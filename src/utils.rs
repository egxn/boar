use hyper::{Body, Request, Response, StatusCode};
use qrcodegen::QrCode;
use std::collections::HashMap;
use std::fs;
use async_process::Command;

pub fn get_asset(resource: &str) -> Result<String, String> {
  let root = String::from("./client/build/");
  let asset = fs::read_to_string(root + resource);

  match asset {
    Ok(asset) => Ok(asset),
    Err(_) => Ok((StatusCode::NOT_FOUND.to_string()).into()),
  }
}

pub fn get_static_asset(req: &Request<Body>) -> Result<Response<Body>, Response<Body>> {
  let asset = get_asset(&req.uri().path());

  match asset {
    Ok(asset) => Ok(Response::new(Body::from(asset))),
    Err(_) => Ok(Response::new(StatusCode::NOT_FOUND.to_string().into()))
  }
}

pub fn get_home() -> Result<Response<Body>, Response<Body>> {
  let index = get_asset("index.html");

  match index {
    Ok(index) => Ok(Response::new(Body::from(index.to_string()))),
    Err(_) => Ok(Response::new(StatusCode::NOT_FOUND.to_string().into()))
  }
}

pub fn get_params(query: &str) -> HashMap<&str, &str> {
  let params_list : Vec<&str> = query.split('&').collect();
  let mut params_map : HashMap<&str, &str> = HashMap::new();

  for param in params_list {
    let pair : Vec<&str> = param.split('=').collect();
    params_map.insert(pair[0], pair[1]);
  }
  
  return params_map;
}

pub fn print_qr(qr: &QrCode) {
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

pub async fn push_keys(commands: &str, kind: &str) {   
  if cfg!(target_os = "linux") {
    let output = Command::new("xdotool")
      .arg(kind)
      .arg(commands)
      .output()
      .await;

    println!("{:?}", output);
  }
}

#[test]
fn test_get_home() {
  let req = Request::builder()
    .uri("/index.html")
    .body(Body::empty())
    .unwrap();

  let res = get_static_asset(&req);
  assert_eq!(res.unwrap().status(), 200);
}

#[test]
fn test_get_params() {
  let query = "key=super+d";
  let params_map = get_params(query);
  assert_eq!(params_map["key"], "super+d");
}