import MedlaAperture from "./components/medla-aperture.jsx";
import useScrollScene from "./components/use-scroll-scene.jsx";

const { useEffect, useRef, useState } = React;
function Arrow({ down = false }) {
  return <svg className={`m-arrow${down ? " is-down" : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}
function useReducedMotion() {
  const [value, setValue] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setValue(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return value;
}
function RevealController() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.revealed = "true";
      observer.unobserve(entry.target);
    }), { threshold: .08 });
    document.querySelectorAll("[data-reveal]").forEach(node => observer.observe(node));
    document.documentElement.classList.add("m-reveal-ready");
    return () => { observer.disconnect(); document.documentElement.classList.remove("m-reveal-ready"); };
  }, []);
  return null;
}
function Hero() {
  const reducedMotion = useReducedMotion();
  return <section className="m-hero" aria-labelledby="hero-title">
    <div className="m-hero__art" aria-hidden="true"><MedlaAperture reducedMotion={reducedMotion} /></div>
    <div className="m-wrap m-hero__inner">
      <div className="m-hero__copy">
        <p className="m-kicker"><span className="m-status-dot" />Consultoría empresarial + tecnología</p>
        <h1 id="hero-title">Tu negocio.<br /><span>Su siguiente</span><br /><span>versión.</span></h1>
        <p className="m-hero__lead">Hay decisiones que cambian una empresa.<br />Te ayudamos a tomarlas. Y a hacerlas realidad.</p>
        <div className="m-actions"><a className="m-button" href="contacto.html?context=proyecto">Hablemos de tu proyecto <Arrow /></a><a className="m-text-link" href="#capacidades">Explorar MEDLA <Arrow down /></a></div>
      </div>
      <div className="m-hero__art-note"><span>Criterio. Diseño. Ejecución.</span><small>Empresa / Legal / Tecnología</small></div>
      <div className="m-hero__bottom"><span>MEDLA ASESORES <i>/</i> MADRID, ES</span><a href="#capacidades">Lo que podemos hacer juntos <Arrow down /></a></div>
    </div>
  </section>;
}
const CAPABILITIES = [
  { title: "Decidir con criterio.", discipline: "EMPRESA + LEGAL", text: "Una inversión, un acuerdo entre socios, un contrato importante. Ponemos sobre la mesa los hechos, las opciones y sus implicaciones para que puedas decidir con una visión completa.", result: "Una decisión clara. Un plan para ejecutarla.", links: [["Asesoría legal", "asesoria-legal.html"], ["Sociedades", "constitucion.html"], ["Inversión y financiación", "inversiones.html"]], words: ["Contexto", "Opciones", "Decisión"], color: "gold" },
  { title: "Conectar la operación.", discipline: "PROCESOS + SISTEMAS", text: "Cuando las herramientas y los equipos dejan de entenderse, el trabajo se atasca. Rediseñamos el recorrido y conectamos datos, tareas y responsables para que cada paso tenga continuidad.", result: "Menos traspasos manuales. Más visibilidad.", links: [["Digitalización", "digitalizacion.html"], ["Automatización", "automatizacion.html"], ["Formularios y datos", "jotform.html"]], words: ["Entrada", "Proceso", "Resultado"], color: "teal" },
  { title: "Construir lo que sigue.", discipline: "TECNOLOGÍA + CRECIMIENTO", text: "Desarrollamos soluciones que trabajan dentro de tu empresa: agentes de IA, integraciones y sistemas de seguimiento comercial. Conectados a tus herramientas y probados con tu equipo.", result: "Tecnología útil. Control en tus manos.", links: [["Agentes de IA", "agentes.html"], ["Captación y CRM", "redes-sociales.html"], ["Todas las capacidades", "servicios.html"]], words: ["Necesidad", "Desarrollo", "Uso real"], color: "silver" },
];
function Capabilities() {
  const [active, setActive] = useState(1);
  return <section className="m-capabilities" id="capacidades" aria-labelledby="capabilities-title"><div className="m-wrap">
    <div className="m-section-top" data-reveal><p className="m-kicker">01 / Lo que hacemos</p><p>El criterio de una consultora.<br />La capacidad de un equipo de desarrollo.</p></div>
    <h2 className="m-display" id="capabilities-title" data-reveal>Las piezas correctas.<br /><span>Trabajando juntas.</span></h2>
    <div className="m-capability-list" data-reveal>{CAPABILITIES.map((item, i) => <article className={`m-capability${active === i ? " is-open" : ""}`} key={item.title}>
      <h3><button type="button" aria-expanded={active === i} aria-controls={`capability-${i}`} id={`capability-button-${i}`} onClick={() => setActive(active === i ? -1 : i)}><small>0{i + 1}</small><span>{item.title}</span><i aria-hidden="true">{active === i ? "−" : "+"}</i></button></h3>
      <div className="m-capability__body" id={`capability-${i}`} role="region" aria-labelledby={`capability-button-${i}`} hidden={active !== i}>
        <div className="m-capability__copy"><span className="m-kicker">{item.discipline}</span><p>{item.text}</p><div className="m-capability__links">{item.links.map(([name, href]) => <a key={href} href={href}>{name}<Arrow /></a>)}</div></div>
        <div className={`m-capability__diagram is-${item.color}`}><div className="m-capability__line" aria-hidden="true"><span /><span /><span /></div><div className="m-capability__words">{item.words.map((word, index) => <span key={word}><small>0{index+1}</small>{word}</span>)}</div><p>{item.result}</p></div>
      </div>
    </article>)}</div>
  </div></section>;
}
const EXAMPLES = [
  { label: "Una factura", href: "automatizacion.html", title: "Del correo al registro.", intro: "La factura llega, se comprueba, se aprueba y se registra. Si algo no cuadra, el flujo pide ayuda a la persona adecuada.", steps: ["Recepción", "Validación", "Aprobación", "Registro"], notes: ["El documento entra una sola vez.", "Los datos se contrastan con el pedido.", "El responsable valida el importe.", "El resultado queda registrado en el sistema."], exception: "Falta el pedido. Compras recibe el caso para revisarlo.", result: "Factura registrada. Documento y aprobación unidos.", review: "Compras", data: "FAC-0248", caption: "Automatización con excepciones previstas" },
  { label: "Un nuevo cliente", href: "redes-sociales.html", title: "De la consulta a la próxima acción.", intro: "Cada oportunidad entra con contexto, llega a un responsable y tiene un siguiente paso. El equipo puede continuar la conversación sin perder el hilo.", steps: ["Consulta", "Contexto", "Asignación", "Seguimiento"], notes: ["La solicitud llega desde el formulario.", "Se reúne el contexto de la oportunidad.", "Un responsable recibe el caso.", "La próxima acción queda en el CRM."], exception: "Falta el alcance. El equipo comercial solicita contexto.", result: "Oportunidad asignada. Siguiente acción preparada.", review: "Comercial", data: "OP-0086", caption: "Captación conectada al trabajo comercial" },
  { label: "Una consulta interna", href: "agentes.html", title: "Del documento a una respuesta útil.", intro: "El agente consulta las fuentes permitidas y prepara una respuesta con referencias. Cuando no encuentra una base suficiente, deriva la consulta.", steps: ["Pregunta", "Fuentes", "Revisión", "Respuesta"], notes: ["La pregunta entra con el contexto del usuario.", "Se consultan las fuentes autorizadas.", "Se comprueba que la respuesta tenga soporte.", "La respuesta incluye sus referencias."], exception: "La fuente no es suficiente. Un especialista revisa la consulta.", result: "Respuesta preparada con referencias y registro.", review: "Especialista", data: "IA-0031", caption: "IA con fuentes, permisos y revisión" },
];
function StepIcon({ index, done }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">{done ? <path d="m8 16 5 5 11-11" /> : index === 0 ? <path d="M6 9h20v17H6zM12 6h8M12 14h8M12 19h5" /> : index === 1 ? <path d="m16 4 12 12-12 12L4 16zM12 16l3 3 5-6" /> : index === 2 ? <><circle cx="16" cy="10" r="5"/><path d="M6 27v-3c0-7 20-7 20 0v3" /></> : <path d="M7 5h18v22H7zM11 11h10M11 16h10M11 21h5" />}</svg>;
}
function ProcessLab() {
  const [selected, setSelected] = useState(0);
  const [exception, setException] = useState(false);
  const flowRef = useRef(null);
  const reduced = useReducedMotion();
  const { phase: step, selectPhase } = useScrollScene({ ref: flowRef, count: 4, reducedMotion: reduced, resetKey: selected });
  const example = EXAMPLES[selected], finished = step === 3;
  const message = finished ? `${exception ? "La persona responsable completa la revisión. " : ""}${example.result}` : exception && step === 2 ? example.exception : example.notes[step];

  return <section className="m-lab" id="como-funciona" aria-labelledby="lab-title"><div className="m-wrap">
    <div className="m-section-top" data-reveal><p className="m-kicker">02 / De la idea a la operación</p><span className="m-lab__tag"><i />El trabajo, conectado</span></div>
    <div className="m-lab__intro" data-reveal><h2 className="m-display" id="lab-title">Se entiende mejor<br /><span>cuando lo ves funcionar.</span></h2><p>Solicitudes, decisiones y responsables.<br />Así se conecta el trabajo de un equipo.</p></div>
    <div className="m-lab__cases" aria-label="Elige el proceso de ejemplo">{EXAMPLES.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><small>0{index+1}</small>{item.label}<Arrow /></button>)}</div>
    <div className="m-lab__stage">
      <div className="m-lab__story"><span className="m-kicker">{example.data} / EJEMPLO ILUSTRATIVO</span><h3>{example.title}</h3><p>{example.intro}</p><a className="m-text-link" href={example.href}>Ver cómo lo desarrollamos <Arrow /></a></div>
      <div ref={flowRef} className={`m-flow${exception ? " has-exception" : ""}`} data-phase={step} style={{ "--flow-step": step }}>
        <div className="m-flow__rail" aria-hidden="true"><i /></div>
        <div className="m-flow__nodes" role="group" aria-label="Fases del proceso">{example.steps.map((label, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => selectPhase(index)} className={`m-flow__node${step === index ? " is-current" : ""}${step > index || finished ? " is-done" : ""}`}><span className="m-flow__number">0{index+1}</span><span className="m-flow__icon"><StepIcon index={index} done={step > index || finished} /></span><strong>{label}</strong><small>{step > index || finished ? "Completado" : step === index ? exception && index === 2 ? "Revisión humana" : "En curso" : "Por resolver"}</small></button>)}</div>
        <div className={`m-flow__review${exception && step >= 2 ? " is-active" : ""}`}><span className="m-flow__branch" aria-hidden="true"/><span><i />{example.review}</span><small>{exception ? "La excepción tiene responsable" : "Intervención si hace falta"}</small></div>
      </div>
      <div className="m-lab__readout"><span className={finished ? "is-finished" : ""}>{finished ? "✓" : `0${step+1}`}</span><p key={`${selected}-${step}-${exception}`}>{message}</p></div>
      <div className="m-lab__controls"><button className="m-exception-switch" type="button" role="switch" aria-checked={exception} onClick={() => { setException(value => !value); selectPhase(2); }}><span className="m-switch" aria-hidden="true"><i /></span>¿Y si falta información?</button></div>
    </div>
    <div className="m-lab__foot"><span>{example.caption}</span><span>Ejemplo explicativo. No utiliza datos de clientes.</span></div>
  </div></section>;
}
function WorkingTogether() {
  return <section className="m-method" id="metodo" aria-labelledby="method-title"><div className="m-wrap m-method__layout">
    <div className="m-method__copy" data-reveal><p className="m-kicker">03 / De principio a fin</p><h2 className="m-display" id="method-title">Nos implicamos.<br /><span>Hasta la entrega.</span></h2><p>Trabajamos contigo para entender qué necesitas, construir la solución y dejarla en manos de tu equipo.</p><a className="m-text-link" href="nosotros.html">Conoce nuestra forma de trabajar <Arrow /></a></div>
    <ol className="m-method__steps" data-reveal>{[
      ["Entender antes de proponer.", "Escuchamos al equipo y revisamos el punto de partida. Acordamos qué hay que resolver, qué queda fuera y cómo sabremos que está resuelto."],
      ["Construir contigo.", "Trabajamos por entregas que puedes revisar. Las decisiones importantes, los responsables y los cambios quedan claros durante el proyecto."],
      ["Dejarlo en tus manos.", "Entregamos la solución junto con su documentación y criterios de uso. Definimos quién la mantiene y qué seguimiento necesita."],
    ].map(([title,text],index) => <li key={title}><span>0{index+1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
  </div></section>;
}
function App() {
  return <><RevealController /><window.MedlaSiteHeader current="home" /><main id="contenido"><Hero /><Capabilities /><ProcessLab /><WorkingTogether /></main><window.MedlaSiteFooter current="home" /></>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
