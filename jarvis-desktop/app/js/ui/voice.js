window.jarvisAPI.onAwake(() => {
  updateConsole("> JARVIS ONLINE");
  speak("Yes Omkar, I am listening.");
});

window.jarvisAPI.onSleep(() => {
  updateConsole("> JARVIS STANDBY");
  speak("Going offline.");
});

window.jarvisAPI.onQuery(async (text) => {
  updateConsole("> You: " + text);

  const reply = await askJarvis(text);
  updateConsole("> Jarvis: " + reply);
  speak(reply);
});
