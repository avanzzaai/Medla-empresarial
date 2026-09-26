const { useEffect, useRef } = React;

/* A small, purpose-built renderer. The three frames and their reflections are
   actual projected geometry; the light travelling through them is one path. */
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
    const context = canvas?.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let visible = true;
    let lastTime = 0;
    let elapsed = 3.2;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let disposed = false;
    const ground = -1.72;
    const distance = 7.5;

    const frames = [-1.06, 0.18, 1.42].map((z, index) => ({
      z,
      index,
      outer: [[-1.13, 1.74], [1.13, 1.74], [1.13, ground], [-1.13, ground]],
      inner: [[-0.965, 1.575], [0.965, 1.575], [0.965, ground + 0.165], [-0.965, ground + 0.165]],
    }));

    function draw(time) {
      if (!width || !height || disposed) return;
      const staticScene = controlsRef.current.reducedMotion;
      const phase = staticScene ? 3.2 : elapsed;
      const yaw = -0.29 + pointerX * 0.032 + (staticScene ? 0 : Math.sin(phase * 0.14) * 0.011);
      const pitch = 0.13 + pointerY * 0.016;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const unit = Math.min(width / 4.52, height / 4.87);
      const originX = width * 0.535;
      const originY = height * 0.443;
      const ctx = context;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      function project(x, y, z, reflect = false) {
        if (reflect) y = ground * 2 - y;
        const rx = x * cy + z * sy;
        const rz = z * cy - x * sy;
        const ry = y * cp - rz * sp;
        const depth = rz * cp + y * sp;
        const perspective = distance / (distance + depth);
        return { x: originX + rx * unit * perspective, y: originY - ry * unit * perspective, depth };
      }

      function polygon(vertices, fill, alpha = 1, stroke = null) {
        ctx.beginPath();
        vertices.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.closePath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      function line(points, color, lineWidth = 1, alpha = 1) {
        if (!points.length) return;
        ctx.beginPath();
        points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // A lit ground surface anchors the object without a visible container.
      const floorCenter = project(0, ground, 0.5);
      ctx.save();
      ctx.translate(floorCenter.x, floorCenter.y);
      ctx.scale(1, 0.25);
      const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, unit * 2.7);
      pool.addColorStop(0, "rgba(88,147,146,0.115)");
      pool.addColorStop(0.36, "rgba(50,95,98,0.057)");
      pool.addColorStop(1, "rgba(10,17,20,0)");
      ctx.fillStyle = pool;
      ctx.fillRect(-unit * 2.8, -unit * 2.8, unit * 5.6, unit * 5.6);
      ctx.restore();

      const surfaces = [];
      frames.forEach(({ z, outer, inner, index }) => {
        const front = z - 0.125;
        const back = z + 0.125;
        const push = (points, type, edge) => {
          const projected = points.map((point) => project(...point));
          surfaces.push({ points, projected, type, edge, index, depth: projected.reduce((sum, p) => sum + p.depth, 0) / projected.length });
        };
        for (let edge = 0; edge < 4; edge++) {
          const next = (edge + 1) % 4;
          push([[...outer[edge], back], [...outer[next], back], [...inner[next], back], [...inner[edge], back]], "back", edge);
          push([[...outer[edge], front], [...outer[next], front], [...outer[next], back], [...outer[edge], back]], "outer", edge);
          push([[...inner[edge], front], [...inner[next], front], [...inner[next], back], [...inner[edge], back]], "inner", edge);
          push([[...outer[edge], front], [...outer[next], front], [...inner[next], front], [...inner[edge], front]], "front", edge);
        }
      });
      surfaces.sort((a, b) => b.depth - a.depth);

      // Ground reflection: deliberately soft and short, like brushed stone.
      ctx.save();
      ctx.filter = "blur(1.5px)";
      for (const surface of surfaces) {
        if (surface.type !== "front" && surface.type !== "inner") continue;
        const projected = surface.points.map((point) => project(...point, true));
        const sheen = ctx.createLinearGradient(0, floorCenter.y - unit * 0.05, 0, floorCenter.y + unit * 1.6);
        sheen.addColorStop(0, "rgba(112,164,166,0.14)");
        sheen.addColorStop(0.35, "rgba(89,134,137,0.035)");
        sheen.addColorStop(1, "rgba(40,70,74,0)");
        polygon(projected, sheen);
      }
      ctx.restore();

      // Continuous conduits turn towards the opening and travel through all
      // three frames. The travelling highlights follow that same geometry.
      function route(z, lane) {
        const entrance = Math.max(0, -z - 0.8);
        const exit = Math.max(0, z - 1.9);
        const x = (lane - 3) * 0.09 - entrance * entrance * 0.16 + exit * exit * 0.07;
        const y = ground + 0.245 + Math.sin((z + 3.8) * 0.6) * 0.05;
        return project(x, y, z);
      }
      for (let lane = 0; lane < 7; lane++) {
        const points = [];
        for (let step = 0; step <= 88; step++) points.push(route(-4.05 + step / 88 * 8.1, lane));
        line(points, lane === 3 ? "#d6c7a0" : "#80aeb1", lane === 3 ? 1 : 0.65, lane === 3 ? 0.47 : 0.22);
        const progress = ((phase * 0.13 + lane * 0.145) % 1);
        const head = -3.9 + progress * 7.8;
        for (let segment = 0; segment < 12; segment++) {
          const z = head - segment * 0.055;
          if (z < -4.05 || z > 4.05) continue;
          line([route(z, lane), route(z + 0.06, lane)], lane === 3 ? "#f0deb0" : "#a7e2df", 1.3, (1 - segment / 12) * 0.85);
        }
      }

      // Material faces carry directional highlights rather than flat strokes.
      for (const surface of surfaces) {
        const { projected, type, edge, index } = surface;
        const left = Math.min(...projected.map((p) => p.x));
        const right = Math.max(...projected.map((p) => p.x));
        const top = Math.min(...projected.map((p) => p.y));
        const bottom = Math.max(...projected.map((p) => p.y));
        const material = ctx.createLinearGradient(left, top, right + 0.01, bottom + 0.01);
        if (type === "front") {
          const palette = edge === 0
            ? ["#bacac9", "#64787d", "#253b41", "#8ca8aa"]
            : edge === 3
              ? ["#8ca5a7", "#30484e", "#15282e", "#729195"]
              : edge === 1
                ? ["#5a757c", "#172a32", "#354e53", "#739195"]
                : ["#14272d", "#496368", "#7e9e9e", "#273f43"];
          palette.forEach((color, i) => material.addColorStop(i / 3, color));
        } else if (type === "inner") {
          material.addColorStop(0, edge === 3 ? "#365a5e" : "#12262d");
          material.addColorStop(0.55, "#0b161c");
          material.addColorStop(1, edge === 1 ? "#5c8c8d" : "#27464d");
        } else {
          material.addColorStop(0, "#18292f");
          material.addColorStop(0.6, "#0b171c");
          material.addColorStop(1, "#29424a");
        }
        polygon(projected, material, 1, type === "front" ? "rgba(179,214,216,0.28)" : "rgba(80,124,131,0.12)");
        if (type === "front") {
          // Machined edge: a one-pixel lip with a quieter parallel chamfer.
          line([projected[0], projected[1]], "#d1e6e4", 0.8, edge === 0 ? 0.78 : 0.25);
          line([projected[2], projected[3]], index === 1 ? "#cddbd4" : "#a7d6d3", 1.05, 0.7);
          const shine = 0.21 + Math.sin(phase * 0.8 - index * 0.9) * 0.08;
          ctx.save();
          ctx.shadowColor = "#76c8c1";
          ctx.shadowBlur = 7;
          line([projected[2], projected[3]], "#8dc9c3", 1.1, shine);
          ctx.restore();
        }
      }

      // Tiny engraved registration marks belong to the sculpture, not the UI.
      frames.forEach(({ z, index }) => {
        const a = project(-1.064, ground + 0.27, z - 0.126);
        const b = project(-1.018, ground + 0.27, z - 0.126);
        for (let mark = 0; mark <= index; mark++) {
          line([{ x: a.x, y: a.y - mark * 3 }, { x: b.x, y: b.y - mark * 3 }], "#cbdedb", 0.8, 0.6);
        }
      });

      // Light escaping the far opening is a narrow physical slit.
      const distantA = project(-0.62, ground + 0.19, 2.28);
      const distantB = project(0.62, ground + 0.19, 2.28);
      const horizon = ctx.createLinearGradient(distantA.x, distantA.y, distantB.x, distantB.y);
      horizon.addColorStop(0, "rgba(152,215,208,0)");
      horizon.addColorStop(0.5, "rgba(192,234,224,0.65)");
      horizon.addColorStop(1, "rgba(152,215,208,0)");
      line([distantA, distantB], horizon, 1.2);
    }

    function canAnimate() {
      return visible && !document.hidden && !controlsRef.current.paused && !controlsRef.current.reducedMotion;
    }

    function tick(timestamp) {
      frame = 0;
      if (!canAnimate()) {
        lastTime = 0;
        return;
      }
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      elapsed += delta;
      const ease = 1 - Math.exp(-delta * 4);
      pointerX += (targetX - pointerX) * ease;
      pointerY += (targetY - pointerY) * ease;
      draw(timestamp);
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      if (disposed) return;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      draw();
      if (canAnimate()) frame = requestAnimationFrame(tick);
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      sync();
    }

    function move(event) {
      if (controlsRef.current.reducedMotion || controlsRef.current.paused || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    }
    function resetPointer() { targetX = 0; targetY = 0; }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { rootMargin: "60px" });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    const pointerSurface = canvas.closest(".m-hero") || canvas;
    pointerSurface.addEventListener("pointermove", move, { passive: true });
    pointerSurface.addEventListener("pointerleave", resetPointer, { passive: true });
    redrawRef.current = sync;
    resize();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      pointerSurface.removeEventListener("pointermove", move);
      pointerSurface.removeEventListener("pointerleave", resetPointer);
      redrawRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="medla-aperture" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }} />;
}
