const { useEffect, useRef, useState } = React;

const CAPABILITY_FAMILIES = [
  {
    id: "decision", number: "01", label: "Decisión y estructura",
    title: "Decisiones corporativas con criterio jurídico y financiero trazable.",
    description: "Reunimos hechos, riesgos, hipótesis y documentos para que dirección, socios o comité puedan comparar, aprobar y ejecutar.",
    situations: ["Contratos o acuerdos con impacto operativo", "Cambios societarios y reglas de gobierno", "Escenarios de inversión o financiación"],
    outputs: ["Documento de decisión", "Documentación coordinada", "Condiciones y próximos pasos"],
    links: [["Legal y contratos", "asesoria-legal.html"], ["Estructura societaria", "constitucion.html"], ["Preparación de financiación", "inversiones.html"]],
    lab: { scene: "legal", project: "Un acuerdo con impacto operativo necesita una decisión común.", capabilities: ["Criterio jurídico", "Escenarios comparables", "Gobierno de decisión"], result: "Mandato documentado y listo para ejecutar." },
  },
  {
    id: "operations", number: "02", label: "Operaciones y sistemas",
    title: "Procesos visibles, conectados y mantenibles por el equipo.",
    description: "Definimos el recorrido real antes de tocar herramientas. Después conectamos datos, reglas, aprobaciones y excepciones con responsables claros.",
    situations: ["Información repartida entre hojas y correos", "Aprobaciones sin estado ni plazo", "Datos copiados entre herramientas"],
    outputs: ["Mapa de operación", "Flujo implantado", "Registro y guía de recuperación"],
    links: [["Digitalización de operaciones", "digitalizacion.html"], ["Automatización", "automatizacion.html"], ["Captura de datos y formularios", "jotform.html"]],
    lab: { scene: "automatizacion", project: "Un alta de proveedor se reparte entre correo, hojas y ERP.", capabilities: ["Diseño del flujo", "Integraciones", "Control de excepciones"], result: "Proceso implantado con estados y responsables visibles." },
  },
  {
    id: "ai", number: "03", label: "IA aplicada",
    title: "Agentes integrados en procesos, con fuentes, permisos y evaluación.",
    description: "La tarea, los datos y el control se definen antes de elegir el modelo. Implantamos casos acotados con revisión humana y registro de actividad.",
    situations: ["Conocimiento difícil de recuperar", "Tareas intensivas en lectura o clasificación", "Pilotos sin permisos, evaluación o propietario"],
    outputs: ["Arquitectura del agente", "Caso evaluado en contexto", "Protocolo de operación"],
    links: [["Agentes de IA", "agentes.html"], ["Sistemas de soporte", "digitalizacion.html"], ["Automatización conectada", "automatizacion.html"]],
    lab: { scene: "ia", project: "Una tarea intensiva en información no tiene fuentes ni permisos definidos.", capabilities: ["Fuentes autorizadas", "Agente acotado", "Evaluación humana"], result: "Caso en operación con registro, límites y escalado." },
  },
  {
    id: "growth", number: "04", label: "Crecimiento y CRM",
    title: "Una sola lectura desde el primer interés hasta la siguiente acción comercial.",
    description: "Conectamos posicionamiento, entrada, cualificación y seguimiento para que cada oportunidad conserve contexto, prioridad y responsable.",
    situations: ["Mensajes que no atraen al cliente adecuado", "Entradas sin información suficiente", "Oportunidades sin próxima acción"],
    outputs: ["Arquitectura de mensaje", "Recorrido de captación", "CRM y seguimiento operativo"],
    links: [["Posicionamiento, captación y CRM", "redes-sociales.html"], ["Formularios y entradas", "jotform.html"], ["Automatización comercial", "automatizacion.html"]],
    lab: { scene: "social", project: "El interés comercial llega disperso y sin una siguiente acción.", capabilities: ["Posicionamiento", "Captura de contexto", "CRM y seguimiento"], result: "Cada oportunidad llega con prioridad y responsable." },
  },
];

const STARTING_POINTS = [
  { id: "blocked", label: "La decisión está bloqueada entre varias áreas", title: "Primero fijamos qué debe decidirse y con qué información.", text: "Separamos hechos, supuestos, riesgos y derechos de decisión. El resultado es un mandato que permite movilizar a cada especialista sobre el mismo alcance.", families: ["decision", "operations"], outputs: ["Pregunta ejecutiva", "Opciones comparables", "Mandato inicial"], context: "proyecto" },
  { id: "manual", label: "La operación depende de correos, hojas y seguimiento manual", title: "Primero documentamos el recorrido completo.", text: "Mapeamos entradas, decisiones, esperas, excepciones y sistemas. Solo después definimos qué automatizar y qué debe seguir en manos de una persona.", families: ["operations", "ai"], outputs: ["Mapa actual", "Flujo objetivo", "Prioridad de implantación"], context: "digitalizacion" },
  { id: "technology", label: "Una inversión tecnológica no llega al uso diario", title: "Primero definimos el caso, los datos y el criterio de aceptación.", text: "Acotamos la tarea, el propietario, las fuentes y los permisos. La tecnología se valida dentro del proceso que debe mejorar, no en una demostración aislada.", families: ["ai", "operations"], outputs: ["Caso priorizado", "Prueba en contexto", "Plan de implantación"], context: "ia" },
  { id: "commercial", label: "La captación no termina en un seguimiento claro", title: "Primero conectamos promesa, contexto y siguiente acción.", text: "Revisamos el mensaje, la entrada y el traspaso al CRM para que cada oportunidad llegue al responsable adecuado con información suficiente.", families: ["growth", "operations"], outputs: ["Criterio de encaje", "Recorrido comercial", "Responsable y próxima acción"], context: "crecimiento" },
];

function Arrow({ diagonal = false }) { return <span className="svc-arrow" aria-hidden="true">{diagonal ? "↗" : "→"}</span>; }

function useReveal() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll("[data-svc-reveal]")];
    if (!("IntersectionObserver" in window)) { nodes.forEach((node) => node.classList.add("is-visible")); return undefined; }
    document.documentElement.classList.add("svc-reveal-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: .12, rootMargin: "0px 0px -6%" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false);
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function CapabilityFallback() {
  return <svg className="svc-lab__fallback" viewBox="0 0 600 220" aria-hidden="true">
    <path d="M48 110H205M395 110H552" pathLength="1" />
    <circle cx="48" cy="110" r="12" /><circle cx="552" cy="110" r="12" />
    <g transform="translate(300 110)"><circle r="76" /><circle r="48" /><text y="5" textAnchor="middle">MEDLA</text></g>
  </svg>;
}

function CapabilityMap() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 2 : 0);
  const [running, setRunning] = useState(() => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [visible, setVisible] = useState(false);
  const family = CAPABILITY_FAMILIES[active];
  const refs = useRef([]);
  const labRef = useRef(null);
  const Scene = window.MedlaServiceScenes?.[family.lab.scene] || window.Scenes?.[family.lab.scene] || CapabilityFallback;
  const stages = ["Proyecto", "Capacidades", "Resultado"];

  useEffect(() => {
    if (!reducedMotion) return;
    setStage(2);
    setRunning(false);
  }, [reducedMotion]);

  useEffect(() => {
    const lab = labRef.current;
    if (!lab) return undefined;
    const syncVisibility = () => {
      const rect = lab.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      setVisible(!document.hidden && visibleHeight >= Math.min(rect.height, window.innerHeight) * .25);
    };
    if (!("IntersectionObserver" in window)) {
      syncVisibility();
      document.addEventListener("visibilitychange", syncVisibility);
      return () => document.removeEventListener("visibilitychange", syncVisibility);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), { threshold: .25 });
    observer.observe(lab);
    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!running || reducedMotion || !visible) return undefined;
    const timer = window.setTimeout(() => {
      if (stage >= stages.length - 2) {
        setStage(stages.length - 1);
        setRunning(false);
      } else setStage((value) => value + 1);
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [active, stage, running, reducedMotion, visible]);

  const chooseFamily = (index) => {
    setActive(index);
    setStage(reducedMotion ? 2 : 0);
    setRunning(!reducedMotion);
  };
  const chooseStage = (index) => {
    setStage(index);
    setRunning(false);
  };
  const toggleSequence = () => {
    if (reducedMotion) return;
    if (running) setRunning(false);
    else if (stage >= stages.length - 1) { setStage(0); setRunning(true); }
    else setRunning(true);
  };

  return <div ref={labRef} className={`svc-lab${running ? " is-running" : ""}`} aria-label="Laboratorio interactivo de capacidades MEDLA">
    <header className="svc-lab__head">
      <div><span>M/ LABORATORIO DE PROYECTO</span><strong>{family.label}</strong></div>
      <button type="button" onClick={toggleSequence} disabled={reducedMotion} aria-label={running ? "Pausar secuencia" : stage >= stages.length - 1 ? "Repetir secuencia" : "Continuar secuencia"}><i className={running ? "is-live" : ""} />{reducedMotion ? "MOVIMIENTO REDUCIDO" : running ? "PAUSAR" : stage >= stages.length - 1 ? "REPETIR" : "CONTINUAR"}</button>
    </header>
    <div className="svc-lab__routes" role="tablist" aria-label="Familias de capacidades">
      {CAPABILITY_FAMILIES.map((item,index) => <button key={item.id} ref={(node) => { refs.current[index] = node; }} type="button" role="tab" id={`map-tab-${item.id}`} aria-controls="map-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => chooseFamily(index)} onKeyDown={(event) => {
        if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? CAPABILITY_FAMILIES.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + CAPABILITY_FAMILIES.length) % CAPABILITY_FAMILIES.length;
        chooseFamily(next); refs.current[next]?.focus();
      }}><span>{item.number}</span><b>{item.label}</b><i /></button>)}
    </div>
    <article id="map-panel" className="svc-lab__panel" role="tabpanel" aria-labelledby={`map-tab-${family.id}`} key={family.id}>
      <div className={`svc-lab__node svc-lab__node--project ${stage === 0 ? "is-active" : "is-complete"}`}>
        <span>01 / PROYECTO</span><strong>{family.lab.project}</strong><small>Situación de partida</small>
      </div>
      <div className={`svc-lab__connector ${stage >= 1 ? "is-complete" : ""}`} aria-hidden="true"><span>activar</span><i /></div>
      <div className={`svc-lab__node svc-lab__node--capabilities ${stage === 1 ? "is-active" : stage > 1 ? "is-complete" : "is-pending"}`}>
        <span>02 / CAPACIDADES</span>
        <div className="svc-lab__scene" aria-hidden="true"><Scene key={`${family.id}-${stage}`} t={(stage + 1) * 1.35} /></div>
        <strong>{family.title}</strong>
        <ul>{family.lab.capabilities.map((item) => <li key={item}><i />{item}</li>)}</ul>
      </div>
      <div className={`svc-lab__connector ${stage >= 2 ? "is-complete" : ""}`} aria-hidden="true"><span>validar</span><i /></div>
      <div className={`svc-lab__node svc-lab__node--result ${stage === 2 ? "is-active" : "is-pending"}`}>
        <span>03 / RESULTADO</span><strong>{family.lab.result}</strong><ul>{family.outputs.map((output) => <li key={output}><i />{output}</li>)}</ul>
      </div>
    </article>
    <footer className="svc-lab__timeline">
      <span className="svc-lab__status" aria-live="polite">FASE {String(stage + 1).padStart(2,"0")} / 03 · {stages[stage]}</span>
      <div role="group" aria-label="Explorar las fases del laboratorio">{stages.map((label,index) => <button key={label} type="button" className={`${index === stage ? "is-active" : ""}${index < stage ? " is-complete" : ""}`} aria-pressed={index === stage} onClick={() => chooseStage(index)}><span>0{index+1}</span>{label}<i /></button>)}</div>
    </footer>
  </div>;
}

function Hero() {
  return <header className="svc-hero">
    <div className="svc-shell svc-hero__layout">
      <div className="svc-hero__copy">
        <div className="svc-overline"><span>Capacidades activadas según el mandato</span><small>04 rutas</small></div>
        <h1>Empieza por el proyecto. <em>No por una lista de servicios.</em></h1>
        <p>Combinamos criterio jurídico, diseño operativo y desarrollo tecnológico bajo un responsable de proyecto, desde la decisión hasta la transferencia.</p>
        <div className="svc-actions"><a className="svc-button svc-button--gold" href="#orientador">Orientar el proyecto <Arrow /></a><a className="svc-text-link" href="contacto.html?context=proyecto">Plantear un proyecto <Arrow /></a></div>
      </div>
      <CapabilityMap />
    </div>
  </header>;
}

function ProjectRouter() {
  const [active, setActive] = useState(0);
  const point = STARTING_POINTS[active];
  const related = point.families.map((id) => CAPABILITY_FAMILIES.find((family) => family.id === id));
  const refs = useRef([]);
  const move = (event,index) => {
    if (!["ArrowUp","ArrowDown","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? STARTING_POINTS.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + STARTING_POINTS.length) % STARTING_POINTS.length;
    setActive(next); refs.current[next]?.focus();
  };
  return <section className="svc-router" id="orientador" aria-labelledby="router-title">
    <div className="svc-shell">
      <div className="svc-section-head" data-svc-reveal><span>01 / PUNTO DE PARTIDA</span><h2 id="router-title">Describe la situación. <em>A partir de ella, identificamos las capacidades necesarias.</em></h2><p>Selecciona la situación más próxima para ver qué debe quedar definido antes de iniciar.</p></div>
      <div className="svc-router__workspace" data-svc-reveal>
        <div className="svc-router__questions" role="tablist" aria-label="Situaciones empresariales">
          {STARTING_POINTS.map((item,index) => <button key={item.id} ref={(node) => { refs.current[index] = node; }} type="button" role="tab" id={`start-tab-${item.id}`} aria-controls="start-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => move(event,index)}><span>0{index+1}</span><b>{item.label}</b><Arrow /></button>)}
        </div>
        <article id="start-panel" className="svc-router__answer" role="tabpanel" aria-labelledby={`start-tab-${point.id}`} key={point.id}>
          <header><span>LECTURA INICIAL / 0{active+1}</span><b>PROYECTO TRANSVERSAL</b></header>
          <h3>{point.title}</h3><p>{point.text}</p>
          <div className="svc-router__answer-lower">
            <section><span>CAPACIDADES PROBABLES</span>{related.map((family) => <a key={family.id} href={`#${family.id}`}><i>{family.number}</i>{family.label}<Arrow diagonal /></a>)}</section>
            <section><span>DEBERÍA QUEDAR DEFINIDO</span>{point.outputs.map((output,index) => <b key={output}><i>{index+1}</i>{output}</b>)}</section>
          </div>
          <a className="svc-button svc-button--light" href={`contacto.html?context=${point.context}`}>Plantear este proyecto <Arrow /></a>
        </article>
      </div>
    </div>
  </section>;
}

function Families() {
  const [open, setOpen] = useState(0);
  return <section className="svc-families" aria-labelledby="families-title">
    <div className="svc-shell">
      <div className="svc-section-head" data-svc-reveal><span>02 / CAPACIDADES</span><h2 id="families-title">Cuatro grupos de capacidades. <em>Una misma dirección de proyecto.</em></h2><p>Las capacidades se activan según el mandato y comparten calendario, responsables y registro de decisiones.</p></div>
      <div className="svc-family-list">
        {CAPABILITY_FAMILIES.map((family,index) => <article id={family.id} className={open === index ? "is-open" : ""} key={family.id} data-svc-reveal>
          <button type="button" aria-expanded={open === index} aria-controls={`family-panel-${family.id}`} onClick={() => setOpen(open === index ? -1 : index)}>
            <span>{family.number}</span><small>{family.label}</small><h3>{family.title}</h3><i aria-hidden="true">{open === index ? "−" : "+"}</i>
          </button>
          <div id={`family-panel-${family.id}`} className="svc-family-list__panel" hidden={open !== index}>
            <div><p>{family.description}</p><span>SEÑALES</span><ul>{family.situations.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><span>RESULTADOS HABITUALES</span><ol>{family.outputs.map((item,outputIndex) => <li key={item}><span>0{outputIndex+1}</span>{item}</li>)}</ol></div>
            <nav aria-label={`Especialidades de ${family.label}`}>{family.links.map(([label,href]) => <a key={href} href={href}>{label}<Arrow diagonal /></a>)}</nav>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

function MandatePrinciple() {
  return <section className="svc-principle" aria-labelledby="principle-title">
    <div className="svc-shell svc-principle__layout">
      <div data-svc-reveal><span>03 / FORMA DE CONTRATAR</span><h2 id="principle-title">Cada frente conserva <em>alcance y criterio de aceptación propios.</em></h2></div>
      <div data-svc-reveal><p>Si un frente puede ejecutarse de forma independiente, la propuesta identifica alcance, responsable, calendario y criterio de aceptación.</p><strong>No trabajamos como bolsa de horas.</strong><a href="nosotros.html">Ver cómo gobernamos cada encargo <Arrow /></a></div>
    </div>
  </section>;
}

function ServicesApp() {
  useReveal();
  return <div className="svc-page"><window.MedlaSiteHeader current="services" /><main><Hero /><ProjectRouter /><Families /><MandatePrinciple /></main><window.MedlaSiteFooter current="services" /></div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<ServicesApp />);
