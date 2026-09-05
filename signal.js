(() => {
  const hero = document.querySelector('.hero');
  const copy = document.querySelector('.hero-copy');
  const canvas = document.querySelector('#page-signal');
  const ctx = canvas.getContext('2d');
  const waypoint = document.querySelector('#signal-waypoint');
  const label = waypoint.querySelector('.waypoint-label');
  const word = document.querySelector('.signal-word');
  const underline = word.querySelector('path');
  const motionButton = document.querySelector('#motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const svgNS = 'http://www.w3.org/2000/svg';
  const active = new Set();
  const visible = new Set();
  const duration = 24;
  let now = duration;
  let anomalyTime = 20.4;
  let paused = reducedMotion.matches;
  let frame = null;
  let lastFrame = 0;
  let lastPaint = 0;
  let lastDividers = 0;
  let nearSignal = null;
  let geometry = null;

  const sections = [...document.querySelectorAll('main > .section')].map((section, index) => {
    const svg = document.createElementNS(svgNS, 'svg');
    const path = document.createElementNS(svgNS, 'path');
    svg.setAttribute('class', 'section-trace');
    svg.setAttribute('aria-hidden', 'true');
    svg.append(path);
    section.prepend(svg);
    return { section, svg, path, index, width: 0 };
  });

  // The same time-indexed signal supplies the illustration, the link's
  // underline, and the section dividers. This is generative page artwork.
  function sample(time, channel = 0) {
    return .5 * Math.sin(time * (1.6 + channel * .21) + channel * 2)
      + .24 * Math.sin(time * (3.8 - channel * .3) + channel)
      + .075 * Math.sin(time * 17.3 + channel * 7)
      + .04 * Math.sin(time * 31.7 + channel * 3);
  }

  const timeAt = x => now - duration + x / geometry.width * duration;
  const xAt = time => (time - now + duration) / duration * geometry.width;
  function layoutAt(x, channel) {
    const g = geometry;
    if (g.mobile) return { baseline: g.copyBottom + 170 + (channel - 1) * 13, amplitude: 13 };
    const start = g.copyRight - 70;
    const progress = Math.max(0, Math.min(1, (x - start) / (g.width - start)));
    const turn = progress * progress * (3 - 2 * progress);
    return { baseline: g.height - 60 - turn * g.height * .61 + (channel - 1) * (7 + turn * 18), amplitude: 10 + turn * 22 };
  }
  function yAt(x, channel = 0) {
    const { baseline, amplitude } = layoutAt(x, channel);
    const time = timeAt(x);
    let value = sample(time, channel);
    if (channel === 0) {
      const distance = time - anomalyTime;
      value += 2.65 * Math.exp(-Math.pow(distance / .15, 2))
        - .8 * Math.exp(-Math.pow((distance - .26) / .13, 2));
    }
    return baseline - value * amplitude;
  }

  function strokeSignal(channel, from, to, color, weight) {
    ctx.beginPath();
    const peak = { x: from, y: Infinity };
    const steps = Math.max(2, Math.ceil((to - from) / 1.8));
    for (let step = 0; step <= steps; step++) {
      const x = from + (to - from) * step / steps;
      const y = yAt(x, channel);
      if (y < peak.y) { peak.x = x; peak.y = y; }
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.stroke();
    return peak;
  }

  function positionWaypoint(peak) {
    const g = geometry;
    const { x, y } = peak;
    let labelX = x > g.copyRight + g.labelWidth + 36 ? x - g.labelWidth - 22 : x + 22;
    labelX = Math.max(g.inset, Math.min(g.width - g.inset - g.labelWidth, labelX));
    let labelY = y - g.labelHeight - 36;
    if (g.mobile || labelX < g.copyRight + 24) labelY = Math.max(labelY, g.copyBottom + 28);
    waypoint.style.left = `${x - g.inset - 22}px`;
    waypoint.style.top = `${y - 22}px`;
    label.style.left = `${labelX - x + 22}px`;
    label.style.top = `${labelY - y + 22}px`;
    // Connect the measured label edge to the peak of the rendered spike.
    // The arrow follows either side of the label as the layout changes.
    const startX = Math.max(labelX - 6, Math.min(labelX + g.labelWidth + 6, x));
    const startY = Math.max(labelY - 6, Math.min(labelY + g.labelHeight + 6, y));
    const distance = Math.hypot(x - startX, y - startY);
    const dx = (x - startX) / distance;
    const dy = (y - startY) / distance;
    const tipX = x - dx * 8;
    const tipY = y - dy * 8;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(tipX, tipY);
    ctx.moveTo(tipX - dx * 7 - dy * 3, tipY - dy * 7 + dx * 3);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(tipX - dx * 7 + dy * 3, tipY - dy * 7 - dx * 3);
    ctx.strokeStyle = active.size ? '#9b472d' : '#879573';
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }

  function drawHero() {
    if (!geometry) return;
    const g = geometry;
    ctx.clearRect(0, 0, g.width, g.height);
    strokeSignal(2, 0, g.width, '#8ba47540', 1);
    strokeSignal(1, 0, g.width, '#527b7350', 1.15);
    strokeSignal(0, 0, g.width, active.size ? '#577149b0' : '#6d87548c', 1.65);
    const from = Math.max(0, xAt(anomalyTime - .45));
    const to = Math.min(g.width, xAt(anomalyTime + .5));
    const peak = to > from
      ? strokeSignal(0, from, to, active.size ? '#9b472d' : '#a35b38b3', active.size ? 2.5 : 1.8)
      : null;
    if (nearSignal !== null) {
      const x = nearSignal;
      strokeSignal(0, Math.max(0, x - 34), Math.min(g.width, x + 34), '#526d3f', 2.1);
      ctx.beginPath();
      ctx.arc(x, yAt(x), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f6f5f0';
      ctx.fill();
      ctx.strokeStyle = '#526d3f';
      ctx.stroke();
    }
    if (peak) positionWaypoint(peak);
    let d = '';
    for (let x = 0; x <= g.wordWidth; x += 2) {
      const y = 6 + sample(now + x / g.wordWidth * 7) * 4.5;
      d += `${x === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(2)}`;
    }
    underline.setAttribute('d', d);
  }

  function drawDividers(force = false) {
    for (const item of sections) {
      if (!force && !visible.has(item.section)) continue;
      let d = '';
      for (let x = 0; x <= item.width; x += 3) {
        const y = 12 + sample(now + x / item.width * 26 + item.index * 6) * 3;
        d += `${x === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(2)}`;
      }
      item.path.setAttribute('d', d);
    }
  }

  function fit() {
    const rect = hero.getBoundingClientRect();
    const copyRect = copy.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    geometry = {
      width, height: rect.height, inset: rect.left,
      copyBottom: copyRect.bottom - rect.top, copyRight: copyRect.right,
      mobile: window.matchMedia('(max-width: 860px)').matches,
      wordWidth: word.getBoundingClientRect().width,
      labelWidth: label.getBoundingClientRect().width,
      labelHeight: label.getBoundingClientRect().height
    };
    if (xAt(anomalyTime) < geometry.inset + 25) anomalyTime = now - duration * .08;
    canvas.style.left = `${-rect.left}px`;
    canvas.style.width = `${width}px`;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    for (const item of sections) item.width = item.section.getBoundingClientRect().width;
    drawHero();
    drawDividers(true);
  }

  function animate(timestamp) {
    const delta = Math.min((timestamp - lastFrame) / 1000, .08);
    lastFrame = timestamp;
    now += delta * .18;
    if (xAt(anomalyTime) < geometry.inset + 25) anomalyTime = now - duration * .08;
    if (timestamp - lastPaint > 32) {
      if (visible.has(hero)) drawHero();
      lastPaint = timestamp;
    }
    if (timestamp - lastDividers > 95) {
      drawDividers();
      lastDividers = timestamp;
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (!paused && !(active.size && visible.has(hero)) && visible.size && !document.hidden) {
      lastFrame = performance.now();
      frame = requestAnimationFrame(animate);
    }
    motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
    motionButton.setAttribute('aria-label', paused ? 'Resume signal animation' : 'Pause signal animation');
    motionButton.setAttribute('aria-pressed', String(paused));
  }

  function setActive(source, enabled) {
    if (enabled) active.add(source);
    else active.delete(source);
    hero.classList.toggle('is-signal-active', active.size > 0);
    drawHero();
    syncMotion();
  }
  for (const [element, name] of [[word, 'word'], [waypoint, 'waypoint']]) {
    element.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') setActive(`${name}-pointer`, true); });
    element.addEventListener('pointerleave', () => setActive(`${name}-pointer`, false));
    element.addEventListener('focus', () => setActive(`${name}-focus`, true));
    element.addEventListener('blur', () => setActive(`${name}-focus`, false));
  }
  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !geometry) return;
    const x = event.clientX;
    const y = event.clientY - hero.getBoundingClientRect().top;
    nearSignal = Math.abs(y - yAt(x)) < 30 ? x : null;
    if (paused || active.size) drawHero();
  });
  hero.addEventListener('pointerleave', () => { nearSignal = null; if (paused) drawHero(); });
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  const visibilityObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    drawDividers();
    syncMotion();
  });
  visibilityObserver.observe(hero);
  for (const item of sections) visibilityObserver.observe(item.section);
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(hero);
  resizeObserver.observe(copy);
  resizeObserver.observe(word);
  resizeObserver.observe(label);
  for (const item of sections) resizeObserver.observe(item.section);
  fit();
  syncMotion();
})();
