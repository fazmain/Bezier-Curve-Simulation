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
      controlPoints.push({ x: x, y: y });
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
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    });

    if (controlPoints.length === maxPoints && !animationFrame) {
      t = 0;
      animateCurve();
    }
  }

  function animateCurve() {
    animationFrame = requestAnimationFrame(animateCurve);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawPoints();

    ctx.beginPath();
    ctx.moveTo(controlPoints[0].x, controlPoints[0].y);
    ctx.quadraticCurveTo(
      controlPoints[0].x + t * (controlPoints[1].x - controlPoints[0].x),
      controlPoints[0].y + t * (controlPoints[1].y - controlPoints[0].y),
      controlPoints[0].x + t * (controlPoints[2].x - controlPoints[0].x),
      controlPoints[0].y + t * (controlPoints[2].y - controlPoints[0].y)
    );
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    updateValues(t);
    t += 0.01;
    if (t >= 1) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function updateValues(t) {
    valuesDiv.innerHTML = `t: ${t.toFixed(2)}<br>
          Control Point 1: (${controlPoints[0].x}, ${controlPoints[0].y})<br>
          Control Point 2: (${controlPoints[1].x}, ${controlPoints[1].y})<br>
          Anchor Point: (${controlPoints[2].x}, ${controlPoints[2].y})`;
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
