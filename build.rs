use std::process::Command;

fn yarn_install() {
  Command::new("yarn")
    .args(&["--cwd", "client", "install"])
    .output()
    .expect("Failed to run yarn");
}

fn yarn_build() {
  Command::new("yarn")
    .args(&["--cwd", "client", "build"])
    .output()
    .expect("client not found");
}

fn main() {
  println!("Building client");
  if cfg!(target_os = "linux") {
    yarn_install();
    yarn_build();
  }
}
