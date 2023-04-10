use std::process::Command;

fn merge_presets() {
  Command::new("node")
    .args(&["merge_presets.js"])
    .output()
    .expect("Failed to run merge_presets.js");
}

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
    merge_presets();
    yarn_install();
    yarn_build();
  }
}
