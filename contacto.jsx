// Contacto page — interactive multi-step form + info + FAQ
const { useState, useEffect, useRef } = React;

/* ─────────── Icons local ─────────── */
const IconCal = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
  </svg>
);
const IconMsg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16v12H8l-4 4z" />
  </svg>
);
const IconWa = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12.5a8 8 0 0 1-11.9 6.9L4 21l1.7-4A8 8 0 1 1 20 12.5z" />
    <path d="M9.3 10.2c.3 1.5 1.2 2.9 2.7 3.8.4.2.9.1 1.3-.2l.7-.5c.3-.2.7-.2 1 0l1.4.7" />
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" />
  </svg>
);
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3c0 1-1 2-2 2A18 18 0 0 1 3 6c0-1 1-2 2-2z" />
  </svg>
);
/* ─────────── Hero ─────────── */
function CtHero({ context }) {
  return (
    <section className="contacto-hero">
      <div className="container contacto-hero-inner">
        <div className="contacto-hero-copy">
          <span className="eyebrow">01 — Hablemos</span>
          <h1>Cuéntanos qué <em>quieres resolver.</em></h1>
          <p className="lead">
            Qué está pasando, quién interviene y cuándo necesitas avanzar. Con ese punto de partida podremos decirte cómo ayudarte.
          </p>
          <div className="contacto-pulse">
            <span className="dot"></span> Revisión del contexto del proyecto
          </div>
        </div>
        <aside className="ct-brief" aria-label="Vista previa del contexto que recibirá MEDLA">
          <header><span>MEDLA / CONTEXTO INICIAL</span><b>01</b></header>
          <div className="ct-brief-status"><i></i><span>{context ? "Tema seleccionado" : "Preparado para completar"}</span></div>
          <h2>{context?.label || "Describe tu proyecto"}</h2>
          <dl>
            <div><dt>Tema seleccionado</dt><dd>{context ? "Conservado desde la página anterior" : "Empiezas por el proyecto, sin elegir una capacidad"}</dd></div>
            <div><dt>Revisión de encaje</dt><dd>Decisión · consecuencia · responsables</dd></div>
            <div><dt>Respuesta</dt><dd>Encaje · información pendiente · reunión</dd></div>
          </dl>
          <footer><span>Datos tratados con consentimiento</span><i>Madrid / ES</i></footer>
        </aside>
      </div>
    </section>
  );
}

/* ─────────── Paths Selector ─────────── */
const PATHS = [
  {
    id: "diagnostico",
    icon: <IconCal />,
    title: "Revisión de encaje",
    desc: "Para valorar si MEDLA debe asumir la dirección del proyecto y qué información falta para definir el mandato.",
    meta: "Contexto inicial",
  },
  {
    id: "propuesta",
    icon: <IconMsg />,
    title: "Solicitud de propuesta",
    desc: "Para equipos que ya tienen claro el alcance y necesitan una propuesta económica detallada.",
    meta: "Alcance definido",
  },
  {
    id: "alianza",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L4 8v6a8 8 0 0 0 8 7 8 8 0 0 0 8-7V8z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Colaboración profesional",
    desc: "Despachos, firmas o fondos que quieren coordinar una oferta conjunta o integrar servicios MEDLA.",
    meta: "Oferta conjunta",
  },
];

function CtPaths({ active, onPick }) {
  return (
    <section className="contacto-paths">
      <div className="container">
        <div className="paths-grid">
          {PATHS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`path-card ${active === p.id ? "active" : ""}`}
              aria-pressed={active === p.id}
              onClick={() => onPick(p.id)}
            >
              <div className="path-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="path-meta">{p.meta}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Multi-step Form ─────────── */
const ALCANCE_OPTIONS = [
  { value: "Asesoría legal corporativa", label: "Asesoría legal corporativa" },
  { value: "Constitución / reestructura", label: "Constitución o reestructuración societaria" },
  { value: "Inversión y financiación", label: "Inversión y financiación" },
  { value: "Digitalización de procesos", label: "Digitalización de procesos" },
  { value: "Automatización e integración", label: "Automatización e integración" },
  { value: "IA aplicada", label: "IA aplicada" },
  { value: "Posicionamiento, captación y CRM", label: "Posicionamiento, captación y CRM" },
  { value: "Aún no lo tengo claro", label: "Aún no lo tengo claro" },
];

const CONTEXT_PRESETS = {
  proyecto: {
    label: "Proyecto transversal",
    alcance: ["Aún no lo tengo claro"],
    notas: "Punto de partida: una decisión o iniciativa relevante afecta a varias áreas y necesita dirección, implantación y transferencia al equipo.",
  },
  operacion: {
    label: "Operación y sistemas",
    alcance: ["Digitalización de procesos", "Automatización e integración"],
    notas: "Punto de partida: un proceso de aprobaciones manuales sin un estado ni un responsable claros.",
  },
  legal: {
    label: "Asesoría legal empresarial",
    alcance: ["Asesoría legal corporativa"],
    notas: "Punto de partida: una decisión bloqueada por contratos, obligaciones o versiones dispersas.",
  },
  ia: {
    label: "IA aplicada",
    alcance: ["IA aplicada"],
    notas: "Punto de partida: un caso de IA que aún no opera con fuentes, permisos y controles definidos.",
  },
  growth: {
    label: "Posicionamiento, captación y CRM",
    alcance: ["Posicionamiento, captación y CRM"],
    notas: "Punto de partida: oportunidades comerciales sin responsable o próxima acción.",
  },
  constitucion: {
    label: "Constitución y estructura societaria",
    alcance: ["Constitución / reestructura", "Asesoría legal corporativa"],
    notas: "Punto de partida: hay que ordenar propiedad, administración, capital y reglas de decisión antes de operar o cambiar la estructura.",
  },
  inversiones: {
    label: "Inversión y financiación",
    alcance: ["Inversión y financiación", "Asesoría legal corporativa"],
    notas: "Punto de partida: necesitamos comparar escenarios o preparar una decisión de financiación con datos y supuestos trazables.",
  },
  digitalizacion: {
    label: "Digitalización de operaciones",
    alcance: ["Digitalización de procesos"],
    notas: "Punto de partida: la información vive en correos, hojas o herramientas que no comparten estados ni responsables.",
  },
  automatizacion: {
    label: "Automatización de flujos",
    alcance: ["Automatización e integración"],
    notas: "Punto de partida: el equipo repite pasos previsibles o persigue aprobaciones que podrían quedar conectadas y registradas.",
  },
  crecimiento: {
    label: "Posicionamiento, captación y CRM",
    alcance: ["Posicionamiento, captación y CRM"],
    notas: "Punto de partida: la captación no conserva contexto o no termina en una próxima acción comercial con responsable.",
  },
  jotform: {
    label: "Jotform y flujos de datos",
    alcance: ["Digitalización de procesos", "Automatización e integración"],
    notas: "Punto de partida: la captura de datos genera errores, duplicados o trabajo manual antes de llegar al sistema y a la persona correctos.",
  },
  cuadernos: {
    label: "Aplicar una nota de decisión",
    alcance: ["Aún no lo tengo claro"],
    notas: "Quiero aplicar una nota de decisión MEDLA a un proyecto concreto.",
  },
  notas: {
    label: "Aplicar una nota de decisión",
    alcance: ["Aún no lo tengo claro"],
    notas: "Quiero aplicar una nota de decisión MEDLA a un proyecto concreto.",
  },
};

const requestParams = new URLSearchParams(window.location.search);
const contextKey = requestParams.get("context") || "";
const guideKey = requestParams.get("guide") || "";
const baseContext = CONTEXT_PRESETS[contextKey] || null;
const selectedContext = baseContext ? {
  ...baseContext,
  notas: guideKey ? `${baseContext.notas} Nota de referencia: ${guideKey}.` : baseContext.notas,
} : null;

const ETAPA_OPTIONS = [
  { value: "Pre-constitución", label: "Emprendedor o proyecto en fase de constitución" },
  { value: "Empresa emergente en ronda", label: "Empresa emergente que prepara o está en una ronda de financiación" },
  { value: "Pyme en crecimiento", label: "Pyme en crecimiento" },
  { value: "Empresa establecida", label: "Empresa consolidada" },
  { value: "Grupo o holding", label: "Grupo empresarial o holding" },
  { value: "Otro", label: "Otro / Prefiero explicarlo" },
];

const PRESUPUESTO_LABELS = [
  { min: 0, max: 0, label: "A definir", value: "A definir" },
  { min: 1, max: 10, label: "Hasta 10.000 €", value: "Hasta 10K" },
  { min: 10, max: 25, label: "10.000 – 25.000 €", value: "10K – 25K" },
  { min: 25, max: 50, label: "25.000 – 50.000 €", value: "25K – 50K" },
  { min: 50, max: 100, label: "50.000 – 100.000 €", value: "50K – 100K" },
  { min: 100, max: 999, label: "Más de 100.000 €", value: "100K+" },
];

function CtForm({ pathId }) {
  const [step, setStep] = useState(0);
  const questionRef = useRef(null);
  const previousStepRef = useRef(0);
  const [data, setData] = useState(() => ({
    alcance: selectedContext?.alcance || [],
    etapa: null,
    presupuestoIdx: 0,
    nombre: "",
    empresa: "",
    cargo: "",
    email: "",
    telefono: "",
    notas: "",
    website: "",
  }));
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;
    questionRef.current?.focus();
  }, [step]);

  const totalSteps = 3;
  const toggleAlcance = (opt) => {
    setData((d) => ({
      ...d,
      alcance: d.alcance.includes(opt) ? d.alcance.filter((x) => x !== opt) : [...d.alcance, opt],
    }));
    if (sendError) setSendError(null);
  };

  const setEtapa = (opt) => {
    setData((d) => ({ ...d, etapa: opt }));
    if (sendError) setSendError(null);
  };
  const setField = (k, v) => {
    setData((d) => ({ ...d, [k]: v }));
    if (sendError) setSendError(null);
  };

  const problemReady = data.notas.trim().length >= 12;
  const contactReady = data.nombre.trim().length >= 2
    && data.empresa.trim().length >= 2
    && data.cargo.trim().length >= 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim());
  const canAdvance =
    (step === 0 && problemReady) ||
    (step === 1 && contactReady) ||
    step >= 2;

  const selectedScopeLabels = data.alcance.map((value) => ALCANCE_OPTIONS.find((option) => option.value === value)?.label || value);
  const selectedStageLabel = ETAPA_OPTIONS.find((option) => option.value === data.etapa)?.label || "Sin indicar";
  const selectedBudget = PRESUPUESTO_LABELS[data.presupuestoIdx];
  const issuePreview = data.notas.trim().replace(/\s+/g, " ") || "Aún no has descrito el proyecto.";

  const submitToWebhook = async () => {
    if (!privacyAccepted) {
      setSendError("Necesitamos que aceptes la política de privacidad antes de enviar.");
      return;
    }
    setSending(true);
    setSendError(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);
    const alcance = data.alcance.length ? data.alcance : ["Aún no lo tengo claro"];
    const payload = {
      tipo_contacto: pathId,
      nombre: data.nombre,
      empresa: data.empresa,
      cargo: data.cargo,
      email: data.email,
      telefono: data.telefono,
      alcance,
      etapa_empresa: data.etapa || "Otro",
      rango_presupuesto: selectedBudget.value,
      notas: data.notas,
      origen_contexto: contextKey,
      origen_nota: guideKey,
      pagina_origen: document.referrer || window.location.href,
      consentimiento_privacidad: true,
      version_privacidad: "2026-09-04",
      website: data.website,
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Webhook error ${response.status}`);
      setSent(true);
    } catch (err) {
      setSendError(err.name === "AbortError"
        ? "El envío tardó demasiado. Comprueba tu conexión e inténtalo de nuevo."
        : "No se pudo enviar. Por favor inténtalo de nuevo.");
    } finally {
      window.clearTimeout(timeoutId);
      setSending(false);
    }
  };

  const next = () => {
    if (step < totalSteps - 1 && canAdvance) setStep(step + 1);
  };
  const back = () => step > 0 && setStep(step - 1);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (step !== totalSteps - 1 || sending) return;
    if (!problemReady) {
      setStep(0);
      setSendError("Describe brevemente qué debe decidirse o quedar funcionando antes de enviar.");
      return;
    }
    if (!contactReady) {
      setStep(1);
      setSendError("Revisa el nombre, la empresa, tu responsabilidad y el correo electrónico antes de enviar.");
      return;
    }
    submitToWebhook();
  };

  const stepTitle = {
    diagnostico: "Revisión de encaje",
    propuesta: "Solicitud de propuesta",
    alianza: "Colaboración profesional",
  }[pathId] || "Revisión de encaje";

  const stepHints = [
    "Proyecto y decisión",
    "Cómo respondemos",
    "Añadir contexto",
  ];

  const fallbackText = encodeURIComponent([
    `Hola, quiero contactar con MEDLA por: ${stepTitle.toLowerCase()}.`,
    `Proyecto y decisión: ${data.notas.trim()}`,
    `Nombre: ${data.nombre.trim()}`,
    `Correo electrónico: ${data.email.trim()}`,
    `Empresa: ${data.empresa.trim()}`,
    `Responsabilidad: ${data.cargo.trim()}`,
    selectedScopeLabels.length ? `Áreas: ${selectedScopeLabels.join(", ")}` : "Áreas: por definir",
  ].filter(Boolean).join("\n\n"));

  return (
    <section className="contacto-form-wrap" id="form">
      <div className="container">
        <form className="form-card" onSubmit={handleSubmit}>
          <aside className="form-side">
            <div className="form-side-top">
              <span className="eyebrow">— {stepTitle}</span>
              <h3>Empecemos por la decisión y el resultado esperado.</h3>
              <p>Describe el objetivo y la consecuencia de no actuar. Después indícanos cómo responderte; el resto es opcional.</p>

              <div className="form-side-steps">
                {stepHints.map((h, i) => (
                  <div
                    key={i}
                    className={`form-side-step ${i < step || sent ? "done" : ""} ${i === step && !sent ? "current" : ""}`}
                    aria-current={i === step && !sent ? "step" : undefined}
                  >
                    <div className="step-dot">{i < step || sent ? "✓" : i + 1}</div>
                    <div>{h}</div>
                  </div>
                ))}
              </div>

              {!sent && (
                <section className="form-live-brief" aria-label="Resumen del contexto en preparación">
                  <header><span>CONTEXTO / EN PREPARACIÓN</span><b>0{step + 1}</b></header>
                  <div className="form-live-brief__status"><i></i>{problemReady ? "Punto de partida descrito" : "Esperando el punto de partida"}</div>
                  <dl>
                    <div className="form-live-brief__issue"><dt>Proyecto</dt><dd>{issuePreview}</dd></div>
                    <div><dt>Contacto</dt><dd>{data.nombre.trim() || "Sin completar"}</dd></div>
                    <div><dt>Áreas</dt><dd>{selectedScopeLabels.length ? selectedScopeLabels.join(" · ") : "Sin clasificar"}</dd></div>
                    <div><dt>Momento</dt><dd>{selectedStageLabel}</dd></div>
                    <div><dt>Presupuesto</dt><dd>{selectedBudget.label}</dd></div>
                  </dl>
                  <footer><span>{selectedContext ? "Contexto heredado" : "Contexto editable"}</span><i>{String(step + 1).padStart(2, "0")} / 03</i></footer>
                </section>
              )}
            </div>

            <div className="form-side-channels">
              <a className="form-side-channel" href="mailto:info@medla-empresas.com"><IconMail /> info@medla-empresas.com</a>
              <a className="form-side-channel" href="tel:+34641576772"><IconPhone /> +34 641 576 772</a>
              <a className="form-side-channel" href="https://wa.me/34641576772"><IconWa /> WhatsApp directo</a>
            </div>
          </aside>

          <div className="form-body">
            {!sent && (
              <div className="form-progress">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`form-progress-bar ${i < step ? "done" : ""} ${i === step ? "current" : ""}`}
                  />
                ))}
              </div>
            )}

            {!sent && step === 0 && (
              <div className="form-step form-step--issue">
                <div>
                  <div className="step-label">Paso 1 · {stepHints[0]}</div>
                  <h4 id="contact-issue-question">¿Qué debe decidirse o quedar funcionando? <span aria-hidden="true">*</span><span className="sr-only"> Respuesta obligatoria.</span></h4>
                  <p id="contact-issue-hint" className="form-step__hint">Indica el objetivo, la consecuencia de no actuar, quién interviene y el plazo si ya existe.</p>
                </div>
                {selectedContext && (
                  <div className="brief-origin">
                    <span>Contexto conservado desde la página anterior</span>
                    <strong>{selectedContext.label}</strong>
                    <small>{selectedContext.notas}</small>
                  </div>
                )}
                <div className="field field--issue">
                  <label htmlFor="contact-issue">Describe el proyecto</label>
                  <textarea
                    ref={questionRef}
                    id="contact-issue"
                    required
                    minLength="12"
                    maxLength="3000"
                    value={data.notas}
                    onChange={(event) => setField("notas", event.target.value)}
                    aria-labelledby="contact-issue-question"
                    aria-describedby="contact-issue-hint contact-issue-count"
                    placeholder={selectedContext ? `Añade el contexto de tu caso. ${selectedContext.notas}` : "Por ejemplo: necesitamos decidir e implantar un nuevo proceso de alta de proveedores antes de noviembre; intervienen Compras, Legal y Sistemas…"}
                  />
                  <div className="field-meta" id="contact-issue-count"><span>{problemReady ? "Punto de partida listo" : "Escribe al menos una frase"}</span><span>{data.notas.length} / 3000</span></div>
                </div>
              </div>
            )}

            {!sent && step === 1 && (
              <div className="form-step form-step--identity">
                <div>
                  <div className="step-label">Paso 2 · {stepHints[1]}</div>
                  <h4 ref={questionRef} tabIndex="-1">¿Cómo podemos responderte?</h4>
                  <p className="form-step__hint">Indica quién lidera la conversación y desde qué empresa. El teléfono es opcional.</p>
                </div>
                <div className="fields-row">
                  <div className="field">
                    <label htmlFor="contact-name">Nombre *</label>
                    <input id="contact-name" type="text" required autoComplete="name" value={data.nombre} onChange={(e) => setField("nombre", e.target.value)} placeholder="Nombre y apellidos" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-email">Correo electrónico *</label>
                    <input id="contact-email" type="email" required autoComplete="email" value={data.email} onChange={(e) => setField("email", e.target.value)} placeholder="tu@empresa.com" />
                  </div>
                </div>
                <div className="fields-row">
                  <div className="field">
                    <label htmlFor="contact-company">Empresa *</label>
                    <input id="contact-company" type="text" required autoComplete="organization" value={data.empresa} onChange={(e) => setField("empresa", e.target.value)} placeholder="Nombre comercial" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-role">Cargo o responsabilidad *</label>
                    <input id="contact-role" type="text" required autoComplete="organization-title" value={data.cargo} onChange={(e) => setField("cargo", e.target.value)} placeholder="Dirección, operaciones, legal…" />
                  </div>
                </div>
                <div className="fields-row fields-row--single">
                  <div className="field">
                    <label htmlFor="contact-phone">Teléfono <span>Opcional</span></label>
                    <input id="contact-phone" type="tel" autoComplete="tel" value={data.telefono} onChange={(e) => setField("telefono", e.target.value)} placeholder="+34…" />
                  </div>
                </div>
                <p className="form-data-note"><i></i>Usaremos estos datos para revisar y responder a esta solicitud.</p>
              </div>
            )}

            {!sent && step === 2 && (
              <div className="form-step form-step--context">
                <div>
                  <div className="step-label">Paso 3 · {stepHints[2]}</div>
                  <h4 ref={questionRef} tabIndex="-1">Añadir contexto <em>es opcional.</em></h4>
                  <p className="form-step__hint">Si ya conoces el área, el momento de la empresa o el presupuesto, puedes indicarlo. También puedes enviar la consulta sin clasificarla.</p>
                </div>
                <div className="context-stack">
                  <fieldset className="context-block">
                    <legend><span>01</span> Área o capacidad</legend>
                    <p>Selecciona las capacidades que puedan estar relacionadas.</p>
                    <div className="options-grid options-grid--compact">
                      {ALCANCE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          className={`opt-card ${data.alcance.includes(option.value) ? "selected" : ""}`}
                          aria-pressed={data.alcance.includes(option.value)}
                          onClick={() => toggleAlcance(option.value)}
                          type="button"
                        >
                          <span>{option.label}</span>
                          <span className="opt-check"></span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="context-split">
                    <fieldset className="context-block">
                      <legend><span>02</span> Momento de la empresa</legend>
                      <div className="field">
                        <label htmlFor="contact-stage">Selecciona solo si ayuda a entender el caso</label>
                        <select id="contact-stage" value={data.etapa || ""} onChange={(event) => setEtapa(event.target.value || null)}>
                          <option value="">Prefiero no indicarlo</option>
                          {ETAPA_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                    </fieldset>

                    <fieldset className="context-block">
                      <legend><span>03</span> Presupuesto orientativo</legend>
                      <div className="slider-wrap slider-wrap--compact">
                        <div className="slider-value">{selectedBudget.label}</div>
                        <input
                          type="range"
                          aria-label="Rango de presupuesto orientativo"
                          aria-valuetext={selectedBudget.label}
                          min="0"
                          max={PRESUPUESTO_LABELS.length - 1}
                          step="1"
                          value={data.presupuestoIdx}
                          onChange={(e) => setField("presupuestoIdx", parseInt(e.target.value, 10))}
                        />
                        <div className="slider-ticks slider-ticks--ends"><span>A definir</span><span>100 mil €+</span></div>
                      </div>
                    </fieldset>
                  </div>
                </div>
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website">Tu web</label>
                  <input id="contact-website" type="text" tabIndex="-1" autoComplete="off" value={data.website} onChange={(event) => setField("website", event.target.value)} />
                </div>
                <div className="privacy-consent">
                  <input
                    id="contact-privacy"
                    type="checkbox"
                    required
                    checked={privacyAccepted}
                    onChange={(event) => {
                      setPrivacyAccepted(event.target.checked);
                      if (sendError) setSendError(null);
                    }}
                  />
                  <label htmlFor="contact-privacy">
                    He leído y acepto la <a href="privacidad.html" target="_blank" rel="noopener noreferrer">política de privacidad</a> y consiento el tratamiento de mis datos para responder a esta solicitud.
                  </label>
                </div>
              </div>
            )}

            {sent && (
              <div className="form-success" role="status" aria-live="polite">
                <div className="success-ring">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                    <path className="success-check" d="M 12 26 L 22 35 L 38 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Mensaje enviado, {data.nombre.split(" ")[0] || "gracias"}.</h3>
                <p>Hemos recibido el contexto. En la primera respuesta indicaremos si el proyecto encaja, qué información falta y qué reunión conviene convocar.</p>
                <div className="hero-ctas">
                  <a href="servicios.html" className="btn btn-primary">Ver qué resolvemos <span className="arr">→</span></a>
                  <a href="index.html" className="btn btn-ghost">Volver al inicio</a>
                </div>
              </div>
            )}

            {!sent && (
              <div className="form-nav">
                <button type="button" className="btn-link" onClick={back} disabled={step === 0 || sending}>← Anterior</button>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  {sendError && (
                    <div className="send-fallback" role="alert"><span>{sendError}</span><div><a href={`mailto:info@medla-empresas.com?subject=${encodeURIComponent(`Consulta MEDLA · ${stepTitle}`)}&body=${fallbackText}`}>Enviar por correo</a><a href={`https://wa.me/34641576772?text=${fallbackText}`} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a></div></div>
                  )}
                  <button
                    type={step === totalSteps - 1 ? "submit" : "button"}
                    className="btn btn-primary"
                    onClick={step === totalSteps - 1 ? undefined : next}
                    disabled={sending || (step < totalSteps - 1 && !canAdvance)}
                    style={{
                      opacity: !sending && (step === totalSteps - 1 || canAdvance) ? 1 : 0.4,
                      cursor: !sending && (step === totalSteps - 1 || canAdvance) ? "pointer" : "default"
                    }}
                  >
                    {sending ? "Enviando…" : step === totalSteps - 1 ? "Enviar contexto" : "Continuar"} <span className="arr">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

/* ─────────── Info + Map ─────────── */
function CtInfo() {
  return (
    <section className="contacto-info">
      <div className="container">
        <div className="info-grid">
          <div className="info-text">
            <span className="eyebrow">— Canales directos</span>
            <h2 style={{ marginTop: 16 }}>También puedes <em>escribirnos directamente.</em></h2>
            <p className="lead" style={{ maxWidth: "44ch" }}>
              Para una pregunta concreta o para valorar si el caso encaja antes de formalizar una colaboración.
            </p>

            <div className="info-channels">
              <a className="info-channel" href="mailto:info@medla-empresas.com">
                <div className="info-channel-icon"><IconMail /></div>
                <div className="info-channel-body">
                  <div className="info-channel-label">Correo electrónico</div>
                  <div className="info-channel-val">info@medla-empresas.com</div>
                </div>
                <span className="info-channel-arr">→</span>
              </a>
              <a className="info-channel" href="tel:+34641576772">
                <div className="info-channel-icon"><IconPhone /></div>
                <div className="info-channel-body">
                  <div className="info-channel-label">Teléfono</div>
                  <div className="info-channel-val">+34 641 576 772</div>
                </div>
                <span className="info-channel-arr">→</span>
              </a>
              <a className="info-channel" href="https://wa.me/34641576772">
                <div className="info-channel-icon"><IconWa /></div>
                <div className="info-channel-body">
                  <div className="info-channel-label">WhatsApp</div>
                  <div className="info-channel-val">Mensaje directo</div>
                </div>
                <span className="info-channel-arr">→</span>
              </a>
            </div>
          </div>

          <div className="map-card">
            <div className="map-visual">
              <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1A1A2E" strokeOpacity="0.04" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#mapGrid)" />
                {/* roads */}
                <path d="M 0 180 L 400 160" stroke="#C9A84C" strokeOpacity="0.15" strokeWidth="8" />
                <path d="M 0 180 L 400 160" stroke="#C9A84C" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 220 0 L 180 400" stroke="#C9A84C" strokeOpacity="0.15" strokeWidth="6" />
                <path d="M 220 0 L 180 400" stroke="#C9A84C" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 40 60 Q 200 200 380 340" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="6" fill="none" />
                <path d="M 40 60 Q 200 200 380 340" stroke="#1A1A2E" strokeOpacity="0.4" strokeWidth="1" fill="none" strokeDasharray="3 4" />
                {/* blocks */}
                <rect x="60" y="50" width="60" height="40" fill="#1A1A2E" opacity="0.05" />
                <rect x="130" y="60" width="40" height="50" fill="#1A1A2E" opacity="0.07" />
                <rect x="250" y="40" width="80" height="60" fill="#1A1A2E" opacity="0.06" />
                <rect x="50" y="230" width="90" height="70" fill="#1A1A2E" opacity="0.08" />
                <rect x="220" y="220" width="60" height="60" fill="#1A1A2E" opacity="0.07" />
                <rect x="290" y="260" width="70" height="50" fill="#1A1A2E" opacity="0.05" />
                <rect x="60" y="320" width="50" height="50" fill="#1A1A2E" opacity="0.06" />
                <rect x="280" y="100" width="40" height="60" fill="#1A1A2E" opacity="0.06" />
                {/* pin */}
                <g transform="translate(200, 175)">
                  <circle className="map-pin-pulse" r="26" fill="#C9A84C" opacity="0.15" />
                  <circle r="14" fill="#C9A84C" opacity="0.3" />
                  <g transform="translate(0, -6)">
                    <path d="M 0 -14 C -8 -14 -12 -8 -12 -2 C -12 6 0 18 0 18 C 0 18 12 6 12 -2 C 12 -8 8 -14 0 -14 Z" fill="#1A1A2E" />
                    <circle cy="-2" r="4" fill="#C9A84C" />
                  </g>
                </g>
              </svg>
            </div>
            <div className="map-card-body">
              <span className="lbl">Base operativa</span>
              <span className="addr">Madrid, España</span>
              <span className="hours">Trabajo remoto · reuniones coordinadas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── FAQ ─────────── */
const FAQS = [
  {
    q: "¿Cómo funciona la primera respuesta?",
    a: "Revisamos la información enviada y respondemos indicando si el proyecto encaja, qué información falta y qué reunión conviene convocar.",
  },
  {
    q: "¿Cómo se define el alcance?",
    a: "Partimos del contexto enviado, hacemos las preguntas necesarias y delimitamos alcance, responsables y criterio de aceptación antes de comenzar.",
  },
  {
    q: "¿Trabajan con equipos fuera de España?",
    a: "El trabajo puede coordinarse de forma remota. La disponibilidad y, cuando aplique, la jurisdicción y los responsables locales se confirman durante la revisión de encaje.",
  },
  {
    q: "¿Puedo empezar por un solo frente?",
    a: "Activamos las capacidades que exige el mandato. Un frente puede abordarse de forma independiente cuando tiene alcance, responsable y criterio de aceptación propios; no trabajamos como bolsa de horas.",
  },
  {
    q: "¿Cómo se acuerdan las condiciones?",
    a: "Antes de iniciar cualquier trabajo se presenta un alcance con entregables, responsables, calendario y condiciones económicas. La modalidad depende del tipo de intervención.",
  },
  {
    q: "¿Cómo comparto información sensible?",
    a: "No la incluyas en el primer formulario. Indica que existe documentación sensible y acordaremos el canal y las condiciones de intercambio antes de recibirla.",
  },
];

function CtFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="contacto-faq">
      <div className="container">
        <div className="section-head" style={{ textAlign: "center", margin: "0 auto" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>— Preguntas frecuentes</span>
          <h2 style={{ margin: "12px auto 0" }}>Antes de escribirnos, quizá <em>ya tengas la respuesta</em>.</h2>
        </div>
        <div className="faq-grid">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button
                className="faq-q"
                type="button"
                id={`faq-question-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {f.q} <span className="faq-plus" aria-hidden="true">+</span>
              </button>
              <div
                className="faq-a"
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                aria-hidden={open !== i}
                hidden={open !== i}
              >
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── App ─────────── */
function ContactoApp() {
  const requestedPath = requestParams.get("path");
  const [path, setPath] = useState(PATHS.some((item) => item.id === requestedPath) ? requestedPath : "diagnostico");
  return (
    <div className="contacto-page">
      <window.MedlaSiteHeader current="contact" />
      <main id="contenido">
        <CtHero context={selectedContext} />
        <CtPaths active={path} onPick={setPath} />
        <CtForm pathId={path} />
        <CtInfo />
        <CtFAQ />
      </main>
      <window.MedlaSiteFooter current="contact" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ContactoApp />);
