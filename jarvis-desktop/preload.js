const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jarvisAPI", {
  ask: (prompt) => ipcRenderer.invoke("ask-jarvis", prompt),
  onAwake: (cb) => ipcRenderer.on("jarvis-awake", cb),
  onSleep: (cb) => ipcRenderer.on("jarvis-sleep", cb),
  onQuery: (cb) => ipcRenderer.on("jarvis-query", (_, text) => cb(text))
});
