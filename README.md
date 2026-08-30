# 🖥️ Jarvis Desktop Bridge

> **Desktop integration bridge connecting local system controls with voice recognition speech servers and web assistant interfaces.**

---

## ✨ Features

- ⚛️ **Electron Desktop Shell** (`jarvis-desktop/`)
  - Cross-platform desktop interface built with Electron, providing IPC bridge access to operating system controls.
- 🐍 **Speech Recognition Microservice** (`speech_server.py`)
  - Python speech-to-text server processing microphone streams.
- 🔌 **WebSocket Communication Bridge** (`jarvis-bridge/`)
  - Real-time bidirectional socket communication between system services and web clients.

---

## 🛠️ Tech Stack

- **Desktop**: Electron.js, Node.js, IPC Main/Renderer
- **Voice Server**: Python 3.10+, `SpeechRecognition`, `pyttsx3`
- **Networking**: WebSockets (`ws`), REST API

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Omkar4812x/Jarvis-Desktop-Bridge.git
   cd Jarvis-Desktop-Bridge
   ```

2. **Run Desktop App**:
   ```bash
   cd jarvis-desktop
   npm install
   npm start
   ```

---

## 📄 License

Distributed under the MIT License.