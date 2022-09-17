use hyper::{Body, Request, Response, Server, Method, StatusCode};
use hyper::service::{make_service_fn, service_fn};
use local_ip_address::local_ip;
use std::collections::HashMap;
use std::convert::Infallible;
use std::net::SocketAddr;
use qrcodegen::QrCode;
use qrcodegen::QrCodeEcc;
use urlencoding::decode;

mod utils;

async fn routes(req: Request<Body>) -> Result<Response<Body>, Infallible> {
  let mut response = Response::new(Body::empty());

  match (req.method(), req.uri().path()) {
    (&Method::GET, "/") => response = utils::get_asset("index.html"),
    (&Method::GET, "/main.js") => response = utils::get_asset("main.js"),
    (&Method::GET, "/main.css") => response = utils::get_asset("main.css"),
    (&Method::GET, "/grunt")  => { 
      let params : HashMap<&str, &str> = utils::get_params(req.uri().query().unwrap());
      let kind =  if params.contains_key("key") { "key"} 
                  else if params.contains_key("type") { "type" }
                  else { "" };
      if kind != "" {
        let value = decode(params.get(kind).unwrap()).expect("UTF-8");
        utils::push_keys(&value, kind).await;
        *response.body_mut() = StatusCode::OK.to_string().into();  
      } else {
        *response.body_mut() = StatusCode::BAD_REQUEST.to_string().into();
      }
    },
    _ => { *response.status_mut() = StatusCode::NOT_FOUND;  }
  }

  Ok(response)
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
  utils::print_qr(&qr);

  if let Err(e) = server.await {
    eprintln!("server error: {}", e);
  }
}
