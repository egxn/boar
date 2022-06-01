use hyper::{Body, Request, Response, Server, Method, StatusCode};
use hyper::service::{make_service_fn, service_fn};
use local_ip_address::local_ip;
use std::collections::HashMap;
use std::convert::Infallible;
use std::fs;
use std::net::SocketAddr;
use std::path::Path;
use std::process::Command;
use qrcodegen::QrCode;
use qrcodegen::QrCodeEcc;


fn get_keys(query: &str) -> HashMap<&str, &str> {
  let params_list : Vec<&str> = query.split('&').collect();
  let mut params_map : HashMap<&str, &str> = HashMap::new();

  for param in params_list {
    let pair : Vec<&str> = param.split('=').collect();
    params_map.insert(pair[0], pair[1]);
  }
  
  return params_map;
}

fn get_home() -> Response<Body> {
  let root = Path::new("./client/build");
  let index = fs::read_to_string(root.join("index.html")).unwrap();

  Response::new(Body::from(index.to_string()))
}

fn get_asset(req: &Request<Body>) -> Response<Body> {
  let root = String::from("./client/build");
  let path = root + req.uri().path();
  let asset = fs::read_to_string(path).unwrap();

  Response::new(Body::from(asset))
}

fn push_keys(keys: &str) {   
  if cfg!(target_os = "linux") {
    let output = Command::new("xdotool")
      .arg("key")
      .arg(keys)
      .output();

    println!("{:?}", output);
  } 
}

async fn routes(req: Request<Body>) -> Result<Response<Body>, Infallible> {
  let mut response = Response::new(Body::empty());

  fn is_asset(req: &Request<Body>) -> bool {
    req.uri().path().starts_with("/static/")
  }

  match (req.method(), req.uri().path()) {
    (&Method::GET, "/") => {
      response = get_home();
    },
    (&Method::GET, "/grunt")  => { 
      let keys : HashMap<&str, &str> = get_keys(req.uri().query().unwrap());
      if keys.contains_key("keys") {
        push_keys(keys.get("keys").unwrap());
        *response.body_mut()   = StatusCode::OK.to_string().into();
      } else {
        *response.body_mut()   = StatusCode::BAD_REQUEST.to_string().into();
      }
    },
    (&Method::GET, _ ) => {
      if is_asset(&req) {
        response = get_asset(&req);    
      } else {
        *response.status_mut() = StatusCode::NOT_FOUND;
      }
    },
    _ => { *response.status_mut() = StatusCode::NOT_FOUND;  }
  }

  Ok(response)
}

fn print_qr(qr: &QrCode) {
	let border: i32 = 4;
	for y in -border .. qr.size() + border {
		for x in -border .. qr.size() + border {
			let c: char = if qr.get_module(x, y) { '█' } else { ' ' };
			print!("{0}{0}", c);
		}
		println!();
	}
	println!();
}

#[tokio::main]
async fn main() {
  let ip = local_ip().unwrap();
  let port = 7878;
  let addr = SocketAddr::from((ip, port));
  
  let make_svc = make_service_fn(|_conn| async {
    Ok::<_, Infallible>(service_fn(routes))
  });

  let server = Server::bind(&addr).serve(make_svc);
  let url = format!("http://{}:{}", &ip.to_string(), port);
  let qr = QrCode::encode_text(&url, QrCodeEcc::Medium).unwrap();

  println!("Boar 🐗 running on http://{}:{}", &ip.to_string(), port);
  print_qr(&qr);

  if let Err(e) = server.await {
    eprintln!("server error: {}", e);
  }
}
