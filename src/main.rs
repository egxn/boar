use futures::SinkExt;
use hyper::{Body, Request, Response, Server, Method, StatusCode};
use hyper::service::{make_service_fn, service_fn};
use hyper_tungstenite::{is_upgrade_request, tungstenite, HyperWebsocket};
use local_ip_address::local_ip;
use std::collections::HashMap;
use std::convert::Infallible;
use std::net::SocketAddr;
use qrcodegen::QrCode;
use qrcodegen::QrCodeEcc;
use urlencoding::decode;
use tungstenite::Message;

mod utils;

async fn handle_request(mut request: Request<Body>) -> Result<Response<Body>, Infallible> {
  if is_upgrade_request(&request) {
    let (response, websocket) = hyper_tungstenite::upgrade(&mut request, None).unwrap();
    tokio::spawn(async move {
        if let Err(e) = serve_websocket(websocket).await {
            eprintln!("Error in websocket connection: {}", e);
        }
    });
    Ok(response)
} else {
  let mut response = Response::new(Body::empty());
  match (request.method(), request.uri().path()) {
    (&Method::GET, "/") => response = utils::get_asset("index.html"),
    (&Method::GET, "/main.js") => response = utils::get_asset("main.js"),
    (&Method::GET, "/main.css") => response = utils::get_asset("main.css"),
    (&Method::GET, "/grunt")  => { 
      let params : HashMap<&str, &str> = utils::get_params(request.uri().query().unwrap());
      let kind =
        if params.contains_key("keys") { "key"}
        else if params.contains_key("type") { "type" }
        else { "" };
      if kind != "" {
        let value = decode(params.get(kind).unwrap()).expect("UTF-8");
        utils::push_keys(&value, kind).await;
        *response.status_mut() = StatusCode::OK;  
      } else {
        *response.status_mut() = StatusCode::BAD_REQUEST;
      }
    },
    _ => { *response.status_mut() = StatusCode::NOT_FOUND;  }
  }

  Ok(response)
  }
}


async fn serve_websocket(websocket: HyperWebsocket) -> Result<(), Infallible> {
  let mut websocket = websocket.await.unwrap();
  tokio::spawn(async move {
    let mut wapp: String = "".to_string();
    loop {
      tokio::time::sleep(std::time::Duration::from_millis(1000)).await;
      let app_window_name = utils::get_focused_app_name();
      match app_window_name {
        Some(app_name) => {
          if app_name != wapp {
            wapp = app_name.clone();
            if let Err(err) = websocket.send(Message::Text(app_name)).await {
              println!("Error sending message: {}", err);
            }
          }
        },
        None => {},
      }
    }
  });
  Ok(())
}


#[tokio::main]
async fn main() {
  let ip = local_ip().unwrap();
  let port = 7878;
  let addr = SocketAddr::from((ip, port));
  
  let make_svc = make_service_fn(|_conn| async {
    Ok::<_, Infallible>(service_fn(handle_request))
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
