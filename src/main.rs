use futures::SinkExt;
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Method, Request, Response, Server, StatusCode};
use hyper_tungstenite::{is_upgrade_request, tungstenite, HyperWebsocket};
use local_ip_address::local_ip;
use qrcodegen::{QrCode, QrCodeEcc};
use std::collections::HashMap;
use std::convert::Infallible;
use std::net::SocketAddr;
use std::sync::Arc;
use tungstenite::Message;
use urlencoding::decode;

mod tray;
mod utils;

async fn handle_request(mut request: Request<Body>, code: String) -> Result<Response<Body>, Infallible> {
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
            (&Method::GET, "/grunt") => {
                let params: HashMap<&str, &str> = utils::get_params(request.uri().query().unwrap());
                let user_code = params.get("code").unwrap();
                let kind = if params.contains_key("keys") {
                    "keys"
                } else if params.contains_key("type") {
                    "type"
                } else if params.contains_key("cli") {
                    "cli"
                } else {
                    ""
                };

                if kind != "" && user_code == &code {
                    match params.get(kind) {
                        Some(commands) => {
                            let decoded_commands = decode(commands).expect("UTF-8");
                            utils::push_keys(&decoded_commands, kind).await;
                            *response.status_mut() = StatusCode::OK;
                        }
                        None => (),
                    }
                } else {
                    *response.status_mut() = StatusCode::BAD_REQUEST;
                }
            }
            _ => {
                *response.status_mut() = StatusCode::NOT_FOUND;
            }
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
                }
                None => {}
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
    let url = format!("http://{}:{}", &ip.to_string(), port);
    let code = Arc::new(utils::get_code());
    let code_cli = code.clone();

    let make_svc = make_service_fn(move |_| {
            let code = Arc::clone(&code);
            async move {
                let cloned_code = code.clone();
                Ok::<_, Infallible>(service_fn(move |req| handle_request(req, cloned_code.to_string())))
            }
        });
    let server = Server::bind(&addr).serve(make_svc);
    let qr = QrCode::encode_text(&url, QrCodeEcc::Medium).unwrap();

    println!("Boar 🐗 running on {}, code: {}", url, &code_cli);

    utils::print_qr(&qr);
    tokio::spawn(async move {
        tray::run(url, &code_cli);
    });

    if let Err(e) = server.await {
        eprintln!("server error: {}", e);
    }
}
