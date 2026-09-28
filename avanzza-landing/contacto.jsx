// Contacto page — interactive multi-step form + info + FAQ
const { useState, useEffect } = React;

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
const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13z" />
    <circle cx="12" cy="9" r="3" />
  </svg>
);
const IconLinkedIn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10v7M8 7.5v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
);

/* ─────────── Nav ─────────── */
function CtNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
    <nav className="nav scrolled">
      <div className="container nav-inner">
        <a href="index.html" className="logo"><img src="logo.png" alt="MEDLA" style={{height: 96}} /></a>
        <ul className="nav-links">
          <li><a href="servicios.html">Servicios</a></li>
          <li><a href="nosotros.html">Nosotros</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contacto.html" style={{ color: "var(--gold)" }}>Contacto</a></li>
        </ul>
        <div style={{display: "flex", alignItems: "center"}}>
          <a href="contacto.html" className="btn btn-primary btn-sm nav-cta">Agendar diagnóstico</a>
          <button className="nav-toggle" onClick={() => setMobileOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
    </nav>
    {mobileOpen && (
      <div className="mobile-menu">
        <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)}></div>
        <div className="mobile-menu-content">
          <div className="mobile-menu-head">
            <img src="logo.png" alt="MEDLA" style={{height: 40}} />
            <button className="nav-toggle" style={{display: "block"}} onClick={() => setMobileOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <ul className="mobile-links" onClick={() => setMobileOpen(false)}>
            <li><a href="servicios.html">Servicios</a></li>
            <li><a href="nosotros.html">Nosotros</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="contacto.html" style={{ color: "var(--gold)" }}>Contacto</a></li>
            <li style={{marginTop: 20}}><a href="contacto.html" className="btn btn-primary" style={{textAlign: "center", justifyContent: "center", width: "100%"}}>Agendar diagnóstico</a></li>
          </ul>
        </div>
      </div>
    )}
    </>
  );
}

/* ─────────── Hero ─────────── */
function CtHero() {
  return (
    <section className="contacto-hero">
      <div className="container contacto-hero-inner">
        <span className="eyebrow" style={{ justifyContent: "center" }}>— Contacto</span>
        <h1 style={{ marginTop: 20 }}>
          Escríbenos y<br /><em>empecemos a trabajar</em>.
        </h1>
        <p className="lead">
          No atendemos desde un buzón automático. Cada mensaje lo lee
          alguien del equipo y la primera respuesta llega en menos de 24 horas hábiles.
        </p>
        <div className="contacto-pulse">
          <span className="dot"></span> Aceptando nuevos clientes · Abril 2026
        </div>
      </div>
    </section>
  );
}

/* ─────────── Paths Selector ─────────── */
const PATHS = [
  {
    id: "diagnostico",
    icon: <IconCal />,
    title: "Diagnóstico inicial",
    desc: "30 min en videollamada. Entendemos tu operación y proponemos el alcance exacto.",
    meta: "Gratuito · 30 min",
  },
  {
    id: "propuesta",
    icon: <IconMsg />,
    title: "Propuesta a medida",
    desc: "Para equipos que ya tienen claro el alcance y necesitan un cotización detallada.",
    meta: "Respuesta · 48h",
  },
  {
    id: "alianza",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L4 8v6a8 8 0 0 0 8 7 8 8 0 0 0 8-7V8z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Alianza estratégica",
    desc: "Despachos, firmas o fondos que quieren co-crear o integrar servicios MEDLA.",
    meta: "Partnerships",
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
              className={`path-card ${active === p.id ? "active" : ""}`}
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
  "Asesoría legal corporativa",
  "Constitución / reestructura",
  "Inversiones y capital",
  "Digitalización de procesos",
  "Automatización e integración",
  "IA aplicada",
  "Presencia en redes",
  "Aún no lo tengo claro",
];

const ETAPA_OPTIONS = [
  "Pre-constitución",
  "Startup en ronda",
  "Pyme en crecimiento",
  "Empresa establecida",
  "Grupo o holding",
  "Otro",
];

const PRESUPUESTO_LABELS = [
  { min: 0, max: 0, label: "A definir" },
  { min: 1, max: 3, label: "1K – 3K / mes" },
  { min: 3, max: 8, label: "3K – 8K / mes" },
  { min: 8, max: 15, label: "8K – 15K / mes" },
  { min: 15, max: 30, label: "15K – 30K / mes" },
  { min: 30, max: 999, label: "30K+ / mes" },
];

function CtForm({ pathId }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    alcance: [],
    etapa: null,
    presupuestoIdx: 0,
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    notas: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const WEBHOOK_URL = "/api/contact";

  const totalSteps = 4;
  const toggleAlcance = (opt) =>
    setData((d) => ({
      ...d,
      alcance: d.alcance.includes(opt) ? d.alcance.filter((x) => x !== opt) : [...d.alcance, opt],
    }));

  const setEtapa = (opt) => setData((d) => ({ ...d, etapa: opt }));
  const setField = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const canAdvance =
    (step === 0 && data.alcance.length > 0) ||
    (step === 1 && !!data.etapa) ||
    step === 2 ||
    (step === 3 && data.nombre && data.email);

  const submitToWebhook = async () => {
    setSending(true);
    setSendError(null);
    const presupuesto = PRESUPUESTO_LABELS[data.presupuestoIdx].label;
    const payload = {
      tipo_contacto: pathId,
      nombre: data.nombre,
      empresa: data.empresa,
      email: data.email,
      telefono: data.telefono,
      alcance: data.alcance.join(", "),
      etapa_empresa: data.etapa,
      presupuesto_mensual: presupuesto,
      notas: data.notas,
      fecha: new Date().toISOString(),
    };
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSent(true);
    } catch (err) {
      setSendError("No se pudo enviar. Por favor inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const next = () => {
    if (step < totalSteps - 1 && canAdvance) setStep(step + 1);
    else if (step === totalSteps - 1 && canAdvance) submitToWebhook();
  };
  const back = () => step > 0 && setStep(step - 1);

  const stepTitle = {
    diagnostico: "Diagnóstico inicial",
    propuesta: "Solicitud de propuesta",
    alianza: "Alianza estratégica",
  }[pathId];

  const stepHints = [
    "Qué necesitas",
    "Dónde estás",
    "Rango de inversión",
    "Tus datos",
  ];

  return (
    <section className="contacto-form-wrap" id="form">
      <div className="container">
        <div className="form-card">
          <aside className="form-side">
            <div className="form-side-top">
              <span className="eyebrow">— {stepTitle}</span>
              <h3>Construyamos la conversación antes de hablar.</h3>
              <p>4 pasos. Menos de 90 segundos. La información nos permite llegar a la llamada con una propuesta real, no un pitch genérico.</p>

              <div className="form-side-steps">
                {stepHints.map((h, i) => (
                  <div
                    key={i}
                    className={`form-side-step ${i < step ? "done" : ""} ${i === step && !sent ? "current" : ""}`}
                  >
                    <div className="step-dot">{i < step || sent ? "✓" : i + 1}</div>
                    <div>{h}</div>
                  </div>
                ))}
              </div>
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
              <div className="form-step">
                <div>
                  <div className="step-label">Paso 1 · {stepHints[0]}</div>
                  <h4>¿En qué necesitas que te acompañemos?</h4>
                  <p style={{ color: "var(--text-mute)", fontSize: 14, marginTop: 8 }}>
                    Selecciona todas las líneas relevantes. Si aún no lo tienes claro, no pasa nada.
                  </p>
                </div>
                <div className="options-grid">
                  {ALCANCE_OPTIONS.map((o) => (
                    <button
                      key={o}
                      className={`opt-card ${data.alcance.includes(o) ? "selected" : ""}`}
                      onClick={() => toggleAlcance(o)}
                      type="button"
                    >
                      <span>{o}</span>
                      <span className="opt-check"></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!sent && step === 1 && (
              <div className="form-step">
                <div>
                  <div className="step-label">Paso 2 · {stepHints[1]}</div>
                  <h4>¿En qué etapa está tu empresa?</h4>
                </div>
                <div className="options-grid">
                  {ETAPA_OPTIONS.map((o) => (
                    <button
                      key={o}
                      className={`opt-card ${data.etapa === o ? "selected" : ""}`}
                      onClick={() => setEtapa(o)}
                      type="button"
                    >
                      <span>{o}</span>
                      <span className="opt-check"></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!sent && step === 2 && (
              <div className="form-step">
                <div>
                  <div className="step-label">Paso 3 · {stepHints[2]}</div>
                  <h4>¿Rango de inversión mensual?</h4>
                  <p style={{ color: "var(--text-mute)", fontSize: 14, marginTop: 8 }}>
                    Esto nos ayuda a dimensionar la propuesta. Siempre podemos ajustarla.
                  </p>
                </div>
                <div className="slider-wrap">
                  <div className="slider-value">
                    <em>€</em> {PRESUPUESTO_LABELS[data.presupuestoIdx].label}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={PRESUPUESTO_LABELS.length - 1}
                    step="1"
                    value={data.presupuestoIdx}
                    onChange={(e) => setField("presupuestoIdx", parseInt(e.target.value))}
                  />
                  <div className="slider-ticks">
                    <span>A definir</span>
                    <span>Mínimo</span>
                    <span>Medio</span>
                    <span>Avanzado</span>
                    <span>Enterprise</span>
                  </div>
                </div>
              </div>
            )}

            {!sent && step === 3 && (
              <div className="form-step">
                <div>
                  <div className="step-label">Paso 4 · {stepHints[3]}</div>
                  <h4>¿Cómo te contactamos?</h4>
                </div>
                <div className="fields-row">
                  <div className="field">
                    <label>Nombre</label>
                    <input type="text" value={data.nombre} onChange={(e) => setField("nombre", e.target.value)} placeholder="Nombre y apellidos" />
                  </div>
                  <div className="field">
                    <label>Empresa</label>
                    <input type="text" value={data.empresa} onChange={(e) => setField("empresa", e.target.value)} placeholder="Nombre comercial" />
                  </div>
                </div>
                <div className="fields-row">
                  <div className="field">
                    <label>Email *</label>
                    <input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} placeholder="tu@empresa.com" />
                  </div>
                  <div className="field">
                    <label>Teléfono</label>
                    <input type="tel" value={data.telefono} onChange={(e) => setField("telefono", e.target.value)} placeholder="+52..." />
                  </div>
                </div>
                <div className="field">
                  <label>Notas (opcional)</label>
                  <textarea value={data.notas} onChange={(e) => setField("notas", e.target.value)} placeholder="Cuéntanos el contexto: objetivo, urgencia, cualquier detalle útil…" />
                </div>
              </div>
            )}

            {sent && (
              <div className="form-success">
                <div className="success-ring">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                    <path className="success-check" d="M 12 26 L 22 35 L 38 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Mensaje enviado, {data.nombre.split(" ")[0] || "gracias"}.</h3>
                <p>Recibirás un email de confirmación en los próximos minutos. Alguien del equipo responde, como tarde, en 24 horas hábiles.</p>
                <div className="hero-ctas">
                  <a href="contacto.html" className="btn btn-primary">Explorar servicios <span className="arr">→</span></a>
                  <a href="contacto.html" className="btn btn-ghost">Volver al inicio</a>
                </div>
              </div>
            )}

            {!sent && (
              <div className="form-nav">
                <button className="btn-link" onClick={back} disabled={step === 0 || sending}>← Anterior</button>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  {sendError && (
                    <span style={{ fontSize: 13, color: "#c0392b" }}>{sendError}</span>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={next}
                    disabled={!canAdvance || sending}
                    style={{ opacity: canAdvance && !sending ? 1 : 0.4, cursor: canAdvance && !sending ? "pointer" : "default" }}
                  >
                    {sending ? "Enviando…" : step === totalSteps - 1 ? "Enviar mensaje" : "Siguiente"} <span className="arr">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
            <h2 style={{ marginTop: 16 }}>También <em>hablamos en corto</em>, si prefieres.</h2>
            <p className="lead" style={{ maxWidth: "44ch" }}>
              Para consultas puntuales, segundas opiniones o una pregunta rápida antes de formalizar cualquier colaboración.
            </p>

            <div className="info-channels">
              <a className="info-channel" href="mailto:info@medla-empresas.com">
                <div className="info-channel-icon"><IconMail /></div>
                <div className="info-channel-body">
                  <div className="info-channel-label">Email</div>
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
              <a className="info-channel" href="#">
                <div className="info-channel-icon"><IconLinkedIn /></div>
                <div className="info-channel-body">
                  <div className="info-channel-label">LinkedIn</div>
                  <div className="info-channel-val">MEDLA Empresas</div>
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
                  <circle r="26" fill="#C9A84C" opacity="0.15">
                    <animate attributeName="r" values="24;36;24" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle r="14" fill="#C9A84C" opacity="0.3" />
                  <g transform="translate(0, -6)">
                    <path d="M 0 -14 C -8 -14 -12 -8 -12 -2 C -12 6 0 18 0 18 C 0 18 12 6 12 -2 C 12 -8 8 -14 0 -14 Z" fill="#1A1A2E" />
                    <circle cy="-2" r="4" fill="#C9A84C" />
                  </g>
                </g>
              </svg>
            </div>
            <div className="map-card-body">
              <span className="lbl">Oficina</span>
              <span className="addr">Madrid, España</span>
              <span className="hours">Lun – Vie · 9:00 – 19:00 (CET)</span>
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
    q: "¿Cuánto tarda una primera respuesta?",
    a: "Menos de 24 horas hábiles. En la mayoría de casos, responde alguien del equipo el mismo día, con contexto real, no una plantilla.",
  },
  {
    q: "¿El diagnóstico inicial tiene coste?",
    a: "No. La primera videollamada de 30 minutos es gratuita. Salimos de ahí con un alcance propuesto, tiempos y rango de inversión. Luego decides.",
  },
  {
    q: "¿Atienden fuera de México?",
    a: "Sí. Trabajamos con empresas en España, LATAM y Estados Unidos, de forma totalmente remota. Para operaciones transfronterizas articulamos con corresponsales locales.",
  },
  {
    q: "¿Puedo contratar solo uno de los siete servicios?",
    a: "Sí. Cada servicio es autónomo. La ventaja de contratar más de uno es que se articulan sin solapes y compartes un único interlocutor.",
  },
  {
    q: "¿Cómo es la facturación?",
    a: "La mayoría de líneas funcionan como retainer mensual con alcance claro. Proyectos puntuales se cotizan cerrados. Sin letra pequeña ni minutos facturados.",
  },
  {
    q: "¿Firman acuerdos de confidencialidad?",
    a: "Sí, antes de cualquier conversación sensible. Envíanos el NDA de tu empresa o facilitamos el nuestro.",
  },
];

function CtFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="contacto-faq">
      <div className="container">
        <div className="section-head" style={{ textAlign: "center", margin: "0 auto" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>— Preguntas frecuentes</span>
          <h2 style={{ margin: "12px auto 0" }}>Antes de escribir, quizá <em>ya lo respondimos</em>.</h2>
        </div>
        <div className="faq-grid">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q} <span className="faq-plus">+</span>
              </button>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Footer (reused) ─────────── */
function CtFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="index.html"><img src="logo.png" alt="MEDLA Empresas" style={{height: 72, display: "block", marginBottom: 16}} /></a>
            <p>Estructura legal, tecnológica y comercial para empresas que deciden operar con criterio.</p>
          </div>
          <div>
            <h4>Servicios</h4>
            <ul>
              <li><a href="asesoria-legal.html">Asesoría legal</a></li>
              <li><a href="redes-sociales.html">Comunicación</a></li>
              <li><a href="Langin_MEDLA_Jotform/dist/index.html">Soluciones Jotform</a></li>
            </ul>
          </div>
          <div>
            <h4>Empresa</h4>
            <ul>
              <li><a href="nosotros.html">Nosotros</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="contacto.html">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:info@medla-empresas.com">info@medla-empresas.com</a></li>
              <li><a href="tel:+34641576772">+34 641 576 772</a></li>
              <li>Madrid, España</li>
            </ul>
            <a
              href="https://api.whatsapp.com/send/?phone=34641576772&text=Hola%2C+me+gustar%C3%ADa+recibir+m%C3%A1s+informaci%C3%B3n&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.85rem", padding: "10px 20px"}}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 MEDLA empresas. Todos los derechos reservados.</span>
          <div>
            <a href="#">Aviso legal</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── App ─────────── */
function ContactoApp() {
  const [path, setPath] = useState("diagnostico");
  return (
    <div className="contacto-page">
      <CtNav />
      <CtHero />
      <CtPaths active={path} onPick={setPath} />
      <CtForm pathId={path} />
      <CtInfo />
      <CtFAQ />
      <CtFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ContactoApp />);
