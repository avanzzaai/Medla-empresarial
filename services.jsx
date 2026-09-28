import ServiceMoment from "./components/service-moment.jsx";
import useScrollScene from "./components/use-scroll-scene.jsx";

const { useEffect, useRef, useState } = React;

const CAPABILITY_FAMILIES = [
  {
    id: "operations", number: "01", label: "Tecnología y operaciones",
    description: "Herramientas conectadas para trabajar con menos tareas manuales y una misma información.",
    services: [
      { name: "ERP", text: "Organizamos compras, facturación y operaciones en un sistema de gestión conectado a las herramientas de tu empresa.", href: "digitalizacion.html?servicio=erp#alcance" },
      { name: "Automatizaciones", text: "Conectamos aplicaciones y automatizamos tareas, avisos y aprobaciones, con reglas claras y revisión de excepciones.", href: "automatizacion.html" },
      { name: "Desarrollo a medida", text: "Desarrollamos aplicaciones, portales e integraciones adaptados a tu operativa cuando las herramientas existentes no llegan.", href: "digitalizacion.html?servicio=desarrollo#alcance" },
      { name: "Jotform", text: "Creamos formularios y portales con validaciones, lógica, aprobaciones e integraciones para que cada respuesta active el trabajo necesario.", href: "jotform.html" },
    ],
    lab: { mode: "flow", project: "Una solicitud de alta de proveedor llega por correo y debe pasar al ERP.", capabilities: ["Datos del proveedor", "Regla de aprobación", "Conexión con el ERP"], result: "El proveedor queda dado de alta y la aprobación permanece en el historial." },
  },
  {
    id: "growth", number: "02", label: "Desarrollo comercial",
    description: "Una propuesta clara, un proceso de venta ordenado y seguimiento de cada oportunidad.",
    services: [
      { name: "CRM", text: "Implantamos o ajustamos tu CRM para reunir contactos, ventas y seguimiento: quién atiende cada oportunidad y cuál es la próxima acción.", href: "redes-sociales.html?servicio=crm#alcance" },
      { name: "Desarrollo comercial", text: "Trabajamos tu oferta, el cliente al que te diriges, la captación y el proceso comercial, desde el primer interés hasta el seguimiento.", href: "redes-sociales.html?servicio=comercial#alcance" },
    ],
    lab: { mode: "growth", project: "Una persona se interesa por tu propuesta. Su información debe llegar al equipo comercial.", capabilities: ["Propuesta y captación", "Datos de la oportunidad", "Seguimiento en CRM"], result: "La oportunidad queda en el CRM con contexto, responsable y siguiente acción." },
  },
  {
    id: "decision", number: "03", label: "Empresa, legal y fiscal",
    description: "Acompañamiento para establecer la empresa, revisar su situación y documentar las decisiones importantes.",
    services: [
      { name: "Auditoría y asesoría fiscal", text: "Revisamos información contable y fiscal, identificamos incidencias y ordenamos obligaciones, documentación y próximos pasos.", href: "asesoria-fiscal.html" },
      { name: "Establecimiento de empresas", text: "Coordinamos la constitución, los acuerdos entre socios, la documentación y los trámites necesarios para empezar a operar.", href: "constitucion.html" },
      { name: "Legal y contratos", text: "Preparamos y revisamos contratos, acuerdos y documentación societaria para que cada decisión tenga el soporte adecuado.", href: "asesoria-legal.html" },
      { name: "Preparación de financiación", text: "Organizamos datos, supuestos y escenarios para valorar una inversión o preparar la documentación de una financiación.", href: "inversiones.html" },
    ],
    lab: { mode: "document", project: "Un contrato necesita revisión antes de comprometer a tu empresa.", capabilities: ["Alcance y obligaciones", "Responsables y plazos", "Comentarios resueltos"], result: "El acuerdo queda revisado y preparado para la siguiente aprobación o firma." },
  },
  {
    id: "ai", number: "04", label: "IA aplicada",
    description: "Asistentes conectados a tus documentos y herramientas, con límites y revisión humana.",
    services: [
      { name: "Agentes de inteligencia artificial", text: "Diseñamos agentes para consultar información y preparar o ejecutar tareas concretas, con fuentes autorizadas, permisos y evaluación.", href: "agentes.html" },
    ],
    lab: { mode: "agent", project: "El equipo necesita una respuesta que está repartida entre documentos y sistemas.", capabilities: ["Fuentes autorizadas", "Permisos definidos", "Respuesta con referencias"], result: "El equipo recibe una respuesta con sus fuentes y sabe qué necesita revisión humana." },
  },
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

function CapabilityMap() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const family = CAPABILITY_FAMILIES[active];
  const refs = useRef([]);
  const labRef = useRef(null);
  const { phase: stage, selectPhase } = useScrollScene({ ref: labRef, count: 4, reducedMotion, resetKey: active });
  const stages = ["Entender", "Preparar", "Validar", "Entregar"];
  const caption = [family.lab.project, family.lab.capabilities.join(" · "), "Revisamos el resultado con la persona responsable antes de avanzar.", family.lab.result][stage];

  const chooseFamily = (index) => {
    setActive(index);
    selectPhase(0);
  };

  return <div ref={labRef} className="svc-lab" data-phase={stage} aria-label="Explorar cómo trabaja cada área de MEDLA">
    <header className="svc-lab__head">
      <div><span>DEL PROBLEMA A LA ENTREGA</span></div>
      <span className="svc-lab__phase-index">0{stage + 1} / 0{stages.length}</span>
    </header>
    <div className="svc-lab__routes" role="tablist" aria-label="Familias de capacidades">
      {CAPABILITY_FAMILIES.map((item,index) => <button key={item.id} ref={(node) => { refs.current[index] = node; }} type="button" role="tab" id={`map-tab-${item.id}`} aria-controls="map-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => chooseFamily(index)} onKeyDown={(event) => {
        if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? CAPABILITY_FAMILIES.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + CAPABILITY_FAMILIES.length) % CAPABILITY_FAMILIES.length;
        chooseFamily(next); refs.current[next]?.focus({ preventScroll: true });
      }}><span>{item.number}</span><b>{item.label}</b><i /></button>)}
    </div>
    <article id="map-panel" className="svc-lab__panel" role="tabpanel" aria-labelledby={`map-tab-${family.id}`} key={family.id}>
      <ServiceMoment mode={family.lab.mode} stage={stage} reducedMotion={reducedMotion} />
      <div className="svc-lab__caption" key={stage}><span>0{stage + 1} / {stages[stage]}</span><p>{caption}</p></div>
    </article>
    <footer className="svc-lab__timeline">
      <span className="svc-lab__status">Ejemplo ilustrativo</span>
      <div role="group" aria-label="Explorar las fases del laboratorio">{stages.map((label,index) => <button key={label} type="button" className={`${index === stage ? "is-active" : ""}${index < stage ? " is-complete" : ""}`} aria-pressed={index === stage} onClick={() => selectPhase(index)}><span>0{index+1}</span>{label}<i /></button>)}</div>
    </footer>
  </div>;
}

function Hero() {
  return <header className="svc-hero">
    <div className="svc-shell svc-hero__layout">
      <div className="svc-hero__copy">
        <div className="svc-overline"><span>Qué podemos hacer por tu empresa</span><small>04 áreas</small></div>
        <h1>Tecnología y asesoría <em>para tu empresa.</em></h1>
        <p>Implantamos CRM y ERP, automatizamos procesos y te acompañamos en el desarrollo comercial, la gestión fiscal y la creación de empresas.</p>
        <div className="svc-actions"><a className="svc-button svc-button--gold" href="#catalogo">Ver todos los servicios <Arrow /></a><a className="svc-text-link" href="contacto.html?context=proyecto">Cuéntanos qué necesitas <Arrow /></a></div>
      </div>
      <CapabilityMap />
    </div>
  </header>;
}

function ServiceCatalog() {
  return <section className="svc-catalog" id="catalogo" aria-labelledby="catalog-title">
    <span id="servicios" className="svc-catalog__anchor" aria-hidden="true" />
    <span id="orientador" className="svc-catalog__anchor" aria-hidden="true" />
    <div className="svc-shell">
      <div className="svc-section-head" data-svc-reveal>
        <span>01 / NUESTROS SERVICIOS</span>
        <h2 id="catalog-title">Qué necesitas.<br /><em>Qué podemos hacer.</em></h2>
        <p>Puedes contratar un servicio concreto o combinar varios. En cada página encontrarás qué incluye y cómo lo trabajamos.</p>
      </div>
      <div className="svc-catalog__families">
        {CAPABILITY_FAMILIES.map((family) => <section className="svc-catalog__family" id={family.id} key={family.id} aria-labelledby={`catalog-${family.id}`}>
          <header className="svc-catalog__family-head" data-svc-reveal>
            <span>{family.number}</span>
            <h3 id={`catalog-${family.id}`}>{family.label}</h3>
            <p>{family.description}</p>
          </header>
          <ul className="svc-catalog__services">
            {family.services.map((service) => <li key={service.name}>
              <a href={service.href} aria-label={`${service.name}: ver el servicio`}>
                <h4>{service.name}</h4>
                <p>{service.text}</p>
                <Arrow diagonal />
              </a>
            </li>)}
          </ul>
        </section>)}
      </div>
    </div>
  </section>;
}

function MandatePrinciple() {
  return <section className="svc-principle" aria-labelledby="principle-title">
    <div className="svc-shell svc-principle__layout">
      <div data-svc-reveal><span>02 / CÓMO EMPEZAMOS</span><h2 id="principle-title">Un servicio concreto.<br /><em>O un proyecto que los conecta.</em></h2></div>
      <div data-svc-reveal><p>Nos cuentas qué necesitas y revisamos el punto de partida. Antes de empezar, recibirás una propuesta con el trabajo incluido, los responsables, el calendario y los honorarios.</p><strong>Un alcance claro antes de empezar.</strong><a href="contacto.html?context=proyecto">Hablemos de tu empresa <Arrow /></a></div>
    </div>
  </section>;
}

function ServicesApp() {
  useReveal();
  return <div className="svc-page"><window.MedlaSiteHeader current="services" /><main><Hero /><ServiceCatalog /><MandatePrinciple /></main><window.MedlaSiteFooter current="services" /></div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<ServicesApp />);
