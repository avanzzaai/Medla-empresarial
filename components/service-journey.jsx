import ServiceMoment from "./service-moment.jsx";
import useScrollScene from "./use-scroll-scene.jsx";
import { SERVICE_JOURNEYS } from "./service-journeys.js";
import { journeyView } from "./service-journey-state.js";

const GROUPS = { operations: "Tecnología y operaciones", growth: "Desarrollo comercial", decision: "Empresa, legal y fiscal", ai: "IA aplicada" };
const { useEffect, useRef, useState } = React;

function ReviewMoment() {
  return <div className="medla-moment sj__review"><svg viewBox="0 0 650 450" role="img" aria-label="Incidencia detectada. Una persona revisa el caso antes de permitir la entrega.">
    <g aria-hidden="true" fontFamily="Manrope, sans-serif">
      <path className="sj__review-path" d="M122 215h119" fill="none" stroke="#c5ab70" strokeWidth="1.5" />
      <path d="M409 215h119" fill="none" stroke="#455452" strokeWidth="1.5" strokeDasharray="4 7" />
      <circle cx="96" cy="215" r="26" fill="#182527" stroke="#718983" />
      <path d="m87 215 6 6 13-13" fill="none" stroke="#83cec8" strokeWidth="1.5" />
      <circle className="sj__review-ring" cx="325" cy="215" r="84" fill="none" stroke="#c5ab70" strokeOpacity=".22" />
      <circle cx="325" cy="215" r="69" fill="#20251f" stroke="#c5ab70" />
      <circle cx="325" cy="199" r="11" fill="none" stroke="#e0d1aa" strokeWidth="1.6" />
      <path d="M304 238v-6a21 21 0 0 1 42 0v6" fill="none" stroke="#e0d1aa" strokeWidth="1.6" />
      <circle cx="554" cy="215" r="26" fill="#10191b" stroke="#455452" />
      <path d="M549 209v12m10-12v12" stroke="#8d9b9b" strokeWidth="1.8" />
      <text x="325" y="110" textAnchor="middle" fill="#dfc996" fontSize="12" letterSpacing="2">ANTES DE CONTINUAR</text>
      <text x="96" y="280" textAnchor="middle" fill="#d3ddda" fontSize="16">Punto detectado</text>
      <text x="325" y="329" textAnchor="middle" fill="#e0d1aa" fontSize="19">Revisión humana</text>
      <text x="325" y="354" textAnchor="middle" fill="#a4b2b2" fontSize="13">Comprobar · corregir · volver a validar</text>
      <text x="554" y="280" textAnchor="middle" fill="#a4b2b2" fontSize="16">Entrega pendiente</text>
    </g>
  </svg></div>;
}

export default function ServiceJourney({ selectedId, selectionKey, onSelect, focusRequested = false }) {
  const journey = SERVICE_JOURNEYS.find(item => item.id === selectedId) || SERVICE_JOURNEYS[0];
  const sceneRef = useRef(null), rootRef = useRef(null), titleRef = useRef(null), tabRefs = useRef([]), resolutionRef = useRef(null);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [issue, setIssue] = useState("none");
  const [expanded, setExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const { phase, selectPhase } = useScrollScene({ ref: sceneRef, count: 4, reducedMotion: reduced, resetKey: selectionKey });
  const view = journeyView(journey, phase, issue);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setIssue("none"); setExpanded(false); setAnnouncement("");
    if (!focusRequested) return undefined;
    const frame = requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" });
      titleRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectionKey]);

  useEffect(() => {
    if (issue !== "resolved") return undefined;
    const frame = requestAnimationFrame(() => resolutionRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [issue, selectionKey]);

  function selectStep(index) {
    selectPhase(index);
    if (issue === "open" && index === 3) setAnnouncement("Antes de entregar, hay que resolver la incidencia del ejemplo.");
    else setAnnouncement("");
  }
  function move(event, index) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const available = issue === "open" ? 3 : 4;
    const next = event.key === "Home" ? 0 : event.key === "End" ? available - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + available) % available;
    selectStep(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  }
  function exploreIssue() {
    if (issue !== "none") { setIssue("none"); setAnnouncement("Recorrido habitual del ejemplo."); return; }
    setIssue("open"); selectPhase(2);
    setAnnouncement(`Incidencia del ejemplo: ${journey.exception.trigger}`);
  }
  function resolveIssue() {
    setIssue("resolved"); selectPhase(3);
    setAnnouncement(`Resolución ilustrativa: ${journey.exception.resolution}`);
  }

  return <section id="recorrido" ref={rootRef} className="sj" data-phase={view.stage} data-issue={issue} aria-labelledby="journey-title" style={{ "--journey-progress": `${view.stage / 3 * 100}%` }}>
    <div className="sj__topline"><span>Del problema a la entrega</span><span>0{view.stage + 1} / 04</span></div>
    <label className="sj__picker" htmlFor="journey-service"><span>Explora un servicio</span><select id="journey-service" value={journey.id} onChange={event => onSelect(event.target.value)}>{Object.entries(GROUPS).map(([id,label]) => <optgroup key={id} label={label}>{SERVICE_JOURNEYS.filter(item => item.group === id).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</optgroup>)}</select></label>
    <div className="sj__intro" key={journey.id}><p className="sj__eyebrow">Caso ilustrativo · {journey.label}</p><h2 id="journey-title" ref={titleRef} tabIndex={-1}>{journey.caseTitle}</h2><p>{journey.summary}</p></div>
    <div className="sj__visual" ref={sceneRef}>
      {issue === "open" ? <ReviewMoment /> : <ServiceMoment mode={journey.mode} stage={view.stage} reducedMotion={reduced} />}
      {issue !== "none" && <span className={`sj__signal${issue === "resolved" ? " is-resolved" : ""}`}><i aria-hidden="true" />{issue === "resolved" ? "Revisión completada en el ejemplo" : "Requiere revisión humana"}</span>}
    </div>
    <div className="sj__phases" role="tablist" aria-label="Fases del servicio">{journey.stages.map((step,index) => <button key={step.title} id={`journey-phase-${index}`} ref={node => {tabRefs.current[index] = node;}} type="button" role="tab" aria-selected={view.stage === index} aria-controls="journey-detail" aria-disabled={issue === "open" && index === 3} tabIndex={view.stage === index ? 0 : -1} onClick={() => selectStep(index)} onKeyDown={event => move(event,index)}><span>0{index + 1}</span><b>{step.title}</b></button>)}</div>
    <div className="sj__track" aria-hidden="true"><i /></div>
    <div className="sj__detail" id="journey-detail" role="tabpanel" tabIndex={0} aria-labelledby={`journey-phase-${view.stage}`}>
      <h3 key={`${journey.id}-${view.stage}-${issue}`}>{view.action}</h3>
      <dl><div><dt>{view.blocked ? "Por resolver" : view.complete ? "Entrega" : "Avance concreto"}</dt><dd>{view.evidence}</dd></div><div><dt>Quién interviene</dt><dd>{view.owner}</dd></div></dl>
    </div>
    <div className="sj__branch"><button type="button" aria-pressed={issue !== "none"} aria-controls="journey-exception" onClick={exploreIssue}>{issue === "none" ? "¿Y si algo no encaja?" : "Volver al caso habitual"}<span aria-hidden="true">{issue === "none" ? "+" : "−"}</span></button></div>
    <div id="journey-exception" className={`sj__exception${issue === "resolved" ? " is-resolved" : ""}`} hidden={issue === "none"}>{issue === "open" ? <><p><strong>{journey.exception.trigger}</strong> La entrega espera a que se revise este punto.</p><button type="button" onClick={resolveIssue}>Ver cómo se resuelve <span aria-hidden="true">↗</span></button></> : <p ref={resolutionRef} tabIndex={-1}>{journey.exception.resolution}</p>}</div>
    <details className="sj__deliverables" open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}><summary>Qué queda en tus manos <small>03 entregables</small></summary><ul>{journey.deliverables.map((item,index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul><p className="sj__input"><strong>El resultado</strong>{journey.outcome}</p><p className="sj__input"><strong>Para empezar</strong>{journey.input}</p></details>
    <div className="sj__footer"><a href={`contacto.html?context=${journey.context}`}>Hablemos de {journey.label.toLowerCase()} <span aria-hidden="true">↗</span></a><small>Ejemplo explicativo. Sin datos de clientes.</small></div>
    <p className="sj__announcement" role="status" aria-live="polite">{announcement}</p>
  </section>;
}
