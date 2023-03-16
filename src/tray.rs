use gtk::{self, traits::{MenuShellExt, GtkMenuItemExt, WidgetExt}};
use image::load_from_memory;
use libappindicator::{AppIndicator, AppIndicatorStatus};
use rust_embed::RustEmbed;
use std::{env, fs, path::PathBuf};

#[derive(RustEmbed)]
#[folder = "assets/icons"]
struct Asset;

fn get_icon_path() -> (PathBuf, PathBuf) {
  let dir = env::temp_dir().join("boar");
  let icon_path = dir.join("icon.png");
  (dir, icon_path)
}

fn copy_assets() -> () {
  let (dir, icon_path) = get_icon_path();
  if !dir.exists() {
      fs::create_dir(&dir).unwrap();
  }

  load_from_memory(&Asset::get("icon.png").unwrap().data)
      .unwrap()
      .save(&icon_path)
      .unwrap();
}

fn copy_to_clipboard(text: &str) -> () {
  let clipboard = gtk::Clipboard::get(&gdk::SELECTION_CLIPBOARD);
  clipboard.set_text(text);
}

fn copy_to_clipboard_item(text:  &str, value: &str) -> gtk::MenuItem {
  let value_cb = value.to_owned();
  let item = gtk::MenuItem::with_label(&format!("{} {}", text, value));
  item.connect_activate(move |_| {
    copy_to_clipboard(&value_cb);
  });
  item
}

fn exit_item() -> gtk::MenuItem {
  let item = gtk::MenuItem::with_label("🚪 Exit");
  item.connect_activate(|_| {
    std::process::exit(0);
  });
  item
}


fn create_tray_icon(url: String, code: &str) -> () {
  let (dir, _) = get_icon_path();
  copy_assets();
  let url_info = copy_to_clipboard_item("📲", &url);
  let code_key = copy_to_clipboard_item("🔑", code);
  let exit = exit_item();
  let mut menu = gtk::Menu::new();

  menu.append(&url_info);
  menu.append(&code_key);
  menu.append(&gtk::SeparatorMenuItem::new());
  menu.append(&exit);
  menu.show_all();

  let mut tray: AppIndicator = AppIndicator::new("boar", "🐗");
  tray.set_status(AppIndicatorStatus::Active);
  tray.set_icon_theme_path(dir.to_str().unwrap());
  tray.set_icon_full("icon", "icon");
  tray.set_menu(&mut menu);
}

pub fn run(url: String, code: &str) -> () {
  gtk::init().unwrap();
  create_tray_icon(url, code);
  gtk::main();
}