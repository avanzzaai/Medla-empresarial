import ServiceJourney from "./components/service-journey.jsx";
import { SERVICE_JOURNEYS } from "./components/service-journeys.js";

const { useEffect, useState } = React;

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
  },
  {
    id: "growth", number: "02", label: "Desarrollo comercial",
    description: "Una propuesta clara, un proceso de venta ordenado y seguimiento de cada oportunidad.",
    services: [
      { name: "CRM", text: "Implantamos o ajustamos tu CRM para reunir contactos, ventas y seguimiento: quién atiende cada oportunidad y cuál es la próxima acción.", href: "redes-sociales.html?servicio=crm#alcance" },
      { name: "Desarrollo comercial", text: "Trabajamos tu oferta, el cliente al que te diriges, la captación y el proceso comercial, desde el primer interés hasta el seguimiento.", href: "redes-sociales.html?servicio=comercial#alcance" },
    ],
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
  },
  {
    id: "ai", number: "04", label: "IA aplicada",
    description: "Asistentes conectados a tus documentos y herramientas, con límites y revisión humana.",
    services: [
      { name: "Agentes de inteligencia artificial", text: "Diseñamos agentes para consultar información y preparar o ejecutar tareas concretas, con fuentes autorizadas, permisos y evaluación.", href: "agentes.html" },
    ],
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

function Hero({ selection, onSelect }) {
  return <header className="svc-hero">
    <div className="svc-shell svc-hero__layout">
      <div className="svc-hero__copy">
        <div className="svc-overline"><span>Qué podemos hacer por tu empresa</span><small>04 áreas</small></div>
        <h1>Tecnología y asesoría <em>para tu empresa.</em></h1>
        <p>Implantamos CRM y ERP, automatizamos procesos y te acompañamos en el desarrollo comercial, la gestión fiscal y la creación de empresas.</p>
        <div className="svc-actions"><a className="svc-button svc-button--gold" href="#catalogo">Ver todos los servicios <Arrow /></a><a className="svc-text-link" href="contacto.html?context=proyecto">Cuéntanos qué necesitas <Arrow /></a></div>
      </div>
      <ServiceJourney selectedId={selection.id} selectionKey={selection.key} focusRequested={selection.focus} onSelect={onSelect} />
    </div>
  </header>;
}

function ServiceCatalog({ selectedId, onExplore }) {
  return <section className="svc-catalog" id="catalogo" aria-labelledby="catalog-title">
    <span id="servicios" className="svc-catalog__anchor" aria-hidden="true" />
    <span id="orientador" className="svc-catalog__anchor" aria-hidden="true" />
    <div className="svc-shell">
      <div className="svc-section-head" data-svc-reveal>
        <span>01 / NUESTROS SERVICIOS</span>
        <h2 id="catalog-title">Qué necesitas.<br /><em>Qué podemos hacer.</em></h2>
        <p>Puedes contratar un servicio concreto o combinar varios. Explora un ejemplo de nuestro trabajo o entra en el detalle de cada servicio.</p>
      </div>
      <div className="svc-catalog__families">
        {CAPABILITY_FAMILIES.map((family) => <section className="svc-catalog__family" id={family.id} key={family.id} aria-labelledby={`catalog-${family.id}`}>
          <header className="svc-catalog__family-head" data-svc-reveal>
            <span>{family.number}</span>
            <h3 id={`catalog-${family.id}`}>{family.label}</h3>
            <p>{family.description}</p>
          </header>
          <ul className="svc-catalog__services">
            {family.services.map((service) => {
              const journey = SERVICE_JOURNEYS.find(item => item.href === service.href);
              return <li key={service.name} data-selected={selectedId === journey?.id}>
              <a href={service.href} aria-label={`${service.name}: ver el servicio`}>
                <h4>{service.name}</h4>
                <p>{service.text}</p>
                <Arrow diagonal />
              </a>
              {journey && <button className="svc-catalog__preview" type="button" onClick={() => onExplore(journey.id)} aria-label={`Ver ejemplo de ${service.name}`}>Ver un ejemplo <span aria-hidden="true">↗</span></button>}
            </li>;
            })}
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
  const [selection, setSelection] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get("ejemplo");
    return { id: SERVICE_JOURNEYS.some(item => item.id === requested) ? requested : "automatizacion", key: 0, focus: false };
  });
  const chooseJourney = (id, focus = false) => setSelection(current => ({ id, key: current.key + 1, focus }));
  useReveal();
  return <div className="svc-page"><window.MedlaSiteHeader current="services" /><main><Hero selection={selection} onSelect={id => chooseJourney(id)} /><ServiceCatalog selectedId={selection.id} onExplore={id => chooseJourney(id, true)} /><MandatePrinciple /></main><window.MedlaSiteFooter current="services" /></div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<ServicesApp />);
