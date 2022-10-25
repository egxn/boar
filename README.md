# Boar 🐗

<p align="center">
  <a href="https://github/egxn/boar">
    <img alt="babel" src="./assets/boar-icon.png" width="100" />
  </a>
</p>

<p align="center">
  A customizable touchpad for linux 🐧 using your mobile device
</p>


## Some uses:

- [x] 🙂 Emojis keyboard
- [x] 📡 Streaming
- [x] 🎨 Apps Shortcuts 
- [x] 🔔 Touch midi controller

## Features

[ Keys combinations](https://user-images.githubusercontent.com/9216933/197866471-fc3592a1-c3b6-4204-aaa6-e6c71d88223f.webm)

[Text input](https://user-images.githubusercontent.com/9216933/197866498-8f6d05a4-b4ef-4cfd-a285-372e7652492f.webm)

[Keys depending on the app](https://user-images.githubusercontent.com/9216933/197866513-14176330-3dac-4a25-888f-f66d83b70157.webm)

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
  "keys": [
    {
      "appTitle": "",
      "background": "",
      "command": "",
      "label": "",
      "kind": "" // "keys" or "type"
    }
  ]
}
```

---

Built with Rust 🦀 + TS 🔵
