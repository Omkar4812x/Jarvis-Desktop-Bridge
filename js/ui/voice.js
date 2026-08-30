const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

let micUnlocked = false;
let active = false;
let jarvisActive = false;

// ---- BOOT (one-time user gesture) ----
async function bootJarvis() {
  if (micUnlocked) return;

  await navigator.mediaDevices.getUserMedia({ audio: true });
  micUnlocked = true;

  updateConsole("> JARVIS ONLINE");
  speak("Hello Omkar. Say hey Jarvis to begin.");

  listen(); // start first listening cycle
}

// ---- START LISTENING ----
function listen() {
  if (!micUnlocked || active) return;

  try {
    recognition.start();
    active = true;
  } catch {}
}

// ---- HANDLE SPEECH ----
recognition.onresult = async (event) => {
  active = false;
  recognition.stop();

  const text = event.results[0][0].transcript.trim().toLowerCase();
  updateConsole(`> You: ${text}`);

  // ---- WAKE WORD ----
  if (!jarvisActive && text.includes("hey jarvis")) {
    jarvisActive = true;
    speak("Yes Omkar. How can I assist you?");
    updateConsole("> Jarvis activated");
    return listen();
  }

  // ---- SLEEP WORD ----
  if (jarvisActive && text.includes("bye jarvis")) {
    jarvisActive = false;
    speak("Going offline. Call me if you need me.");
    updateConsole("> Jarvis idle");
    return;
  }

  // ---- NORMAL COMMAND ----
  if (jarvisActive) {
    const reply = await askJarvis(text);
    updateConsole(`> Jarvis: ${reply}`);
    speak(reply);
  }

  // Continue listening loop
  if (jarvisActive || !jarvisActive) {
    setTimeout(listen, 500);
  }
};

// ---- CLEANUP ----
recognition.onend = () => {
  active = false;
};

recognition.onerror = () => {
  active = false;
  setTimeout(listen, 1000);
};

// ---- REQUIRED USER GESTURE (ONE TIME) ----
document.addEventListener("click", bootJarvis, { once: true });
