use arboard::Clipboard;
use hyper::{Body, Response, StatusCode};
use qrcodegen::QrCode;
use rand::{Rng, thread_rng};
use rand::distributions::Alphanumeric;
use rdev::{simulate, EventType, Key, SimulateError};
use rust_embed::RustEmbed;
use std::{collections::HashMap, process::Command, str, thread, time};

#[derive(RustEmbed)]
#[folder = "client/build"]
struct Asset;

pub fn get_asset(path: &str) -> Response<Body> {
  Asset::get(path)
    .map(|asset| {
      let response = Response::new(Body::from(asset.data));
      response
    })
    .unwrap_or_else(|| Response::new(StatusCode::NOT_FOUND.to_string().into()))
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

pub fn print_qr(qr: &QrCode) -> () {
  let border: i32 = 0;
  for y in -border .. qr.size() + border {
    for x in -border .. qr.size() + border {
      let c: char = if qr.get_module(x, y) { '█' } else { ' ' };
      print!("{0}{0}", c);
    }
    println!();
  }
  println!();
}

fn type_content(commands: &str) -> () {
  let mut clipboard = Clipboard::new().unwrap();
  match clipboard.set_text(commands.to_string()) {
    Ok(_) => {
      send(&EventType::KeyPress(Key::ControlLeft));
      send(&EventType::KeyPress(Key::KeyV));
      send(&EventType::KeyRelease(Key::KeyV));
      send(&EventType::KeyRelease(Key::ControlLeft));
    },
    Err(err) => println!("Error setting clipboard: {}", err)
  }
}

fn key_commands(commands: &str) -> () {
  let commands: Vec<&str> = commands.split('+').collect();
  for command in commands.clone() {
    match string_to_key(command) {
      Some(key) => send(&EventType::KeyPress(key)),
      None => continue,
    };
  }

  for command in commands {
    match string_to_key(command) {
      Some(key) => send(&EventType::KeyRelease(key)),
      None => continue,
    };
  }
}

fn cli_commands(commands: &str) -> () {
  let commands: Vec<&str> = commands
    .split(' ')
    .collect();
  let command = commands[0];
  let args = &commands[1..];
  let output = Command::new(command)
    .args(args)
    .output()
    .expect("failed to execute process");
  println!("stdout: {}", str::from_utf8(&output.stdout).unwrap());
}

fn string_to_key(string: &str) -> Option<Key> {
  let key: Key = match string {
    "0" => Key::Num0,
    "1" => Key::Num1,
    "2" => Key::Num2,
    "3" => Key::Num3,
    "4" => Key::Num4,
    "5" => Key::Num5,
    "6" => Key::Num6,
    "7" => Key::Num7,
    "8" => Key::Num8,
    "9" => Key::Num9,
    "a" => Key::KeyA,
    "alt" => Key::Alt,
    "altgr" => Key::AltGr,
    "b" => Key::KeyB,
    "backslash" => Key::BackSlash,
    "backspace" => Key::Backspace,
    "c" => Key::KeyC,
    "capslock" => Key::CapsLock,
    "comma" => Key::Comma,
    "ctrl" => Key::ControlLeft,
    "d" => Key::KeyD,
    "delete" => Key::Delete,
    "down" => Key::DownArrow,
    "e" => Key::KeyE,
    "end" => Key::End,
    "enter" => Key::Return,
    "esc" => Key::Escape,
    "f" => Key::KeyF,
    "f1" => Key::F1,
    "f10" => Key::F10,
    "f11" => Key::F11,
    "f12" => Key::F12,
    "f2" => Key::F2,
    "f3" => Key::F3,
    "f4" => Key::F4,
    "f5" => Key::F5,
    "f6" => Key::F6,
    "f7" => Key::F7,
    "f8" => Key::F8,
    "f9" => Key::F9,
    "g" => Key::KeyG,
    "h" => Key::KeyH,
    "home" => Key::Home,
    "i" => Key::KeyI,
    "insert" => Key::Insert,
    "j" => Key::KeyJ,
    "k" => Key::KeyK,
    "l" => Key::KeyL,
    "left" => Key::LeftArrow,
    "m" => Key::KeyM,
    "meta" => Key::MetaLeft,
    "super" => Key::MetaLeft,
    "n" => Key::KeyN,
    "numlock" => Key::NumLock,
    "o" => Key::KeyO,
    "p" => Key::KeyP,
    "pagedown" => Key::PageDown,
    "pageup" => Key::PageUp,
    "pause" => Key::Pause,
    "printscreen" => Key::PrintScreen,
    "q" => Key::KeyQ,
    "r" => Key::KeyR,
    "return" => Key::Return,
    "right" => Key::RightArrow,
    "s" => Key::KeyS,
    "scrolllock" => Key::ScrollLock,
    "semicolon" => Key::SemiColon,
    "shift" => Key::ShiftLeft,
    "slash" => Key::Slash,
    "space" => Key::Space,
    "t" => Key::KeyT,
    "tab" => Key::Tab,
    "u" => Key::KeyU,
    "up" => Key::UpArrow,
    "v" => Key::KeyV,
    "w" => Key::KeyW,
    "x" => Key::KeyX,
    "y" => Key::KeyY,
    "z" => Key::KeyZ,
    _ => return None,
  };

  Some(key)
}

pub async fn push_keys(commands: &str, kind: &str) -> () {
  if kind == "type" {
    type_content(commands);
  } else if kind == "keys" {
    key_commands(commands);
  } else if kind == "cli" {
    cli_commands(commands);
  }
}

pub fn get_focused_app_name() -> Option<String> {
  let output = Command::new("xdotool")
    .arg("getwindowfocus")
    .arg("getwindowname")
    .output();

  match output {
    Ok(output) => {
      let output = String::from_utf8(output.stdout).unwrap();
      Some(output)
    },
    Err(_) => None,
  }
}

fn send(event_type: &EventType) -> () {
  let delay = time::Duration::from_millis(20);
  match simulate(event_type) {
      Ok(()) => (),
      Err(SimulateError) => {
          println!("We could not send {:?}", event_type);
      }
  }

  thread::sleep(delay);
}

pub fn get_code() -> String {
  let mut rng = thread_rng();
  let code = (0..5).map(|_| rng.sample(Alphanumeric) as char)
    .collect::<String>();

  code
}

#[test]
fn test_get_home() {
  let req = hyper::Request::builder()
    .uri("/index.html")
    .body(Body::empty())
    .unwrap();

  let res = get_asset(&req.uri().path());
  assert_eq!(res.status(), 200);
}

#[test]
fn test_get_params() {
  let query = "key=super+d";
  let params_map = get_params(query);
  assert_eq!(params_map["key"], "super+d");
}

