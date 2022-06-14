use hyper::{Body, Request, Response};
use qrcodegen::QrCode;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::process::Command;

pub fn get_asset(req: &Request<Body>) -> Response<Body> {
  let root = String::from("./client/build");
  let path = root + req.uri().path();
  let asset = fs::read_to_string(path).unwrap();

  Response::new(Body::from(asset))
}

pub fn get_home() -> Response<Body> {
  let root = Path::new("./client/build");
  let index = fs::read_to_string(root.join("index.html")).unwrap();

  Response::new(Body::from(index.to_string()))
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

pub fn push_keys(commands: &str, kind: &str) {   
  println!("{}", kind);
  println!("{}", commands);

  if cfg!(target_os = "linux") {
    let output = Command::new("xdotool")
      .arg(kind)
      .arg(commands)
      .output();

    println!("{:?}", output);
  } 
}

#[test]
fn test_get_home() {
  let req = Request::builder()
    .uri("/index.html")
    .body(Body::empty())
    .unwrap();

  let res = get_asset(&req);
  assert_eq!(res.status(), 200);
}

#[test]
fn test_get_params() {
  let query = "?key1=value1&key2=value2";
  let params_map = get_params(query);
  assert_eq!(params_map["key1"], "value1");
  assert_eq!(params_map["key2"], "value2");
}