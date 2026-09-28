const { useEffect, useLayoutEffect, useMemo, useRef, useState } = React;

const GUIDES = [
  {
    id: "automatizar-sin-arrastrar-caos", number: "01", category: "Operaciones", format: "Nota práctica", duration: "6 min",
    title: "Qué dibujar antes de automatizar un proceso",
    excerpt: "Una secuencia breve para separar reglas, excepciones y responsables antes de abrir una herramienta.",
    question: "¿Qué decisión humana debe seguir existiendo cuando el flujo esté automatizado?",
    intro: "Automatizar un proceso confuso solo consigue que los errores circulen más rápido. Esta nota sirve para describir el trabajo actual sin maquillar sus fricciones y decidir qué parte merece software.",
    sections: [
      ["Empieza por una sola salida", "Nombra el resultado observable que debe producir el proceso: una propuesta enviada, una incidencia resuelta o un contrato listo para firma. Si hay varias salidas, sepáralas. Todavía no hables de herramientas."],
      ["Dibuja decisiones, no departamentos", "Anota cada punto en el que alguien acepta, rechaza, corrige o escala. Para cada decisión, registra la información que necesita y quién puede tomarla."],
      ["Clasifica las excepciones", "Distingue las excepciones frecuentes de los casos extraordinarios. Las primeras pueden convertirse en reglas; las segundas necesitan una salida clara hacia una persona, con contexto suficiente para actuar."]
    ],
    takeaway: "Una automatización está bien planteada cuando reduce pasos repetidos sin ocultar quién decide, con qué criterio y cómo se recupera un caso atípico."
  },
  {
    id: "ficha-juridica-util", number: "02", category: "Legal", format: "Nota práctica", duration: "5 min",
    title: "La ficha de contexto que evita revisar un contrato a ciegas",
    excerpt: "Seis datos de negocio que permiten revisar una relación contractual con el contexto adecuado.",
    question: "¿Qué tendría que ocurrir para que este acuerdo dejara de ser rentable o controlable?",
    intro: "Un contrato no se evalúa solo por cómo está redactado. También importa la operación que debe sostener. Una ficha clara permite que la revisión jurídica se concentre en los riesgos que sí afectan a la decisión.",
    sections: [
      ["Describe el intercambio real", "Resume qué entrega cada parte, cuándo se considera cumplido y qué depende de terceros. Incluye los hitos que disparan pagos, renovaciones o responsabilidades."],
      ["Señala lo que no es negociable", "Aclara los límites comerciales y operativos antes de revisar cláusulas: plazo máximo, jurisdicción, uso de datos, propiedad del trabajo o capacidad para terminar la relación."],
      ["Explica dónde vive la evidencia", "Identifica qué documentos, registros o sistemas demostrarían que cada parte cumplió. Si una obligación no deja rastro verificable, también será difícil exigirla."]
    ],
    takeaway: "La revisión mejora cuando negocio y legal comparten la misma descripción de la operación, sus límites y la evidencia que quedará disponible."
  },
  {
    id: "ia-con-propietario", number: "03", category: "IA aplicada", format: "Análisis", duration: "7 min",
    title: "Una tarea para IA necesita propietario, límites y salida",
    excerpt: "Un marco para evaluar asistentes y agentes sin confundir una demostración fluida con un sistema fiable.",
    question: "¿Quién responde cuando el sistema no sabe, interpreta mal o necesita escalar?",
    intro: "El valor de un sistema con IA no está en producir una respuesta vistosa, sino en integrarse en una decisión concreta con información, límites y supervisión definidos.",
    sections: [
      ["Delimita la unidad de trabajo", "Evita objetivos abiertos como “mejorar soporte”. Define una tarea comprobable: clasificar una solicitud, preparar un borrador o recuperar datos de una fuente autorizada."],
      ["Especifica fuentes y prohibiciones", "Enumera qué información puede consultar, qué datos no debe usar y qué acciones no puede ejecutar. El sistema necesita una frontera tan explícita como su objetivo."],
      ["Diseña la salida antes de la instrucción", "Decide el formato, los campos obligatorios, la evidencia que debe mostrar y cuándo debe reconocer que no tiene base suficiente. Después se redacta la instrucción."]
    ],
    takeaway: "La IA se vuelve operativa cuando su resultado puede revisarse, su incertidumbre tiene una ruta y alguien conserva la responsabilidad sobre la decisión."
  },
  {
    id: "datos-y-permisos", number: "04", category: "Sistemas", format: "Nota práctica", duration: "6 min",
    title: "Antes del panel de control: fuentes, permisos y definiciones",
    excerpt: "La conversación mínima para que un panel no convierta versiones distintas del negocio en una falsa certeza.",
    question: "¿Dos personas pueden calcular este indicador y llegar al mismo resultado?",
    intro: "Un panel de control solo es útil cuando las personas confían en lo que significa cada dato. Esa confianza se diseña antes de elegir gráficos o colores.",
    sections: [
      ["Nombra la fuente responsable", "Cada indicador necesita una fuente principal y una persona que pueda explicar su origen. Las copias y hojas auxiliares deben identificarse como derivadas, no competir como otra verdad."],
      ["Escribe la definición completa", "Incluye periodo, unidad, exclusiones y momento de actualización. “Cliente activo” u “oportunidad” no significan lo mismo para todos si nunca se documentaron."],
      ["Ajusta acceso a la decisión", "No todo el mundo necesita ver o editar todo. Relaciona permisos con las decisiones que toma cada rol y conserva trazabilidad cuando un dato cambia."]
    ],
    takeaway: "La visualización llega al final. Primero se acuerda qué significa el dato, quién lo mantiene y quién puede utilizarlo."
  },
  {
    id: "experimento-comercial", number: "05", category: "Crecimiento", format: "Análisis", duration: "5 min",
    title: "Cómo diseñar un experimento comercial con criterio de cierre",
    excerpt: "Hipótesis, audiencia, señal y fecha de corte para aprender sin perpetuar campañas ambiguas.",
    question: "¿Qué observación concreta haría que dejáramos de invertir en esta idea?",
    intro: "Un experimento no es una campaña pequeña. Es una forma limitada de reducir incertidumbre antes de ampliar una inversión comercial.",
    sections: [
      ["Una hipótesis con mecanismo", "Formula qué comportamiento esperas y por qué debería producirse. “Aumentar oportunidades” no explica qué cambio probarás ni qué crees que mueve la decisión del cliente."],
      ["Una audiencia reconocible", "Define la situación del cliente, no solo un sector o un cargo. El momento de decisión, el problema visible y las restricciones suelen ser mejores criterios de segmentación."],
      ["Una señal y una fecha de corte", "Elige una señal cercana al comportamiento que quieres validar y fija cuándo revisarás el resultado. Sin una fecha de corte, el experimento se convierte en actividad indefinida."]
    ],
    takeaway: "El experimento debe poder producir una decisión: continuar, ajustar una variable o cerrar la línea de trabajo."
  },
  {
    id: "reunion-de-arranque", number: "06", category: "Dirección", format: "Nota práctica", duration: "4 min",
    title: "Cómo cerrar una reunión de arranque con decisiones y responsables",
    excerpt: "El mínimo documento compartido para que dirección, especialistas y equipo interno empiecen alineados.",
    question: "¿Qué puede decidir cada persona sin volver a convocar a todo el equipo?",
    intro: "El arranque de un proyecto debería reducir ambigüedad. Una reunión útil termina con decisiones registradas, responsabilidades claras y una primera transferencia de contexto.",
    sections: [
      ["Define el cambio observable", "Describe qué será distinto al terminar y para quién. Evita convertir una lista de entregables en la definición del éxito."],
      ["Asigna derechos de decisión", "Distingue quién propone, quién aporta contexto y quién aprueba. Una responsabilidad colectiva suele ocultar quién tiene autoridad para tomar la decisión."],
      ["Cierra la primera transferencia", "Acuerda dónde quedan decisiones, documentos y cambios. El canal y el formato importan menos que la posibilidad de recuperar el contexto sin depender de la memoria."]
    ],
    takeaway: "Un buen arranque no intenta resolver el proyecto: crea las condiciones para decidir con velocidad y dejar rastro."
  }
];


const CATEGORY_FILTERS = [
  { label: "Todas", categories: null },
  { label: "Operación", categories: ["Operaciones", "Sistemas"] },
  { label: "Decisión", categories: ["Legal", "Dirección"] },
  { label: "Tecnología y crecimiento", categories: ["IA aplicada", "Crecimiento"] },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}


function Hero({ onOpenCover }) {
  return <header className="journal-hero">
    <div className="journal-hero-kicker"><span>Ideas MEDLA</span><span>Empresa / Legal / Tecnología</span></div>
    <div className="journal-hero-main"><div className="journal-hero-copy">
      <h1>Pensar mejor.<br /><em>Decidir mejor.</em></h1>
      <p className="journal-hero-intro">Notas breves sobre las decisiones que aparecen cuando diriges, organizas o transformas una empresa.</p>
      <a className="text-action" href="#indice">Explorar las notas <span aria-hidden="true">↓</span></a>
    </div><aside className="journal-featured" aria-label="Nota destacada"><span>Para empezar / 01</span><p>Antes de automatizar,<br />dibuja la decisión.</p><small>Operaciones · {GUIDES[0].duration}</small><button type="button" onClick={onOpenCover}>Leer la nota <span aria-hidden="true">↗</span></button></aside></div>
    <div className="journal-hero-foot"><span>01 — Seis notas prácticas</span><a href="#indice">Explorar las notas <span aria-hidden="true">↓</span></a></div>
  </header>;
}

function FilterBar({ query, setQuery, category, setCategory, resultCount }) {
  return <section className="journal-controls" aria-label="Buscar notas">
    <div className="journal-section-index"><span>Elige por dónde empezar</span><span role="status" aria-live="polite">{String(resultCount).padStart(2, "0")} {resultCount === 1 ? "nota" : "notas"}</span></div>
    <div className="journal-control-row journal-control-row--simple">
      <div className="journal-filter-group"><p>Explora por operación, decisión o tecnología.</p><div className="journal-filters" role="group" aria-label="Filtrar notas por categoría">{CATEGORY_FILTERS.map((item) => <button key={item.label} type="button" className={category === item.label ? "is-active" : ""} aria-pressed={category === item.label} onClick={() => setCategory(item.label)}>{item.label}</button>)}</div></div>
      <label className="journal-search"><span className="sr-only">Buscar en las notas</span><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar por tema" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
  </section>;
}

function GuideIndex({ guides, onOpen }) {
  const indexRef = useRef(null), previousRects = useRef(new Map());
  const reducedMotion = useReducedMotion();
  const resultKey = guides.map(guide => guide.id).join("|");
  useLayoutEffect(() => {
    const rows = [...(indexRef.current?.querySelectorAll(".guide-row") || [])];
    const animations = [];
    const nextRects = new Map();
    rows.forEach((row, index) => {
      const rect = row.getBoundingClientRect();
      const previous = previousRects.current.get(row.id);
      const documentTop = rect.top + window.scrollY;
      nextRects.set(row.id, { top: documentTop });
      if (reducedMotion || document.hidden || rect.bottom <= 0 || rect.top >= window.innerHeight || !row.animate) return;
      const offset = previous ? previous.top - documentTop : 10;
      if (previous && Math.abs(offset) < 1) return;
      animations.push(row.animate([
        { transform: `translateY(${offset}px)`, opacity: previous ? 1 : 0 },
        { transform: "translateY(0)", opacity: 1 },
      ], { duration: 320, delay: previous ? 0 : Math.min(index * 25, 100), easing: "cubic-bezier(.22,1,.36,1)" }));
    });
    previousRects.current = nextRects;
    const stopWhenHidden = () => { if (document.hidden) animations.forEach(animation => animation.cancel()); };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => { animations.forEach(animation => animation.cancel()); document.removeEventListener("visibilitychange", stopWhenHidden); };
  }, [resultKey, reducedMotion]);
  return <section ref={indexRef} id="indice" className="guide-index" tabIndex="-1" aria-label="Índice de notas">{guides.length ? guides.map((guide, index) =>
    <article id={guide.id} className="guide-row" style={{ "--row-index": index }} key={guide.id}><button type="button" className="guide-row-button" onClick={() => onOpen(guide)} aria-label={`Abrir nota: ${guide.title}`}>
      <span className="guide-number">{guide.number}</span><span className="guide-category">{guide.category}</span>
      <span className="guide-title-wrap"><span className="guide-title">{guide.title}</span><span className="guide-excerpt">{guide.excerpt}</span></span>
      <span className="guide-format">{guide.format}<br />{guide.duration}</span><span className="guide-arrow" aria-hidden="true">↗</span>
    </button></article>
  ) : <div className="journal-empty" role="status"><span>Sin coincidencias</span><p>Prueba con otra disciplina o una búsqueda más corta.</p></div>}</section>;
}

function GuideReader({ guide, onClose, onNext }) {
  const dialogRef = useRef(null), closeRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(-1);
  const [copyStatus, setCopyStatus] = useState("");
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!guide) return undefined;
    const oldOverflow = document.body.style.overflow;
    const background = [...document.querySelectorAll(".journal-page > :not(.reader-shell)")];
    document.body.style.overflow = "hidden"; closeRef.current && closeRef.current.focus();
    background.forEach((element) => element.setAttribute("inert", ""));
    const onKey = (event) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab") return;
      const focusables = Array.from(dialogRef.current.querySelectorAll("a[href], button:not([disabled])"));
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = oldOverflow; background.forEach((element) => element.removeAttribute("inert")); document.removeEventListener("keydown", onKey); };
  }, [guide, onClose]);
  useEffect(() => {
    const reader = dialogRef.current;
    if (!guide || !reader) return undefined;
    reader.scrollTop = 0;
    setProgress(0);
    setActiveSection(-1);
    setCopyStatus("");
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = reader.scrollHeight - reader.clientHeight;
      setProgress(max > 0 ? Math.min(1, reader.scrollTop / max) : 1);
      const threshold = reader.getBoundingClientRect().top + 160;
      const sections = [...reader.querySelectorAll(".reader-sections > section")];
      let active = -1;
      sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= threshold) active = index; });
      setActiveSection(active);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    reader.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.cancelAnimationFrame(frame); reader.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [guide]);
  const jumpToSection = (index) => {
    const section = dialogRef.current?.querySelectorAll(".reader-sections > section")[index];
    section?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    section?.focus({ preventScroll: true });
  };
  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("guide", guide.id);
    url.hash = "";
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopyStatus("Enlace copiado");
    } catch {
      setCopyStatus("El enlace está en la barra del navegador");
    }
  };
  if (!guide) return null;
  return <div className="reader-shell" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <article ref={dialogRef} className="reader" role="dialog" aria-modal="true" aria-labelledby="reader-title">
      <header className="reader-head"><span className="reader-brand">Notas de decisión / {guide.number}</span><button ref={closeRef} type="button" className="reader-close" onClick={onClose}>Cerrar <span aria-hidden="true">×</span></button><div className="reader-top-progress" role="progressbar" aria-label="Posición en la nota" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress * 100)}><i style={{ transform: `scaleX(${progress})` }} /></div></header>
      <div className="reader-layout"><aside className="reader-aside"><span>{guide.category}</span><span>{guide.format}</span><span>{guide.duration} de lectura</span><nav className="reader-chapters" aria-label="Secciones de la nota">{guide.sections.map((section, index) => <button key={section[0]} type="button" aria-current={activeSection === index ? "location" : undefined} onClick={() => jumpToSection(index)}><small>0{index + 1}</small>{section[0]}</button>)}</nav><div className="reader-progress" aria-hidden="true"><span style={{ width: `${Math.round(progress * 100)}%` }}></span></div><small>{Math.round(progress * 100)}% del recorrido</small></aside>
        <div className="reader-content"><p className="reader-eyebrow">Una nota para preparar el proyecto</p><h2 id="reader-title">{guide.title}</h2><p className="reader-lead">{guide.intro}</p>
          <blockquote><span>Pregunta crítica</span><p>{guide.question}</p></blockquote>
          <div className="reader-sections">{guide.sections.map((section, index) => <section key={section[0]} tabIndex="-1"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{section[0]}</h3><p>{section[1]}</p></div></section>)}</div>
          <div className="reader-takeaway"><span>Lo que debería quedar sobre la mesa</span><p>{guide.takeaway}</p></div>
          <div className="reader-actions"><a href={`contacto.html?context=notas&guide=${guide.id}`}>Aplicar esta nota a un proyecto <span aria-hidden="true">↗</span></a><button type="button" onClick={copyLink}>Copiar enlace <span aria-hidden="true">⧉</span></button><button type="button" onClick={onNext}>Siguiente nota <span aria-hidden="true">→</span></button></div><p className="reader-copy-status" role="status" aria-live="polite">{copyStatus}</p>
        </div>
      </div>
    </article>
  </div>;
}

function EditorialStatement() {
  return <section className="editorial-statement"><div className="statement-label">Cómo utilizarlas</div><div className="statement-copy"><h2>Lee. Contrasta.<br /><em>Llévalo a tu empresa.</em></h2><p>Cada nota ayuda a preparar hechos, preguntas y límites antes de una decisión. No sustituye asesoramiento adaptado al caso.</p><a href="contacto.html?context=notas">Comentar una nota con MEDLA <span aria-hidden="true">↗</span></a></div></section>;
}

function ConversationCTA() {
  return <section className="journal-cta"><div className="journal-cta-label">03 — Aplicar a tu proyecto</div><p>Describe la decisión, el plazo y las áreas implicadas. Revisaremos el encaje y la información necesaria.</p><a href="contacto.html?context=notas"><span>Plantear un proyecto</span><span aria-hidden="true">↗</span></a></section>;
}

const BLOG_HISTORY_STATE = "medlaBlog";

function createBlogEntryId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function readBlogHistoryState(state = window.history.state) {
  const blogState = state && typeof state === "object" ? state[BLOG_HISTORY_STATE] : null;
  return blogState?.version === 1 ? blogState : null;
}

function BlogApp() {
  const guideFromUrl = () => GUIDES.find((guide) => guide.id === new URLSearchParams(window.location.search).get("guide")) || null;
  const [query, setQuery] = useState(""), [category, setCategory] = useState("Todas"), [selected, setSelected] = useState(guideFromUrl);
  const lastTrigger = useRef(null);
  const activeIndexEntry = useRef(null);
  const readerOrigin = useRef(null);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    const activeFilter = CATEGORY_FILTERS.find((item) => item.label === category);
    return GUIDES.filter((guide) => (!activeFilter?.categories || activeFilter.categories.includes(guide.category)) && (!normalized || `${guide.title} ${guide.excerpt} ${guide.category} ${guide.format}`.toLocaleLowerCase("es").includes(normalized)));
  }, [category, query]);

  const replaceBlogHistoryState = (blogState, url = window.location.href) => {
    const currentState = window.history.state && typeof window.history.state === "object" ? window.history.state : {};
    window.history.replaceState({ ...currentState, [BLOG_HISTORY_STATE]: { version: 1, ...blogState } }, "", url);
  };

  const setGuideUrl = (guide, { replace = false, origin = "direct", indexEntryId = null } = {}) => {
    const url = new URL(window.location.href);
    if (guide) url.searchParams.set("guide", guide.id); else url.searchParams.delete("guide");
    url.hash = "";
    const currentState = window.history.state && typeof window.history.state === "object" ? window.history.state : {};
    const blogState = guide
      ? { version: 1, view: "reader", guideId: guide.id, origin, indexEntryId: origin === "index" ? indexEntryId : null }
      : { version: 1, view: "index", entryId: indexEntryId || createBlogEntryId() };
    window.history[replace ? "replaceState" : "pushState"]({ ...currentState, [BLOG_HISTORY_STATE]: blogState }, "", url);
  };

  useEffect(() => {
    const syncReaderOrigin = (guide, state = window.history.state) => {
      const blogState = readBlogHistoryState(state);
      const openedFromIndex = Boolean(guide && blogState?.view === "reader" && blogState.guideId === guide.id && blogState.origin === "index" && blogState.indexEntryId);
      readerOrigin.current = guide ? (openedFromIndex ? "index" : "direct") : null;
      activeIndexEntry.current = openedFromIndex ? blogState.indexEntryId : (!guide && blogState?.view === "index" ? blogState.entryId : null);
    };

    const initialGuide = guideFromUrl();
    const initialState = readBlogHistoryState();
    if (initialGuide) {
      const openedFromIndex = initialState?.view === "reader" && initialState.guideId === initialGuide.id && initialState.origin === "index" && initialState.indexEntryId;
      replaceBlogHistoryState({ view: "reader", guideId: initialGuide.id, origin: openedFromIndex ? "index" : "direct", indexEntryId: openedFromIndex ? initialState.indexEntryId : null });
    } else {
      replaceBlogHistoryState({ view: "index", entryId: initialState?.view === "index" && initialState.entryId ? initialState.entryId : createBlogEntryId() });
    }
    syncReaderOrigin(initialGuide);

    const onPopState = (event) => {
      const guide = guideFromUrl();
      syncReaderOrigin(guide, event.state);
      setSelected(guide);
      window.requestAnimationFrame(() => !guide && lastTrigger.current?.focus?.());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openGuide = (guide) => {
    lastTrigger.current = document.activeElement;
    const currentState = readBlogHistoryState();
    const indexEntryId = currentState?.view === "index" && currentState.entryId ? currentState.entryId : (activeIndexEntry.current || createBlogEntryId());
    if (currentState?.view !== "index" || currentState.entryId !== indexEntryId) replaceBlogHistoryState({ view: "index", entryId: indexEntryId });
    activeIndexEntry.current = indexEntryId;
    readerOrigin.current = "index";
    setGuideUrl(guide, { origin: "index", indexEntryId });
    setSelected(guide);
  };

  const closeReader = () => {
    const currentState = readBlogHistoryState();
    const canReturnToIndex = readerOrigin.current === "index" && currentState?.view === "reader" && currentState.origin === "index" && currentState.indexEntryId === activeIndexEntry.current;
    if (canReturnToIndex) {
      window.history.back();
      return;
    }
    const indexEntryId = createBlogEntryId();
    setGuideUrl(null, { replace: true, indexEntryId });
    activeIndexEntry.current = indexEntryId;
    readerOrigin.current = null;
    setSelected(null);
    window.requestAnimationFrame(() => lastTrigger.current?.focus?.());
  };

  const nextGuide = () => {
    const currentIndex = GUIDES.findIndex((guide) => guide.id === selected.id);
    const next = GUIDES[(currentIndex + 1) % GUIDES.length];
    const currentState = readBlogHistoryState();
    const openedFromIndex = readerOrigin.current === "index" && currentState?.view === "reader" && currentState.origin === "index" && currentState.indexEntryId === activeIndexEntry.current;
    setGuideUrl(next, { replace: true, origin: openedFromIndex ? "index" : "direct", indexEntryId: openedFromIndex ? currentState.indexEntryId : null });
    readerOrigin.current = openedFromIndex ? "index" : "direct";
    setSelected(next);
  };
  return <div className="journal-page"><a className="journal-skip" href="#indice">Saltar al índice</a><window.MedlaSiteHeader current="insights" /><main><Hero onOpenCover={() => openGuide(GUIDES[0])} /><FilterBar query={query} setQuery={setQuery} category={category} setCategory={setCategory} resultCount={filtered.length} /><GuideIndex guides={filtered} onOpen={openGuide} /><EditorialStatement /></main><window.MedlaSiteFooter /><GuideReader guide={selected} onClose={closeReader} onNext={nextGuide} /></div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<BlogApp />);
