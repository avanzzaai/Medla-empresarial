// MEDLA — shared global navigation and site map
const { useEffect, useRef, useState } = React;

const MEDLA_NAV = [
  { id: "services", label: "Qué hacemos", href: "servicios.html" },
  { id: "about", label: "MEDLA", href: "nosotros.html" },
  { id: "insights", label: "Ideas", href: "blog.html" },
];

const MEDLA_MAP = [
  {
    number: "01",
    title: "Operaciones y sistemas",
    text: "Procesos, datos y herramientas reunidos en una operación visible y mantenible.",
    links: [
      ["Digitalización", "digitalizacion.html"],
      ["Automatización", "automatizacion.html"],
      ["Agentes de IA", "agentes.html"],
      ["Formularios y datos", "jotform.html"],
    ],
  },
  {
    number: "02",
    title: "Decisión y estructura",
    text: "Contratos, gobierno y escenarios preparados para que dirección pueda comparar y aprobar.",
    links: [
      ["Asesoría legal", "asesoria-legal.html"],
      ["Constitución de sociedades", "constitucion.html"],
      ["Inversión y financiación", "inversiones.html"],
    ],
  },
  {
    number: "03",
    title: "Crecimiento y CRM",
    text: "Posicionamiento, captación y seguimiento conectados a una próxima acción comercial.",
    links: [
      ["Posicionamiento, captación y CRM", "redes-sociales.html"],
      ["Mapa de servicios", "servicios.html"],
      ["Plantear un proyecto", "contacto.html?path=diagnostico"],
    ],
  },
  {
    number: "04",
    title: "Preparar el proyecto",
    text: "Método, notas prácticas y contexto necesario para iniciar una conversación útil.",
    links: [
      ["Cómo trabajamos", "nosotros.html"],
      ["Notas de decisión", "blog.html"],
      ["Privacidad", "privacidad.html"],
    ],
  },
];

const MEDLA_FOOTER_GROUPS = [
  {
    title: "Operaciones y sistemas",
    links: [
      ["Digitalización", "digitalizacion.html"],
      ["Automatización", "automatizacion.html"],
      ["Agentes de IA", "agentes.html"],
      ["Formularios y datos", "jotform.html"],
    ],
  },
  {
    title: "Decisión y estructura",
    links: [
      ["Asesoría legal", "asesoria-legal.html"],
      ["Constitución de sociedades", "constitucion.html"],
      ["Inversión y financiación", "inversiones.html"],
    ],
  },
  {
    title: "MEDLA",
    links: [
      ["Posicionamiento, captación y CRM", "redes-sociales.html"],
      ["Cómo trabajamos", "nosotros.html"],
      ["Notas de decisión", "blog.html"],
      ["Plantear un proyecto", "contacto.html?path=diagnostico"],
      ["Privacidad", "privacidad.html"],
    ],
  },
];

function ShellArrow() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

function ShellMenuIcon({ close = false }) {
  return <span className={`medla-shell-icon${close ? " is-close" : ""}`} aria-hidden="true"><i /><i /></span>;
}

function MedlaSiteHeader({ current = "", context = "", ctaHref = "" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const resolvedCta = ctaHref || (current === "contact"
    ? "#form"
    : context
      ? `contacto.html?context=${encodeURIComponent(context)}`
      : "contacto.html");

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const background = [...document.querySelectorAll("main, footer")]
      .filter((element) => !element.closest("#medla-site-map"));
    const panel = panelRef.current;
    const focusables = panel ? [...panel.querySelectorAll('a[href], button:not([disabled])')] : [];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const initialFocus = panel?.querySelector(".medla-site-map__head button") || first;

    document.body.style.overflow = "hidden";
    background.forEach((element) => element.setAttribute("inert", ""));
    if (panel) panel.scrollTop = 0;
    const focusFrame = window.requestAnimationFrame(() => initialFocus?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusables.length) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      background.forEach((element) => element.removeAttribute("inert"));
      triggerRef.current?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return <>
    <header className={`medla-site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="medla-site-header__inner">
        <a className="medla-site-brand" href="index.html" aria-label="MEDLA Empresas, inicio">
          <img src="logo.png" alt="" />
          <span>Consultoría<br />empresarial</span>
        </a>

        <nav className="medla-site-links" aria-label="Navegación principal">
          {MEDLA_NAV.map((item) => <a key={item.id} href={item.href} aria-current={current === item.id ? "page" : undefined}>{item.label}</a>)}
        </nav>

        <div className="medla-site-actions">
          <a className="medla-site-cta" href={resolvedCta} aria-current={current === "contact" ? "page" : undefined}>Hablemos <ShellArrow /></a>
          <button ref={triggerRef} className="medla-site-map-trigger" type="button" aria-label={open ? "Cerrar mapa del sitio" : "Abrir mapa del sitio"} aria-expanded={open} aria-controls="medla-site-map" onClick={() => setOpen(true)}>
            <span>Menú</span><ShellMenuIcon />
          </button>
        </div>
      </div>
    </header>

    <div id="medla-site-map" className={`medla-site-map${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Mapa de MEDLA" aria-hidden={!open} inert={open ? undefined : ""}>
      <button className="medla-site-map__backdrop" type="button" aria-label="Cerrar mapa" onClick={close} />
      <div className="medla-site-map__panel" ref={panelRef}>
        <header className="medla-site-map__head">
          <a className="medla-site-brand" href="index.html" onClick={close} aria-label="MEDLA Empresas, inicio"><img src="logo.png" alt="" /><span>Consultoría<br />empresarial</span></a>
          <div><span>EXPLORA MEDLA</span><button type="button" onClick={close}>Cerrar <ShellMenuIcon close /></button></div>
        </header>

        <div className="medla-site-map__body">
          <section className="medla-site-map__intro">
            <p>Negocio. Derecho. Tecnología.</p>
            <h2>Tu próximo proyecto,<br /><em>por aquí.</em></h2>
            <span>Cuéntanos qué quieres cambiar en tu empresa. Empezamos por entenderlo.</span>
            <a href={resolvedCta} onClick={close}>Hablemos <ShellArrow /></a>
          </section>

          <nav className="medla-site-map__routes" aria-label="Áreas y páginas de MEDLA">
            {MEDLA_MAP.map((group) => <section key={group.number}>
              <div><span>{group.number}</span><h3>{group.title}</h3></div>
              <p>{group.text}</p>
              <div>{group.links.map(([label, href]) => <a key={href} href={href} onClick={close}>{label}<ShellArrow /></a>)}</div>
            </section>)}
          </nav>
        </div>

        <footer className="medla-site-map__foot"><span>Madrid · España</span><a href="mailto:info@medla-empresas.com">info@medla-empresas.com</a><span>Legal · Operaciones · Tecnología · Crecimiento</span></footer>
      </div>
    </div>
  </>;
}

function MedlaSiteFooter({ current = "", context = "" }) {
  const ctaHref = current === "contact"
    ? "#form"
    : context
      ? `contacto.html?context=${encodeURIComponent(context)}`
      : "contacto.html?path=diagnostico";

  return <footer className="medla-site-footer">
    <div className="medla-site-footer__shell">
      <div className="medla-site-footer__opening">
        <div className="medla-site-footer__conversation">
          <span>Hablemos de tu empresa</span>
          <h2>Lo siguiente empieza<br /> con <em>una conversación.</em></h2>
          <p>Cuéntanos dónde estás y qué necesitas resolver.</p>
          <a href={ctaHref}>Empezar una conversación <ShellArrow /></a>
        </div>
        <div className="medla-site-footer__identity">
          <a href="index.html" aria-label="MEDLA Empresas, inicio"><img src="logo.png" alt="" /></a>
          <p>Consultoría empresarial.<br />De la primera decisión<br />a la puesta en marcha.</p>
        </div>
      </div>

      <nav className="medla-site-footer__routes" aria-label="Mapa del sitio">
        {MEDLA_FOOTER_GROUPS.map((group, groupIndex) => <section key={group.title}>
          <header><span>0{groupIndex + 1}</span><h3>{group.title}</h3></header>
          <div>{group.links.map(([label, href]) => <a key={href} href={href}>{label}<ShellArrow /></a>)}</div>
        </section>)}
      </nav>

      <div className="medla-site-footer__base">
        <span>© {new Date().getFullYear()} MEDLA ASESORES, S.L.</span>
        <a href="mailto:info@medla-empresas.com">info@medla-empresas.com</a>
        <a href="tel:+34641576772">+34 641 576 772</a>
        <span>Madrid · España</span>
      </div>
    </div>
  </footer>;
}

window.MedlaSiteHeader = MedlaSiteHeader;
window.MedlaSiteFooter = MedlaSiteFooter;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-medla-header]").forEach((root) => {
    ReactDOM.createRoot(root).render(<MedlaSiteHeader current={root.dataset.current || ""} context={root.dataset.context || ""} ctaHref={root.dataset.ctaHref || ""} />);
  });
  document.querySelectorAll("[data-medla-footer]").forEach((root) => {
    ReactDOM.createRoot(root).render(<MedlaSiteFooter current={root.dataset.current || ""} context={root.dataset.context || ""} />);
  });
});
