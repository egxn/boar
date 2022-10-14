# Boar 🐗

<p align="center">
  <a href="https://github/egxn/boar">
    <img alt="babel" src="./assets/boar-icon.png" width="100" />
  </a>
</p>

<p align="center">
  A customizable touchpad for linux 🐧 using your mobile device
</p>


Some uses:

- [x] 🙂 Emojis keyboard
- [x] 📡 Streaming
- [x] 🎨 Apps Shortcuts 
- [x] 🔔 Touch midi controller

## Dependencies

This app works in linux with X.Org and xdotool.

## Development dependencies

* Node and npm
* Rust and cargo

## Setup

``` bash
  cargo run
```

## How add a preset of shortcuts

Create a new file in  `/client/src/presets/`

``` json
{
  "title": "",
  "label": "",
  "keys": [
    {
      "appTitle": "",
      "background": "",
      "command": "",
      "label": "",
      "kind": "" // "key" or "type"
    }
  ]
}
```

---

Built with Rust 🦀 and  TS 🔷 