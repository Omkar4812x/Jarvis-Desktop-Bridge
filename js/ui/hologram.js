function drawGraph(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = 120;
  }

  resize();
  window.addEventListener("resize", resize);

  let t = 0;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(127,252,255,0.6)";
    ctx.beginPath();

    for (let x = 0; x < canvas.width; x++) {
      const y =
        canvas.height / 2 +
        Math.sin((x + t) * 0.02) * 20;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
    t += 0.5;
    requestAnimationFrame(render);
  }

  render();
}

drawGraph("graph1");
drawGraph("graph2");