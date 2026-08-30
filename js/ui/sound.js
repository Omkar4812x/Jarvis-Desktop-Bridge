// Cleans text so Jarvis does NOT read symbols
function cleanForSpeech(text) {
  if (!text) return "";

  return text
    // remove common UI prefixes
    .replace(/^>\s*jarvis:\s*/i, "")
    .replace(/^>\s*you:\s*/i, "")
    .replace(/^>\s*/g, "")

    // remove symbols that sound bad
    .replace(/[><|{}[\]()]/g, "")
    .replace(/[_*~`^]/g, "")

    // fix dots
    .replace(/\.{2,}/g, ".")

    // clean spaces
    .replace(/\s+/g, " ")
    .trim();
}

// Jarvis voice output
function speak(text) {
  const cleanText = cleanForSpeech(text);
  if (!cleanText) return;

  const utter = new SpeechSynthesisUtterance(cleanText);
  utter.rate = 0.9;
  utter.pitch = 0.9;
  utter.volume = 0.7;

  const voices = speechSynthesis.getVoices();
  utter.voice = voices.find(v => v.lang === "en-US") || voices[0];

  speechSynthesis.speak(utter);
}
