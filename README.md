# Boar

<div style="text-align:center; font-size: 72px;">
 🐗
</div>

---

A customizable touchpad for linux using your mobile device

Create shortcuts that you can use as:

* 📡 Streaming proposes
* 🙂 Emoji keyboard
* 🎨 Shortcuts for apps (like GIMP)
* 🔲 Touch macro pad
* 🔔 Touch midi controller
* ❇️ And more

## Dependencies

> xdotool

**This app works works with X.Org Server (Still does not support Wayland environments due to the xdotool dependency).

## Development dependencies

* Node and npm
* Rust and cargo

## Setup

```cd client && yarn```

```yarn build && cd ..```

| Command | Description |
| ---     | ---         |
| `cargo run`| Run app  |

## How add a preset of shortcuts

Create a new file in  `/client/src/presets/`

``` json
{
  "title": "",
  "label": "",
  "keys": [
    {
      "background": "",
      "command": "",
      "label": "",
      "kind": "" // "key" or "type"
    }
  ]
}
```

## Idea

This is a 🦀 Rust app as webserver and a ⚛️ React app as web application over your local network



Built with Rust 🦀 TypeScript 🔷 and 💖 