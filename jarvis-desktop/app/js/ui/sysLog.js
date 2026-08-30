const logLines = [
  "Neural lattice synchronized",
  "Power distribution nominal",
  "Quantum cache stable",
  "External sensors calibrated",
  "Atmospheric seal confirmed",
  "AI cognition loop active",
  "Threat analysis idle",
  "Memory banks aligned"
];

const logList = document.getElementById("log-list");

function addLog() {
  if (logList.children.length > 7) {
    logList.removeChild(logList.firstChild);
  }

  const li = document.createElement("li");
  li.textContent =
    logLines[Math.floor(Math.random() * logLines.length)];
  logList.appendChild(li);
}

setInterval(addLog, 4000);
addLog();