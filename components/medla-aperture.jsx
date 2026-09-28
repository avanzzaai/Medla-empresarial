const { useEffect, useRef } = React;

/* A single machined M. Its entrance settles once; after that the renderer
   wakes only for interaction, viewport changes or a visibility transition. */
export default function MedlaAperture({ reducedMotion = false }) {
  const canvasRef = useRef(null);
  const controlsRef = useRef({ reducedMotion });
  const redrawRef = useRef(null);

  useEffect(() => {
    controlsRef.current = { reducedMotion };
    redrawRef.current?.();
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!ctx) return;
    const hero = canvas.closest(".m-hero") || canvas;
    let width = 0, height = 0, ratio = 1, frame = 0, lastTime = 0;
    let visible = !("IntersectionObserver" in window), disposed = false;
    let elapsed = controlsRef.current.reducedMotion ? 2.65 : 0;
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    let scroll = 0, targetScroll = 0, scrollDirty = true, needsDraw = true;
    const entranceDuration = 2.65;
    const floorY = -1.60;
    const outer = [
      [-1.29, -1.60], [-1.29, 1.60], [-0.76, 1.60],
      [0, 0.30], [0.76, 1.60], [1.29, 1.60],
      [1.29, -1.60], [0.73, -1.60], [0.73, 0.47],
      [0.23, -0.39], [-0.23, -0.39], [-0.73, 0.47], [-0.73, -1.60],
    ];

    function insetPolygon(points, amount) {
      const area = points.reduce((sum, p, i) => {
        const q = points[(i + 1) % points.length];
        return sum + p[0] * q[1] - q[0] * p[1];
      }, 0);
      const sign = area > 0 ? 1 : -1;
      const edges = points.map((p, i) => {
        const q = points[(i + 1) % points.length];
        const dx = q[0] - p[0], dy = q[1] - p[1], length = Math.hypot(dx, dy);
        return { p: [p[0] - dy / length * amount * sign, p[1] + dx / length * amount * sign], d: [dx, dy] };
      });
      return edges.map((edge, i) => {
        const previous = edges[(i + edges.length - 1) % edges.length];
        const denominator = previous.d[0] * edge.d[1] - previous.d[1] * edge.d[0];
        if (Math.abs(denominator) < 0.00001) return edge.p;
        const dx = edge.p[0] - previous.p[0], dy = edge.p[1] - previous.p[1];
        const t = (dx * edge.d[1] - dy * edge.d[0]) / denominator;
        return [previous.p[0] + t * previous.d[0], previous.p[1] + t * previous.d[1]];
      });
    }
    const inner = insetPolygon(outer, 0.046);

    function draw() {
      if (!width || !height || disposed) return;
      const still = controlsRef.current.reducedMotion;
      const progress = still ? 1 : Math.min(1, elapsed / entranceDuration);
      const settled = 1 - Math.pow(1 - progress, 4);
      const yaw = -0.29 - (1 - settled) * 0.16 + (still ? 0 : pointerX * 0.060 + scroll * 0.025);
      const pitch = 0.105 + (still ? 0 : pointerY * 0.024);
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const unit = Math.min(width / 4.55, height / 4.65) * (0.97 + settled * 0.03);
      const originX = width * 0.54, originY = height * 0.455 + (1 - settled) * unit * 0.12;
      const ctxOpacity = Math.min(1, 0.08 + progress * 2.6);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = ctxOpacity;

      function project(point, reflected = false) {
        const [x, initialY, z] = point;
        const y = reflected ? 2 * floorY - initialY : initialY;
        const rx = x * cy + z * sy, rz = z * cy - x * sy;
        const ry = y * cp - rz * sp, depth = rz * cp + y * sp;
        const scale = 8 / (8 + depth);
        return { x: originX + rx * unit * scale, y: originY - ry * unit * scale, depth };
      }
      const ring = (points, z, reflected = false) => points.map(([x, y]) => project([x, y, z], reflected));
      function path(points) {
        ctx.beginPath();
        points.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.closePath();
      }
      function polygon(points, fill, edge = null) {
        path(points); ctx.fillStyle = fill; ctx.fill();
        if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      function line(a, b, color, strokeWidth = 0.75) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color; ctx.lineWidth = strokeWidth; ctx.stroke();
      }
      const silver = (level, teal = 0) => {
        const value = Math.max(0, Math.min(1, level));
        return "rgb(" + [
          Math.round(21 + 211 * value - teal * 9),
          Math.round(32 + 205 * value + teal * 7),
          Math.round(37 + 199 * value + teal * 9),
        ].join(",") + ")";
      };

      // A soft contact shadow gives the solid letter a grounded, architectural mass.
      const floor = project([0, floorY, 0.15]);
      ctx.save(); ctx.translate(floor.x, floor.y + unit * 0.025); ctx.scale(1, 0.12);
      const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, unit * 1.75);
      shadow.addColorStop(0, "rgba(0,0,0,.65)");
      shadow.addColorStop(0.55, "rgba(0,0,0,.29)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadow; ctx.fillRect(-unit * 1.8, -unit * 1.8, unit * 3.6, unit * 3.6);
      ctx.restore();
      ctx.save(); ctx.filter = "blur(2.5px)";
      const reflection = ctx.createLinearGradient(0, floor.y - unit * 0.2, 0, floor.y + unit * 0.85);
      reflection.addColorStop(0, "rgba(134,168,166,.12)");
      reflection.addColorStop(0.42, "rgba(76,112,114,.04)");
      reflection.addColorStop(1, "rgba(31,60,65,0)");
      polygon(ring(outer, -0.25, true), reflection);
      ctx.restore();

      const front = ring(inner, -0.37);
      const shoulder = ring(outer, -0.31);
      const back = ring(outer, 0.31);
      const backFace = ring(inner, 0.37);
      polygon(backFace, "#101c21");
      const sides = outer.map((p, i) => {
        const next = (i + 1) % outer.length;
        const q = outer[next], dx = q[0] - p[0], dy = q[1] - p[1];
        const length = Math.hypot(dx, dy);
        const light = Math.max(0.04, Math.min(0.8, 0.25 + (dy / length * -0.3 + dx / length * -0.6) * 0.45));
        return { i, next, light, depth: (shoulder[i].depth + shoulder[next].depth + back[i].depth + back[next].depth) / 4 };
      }).sort((a, b) => b.depth - a.depth);

      for (const side of sides) {
        const { i, next, light } = side;
        const material = ctx.createLinearGradient(shoulder[i].x, shoulder[i].y, back[next].x + 0.01, back[next].y + 0.01);
        material.addColorStop(0, silver(light + 0.09, 0.45));
        material.addColorStop(0.27, silver(light - 0.10, 0.55));
        material.addColorStop(0.80, silver(light - 0.17, 0.25));
        material.addColorStop(1, silver(light + 0.02));
        polygon([shoulder[i], back[i], back[next], shoulder[next]], material, "rgba(131,164,166,.19)");
        polygon([back[i], backFace[i], backFace[next], back[next]], silver(light * 0.45), "rgba(108,140,141,.12)");
      }

      // Each chamfer catches a different strip of the studio environment.
      for (const side of sides) {
        const { i, next, light } = side;
        const edgeLight = Math.min(1, light + 0.44);
        const bevel = ctx.createLinearGradient(shoulder[i].x, shoulder[i].y, front[next].x + 0.01, front[next].y + 0.01);
        bevel.addColorStop(0, silver(edgeLight));
        bevel.addColorStop(0.46, silver(Math.max(0.18, edgeLight - 0.24), 0.25));
        bevel.addColorStop(1, silver(edgeLight + 0.18));
        polygon([shoulder[i], front[i], front[next], shoulder[next]], bevel);
      }

      const left = Math.min(...front.map((point) => point.x)), right = Math.max(...front.map((point) => point.x));
      const top = Math.min(...front.map((point) => point.y)), bottom = Math.max(...front.map((point) => point.y));
      const metal = ctx.createLinearGradient(left - unit * 0.45, top + unit * 0.15, right + unit * 0.30, bottom * 0.72);
      metal.addColorStop(0, "#32464d");
      metal.addColorStop(0.18, "#829798");
      metal.addColorStop(0.34, "#d1dad7");
      metal.addColorStop(0.52, "#9baead");
      metal.addColorStop(0.73, "#435b63");
      metal.addColorStop(0.88, "#acbfbb");
      metal.addColorStop(1, "#718b8d");
      polygon(front, metal);

      ctx.save(); path(front); ctx.clip();
      // Brushing belongs to the metal face and never spills beyond its silhouette.
      for (let y = Math.floor(top); y <= bottom; y += 1.6) {
        const variation = (Math.sin(y * 1.37) + Math.sin(y * 0.41)) * 0.006;
        ctx.strokeStyle = "rgba(235,243,236," + (0.024 + variation).toFixed(4) + ")";
        ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y - unit * 0.015); ctx.stroke();
      }
      const softbox = ctx.createLinearGradient(left, top, right, bottom);
      softbox.addColorStop(0, "rgba(225,242,230,0)");
      softbox.addColorStop(0.33, "rgba(225,242,230,.035)");
      softbox.addColorStop(0.46, "rgba(241,248,238,.13)");
      softbox.addColorStop(0.64, "rgba(225,242,230,0)");
      ctx.fillStyle = softbox; ctx.fillRect(left, top, right - left, bottom - top);
      ctx.restore();

      for (const { i, next, light } of sides) {
        line(front[i], front[next], light > 0.25 ? "rgba(233,243,230,.66)" : "rgba(170,212,205,.42)", 0.72);
        line(shoulder[i], shoulder[next], "rgba(90,153,153,.30)", 0.55);
      }
      ctx.globalAlpha = 1;
    }

    function available() { return visible && !document.hidden && !disposed; }
    function wake() {
      if (!frame && available()) frame = requestAnimationFrame(tick);
    }
    function tick(timestamp) {
      frame = 0;
      if (!available()) { lastTime = 0; return; }
      const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.066) : 1 / 60;
      lastTime = timestamp;
      const still = controlsRef.current.reducedMotion;
      if (still) {
        elapsed = entranceDuration; pointerX = 0; pointerY = 0; targetX = 0; targetY = 0; scroll = 0; targetScroll = 0; scrollDirty = false;
      } else {
        elapsed = Math.min(entranceDuration, elapsed + delta);
        if (scrollDirty) {
          const rect = hero.getBoundingClientRect();
          targetScroll = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
          scrollDirty = false;
        }
        const ease = 1 - Math.exp(-delta * 5);
        pointerX += (targetX - pointerX) * ease; pointerY += (targetY - pointerY) * ease; scroll += (targetScroll - scroll) * ease;
      }
      draw(); needsDraw = false;
      const settling = Math.abs(pointerX - targetX) + Math.abs(pointerY - targetY) + Math.abs(scroll - targetScroll) > 0.0008;
      if (!still && (elapsed < entranceDuration || settling || scrollDirty || needsDraw)) wake();
      else lastTime = 0;
    }
    function sync() {
      if (disposed) return;
      if (frame) cancelAnimationFrame(frame);
      frame = 0; lastTime = 0; needsDraw = true;
      if (controlsRef.current.reducedMotion) elapsed = entranceDuration;
      wake();
    }
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width; height = bounds.height; ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio)); canvas.height = Math.max(1, Math.round(height * ratio));
      scrollDirty = true; sync();
    }
    function move(event) {
      if (controlsRef.current.reducedMotion || event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / Math.max(1, bounds.height) * 2 - 1));
      wake();
    }
    function resetPointer() { targetX = 0; targetY = 0; wake(); }
    function onScroll() {
      if (controlsRef.current.reducedMotion) return;
      scrollDirty = true; wake();
    }
    function visibilityChanged() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; lastTime = 0;
      if (available()) { scrollDirty = true; wake(); }
    }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
    const intersectionObserver = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; visibilityChanged();
    }, { rootMargin: "30px" }) : null;
    intersectionObserver?.observe(canvas);
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("scroll", onScroll, { passive: true });
    hero.addEventListener("pointermove", move, { passive: true }); hero.addEventListener("pointerleave", resetPointer, { passive: true });
    redrawRef.current = sync; resize();

    return () => {
      disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged); window.removeEventListener("scroll", onScroll);
      hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", resetPointer); redrawRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="medla-aperture" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }} />;
}
