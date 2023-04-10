# Boar 🐗

<p align="center">
  <a href="https://github/egxn/boar">
    <img alt="babel" src="./assets/boar.png" width="600" />
  </a>
</p>

<p align="center">
  A customizable touchbar || keyboard || controller || for linux 🐧 using your mobile device
</p>


## Use cases

- [..][🙂][🤓][🧐][..] Emojis Keyboard
- [..][🔈][🔊][🔇][..] 📡 Controller
- [..][📋][✂️][📌][..] 🎨 Apps Shortcuts


# 🚀 Quick start

* Download the latest release

``` bash
  chmod +x ./boar.AppImage
  ./boar.AppImage
```

## Features

* Custom apps shortcuts
* Custom commands
* Custom emojis
* Custom text input

## Dependencies

This app works in linux with X.Org and xdotool.

## Development

### Dependencies

* Node, yarn
* Rust, cargo

### Setup

``` bash
  cargo build --release
  cargo run --release
```

## How add a preset of shortcuts

Create a new file in  `/client/src/presets/`

``` json
{
  "title": "",
  "label": "",
  "keycaps": [
    {
      "appTitle": "", // Optional
      "background": "", // Optional
      "command": "",
      "label": "",
      "kind": "" // "keys" || "type" || "cli"
    }
  ]
}
```

---

Built with Rust 🦀 + TS 🔵
