/* One measurement per scroll frame; no autonomous playback or animation loop. */
export default function useScrollScene({ ref, count = 4, reducedMotion = false, resetKey = 0 }) {
  const total = Math.max(1, count);
  const [phase, setPhase] = React.useState(0);
  const manual = React.useRef(false);
  const intentAt = React.useRef(0);
  const lastReset = React.useRef(resetKey);

  const selectPhase = React.useCallback((index) => {
    manual.current = true;
    intentAt.current = 0;
    setPhase(Math.max(0, Math.min(total - 1, Number(index) || 0)));
  }, [total]);

  React.useEffect(() => {
    if (lastReset.current !== resetKey) {
      lastReset.current = resetKey;
      manual.current = true;
      intentAt.current = 0;
      setPhase(0);
    }
    if (reducedMotion) {
      setPhase(0);
      return undefined;
    }
    const element = ref.current;
    if (!element) return undefined;
    let frame = 0;
    let visible = true;
    let lastY = window.scrollY;
    let scrollbarPointer = null;

    const measure = () => {
      frame = 0;
      if (document.hidden || !visible || manual.current) return;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom <= 0 || rect.top >= viewport || rect.height <= 0) return;
      const top = rect.top + window.scrollY;
      // Begin as the scene enters the reading area. Finish while its artwork
      // still occupies the viewport, rather than waiting for it to disappear.
      const start = Math.max(0, top - viewport * .6);
      const finish = Math.max(start + 180, top - viewport * .12 + Math.min(rect.height * .55, viewport * .3));
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / (finish - start)));
      const next = Math.min(total - 1, Math.floor(progress * total));
      setPhase((current) => current === next ? current : next);
    };
    const schedule = () => {
      if (!frame && !document.hidden && visible && !manual.current) frame = window.requestAnimationFrame(measure);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < .5) return;
      lastY = y;
      if (manual.current) {
        // Focus and scrollIntoView must not undo a tab choice. Only an actual
        // wheel, touch gesture, scrollbar drag or page-scroll key can hand
        // control back. A held scrollbar remains intentional during slow drags.
        if (scrollbarPointer === null && (!intentAt.current || performance.now() - intentAt.current > 900)) return;
        manual.current = false;
        intentAt.current = 0;
      }
      schedule();
    };
    const onIntent = (event) => {
      if (event.defaultPrevented) return;
      if (event.type === "wheel" && !event.deltaY) return;
      if (event.type === "keydown") {
        if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
        const target = event.target;
        if (target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role=textbox],[role=combobox],[role=slider]')) return;
        if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) && target?.closest?.("[role=tab],[role=tablist]")) return;
        if ([" ", "Spacebar"].includes(event.key) && target?.closest?.("button,summary,[role=button],[role=tab]")) return;
      }
      intentAt.current = performance.now();
    };
    const onScrollbarDown = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.pointerType === "touch") return;
      const root = document.documentElement;
      const width = window.innerWidth - root.clientWidth;
      if (width <= 0 || root.scrollHeight <= root.clientHeight || event.clientY < 0 || event.clientY >= window.innerHeight) return;
      // Only the measured native gutter qualifies; content near the edge and
      // horizontal scrollbars cannot accidentally release a selected phase.
      const left = root.clientLeft >= width;
      const inGutter = left
        ? event.clientX >= 0 && event.clientX < width
        : event.clientX >= root.clientWidth && event.clientX < window.innerWidth;
      if (!inGutter) return;
      scrollbarPointer = event.pointerId;
      intentAt.current = performance.now();
    };
    const onScrollbarUp = (event) => {
      if (scrollbarPointer === null || event.pointerId !== scrollbarPointer) return;
      scrollbarPointer = null;
      intentAt.current = event.type === "pointercancel" ? 0 : performance.now();
    };
    const onBlur = () => {
      scrollbarPointer = null;
      intentAt.current = 0;
    };
    const onVisibility = () => {
      if (document.hidden) {
        onBlur();
        if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
      } else schedule();
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }) : null;
    observer?.observe(element);
    const sizeObserver = "ResizeObserver" in window ? new ResizeObserver(schedule) : null;
    sizeObserver?.observe(element);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchmove", onIntent, { passive: true });
    window.addEventListener("keydown", onIntent);
    window.addEventListener("pointerdown", onScrollbarDown, { passive: true });
    window.addEventListener("pointerup", onScrollbarUp, { passive: true });
    window.addEventListener("pointercancel", onScrollbarUp, { passive: true });
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    schedule();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      sizeObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchmove", onIntent);
      window.removeEventListener("keydown", onIntent);
      window.removeEventListener("pointerdown", onScrollbarDown);
      window.removeEventListener("pointerup", onScrollbarUp);
      window.removeEventListener("pointercancel", onScrollbarUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref, total, reducedMotion, resetKey]);

  return { phase, selectPhase };
}
