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
  const clickRipples = [];
  
  // Easing/Lerping parameters
  const numPoints = 12;
  const points = [];
  const mouse = { x: 0, y: 0 };
  let isInitialized = false;
  let isInside = false;
  let pixelRatio = window.devicePixelRatio || 1;

  function resizeCanvas() {
    pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  // Handle mouse moves and initialize coordinates
  window.addEventListener('mousemove', (event) => {
    isInside = true;
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    if (!isInitialized) {
      // Initialize all points at the current mouse position
      for (let i = 0; i < numPoints; i++) {
        points.push({ x: mouse.x, y: mouse.y });
      }
      isInitialized = true;
    }
  });

  // Track click ripples
  window.addEventListener('click', (event) => {
    clickRipples.push({ x: event.clientX, y: event.clientY, startedAt: performance.now() });
  });

  document.addEventListener('mouseleave', () => {
    isInside = false;
  });

  document.addEventListener('mouseenter', () => {
    isInside = true;
  });

  function tick(now) {
    // Clear canvas
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 1. Draw click ripples
    for (let index = clickRipples.length - 1; index >= 0; index -= 1) {
      const ripple = clickRipples[index];
      const progress = Math.min((now - ripple.startedAt) / 450, 1);
      
      if (progress >= 1) {
        clickRipples.splice(index, 1);
        continue;
      }

      const radius = 5 + progress * 28;
      context.beginPath();
      context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      context.lineWidth = 1.5;
      context.strokeStyle = `rgba(16, 185, 129, ${0.7 * (1 - progress)})`;
      context.shadowColor = '#10b981';
      context.shadowBlur = 10;
      context.stroke();
      context.shadowBlur = 0; // reset
    }

    // If initialized and mouse is on screen, update and draw trail
    if (isInitialized) {
      // Update trail physics (Point 0 follows mouse, others follow previous point)
      // Ease factor determines how fast they follow. A smaller factor makes the tail longer and lag behind more.
      const easeFactor = 0.45;
      
      // Update first point
      points[0].x += (mouse.x - points[0].x) * easeFactor;
      points[0].y += (mouse.y - points[0].y) * easeFactor;

      // Update remaining points
      for (let i = 1; i < numPoints; i++) {
        points[i].x += (points[i-1].x - points[i].x) * easeFactor;
        points[i].y += (points[i-1].y - points[i].y) * easeFactor;
      }

      const shimmer = 14 + Math.sin(now / 120) * 5;

      // Draw the tail segments
      // We loop backwards to draw the tail ends first (underneath)
      for (let i = numPoints - 1; i > 0; i--) {
        const start = points[i];
        const end = points[i - 1];

        // Check if segments are virtually at the same point to avoid drawing artifacts
        const dist = Math.hypot(start.x - end.x, start.y - end.y);
        if (dist < 0.1) continue;

        // Calculate fade and width tapering
        const ratio = i / numPoints; // 0 (near cursor) to 1 (near tail end)
        const opacity = 1 - ratio;
        const width = 2.5 * (1 - ratio);

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.lineWidth = width;
        context.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
        context.shadowColor = '#10b981';
        context.shadowBlur = shimmer * (1 - ratio);
        context.stroke();
        context.shadowBlur = 0; // reset
      }

      // Draw the main cursor dot (only if mouse is inside the window)
      if (isInside) {
        context.beginPath();
        context.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
        context.fillStyle = '#10b981';
        context.shadowColor = '#06b6d4';
        context.shadowBlur = 22;
        context.fill();
        context.shadowBlur = 0; // reset
      }
    }

    requestAnimationFrame(tick);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Start loop
  requestAnimationFrame(tick);
})();
