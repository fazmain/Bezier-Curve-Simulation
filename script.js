document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("bezierCanvas");
  const ctx = canvas.getContext("2d");
  const valuesDiv = document.getElementById("values");
  const restartBtn = document.getElementById("restartAnimation");
  const resetBtn = document.getElementById("resetCanvas");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let controlPoints = [];
  const maxPoints = 3;
  let animationFrame;
  let t = 0;

  canvas.addEventListener("click", function (event) {
    if (controlPoints.length < maxPoints) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      controlPoints.push({ x, y });
      drawPoints();
    }
  });

  restartBtn.addEventListener("click", function () {
    if (controlPoints.length === maxPoints) {
      t = 0;
      animateCurve();
    }
  });

  resetBtn.addEventListener("click", function () {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
    t = 0;
    controlPoints = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
  });

  function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    controlPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
    });
  }

  function animateCurve() {
    if (t > 1) {
      cancelAnimationFrame(animationFrame);
      return;
    }

    animationFrame = requestAnimationFrame(animateCurve);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawPoints();

    ctx.beginPath();
    ctx.moveTo(controlPoints[0].x, controlPoints[0].y);

    for (let i = 0; i <= t; i += 0.01) {
      let x =
        Math.pow(1 - i, 2) * controlPoints[0].x +
        2 * (1 - i) * i * controlPoints[1].x +
        Math.pow(i, 2) * controlPoints[2].x;
      let y =
        Math.pow(1 - i, 2) * controlPoints[0].y +
        2 * (1 - i) * i * controlPoints[1].y +
        Math.pow(i, 2) * controlPoints[2].y;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    t += 0.01;
  }

  function drawAxes() {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    // Draw X-axis
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);

    // Draw Y-axis
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);

    ctx.stroke();
  }
});
