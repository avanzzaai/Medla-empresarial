// MEDLA — dirección e implantación de proyectos transversales
const { useEffect, useRef, useState } = React;

const PROJECT_SITUATIONS = [
  {
    number: "01",
    type: "Decisión transversal",
    title: "Una decisión con impacto en inversión, riesgo u operación exige criterio de varias áreas.",
    text: "Reunimos hechos, contratos, escenarios y responsables para que dirección pueda comparar opciones y aprobar un alcance ejecutable.",
    outputs: ["Documento de decisión", "Alcance aprobado", "Responsables y condiciones"],
    href: "servicios.html#decision",
  },
  {
    number: "02",
    type: "Operaciones y sistemas",
    title: "El crecimiento ha dejado procesos, datos y responsabilidades fuera de control.",
    text: "Rediseñamos el recorrido, conectamos los sistemas necesarios y dejamos estados, excepciones y control visibles para el equipo.",
    outputs: ["Modelo operativo", "Sistema implantado", "Control y documentación"],
    href: "digitalizacion.html",
  },
  {
    number: "03",
    type: "Tecnología e IA",
    title: "La inversión tecnológica todavía no ha llegado al uso operativo.",
    text: "Acotamos el caso, resolvemos datos, permisos e integración y lo implantamos con revisión humana y criterios de aceptación.",
    outputs: ["Caso priorizado", "Solución en operación", "Protocolo de calidad"],
    href: "agentes.html",
  },
];

const MANDATE_STAGES = [
  { code: "01", label: "Encaje", title: "Aclarar la decisión", detail: "Objetivo, consecuencia, áreas implicadas y acceso a la información.", output: "Decisión de encaje" },
  { code: "02", label: "Mandato", title: "Acordar alcance y gobierno", detail: "Autoridad, responsables, calendario, límites y criterio de cierre.", output: "Mandato aprobado" },
  { code: "03", label: "Implantación", title: "Construir y probar", detail: "Especialistas coordinados, entregas por tramos y decisiones registradas.", output: "Solución validada" },
  { code: "04", label: "Transferencia", title: "Entregar el control", detail: "Responsables internos, documentación, mantenimiento y siguiente revisión.", output: "Control transferido" },
];

const DOSSIER_CHAPTERS = [
  {
    id: "decision", number: "01", label: "Decisión",
    title: "Aprobar el alta cuando llegue el certificado fiscal vigente.",
    text: "La condición, el responsable y el plazo quedan registrados. El equipo no necesita reconstruir la decisión desde el correo.",
    facts: [["Responsable", "Dirección de Operaciones"], ["Plazo", "Viernes · 12:00"], ["Siguiente acción", "Validar y registrar el alta"]],
  },
  {
    id: "system", number: "02", label: "Sistema",
    title: "Un recorrido único desde la recepción documental hasta el ERP.",
    text: "Cada dato tiene una fuente, una validación y un destino. Las excepciones salen hacia una persona con todo el contexto necesario.",
    facts: [["Alcance", "Captura, validación y sincronización"], ["Versión", "Entrega 1.4"], ["Repositorio", "Proveedores / Alta"]],
  },
  {
    id: "control", number: "03", label: "Control",
    title: "Cada incidencia tiene estado, alerta e historial.",
    text: "El equipo puede ver qué se ha detenido, desde cuándo y quién debe intervenir sin depender del proveedor.",
    facts: [["Estados", "Recibido · Revisión · Aprobado"], ["Alertas", "Vencimiento · Plazo superado"], ["Historial", "Hitos y cambios registrados"]],
  },
  {
    id: "handover", number: "04", label: "Transferencia",
    title: "El equipo recibe el criterio para operar y cambiar la solución.",
    text: "La entrega incluye responsables, documentación y una revisión acordada para que el conocimiento no quede fuera de la empresa.",
    facts: [["Operación", "Operaciones + Sistemas"], ["Documentación", "Manual y criterios de cambio"], ["Revisión", "Fecha acordada con el cliente"]],
  },
];

function Arrow({ diagonal = false }) {
  return <svg className="ex-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d={diagonal ? "M5 15 15 5M7 5h8v8" : "M3 10h13M11 5l5 5-5 5"} /></svg>;
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

function RevealController() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll("[data-reveal]")];
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }
    document.documentElement.classList.add("ex-reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return null;
}

function MandateConsole() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const [running, setRunning] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const stage = MANDATE_STAGES[active];
  const last = MANDATE_STAGES.length - 1;

  useEffect(() => {
    if (reducedMotion || !running) return undefined;
    const timer = window.setTimeout(() => {
      if (active >= last - 1) {
        setActive(last);
        setRunning(false);
      } else setActive((value) => value + 1);
    }, 1550);
    return () => window.clearTimeout(timer);
  }, [active, last, running, reducedMotion]);

  const select = (index) => { setActive(index); setRunning(false); };
  const toggle = () => {
    if (reducedMotion) {
      setActive((value) => value >= last ? 0 : value + 1);
      setRunning(false);
      return;
    }
    if (running) {
      setRunning(false);
      return;
    }
    if (active >= last) setActive(0);
    setRunning(true);
  };
  const controlLabel = reducedMotion
    ? active >= last ? "VOLVER AL INICIO" : "SIGUIENTE FASE"
    : running ? "PAUSAR" : active >= last ? "REPETIR" : "CONTINUAR";

  return (
    <section className="ex-console" aria-label="Demostración del recorrido de un proyecto MEDLA">
      <header className="ex-console__head">
        <div><b>M/</b><span>CONTROL DE PROYECTO</span></div>
        <button type="button" onClick={toggle}><i className={running ? "is-live" : ""} />{controlLabel}</button>
      </header>
      <div className="ex-console__brief">
        <span>ESCENARIO ILUSTRATIVO / 01</span>
        <h2>Implantar un nuevo proceso de alta de proveedores.</h2>
        <p>Legal, operaciones y sistemas trabajan sobre una misma decisión.</p>
      </div>
      <div className="ex-console__body">
        <div className="ex-console__inputs" aria-label="Información de entrada">
          <span>ENTRADAS</span>
          {["Riesgo contractual", "Proceso actual", "Datos y permisos"].map((item, index) => <div className={active >= index ? "is-ready" : ""} key={item}><i /><b>{item}</b></div>)}
        </div>
        <div className="ex-console__flow">
          <div className="ex-console__rail" aria-hidden="true"><i style={{ "--progress": `${active / (MANDATE_STAGES.length - 1)}` }} /></div>
          <div className="ex-console__steps" role="tablist" aria-label="Fases del proyecto">
            {MANDATE_STAGES.map((item, index) => (
              <button key={item.code} type="button" role="tab" id={`mandate-tab-${item.code}`} aria-selected={active === index} aria-controls="mandate-stage" tabIndex={active === index ? 0 : -1} className={`${active === index ? "is-active" : ""}${active > index ? " is-done" : ""}`} onClick={() => select(index)} onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? MANDATE_STAGES.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + MANDATE_STAGES.length) % MANDATE_STAGES.length;
                select(next);
                event.currentTarget.parentElement.querySelectorAll("button")[next]?.focus();
              }}><span>{item.code}</span><b>{item.label}</b></button>
            ))}
          </div>
        </div>
        <article id="mandate-stage" className="ex-console__result" role="tabpanel" aria-labelledby={`mandate-tab-${stage.code}`} key={stage.code}>
          <span>SALIDA / {stage.code}</span><h3>{stage.title}</h3><p>{stage.detail}</p><div><i />{stage.output}</div>
        </article>
      </div>
      <footer><span>Demostración conceptual · no utiliza datos de clientes</span><span>Encaje → mandato → implantación → transferencia</span></footer>
    </section>
  );
}

function Hero() {
  return (
    <header className="ex-hero">
      <div className="ex-hero__contours" aria-hidden="true"><i /><i /><i /></div>
      <div className="ex-shell ex-hero__layout">
        <div className="ex-hero__copy">
          <div className="ex-eyebrow"><span>Dirección de proyectos transversales</span><small>Madrid · España</small></div>
          <h1>Una sola dirección para decisiones que cruzan <em>negocio, legal y tecnología.</em></h1>
          <p>MEDLA aclara la decisión, coordina a los especialistas e implanta la solución. El proyecto termina con responsables, documentación y control dentro de tu empresa.</p>
          <div className="ex-actions">
            <a className="ex-button ex-button--gold" href="contacto.html?context=proyecto">Plantear un proyecto <Arrow /></a>
            <a className="ex-text-link" href="#como-funciona">Ver cómo funciona <Arrow /></a>
          </div>
          <div className="ex-hero__assurance" aria-label="Compromisos principales"><span>Un responsable</span><i /><span>Un alcance aprobado</span><i /><span>Control transferido</span></div>
        </div>
        <div className="ex-hero__visual"><MandateConsole /></div>
      </div>
      <a className="ex-scroll-cue" href="#encaje"><span>Explorar</span><i /></a>
    </header>
  );
}

function Situations() {
  return (
    <section className="ex-situations" id="encaje" aria-labelledby="situations-title">
      <div className="ex-shell">
        <div className="ex-section-head" data-reveal>
          <span>01 / CUÁNDO INTERVENIMOS</span>
          <h2 id="situations-title">MEDLA interviene cuando <em>una sola disciplina ya no basta.</em></h2>
          <p>Asumimos la dirección cuando el resultado depende de varias capacidades y de una implantación coordinada.</p>
        </div>
        <div className="ex-situation-list">
          {PROJECT_SITUATIONS.map((item) => (
            <article key={item.number} data-reveal>
              <div className="ex-situation-list__number"><span>{item.number}</span><small>{item.type}</small></div>
              <div className="ex-situation-list__copy"><h3>{item.title}</h3><p>{item.text}</p></div>
              <ul>{item.outputs.map((output) => <li key={output}><i />{output}</li>)}</ul>
              <a href={item.href} aria-label={`Ver una capacidad relacionada con ${item.type}`}>Ver capacidad <Arrow diagonal /></a>
            </article>
          ))}
        </div>
        <div className="ex-situations__foot" data-reveal><p>¿Tu situación cruza varios de estos escenarios?</p><a href="servicios.html">Orientar el proyecto por situación <Arrow /></a></div>
      </div>
    </section>
  );
}

function DeliveryDossier() {
  const [active, setActive] = useState(0);
  const chapter = DOSSIER_CHAPTERS[active];
  const refs = useRef([]);
  const selectByKeyboard = (event, index) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? DOSSIER_CHAPTERS.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + DOSSIER_CHAPTERS.length) % DOSSIER_CHAPTERS.length;
    setActive(next);
    refs.current[next]?.focus();
  };
  return (
    <div className="ex-dossier" data-reveal>
      <header className="ex-dossier__head"><div><i /><span>EJEMPLO DE ENTREGA</span><b>Alta de proveedor internacional</b></div><span>ESCENARIO ILUSTRATIVO</span></header>
      <div className="ex-dossier__layout">
        <aside className="ex-dossier__before">
          <header><span>ANTES</span><h3>Información dispersa y una decisión detenida.</h3></header>
          <ol>
            <li><span>Correo</span><b>¿Quién valida las condiciones?</b><small>Sin responsable</small></li>
            <li><span>Documento</span><b>Contrato_proveedor_v7.pdf</b><small>Versión por confirmar</small></li>
            <li><span>ERP</span><b>Alta bloqueada</b><small>Falta certificado fiscal</small></li>
          </ol>
          <div><i />Contexto incompleto</div>
        </aside>
        <div className="ex-dossier__transformation" aria-hidden="true"><span>MEDLA</span><i /><small>Reunir · decidir · implantar</small></div>
        <article className="ex-dossier__document">
          <header><div><span>EXPEDIENTE DE ENTREGA</span><b>Folio 06 · versión 1.4</b></div><strong><i /> VALIDADO</strong></header>
          <div className="ex-dossier__tabs" role="tablist" aria-label="Contenido de la entrega">
            {DOSSIER_CHAPTERS.map((item, index) => <button key={item.id} ref={(node) => { refs.current[index] = node; }} type="button" role="tab" id={`dossier-tab-${item.id}`} aria-controls="dossier-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => selectByKeyboard(event, index)}><span>{item.number}</span>{item.label}<i /></button>)}
          </div>
          <div id="dossier-panel" className="ex-dossier__panel" role="tabpanel" aria-labelledby={`dossier-tab-${chapter.id}`} key={chapter.id}>
            <span>{chapter.number} / {chapter.label}</span><h3>{chapter.title}</h3><p>{chapter.text}</p>
            <dl>{chapter.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </div>
          <footer><span><i />Decisión registrada</span><span><i />Sistema probado</span><span><i />Control transferido</span></footer>
        </article>
      </div>
    </div>
  );
}

function Delivery() {
  return (
    <section className="ex-delivery" id="como-funciona" aria-labelledby="delivery-title">
      <div className="ex-shell">
        <div className="ex-section-head ex-section-head--dark" data-reveal>
          <span>02 / QUÉ CAMBIA</span>
          <h2 id="delivery-title">El encargo no termina en una recomendación. <em>Termina con una solución operativa.</em></h2>
          <p>Esta demostración enseña cómo una decisión dispersa se convierte en un expediente que el equipo puede ejecutar, revisar y mantener.</p>
        </div>
        <DeliveryDossier />
      </div>
    </section>
  );
}

function MandateDefinition() {
  return (
    <section className="ex-mandate" aria-labelledby="mandate-title">
      <div className="ex-shell ex-mandate__layout">
        <div className="ex-mandate__intro" data-reveal>
          <span>03 / PRIMERA FASE</span>
          <h2 id="mandate-title">Antes de movilizar especialistas, <em>cerramos el mandato.</em></h2>
          <p><strong>Mandato de dirección:</strong> objetivo, alcance, autoridad, responsables y criterio de cierre acordados con el cliente.</p>
          <a className="ex-button ex-button--ink" href="contacto.html?context=proyecto">Plantear un proyecto <Arrow /></a>
        </div>
        <div className="ex-mandate__protocol" data-reveal>
          <header><span>RECORRIDO DEL PROYECTO</span><small>4 cierres verificables</small></header>
          <ol>{MANDATE_STAGES.map((stage, index) => <li key={stage.code}>
            <span>{stage.code}</span><div><small>{stage.label}</small><h3>{stage.title}</h3><p>{stage.detail}</p></div><strong><i />{stage.output}</strong>{index < MANDATE_STAGES.length - 1 && <b aria-hidden="true" />}
          </li>)}</ol>
          <footer>La propuesta confirma calendario, equipo, precio, entregables y criterios de aceptación antes de empezar.</footer>
        </div>
      </div>
    </section>
  );
}

function Accountability() {
  const commitments = [
    ["Dirección identificada", "La propuesta identifica la dirección del proyecto, las funciones asignadas y la autoridad de cada frente."],
    ["Alcance gobernable", "Cada entrega tiene responsable, versión, criterio de aceptación y cambio pendiente."],
    ["Control del cliente", "Permisos, documentación y conocimiento se transfieren al equipo; la solución no depende de una caja negra."],
  ];
  return (
    <section className="ex-accountability" aria-labelledby="accountability-title">
      <div className="ex-shell ex-accountability__layout">
        <div className="ex-accountability__identity" data-reveal>
          <span>04 / RESPONSABILIDAD</span><h2 id="accountability-title">La entidad responsable <em>está identificada.</em></h2>
          <dl>
            <div><dt>Razón social</dt><dd>MEDLA ASESORES, S.L.</dd></div>
            <div><dt>Sede</dt><dd>Móstoles · Madrid · España</dd></div>
            <div><dt>Registro Mercantil</dt><dd>Tomo 46169 · Folio 20 · Hoja M-811076</dd></div>
            <div><dt>Contacto</dt><dd><a href="mailto:info@medla-empresas.com">info@medla-empresas.com</a></dd></div>
          </dl>
          <a href="privacidad.html#responsable">Ver información legal <Arrow diagonal /></a>
        </div>
        <div className="ex-accountability__commitments">{commitments.map(([title, text], index) => <article key={title} data-reveal><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </div>
    </section>
  );
}

function App() {
  return <><RevealController /><window.MedlaSiteHeader current="home" /><main id="contenido"><Hero /><Situations /><Delivery /><MandateDefinition /><Accountability /></main><window.MedlaSiteFooter current="home" /></>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
