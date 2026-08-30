const consoleEl = document.getElementById("console");

function updateConsole(text) {
  consoleEl.innerHTML = `<span>${text}</span>`;
}
