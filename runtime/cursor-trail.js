(() => {
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail-canvas';
  canvas.style.pointerEvents = 'none';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '9999';

  document.body.appendChild(canvas);

  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = 'html, body, body * { cursor: none !important; }';
  document.head.appendChild(cursorStyle);

  const context = canvas.getContext('2d');
  const trail = [];
  const tailLength = 200;
  const maxTrailPoints = 32;
  const tailColors = ['#34d399', '#60a5fa', '#a855f7'];
  const clickRipples = [];
  let cursor = null;
  let hideTimer = null;
  let pixelRatio = window.devicePixelRatio || 1;

  function resizeCanvas() {
    pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function drawTrail() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const now = performance.now();
    const shimmer = 14 + Math.sin(now / 120) * 5;
    clickRipples.forEach((ripple) => {
      const progress = Math.min((now - ripple.startedAt) / 450, 1);
      const radius = 5 + progress * 28;
      context.beginPath();
      context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      context.lineWidth = 1.5;
      context.strokeStyle = `rgba(52, 211, 153, ${0.7 * (1 - progress)})`;
      context.shadowColor = '#34d399';
      context.shadowBlur = 10;
      context.stroke();
    });

    if (!cursor) {
      return;
    }

    const visiblePoints = [cursor];
    let remainingLength = tailLength;

    for (let index = trail.length - 1; index >= 0 && remainingLength > 0; index -= 1) {
      const nextPoint = trail[index];
      const previousPoint = visiblePoints[visiblePoints.length - 1];
      const distance = Math.hypot(previousPoint.x - nextPoint.x, previousPoint.y - nextPoint.y);

      if (distance <= remainingLength) {
        visiblePoints.push(nextPoint);
        remainingLength -= distance;
      } else {
        const ratio = remainingLength / distance;
        visiblePoints.push({
          x: previousPoint.x + (nextPoint.x - previousPoint.x) * ratio,
          y: previousPoint.y + (nextPoint.y - previousPoint.y) * ratio,
        });
        break;
      }
    }

    if (visiblePoints.length > 1) {
      for (let index = visiblePoints.length - 2; index >= 0; index -= 1) {
        const start = visiblePoints[index + 1];
        const end = visiblePoints[index];
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.lineWidth = 2;
        context.strokeStyle = tailColors[index % tailColors.length];
        context.shadowColor = context.strokeStyle;
        context.shadowBlur = shimmer;
        context.stroke();
      }
    }

    context.beginPath();
    context.arc(cursor.x, cursor.y, 6, 0, Math.PI * 2);
    context.fillStyle = '#34d399';
    context.shadowColor = '#34d399';
    context.shadowBlur = 22;
    context.fill();
    context.shadowBlur = 0;
  }

  function clearTrail() {
    window.clearTimeout(hideTimer);
    trail.length = 0;
    cursor = null;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function clearTail() {
    trail.length = 0;
    drawTrail();
  }

  window.addEventListener('mousemove', (event) => {
    window.clearTimeout(hideTimer);
    const nextCursor = { x: event.clientX, y: event.clientY };

    if (cursor) {
      trail.push(cursor);
    }

    cursor = nextCursor;

    if (trail.length > maxTrailPoints) {
      trail.shift();
    }

    drawTrail();
    hideTimer = window.setTimeout(clearTail, 100);
  });

  window.addEventListener('click', (event) => {
    clickRipples.push({ x: event.clientX, y: event.clientY, startedAt: performance.now() });
    drawTrail();
    window.requestAnimationFrame(animateRipples);
  });

  function animateRipples() {
    const now = performance.now();
    for (let index = clickRipples.length - 1; index >= 0; index -= 1) {
      if (now - clickRipples[index].startedAt >= 450) {
        clickRipples.splice(index, 1);
      }
    }

    drawTrail();
    if (clickRipples.length > 0) {
      window.requestAnimationFrame(animateRipples);
    }
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    drawTrail();
  });

  document.addEventListener('mouseleave', clearTrail);

  resizeCanvas();
})();
