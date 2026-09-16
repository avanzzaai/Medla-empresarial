const { useEffect, useRef, useState } = React;

const PROJECT_RHYTHM = [
  { id: "fit", code: "01", label: "Encaje", title: "La decisión se delimita antes de movilizar al equipo", text: "Aclaramos el resultado, la urgencia, las áreas implicadas y el acceso necesario para decidir si el proyecto debe abrirse.", output: "Decisión de encaje", facts: [["Situación", "Alta digital de proveedores"], ["Áreas", "Compras · Legal · Sistemas"], ["Próximo cierre", "Acordar el mandato"]] },
  { id: "mandate", code: "02", label: "Mandato", title: "Una versión común del proyecto", text: "Objetivo, alcance, autoridad y criterios de aceptación quedan visibles para todas las áreas antes de construir.", output: "Mandato aprobado", facts: [["Resultado", "Alta operativa en producción"], ["Alcance", "Proceso · Datos · Integración"], ["Responsable", "Dirección del proyecto"]] },
  { id: "implementation", code: "03", label: "Implantación", title: "Cada tramo se valida con evidencia", text: "Los criterios de aceptación, las incidencias y los riesgos se revisan antes de abrir el siguiente tramo.", output: "Solución validada", facts: [["Progreso", "6 de 8 criterios validados"], ["En tratamiento", "2 incidencias"], ["Revisión", "Comité semanal"]] },
  { id: "transfer", code: "04", label: "Transferencia", title: "El control queda dentro del equipo", text: "Responsables, documentación y criterios de cambio acompañan a la solución cuando termina la implantación.", output: "Control transferido", facts: [["Responsable", "Operaciones + Sistemas"], ["Documentación", "Manual y criterios de cambio"], ["Revisión", "Fecha acordada con el cliente"]] },
];

const ROLES = [
  { number: "01", role: "Dirección MEDLA", responsibility: "Mantiene el alcance, ordena dependencias y eleva las decisiones que corresponden al cliente.", authority: "Coordina el mandato" },
  { number: "02", role: "Responsable del cliente", responsibility: "Valida hechos, asigna acceso y toma las decisiones reservadas a la empresa.", authority: "Aprueba decisiones del cliente" },
  { number: "03", role: "Especialista de frente", responsibility: "Aporta criterio jurídico, operativo o técnico sobre la misma versión del proyecto.", authority: "Resuelve su disciplina" },
];

const PHASES = [
  { code: "01", name: "Encaje", verb: "Delimitar", description: "Revisamos decisión, urgencia, áreas implicadas y acceso a responsables, datos y documentos.", closure: "Decisión de encaje" },
  { code: "02", name: "Mandato", verb: "Acordar", description: "La propuesta fija resultado, alcance, autoridad, equipo, calendario, precio y criterios de aceptación.", closure: "Mandato aprobado" },
  { code: "03", name: "Implantación", verb: "Construir", description: "Coordinamos las capacidades necesarias, probamos por tramos y registramos decisiones y cambios.", closure: "Solución validada" },
  { code: "04", name: "Transferencia", verb: "Traspasar", description: "Asignamos propiedad interna, entregamos documentación y acordamos mantenimiento y revisión.", closure: "Control en el equipo" },
];

function Arrow({ diagonal = false }) { return <span className="how-arrow" aria-hidden="true">{diagonal ? "↗" : "→"}</span>; }

function useReveal() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll("[data-how-reveal]")];
    if (!("IntersectionObserver" in window)) { nodes.forEach((node) => node.classList.add("is-visible")); return undefined; }
    document.documentElement.classList.add("how-reveal-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible"); observer.unobserve(entry.target);
    }), { threshold:.12, rootMargin:"0px 0px -6%" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

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

function GovernanceBoard() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const [running, setRunning] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visible, setVisible] = useState(false);
  const item = PROJECT_RHYTHM[active];
  const last = PROJECT_RHYTHM.length - 1;
  const refs = useRef([]);
  const boardRef = useRef(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const updateVisibility = () => {
      const rect = board.getBoundingClientRect();
      setVisible(!document.hidden && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), { threshold: .18 });
    observer.observe(board);
    document.addEventListener("visibilitychange", updateVisibility);
    updateVisibility();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRunning(false);
      return undefined;
    }
    if (!running || !visible) return undefined;
    const timer = window.setTimeout(() => {
      const next = active + 1;
      if (next >= PROJECT_RHYTHM.length) {
        setRunning(false);
        return;
      }
      setActive(next);
      if (next === PROJECT_RHYTHM.length - 1) setRunning(false);
    }, 1900);
    return () => window.clearTimeout(timer);
  }, [active, running, visible, reducedMotion]);

  const select = (index) => {
    setActive(index);
    setRunning(false);
  };

  const toggleSequence = () => {
    if (reducedMotion) {
      setActive((value) => value >= last ? 0 : value + 1);
      setRunning(false);
      return;
    }
    if (running) {
      setRunning(false);
      return;
    }
    if (active === last) setActive(0);
    setRunning(true);
  };

  const move = (event,index) => {
    if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? PROJECT_RHYTHM.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + PROJECT_RHYTHM.length) % PROJECT_RHYTHM.length;
    select(next); refs.current[next]?.focus();
  };
  const finished = active === last && !running;
  const buttonLabel = reducedMotion
    ? finished ? "Volver al inicio" : "Siguiente fase"
    : running ? "Pausar" : finished ? "Repetir" : "Continuar";
  const status = running ? "SECUENCIA EN CURSO" : finished ? "RECORRIDO COMPLETO" : "SECUENCIA EN PAUSA";

  return <div ref={boardRef} className="how-board" aria-label="Secuencia interactiva del gobierno de un proyecto">
    <header className="how-board__topbar">
      <div><i />PROYECTO / SEMANA 03</div>
      <button type="button" onClick={toggleSequence} aria-label={`${buttonLabel} la secuencia del proyecto`}><i className={running ? "is-running" : ""} />{buttonLabel}</button>
    </header>
    <div className="how-board__summary"><span>PROYECTO DEMOSTRATIVO</span><h2>Implantar el alta digital de proveedores.</h2><div aria-live="polite"><b>{status}</b><small>Un recorrido · cuatro cierres</small></div></div>
    <div className="how-board__journey">
      <div className="how-board__route" aria-hidden="true" style={{ "--progress": active / (PROJECT_RHYTHM.length - 1) }}><i /></div>
      <div className="how-board__tabs" role="tablist" aria-label="Recorrido del proyecto">
        {PROJECT_RHYTHM.map((entry,index) => <button className={`${active === index ? "is-active" : ""}${active > index ? " is-complete" : ""}`} key={entry.id} ref={(node) => { refs.current[index] = node; }} type="button" role="tab" id={`rhythm-tab-${entry.id}`} aria-controls="rhythm-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => move(event,index)}><span>{entry.code}</span><i aria-hidden="true" /><b>{entry.label}</b><small>{entry.output}</small></button>)}
      </div>
    </div>
    <article id="rhythm-panel" role="tabpanel" aria-labelledby={`rhythm-tab-${item.id}`} key={item.id}>
      <div className="how-board__copy"><span>{item.code} / {item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div>
      <div className="how-board__output"><span>SALIDA ACTIVA</span><strong><i />{item.output}</strong><dl>{item.facts.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
    </article>
    <footer><span>Mandato común</span><i /> <span>Decisiones registradas</span><i /> <strong>Control transferido</strong></footer>
  </div>;
}

function Hero() {
  return <header className="how-hero">
    <div className="how-shell how-hero__layout">
      <div className="how-hero__copy">
        <div className="how-overline"><span>Cómo trabajamos</span><small>Gobierno · ejecución · transferencia</small></div>
        <h1>Así se dirige un proyecto MEDLA: <em>con alcance, responsables y decisiones visibles.</em></h1>
        <p>Un mandato común, una persona responsable de coordinarlo y un sistema de trabajo que permite a dirección saber qué está decidido, qué falta y quién debe actuar.</p>
        <div className="how-actions"><a className="how-button how-button--gold" href="contacto.html?context=proyecto">Plantear un proyecto <Arrow /></a><a className="how-text-link" href="#gobierno">Ver el gobierno del encargo <Arrow /></a></div>
      </div>
      <GovernanceBoard />
    </div>
  </header>;
}

function MandateAnatomy() {
  const fields = [
    ["01", "Resultado", "Qué debe quedar decidido, implantado o transferido."],
    ["02", "Alcance", "Qué entra, qué queda fuera y cómo se gestionan los cambios."],
    ["03", "Autoridad", "Quién puede aprobar, priorizar y resolver una excepción."],
    ["04", "Equipo", "Qué capacidad activa MEDLA y qué responsabilidad conserva el cliente."],
    ["05", "Evidencia", "Qué entregable o prueba permite aceptar cada tramo."],
    ["06", "Continuidad", "Quién opera, mantiene y mejora la solución después del cierre."],
  ];
  return <section className="how-anatomy" id="gobierno" aria-labelledby="anatomy-title">
    <div className="how-shell">
      <div className="how-section-head" data-how-reveal><span>01 / ANTES DE EMPEZAR</span><h2 id="anatomy-title">El mandato convierte una necesidad abierta <em>en un encargo gobernable.</em></h2><p>Estas seis definiciones aparecen en la propuesta y se confirman antes de iniciar la implantación.</p></div>
      <div className="how-anatomy__list">{fields.map(([number,title,text]) => <article key={number} data-how-reveal><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <aside data-how-reveal><span>DEFINICIÓN</span><p><strong>Mandato de dirección:</strong> objetivo, alcance, autoridad, responsables y criterio de cierre acordados con el cliente.</p></aside>
    </div>
  </section>;
}

function Roles() {
  return <section className="how-roles" aria-labelledby="roles-title">
    <div className="how-shell">
      <div className="how-section-head how-section-head--dark" data-how-reveal><span>02 / QUIÉN RESPONDE</span><h2 id="roles-title">Tres funciones distintas. <em>Ninguna responsabilidad difusa.</em></h2><p>La propuesta identifica la dirección del proyecto, las funciones asignadas, su dedicación y su autoridad.</p></div>
      <div className="how-role-list">{ROLES.map((role) => <article key={role.number} data-how-reveal><span>{role.number}</span><div><small>FUNCIÓN</small><h3>{role.role}</h3></div><p>{role.responsibility}</p><strong><i />{role.authority}</strong></article>)}</div>
      <div className="how-roles__note" data-how-reveal><span>Regla de gobierno</span><p>La dirección MEDLA coordina el trabajo. Las decisiones reservadas al negocio siguen perteneciendo al cliente y quedan identificadas desde el inicio.</p></div>
    </div>
  </section>;
}

function Protocol() {
  return <section className="how-protocol" aria-labelledby="protocol-title">
    <div className="how-shell how-protocol__layout">
      <div className="how-protocol__intro" data-how-reveal><span>03 / RECORRIDO</span><h2 id="protocol-title">Cada fase cierra una decisión <em>antes de abrir la siguiente.</em></h2><p>El calendario cambia según el alcance. La secuencia de gobierno se mantiene para que la complejidad no quede oculta tras tareas sueltas.</p></div>
      <ol>{PHASES.map((phase,index) => <li key={phase.code} data-how-reveal><span>{phase.code}</span><div><small>{phase.name}</small><h3>{phase.verb}</h3><p>{phase.description}</p></div><strong><i />{phase.closure}</strong>{index < PHASES.length-1 && <b aria-hidden="true" />}</li>)}</ol>
    </div>
  </section>;
}

function WorkingCadence() {
  const cadence = [
    ["Arranque", "Objetivo, alcance, derechos de decisión y primer tramo confirmados."],
    ["Seguimiento", "Estado, bloqueos, riesgos, cambios y siguiente cierre en una lectura común."],
    ["Puertas de decisión", "La dirección aprueba únicamente cuando existe evidencia suficiente."],
    ["Cierre", "Aceptación, propiedad interna, documentación y revisión posterior acordadas."],
  ];
  return <section className="how-cadence" aria-labelledby="cadence-title">
    <div className="how-shell how-cadence__layout">
      <div data-how-reveal><span>04 / RITMO DE TRABAJO</span><h2 id="cadence-title">Una cadencia orientada <em>a cierres verificables.</em></h2><p>La frecuencia se ajusta al proyecto y a la disponibilidad de quienes deben decidir.</p></div>
      <div className="how-cadence__track" data-how-reveal>{cadence.map(([title,text],index) => <article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p>{index<cadence.length-1 && <i />}</article>)}</div>
    </div>
  </section>;
}

function Transfer() {
  const items = [
    ["Decisiones", "Qué se aprobó, por qué y qué condiciones siguen vigentes."],
    ["Sistema", "Configuración, fuentes, permisos, límites y criterios de recuperación."],
    ["Operación", "Responsables internos, manual, mantenimiento y cambios pendientes."],
    ["Revisión", "Fecha, métricas y preguntas para comprobar que la solución sigue funcionando."],
  ];
  return <section className="how-transfer" aria-labelledby="transfer-title">
    <div className="how-shell">
      <div className="how-section-head" data-how-reveal><span>05 / TRANSFERENCIA</span><h2 id="transfer-title">El control queda <em>dentro de la empresa.</em></h2><p>La transferencia forma parte del alcance; no es una explicación improvisada al final.</p></div>
      <div className="how-transfer__record" data-how-reveal><header><span>EXPEDIENTE DE CIERRE</span><b>CONTROL TRANSFERIDO</b></header>{items.map(([title,text],index) => <article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p><i aria-hidden="true">✓</i></article>)}<footer><span>Responsable interno asignado</span><span>Documentación aceptada</span><span>Próxima revisión acordada</span></footer></div>
    </div>
  </section>;
}

function Identity() {
  return <aside className="how-identity"><div className="how-shell how-identity__layout" data-how-reveal><div><span>RESPONSABILIDAD EMPRESARIAL</span><h2>La entidad que recibe el encargo está identificada.</h2><p>La propuesta identifica además la dirección del proyecto y los perfiles previstos para cada frente.</p></div><dl><div><dt>Razón social</dt><dd>MEDLA ASESORES, S.L.</dd></div><div><dt>Sede</dt><dd>Móstoles · Madrid · España</dd></div><div><dt>Registro</dt><dd>Tomo 46169 · Folio 20 · Hoja M-811076</dd></div><div><dt>Contacto</dt><dd><a href="mailto:info@medla-empresas.com">info@medla-empresas.com</a></dd></div></dl><a href="contacto.html?context=proyecto">Plantear un proyecto <Arrow /></a></div></aside>;
}

function NosotrosApp() {
  useReveal();
  return <div className="how-page"><window.MedlaSiteHeader current="about" /><main id="main-content"><Hero /><MandateAnatomy /><Roles /><Protocol /><WorkingCadence /><Transfer /><Identity /></main><window.MedlaSiteFooter current="about" /></div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<NosotrosApp />);
