use std::process::Command;

fn main() {
  println!("Building client");
  if cfg!(target_os = "linux") {
    Command::new("yarn")
      .args(&["--cwd", "client", "build"])
      .spawn()
      .expect("client not found");
  }
}
