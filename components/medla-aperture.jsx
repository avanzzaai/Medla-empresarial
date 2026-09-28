import { LAND } from "./globe-land.js";

const { useEffect, useRef } = React;
const RAD = Math.PI / 180;

// Unlabelled, illustrative connection points: no offices or coverage claims.
const HUBS = [[40.4, -3.7], [40.7, -74], [-23.6, -46.6], [-26.2, 28.0], [25.2, 55.3], [1.3, 103.8], [35.7, 139.7], [-33.9, 151.2], [37.8, -122.4]];
const CONNECTIONS = [[0,1,.17],[0,2,.23],[0,3,.19],[0,4,.12],[4,5,.18],[5,6,.14],[5,7,.18],[8,6,.23],[1,8,.12]];

function spherePoint(lat, lon) {
  const latitude = lat * RAD, longitude = lon * RAD, latitudeCosine = Math.cos(latitude);
  return [latitudeCosine * Math.sin(longitude), Math.sin(latitude), latitudeCosine * Math.cos(longitude)];
}
function makeGeography() {
  const polygons = LAND.map((points) => ({
    points,
    minLat: Math.min(...points.map(p => p[0])), maxLat: Math.max(...points.map(p => p[0])),
    minLon: Math.min(...points.map(p => p[1])), maxLon: Math.max(...points.map(p => p[1])),
  }));
  const inside = (lat, lon, polygon) => {
    if (lat < polygon.minLat || lat > polygon.maxLat || lon < polygon.minLon || lon > polygon.maxLon) return false;
    let found = false;
    const points = polygon.points;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i], b = points[j];
      if ((a[0] > lat) !== (b[0] > lat) && lon < (b[1] - a[1]) * (lat - a[0]) / (b[0] - a[0]) + a[1]) found = !found;
    }
    return found;
  };
  const dots = [];
  let row = 0;
  for (let lat = -55.6; lat <= 83; lat += 1.48) {
    const step = 1.48 / Math.max(0.18, Math.cos(lat * RAD));
    for (let lon = -180 + (row % 2) * step / 2; lon < 180; lon += step) {
      if (polygons.some(p => inside(lat, lon, p))) dots.push(spherePoint(lat, lon));
    }
    row++;
  }
  const coasts = LAND.map((polygon) => {
    const points = [];
    polygon.forEach((a, index) => {
      const b = polygon[(index + 1) % polygon.length];
      const count = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.4));
      for (let i = 0; i < count; i++) {
        const t = i / count;
        points.push(spherePoint(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t));
      }
    });
    points.push(points[0]);
    return points;
  });
  const graticules = [];
  [-60,-30,0,30,60].forEach(lat => {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 3) points.push(spherePoint(lat, lon));
    graticules.push(points);
  });
  for (let lon = 0; lon < 360; lon += 30) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 3) points.push(spherePoint(lat, lon));
    graticules.push(points);
  }
  return { dots, coasts, graticules };
}
const GEOGRAPHY = makeGeography();
const HUB_VECTORS = HUBS.map(([lat, lon]) => spherePoint(lat, lon));
const ROUTES = CONNECTIONS.map(([from, to, lift]) => {
  const a = HUB_VECTORS[from], b = HUB_VECTORS[to];
  const angle = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, value, i) => sum + value * b[i], 0))));
  const sine = Math.sin(angle);
  const points = [];
  for (let i = 0; i <= 84; i++) {
    const t = i / 84, height = 1 + Math.sin(Math.PI * t) * lift;
    const start = Math.sin((1 - t) * angle) / sine, end = Math.sin(t * angle) / sine;
    points.push(a.map((value, axis) => (value * start + b[axis] * end) * height));
  }
  return points;
});

/* A mapped, slowly rotating Earth with geographic great-circle connections.
   Canvas owns animation without React renders; hidden/offscreen work stops. */
export default function MedlaAperture({ reducedMotion = false }) {
  const canvasRef = useRef(null);
  const controlsRef = useRef({ reducedMotion });
  const redrawRef = useRef(null);

  useEffect(() => {
    controlsRef.current = { reducedMotion };
    redrawRef.current?.();
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d", { alpha: true });
    if (!ctx) return;
    const hero = canvas.closest(".m-hero") || canvas;
    let width = 0, height = 0, ratio = 1, frame = 0, lastTime = 0, lastDraw = 0;
    let visible = !("IntersectionObserver" in window), disposed = false;
    let elapsed = 0, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;

    function draw() {
      if (!width || !height || disposed) return;
      const still = controlsRef.current.reducedMotion;
      const time = still ? 0 : elapsed;
      const rotation = 20 * RAD + time * 0.032 + (still ? 0 : pointerX * 0.045);
      const tilt = 18 * RAD + (still ? 0 : pointerY * 0.025);
      const cr = Math.cos(rotation), sr = Math.sin(rotation), ct = Math.cos(tilt), st = Math.sin(tilt);
      const radius = Math.min(width * 0.31, height * 0.35);
      const cx = width * (width < 470 ? 0.525 : 0.57), cy = height * 0.46;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
      function project(point) {
        const x = point[0] * cr + point[2] * sr;
        const z = point[2] * cr - point[0] * sr;
        const y = point[1] * ct - z * st;
        const depth = z * ct + point[1] * st;
        return { x: cx + x * radius, y: cy - y * radius, nx: x, ny: y, z: depth };
      }
      function circle(x, y, r, fill) {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
      }
      function visiblePath(points, color, weight, alpha = 1, raised = false) {
        ctx.beginPath();
        let pen = false;
        for (const point of points) {
          const visiblePoint = point.z > 0.012 || (raised && point.nx * point.nx + point.ny * point.ny > 1.006);
          if (!visiblePoint) { pen = false; continue; }
          if (pen) ctx.lineTo(point.x, point.y); else ctx.moveTo(point.x, point.y);
          pen = true;
        }
        ctx.lineWidth = weight; ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.stroke(); ctx.globalAlpha = 1;
      }

      // The limb has a slim atmospheric edge, without a large background glow.
      const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.98, cx, cy, radius * 1.055);
      atmosphere.addColorStop(0, "rgba(71,123,130,0)");
      atmosphere.addColorStop(0.28, "rgba(98,156,158,.12)");
      atmosphere.addColorStop(1, "rgba(44,93,103,0)");
      circle(cx, cy, radius * 1.055, atmosphere);
      const ocean = ctx.createRadialGradient(cx - radius * 0.40, cy - radius * 0.42, radius * 0.03, cx, cy, radius);
      ocean.addColorStop(0, "#233e43"); ocean.addColorStop(0.38, "#182e34");
      ocean.addColorStop(0.75, "#0c1b22"); ocean.addColorStop(1, "#060e14");
      circle(cx, cy, radius, ocean);

      GEOGRAPHY.graticules.forEach(points => visiblePath(points.map(project), "#6b949a", 0.45, 0.095));

      // Latitude-adjusted spacing keeps the continent dots evenly distributed.
      const bins = Array.from({ length: 9 }, () => []);
      for (const vector of GEOGRAPHY.dots) {
        const p = project(vector);
        if (p.z <= 0.015) continue;
        const light = Math.max(0, Math.min(1, 0.23 + p.z * 0.47 - p.nx * 0.15 + p.ny * 0.17));
        bins[Math.min(8, Math.floor(light * 9))].push(p);
      }
      bins.forEach((points, index) => {
        if (!points.length) return;
        const level = index / 8;
        ctx.fillStyle = "rgb(" + [Math.round(54 + level * 140), Math.round(89 + level * 130), Math.round(95 + level * 117)].join(",") + ")";
        ctx.beginPath();
        points.forEach(p => {
          const size = Math.max(0.48, Math.min(1.03, radius * 0.004)) * (0.42 + Math.sqrt(p.z) * 0.58);
          ctx.moveTo(p.x + size, p.y); ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        });
        ctx.fill();
      });
      GEOGRAPHY.coasts.forEach(points => visiblePath(points.map(project), "#b5cbc6", 0.48, 0.24));

      const limb = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      limb.addColorStop(0, "rgba(178,209,203,.55)");
      limb.addColorStop(0.45, "rgba(107,157,161,.22)");
      limb.addColorStop(1, "rgba(56,95,107,.08)");
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.lineWidth = 0.75; ctx.strokeStyle = limb; ctx.stroke();

      // Spherical interpolation makes every connection follow an actual globe route.
      ROUTES.forEach((points, index) => {
        const projected = points.map(project);
        const gold = index === 1;
        const color = gold ? "#c5ab70" : "#8ecdc7";
        visiblePath(projected, color, 0.82, gold ? 0.66 : 0.49, true);
        if (index % 3 !== 0 && !gold) return;
        const head = Math.floor(((time * 0.082 + index * 0.173 + 0.32) % 1) * (projected.length - 1));
        const start = Math.max(0, head - 9);
        for (let i = start; i < head; i++) {
          const a = projected[i], b = projected[i + 1];
          const isVisible = p => p.z > 0.012 || p.nx * p.nx + p.ny * p.ny > 1.006;
          if (!isVisible(a) || !isVisible(b)) continue;
          const alpha = (i - start + 1) / 10;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = gold ? "#e6d4a2" : "#c7eee3"; ctx.lineWidth = 1.30;
          ctx.globalAlpha = alpha * 0.90; ctx.stroke(); ctx.globalAlpha = 1;
        }
        const p = projected[head];
        if (p.z > 0.012 || p.nx * p.nx + p.ny * p.ny > 1.006) circle(p.x, p.y, Math.max(0.8, radius * 0.005), gold ? "#eddeb7" : "#dbf1e6");
      });
      HUB_VECTORS.forEach((vector) => {
        const p = project(vector);
        if (p.z <= 0.025) return;
        const opacity = Math.min(1, p.z * 3);
        ctx.globalAlpha = opacity;
        circle(p.x, p.y, Math.max(4, radius * 0.019), "rgba(120,202,191,.09)");
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(2.7, radius * 0.012), 0, Math.PI * 2);
        ctx.lineWidth = 0.6; ctx.strokeStyle = "rgba(152,216,203,.45)"; ctx.stroke();
        circle(p.x, p.y, Math.max(1.15, radius * 0.006), "#d0e4da");
        ctx.globalAlpha = 1;
      });
    }

    function available() { return visible && !document.hidden && !disposed; }
    function wake() { if (!frame && available()) frame = requestAnimationFrame(tick); }
    function tick(timestamp) {
      frame = 0;
      if (!available()) { lastTime = 0; return; }
      const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.06) : 1 / 60;
      lastTime = timestamp;
      if (controlsRef.current.reducedMotion) {
        pointerX = 0; pointerY = 0; draw(); lastTime = 0; return;
      }
      elapsed += delta;
      const ease = 1 - Math.exp(-delta * 4);
      pointerX += (targetX - pointerX) * ease; pointerY += (targetY - pointerY) * ease;
      if (!lastDraw || timestamp - lastDraw >= 1000 / 30) {
        draw(); lastDraw = timestamp - ((timestamp - lastDraw) % (1000 / 30));
      }
      wake();
    }
    function sync() {
      if (disposed) return;
      if (frame) cancelAnimationFrame(frame);
      frame = 0; lastTime = 0; lastDraw = 0; wake();
    }
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width; height = bounds.height; ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio)); canvas.height = Math.max(1, Math.round(height * ratio)); sync();
    }
    function move(event) {
      if (controlsRef.current.reducedMotion || event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / Math.max(1, bounds.height) * 2 - 1));
    }
    function resetPointer() { targetX = 0; targetY = 0; }
    function visibilityChanged() { sync(); }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
    const intersectionObserver = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; sync();
    }, { rootMargin: "0px" }) : null;
    intersectionObserver?.observe(canvas);
    document.addEventListener("visibilitychange", visibilityChanged);
    hero.addEventListener("pointermove", move, { passive: true }); hero.addEventListener("pointerleave", resetPointer, { passive: true });
    redrawRef.current = sync; resize();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver?.disconnect(); document.removeEventListener("visibilitychange", visibilityChanged);
      hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", resetPointer); redrawRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="medla-aperture" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }} />;
}
