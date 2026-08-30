const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

/* --------------------------------------------------
   ENABLE SPEECH IN ELECTRON
-------------------------------------------------- */
app.commandLine.appendSwitch("enable-speech-dispatcher");
app.commandLine.appendSwitch("disable-features", "SpeechRecognition");

let mainWindow;
let jarvisAwake = false;

/* --------------------------------------------------
   CREATE WINDOW
-------------------------------------------------- */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#050b10",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile("app/index.html");
}

/* --------------------------------------------------
   AI HANDLER
-------------------------------------------------- */
ipcMain.handle("ask-jarvis", async (_event, prompt) => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are JARVIS. Calm, precise, brief." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 120
      })
    });

    const data = await res.json();
    return data.choices[0].message.content.trim();

  } catch (err) {
    console.error("AI ERROR:", err);
    return "I am experiencing a network issue right now.";
  }
});

/* --------------------------------------------------
   WHISPER POLLING LOOP
-------------------------------------------------- */
async function pollWhisper() {
  try {
    const res = await fetch("http://127.0.0.1:8000/listen");
    const data = await res.json();

    if (!data.text) return;

    const text = data.text.toLowerCase();
    console.log("🎧 Heard:", text);

    // WAKE WORD
    if (!jarvisAwake && text.includes("hey jarvis")) {
      jarvisAwake = true;
      mainWindow.webContents.send("jarvis-awake");
      return;
    }

    // SLEEP WORD
    if (jarvisAwake && text.includes("bye jarvis")) {
      jarvisAwake = false;
      mainWindow.webContents.send("jarvis-sleep");
      return;
    }

    // NORMAL QUERY
    if (jarvisAwake) {
      mainWindow.webContents.send("jarvis-query", text);
    }

  } catch (err) {
    // silent fail
  }
}

/* --------------------------------------------------
   START POLLING WHISPER
-------------------------------------------------- */
setInterval(pollWhisper, 1200);

/* --------------------------------------------------
   APP LIFECYCLE
-------------------------------------------------- */
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
