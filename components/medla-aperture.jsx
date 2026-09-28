const { useEffect, useRef } = React;

/* Three independently formed metal ribbons find the same direction.
   Geometry is fixed; the camera and reflected studio light move very slowly. */
export default function MedlaAperture({ paused = false, reducedMotion = false }) {
  const canvasRef = useRef(null);
  const controlsRef = useRef({ paused, reducedMotion });
  const redrawRef = useRef(null);

  useEffect(() => {
    controlsRef.current = { paused, reducedMotion };
    redrawRef.current?.();
  }, [paused, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0, ratio = 1, frame = 0;
    let visible = true, disposed = false, lastTime = 0, lastDraw = 0;
    let elapsed = 4, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    const ground = -1.76;
    const distance = 8;
    const samples = 100;
    const starts = [
      [[-1.40, -1.19, 0.13], [-1.90, -0.10, -0.27], [-0.62, -0.61, -0.04], [-0.30, 0.12, 0]],
      [[-0.40, -1.67, 0.27], [0.12, -1.08, 0.49], [-0.32, -0.61, 0.07], [0, 0.12, 0]],
      [[1.24, -1.20, 0.03], [1.87, -0.43, -0.18], [-0.02, -0.61, 0.03], [0.30, 0.12, 0]],
    ];

    const add = (a, b, amount = 1) => a.map((value, i) => value + b[i] * amount);
    const subtract = (a, b) => a.map((value, i) => value - b[i]);
    const normalize = (v) => { const length = Math.hypot(...v) || 1; return v.map((value) => value / length); };
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    function bezier(points, t) {
      const s = 1 - t;
      return [0, 1, 2].map((i) => s * s * s * points[0][i] + 3 * s * s * t * points[1][i] + 3 * s * t * t * points[2][i] + t * t * t * points[3][i]);
    }
    const spine = [[0, 0.12, 0], [0.32, 0.85, -0.07], [-0.12, 1.18, 0.19], [0.48, 1.78, 0.08]];
    function outflow(lane, t) {
      const point = bezier(spine, t);
      const tangent = subtract(bezier(spine, Math.min(1, t + 0.0001)), bezier(spine, Math.max(0, t - 0.0001)));
      const sideways = normalize([tangent[1], -tangent[0], 0]);
      return add(point, sideways, (lane - 1) * 0.355);
    }
    starts.forEach((points, lane) => {
      points[3] = outflow(lane, 0);
      const direction = normalize(subtract(outflow(lane, 0.001), points[3]));
      points[2] = add(points[3], direction, -0.80);
    });
    function center(lane, t) {
      if (t < 0.53) return bezier(starts[lane], t / 0.53);
      return outflow(lane, (t - 0.53) / 0.47);
    }

    // Rolled normals give each approach a different form. The final sections align.
    const ribbons = starts.map((_, lane) => {
      const rings = [];
      for (let step = 0; step <= samples; step++) {
        const t = step / samples;
        const point = center(lane, t);
        const tangent = normalize(subtract(center(lane, Math.min(1, t + 0.0001)), center(lane, Math.max(0, t - 0.0001))));
        const flatSide = normalize([tangent[1], -tangent[0], 0]);
        const roll = [-0.75, 0.57, 0.90][lane] * Math.pow(1 - t, 1.7) + Math.sin(t * Math.PI) * 0.12;
        const side = normalize(add(flatSide.map((value) => value * Math.cos(roll)), [0, 0, 1], Math.sin(roll)));
        let normal = normalize(cross(tangent, side));
        if (normal[2] > 0) normal = normal.map((value) => -value);
        const ribbonWidth = 0.265 + Math.sin(t * Math.PI) * 0.035;
        const half = ribbonWidth / 2;
        const left = add(point, side, -half), right = add(point, side, half);
        rings.push({ t, point, normal, side, left: add(left, normal, 0.023), right: add(right, normal, 0.023), lowerLeft: add(left, normal, -0.023), lowerRight: add(right, normal, -0.023) });
      }
      return { lane, rings };
    });

    function draw() {
      if (!width || !height || disposed) return;
      const still = controlsRef.current.reducedMotion;
      const phase = still ? 4 : elapsed;
      const yaw = -0.12 + pointerX * 0.065 + (still ? 0 : Math.sin(phase * 0.12) * 0.035);
      const pitch = 0.085 + pointerY * 0.025;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const unit = Math.min(width / 4.42, height / 4.67);
      const originX = width * 0.54, originY = height * 0.46;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      function project(point, reflected = false) {
        const [x, initialY, z] = point;
        const y = reflected ? 2 * ground - initialY : initialY;
        const rx = x * cy + z * sy, rz = z * cy - x * sy;
        const ry = y * cp - rz * sp, depth = rz * cp + y * sp;
        const scale = distance / (distance + depth);
        return { x: originX + rx * unit * scale, y: originY - ry * unit * scale, depth };
      }
      function polygon(points, fill, seam = false) {
        ctx.beginPath();
        points.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
        if (seam) { ctx.strokeStyle = fill; ctx.lineWidth = 0.42; ctx.stroke(); }
      }
      function line(a, b, color, strokeWidth = 0.75, opacity = 1) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color; ctx.lineWidth = strokeWidth; ctx.globalAlpha = opacity; ctx.stroke(); ctx.globalAlpha = 1;
      }
      const tint = (light, lane) => {
        const mix = Math.max(0, Math.min(1, light));
        const lower = lane === 1 ? [24, 48, 52] : [22, 38, 43];
        const upper = lane === 1 ? [173, 214, 205] : [223, 234, 230];
        return "rgb(" + lower.map((value, i) => Math.round(value + (upper[i] - value) * mix)).join(",") + ")";
      };

      // A quiet ground reflection gives the confluence weight and scale.
      const floor = project([0, ground, 0]);
      ctx.save(); ctx.translate(floor.x, floor.y); ctx.scale(1, 0.20);
      const pool = ctx.createRadialGradient(0, 0, unit * 0.1, 0, 0, unit * 2.15);
      pool.addColorStop(0, "rgba(81,130,132,0.095)"); pool.addColorStop(0.6, "rgba(33,66,72,0.035)"); pool.addColorStop(1, "rgba(8,12,14,0)");
      ctx.fillStyle = pool; ctx.fillRect(-unit * 2.2, -unit * 2.2, unit * 4.4, unit * 4.4); ctx.restore();
      ctx.save(); ctx.filter = "blur(2px)";
      const reflection = ctx.createLinearGradient(0, floor.y - unit * 0.2, 0, floor.y + unit * 0.8);
      reflection.addColorStop(0, "rgba(135,187,184,0.095)"); reflection.addColorStop(0.6, "rgba(75,122,123,0.025)"); reflection.addColorStop(1, "rgba(45,83,88,0)");
      ribbons.forEach(({ rings }) => {
        const contour = [...rings.map((ring) => project(ring.left, true)), ...rings.slice().reverse().map((ring) => project(ring.right, true))];
        polygon(contour, reflection);
      });
      ctx.restore();

      const faces = [];
      function push(points, lane, t, kind, normal) {
        const projected = points.map((point) => project(point));
        faces.push({ projected, lane, t, kind, normal, depth: projected.reduce((total, p) => total + p.depth, 0) / projected.length });
      }
      ribbons.forEach(({ lane, rings }) => {
        for (let i = 0; i < samples; i++) {
          const a = rings[i], b = rings[i + 1];
          push([a.left, a.right, b.right, b.left], lane, a.t, "face", a.normal);
          push([a.left, b.left, b.lowerLeft, a.lowerLeft], lane, a.t, "left", a.normal);
          push([a.right, a.lowerRight, b.lowerRight, b.right], lane, a.t, "right", a.normal);
        }
        [rings[0], rings[samples]].forEach((ring) => push([ring.left, ring.lowerLeft, ring.lowerRight, ring.right], lane, ring.t, "cap", ring.normal));
      });
      faces.sort((a, b) => b.depth - a.depth);

      for (const face of faces) {
        const { projected: p, lane, t, kind, normal } = face;
        if (kind !== "face") {
          const metal = ctx.createLinearGradient(p[0].x, p[0].y, p[2].x + 0.001, p[2].y + 0.001);
          metal.addColorStop(0, tint(kind === "left" ? 0.54 : 0.30, lane));
          metal.addColorStop(0.42, tint(0.10, lane));
          metal.addColorStop(1, tint(kind === "cap" ? 0.70 : 0.17, lane));
          polygon(p, metal, true);
          continue;
        }
        // Broad studio reflection plus a narrow machined edge describe satin metal.
        const facing = Math.abs(normal[2]);
        const bend = 0.34 + Math.sin(t * 5.1 + lane * 0.55) * 0.13;
        const sweep = Math.exp(-Math.pow((t - ((phase * 0.046 + lane * 0.12) % 1.5 - 0.2)) / 0.18, 2)) * 0.13;
        const amount = Math.min(0.90, bend + facing * 0.16 + sweep);
        const material = ctx.createLinearGradient((p[0].x + p[3].x) / 2, (p[0].y + p[3].y) / 2, (p[1].x + p[2].x) / 2 + 0.001, (p[1].y + p[2].y) / 2 + 0.001);
        material.addColorStop(0, tint(Math.min(1, amount + 0.43), lane));
        material.addColorStop(0.045, tint(amount + 0.11, lane));
        material.addColorStop(0.24, tint(amount + 0.31, lane));
        material.addColorStop(0.58, tint(amount, lane));
        material.addColorStop(0.88, tint(Math.max(0.07, amount - 0.30), lane));
        material.addColorStop(0.97, tint(amount - 0.13, lane));
        material.addColorStop(1, tint(amount + 0.33, lane));
        polygon(p, material, true);
        line(p[0], p[3], "#d3e3dc", 0.65, 0.55);
        line(p[1], p[2], lane === 1 ? "#b7e1d4" : "#90afa9", 0.7, 0.45);
        if (unit > 90) {
          [0.18, 0.33, 0.68].forEach((fraction) => {
            const a = { x: p[0].x + (p[1].x - p[0].x) * fraction, y: p[0].y + (p[1].y - p[0].y) * fraction };
            const b = { x: p[3].x + (p[2].x - p[3].x) * fraction, y: p[3].y + (p[2].y - p[3].y) * fraction };
            line(a, b, "#d5e2db", 0.35, 0.07);
          });
        }
      }
    }

    function canAnimate() {
      return visible && !document.hidden && !controlsRef.current.paused && !controlsRef.current.reducedMotion;
    }
    function tick(timestamp) {
      frame = 0;
      if (!canAnimate()) { lastTime = 0; return; }
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp; elapsed += delta;
      const ease = 1 - Math.exp(-delta * 3.5);
      pointerX += (targetX - pointerX) * ease; pointerY += (targetY - pointerY) * ease;
      // Thirty rendered frames per second are sufficient for this slow sculpture.
      if (timestamp - lastDraw >= 1000 / 30) { draw(); lastDraw = timestamp; }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      if (disposed) return;
      if (frame) cancelAnimationFrame(frame);
      frame = 0; lastTime = 0; lastDraw = 0; draw();
      if (canAnimate()) frame = requestAnimationFrame(tick);
    }
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width; height = bounds.height; ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio)); canvas.height = Math.max(1, Math.round(height * ratio)); sync();
    }
    function move(event) {
      if (controlsRef.current.reducedMotion || controlsRef.current.paused || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    }
    function resetPointer() { targetX = 0; targetY = 0; }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { rootMargin: "60px" }); intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    const pointerSurface = canvas.closest(".m-hero") || canvas;
    pointerSurface.addEventListener("pointermove", move, { passive: true }); pointerSurface.addEventListener("pointerleave", resetPointer, { passive: true });
    redrawRef.current = sync; resize();

    return () => {
      disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver.disconnect(); document.removeEventListener("visibilitychange", sync);
      pointerSurface.removeEventListener("pointermove", move); pointerSurface.removeEventListener("pointerleave", resetPointer); redrawRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="medla-aperture" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }} />;
}
