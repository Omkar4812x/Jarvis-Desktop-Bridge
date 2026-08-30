import queue
import sounddevice as sd
import numpy as np
from fastapi import FastAPI
from faster_whisper import WhisperModel
import threading
import uvicorn

app = FastAPI()

model = WhisperModel("small", compute_type="float32")

audio_queue = queue.Queue()
latest_text = ""

SAMPLE_RATE = 16000


def audio_callback(indata, frames, time, status):
    if status:
        print(status)
    audio_queue.put(indata.copy())


def listen_loop():
    global latest_text
    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        callback=audio_callback
    ):
        print("🎤 Whisper listening...")
        while True:
            audio = audio_queue.get()
            audio = np.squeeze(audio)

            segments, _ = model.transcribe(
                audio,
                language="en",
                beam_size=5
            )

            for segment in segments:
                text = segment.text.strip()
                if text:
                    latest_text = text.lower()
                    print("🗣️", latest_text)


@app.get("/listen")
def get_text():
    global latest_text
    text = latest_text
    latest_text = ""
    return {"text": text}


def start_listener():
    thread = threading.Thread(target=listen_loop, daemon=True)
    thread.start()


if __name__ == "__main__":
    start_listener()
    uvicorn.run(app, host="127.0.0.1", port=8000)
