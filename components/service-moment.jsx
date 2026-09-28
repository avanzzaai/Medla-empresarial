/* Code-native service demonstrations. No external media, timers or layout dependencies. */
const MOMENT_TITLES = {
  document: "De un contrato pendiente a una versión revisada y lista para firma",
  fiscal: "Facturas, contabilidad y declaraciones se contrastan para preparar un informe de revisión fiscal",
  agent: "Fuentes autorizadas se convierten en una respuesta con referencias y revisión",
  flow: "Una solicitud sigue una regla, pasa por aprobación y deja un registro",
  entity: "Socios, reglas y documentos se reúnen en una estructura societaria",
  architecture: "Datos dispersos se conectan en un registro operativo común",
  scenarios: "Tres escenarios comparan cómo cambian los supuestos de una decisión",
  growth: "Una propuesta se convierte en una oportunidad asignada con siguiente acción",
  intake: "Un formulario valida la información y la entrega al responsable adecuado",
};

function Note({ x, y, children, accent = false, muted = false, size = 15, anchor = "start", ...props }) {
  return <text x={x} y={y} textAnchor={anchor} fill={accent ? "#83cec8" : muted ? "#8d9b9b" : "#edf1ed"} fontSize={size} fontWeight="500" {...props}>{children}</text>;
}

function Trace({ d, on, gold = false, ...props }) {
  return <g>
    <path d={d} fill="none" stroke="#334143" strokeWidth="1.2" {...props} />
    <path className="mm-trace" d={d} fill="none" stroke={gold ? "#c5ab70" : "#83cec8"} strokeWidth="1.7" pathLength="1" strokeDasharray="1" strokeDashoffset={on ? 0 : 1} {...props} />
  </g>;
}

function Reveal({ show, children, delay = 0, ...props }) {
  return <g className="mm-reveal" opacity={show ? 1 : 0} style={{ transform: `translateY(${show ? 0 : 10}px)`, transitionDelay: `${delay}ms` }} {...props}>{children}</g>;
}

function Tick({ x, y, active, light = false }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle r="10" fill={active ? light ? "#176d66" : "#173e3b" : "none"} stroke={active ? "#83cec8" : light ? "#b5c0b9" : "#475456"} strokeWidth="1" />
    <path className="mm-trace" d="m-4 0 3 3 6-6" fill="none" stroke={light ? "#eef4ed" : "#a5e2d9"} strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={active ? 0 : 1} />
  </g>;
}

function PaperLines({ x, y, lengths = [140, 116, 151], color = "#73827d", gap = 13, opacity = .52 }) {
  return <g stroke={color} strokeWidth="2" opacity={opacity}>{lengths.map((length, i) => <path key={i} d={`M${x} ${y + i * gap}h${length}`} />)}</g>;
}

function DocumentMoment({ stage, ids, fiscal = false }) {
  return <>
    <g className="mm-transform" style={{ transform: `translate(${stage > 0 ? -10 : 0}px, ${stage > 0 ? 0 : 8}px)` }}>
      <path d="M151 77 418 54 442 364 175 387Z" fill="#172124" stroke="#3b4749" />
      <path d="m160 63 268 6-8 314-268-7Z" fill="#243032" stroke="#475457" />
      <g filter={`url(#${ids.shadow})`}>
        <rect x="146" y="56" width="278" height="313" rx="3" fill={`url(#${ids.paper})`} />
        <path d="M171 91h31m-31 10h17" stroke="#287b73" strokeWidth="2" />
        <text x="171" y="138" fill="#172522" fontSize="23" fontWeight="500">{fiscal ? "Revisión fiscal" : "Acuerdo comercial"}</text>
        <text x="171" y="159" fill="#61716a" fontSize="11" letterSpacing="1.4">{fiscal ? "EXPEDIENTE / 03" : "BORRADOR / 03"}</text>
        <path d="M171 177h225" stroke="#a9b6ac" strokeWidth=".8" />
        {[0, 1, 2].map((i) => <g key={i}>
          <rect className="mm-transform" x="166" y={192 + i * 43} width={stage >= 1 && i < 2 ? 232 : 0} height="30" rx="2" fill="#a4c8b5" opacity=".56" />
          <text x="173" y={211 + i * 43} fill="#34473f" fontSize="12">{(fiscal ? ["01  Facturas y soporte", "02  Registros contables", "03  Declaraciones"] : ["01  Objeto y alcance", "02  Responsables y plazos", "03  Condiciones de cierre"])[i]}</text>
          <Tick x="379" y={208 + i * 43} active={stage >= (i === 2 ? 2 : 1)} light />
        </g>)}
        <Reveal show={stage >= 3}>
          <rect x="174" y="324" width="94" height="24" rx="2" fill="#d2e1d2" stroke="#49775d" />
          <text x="221" y="340" textAnchor="middle" fill="#315f47" fontSize="10" letterSpacing="1">REVISADO</text>
        </Reveal>
        <text x="296" y="343" fill="#607367" fontSize={fiscal ? "8" : "10"}>{stage >= 3 ? fiscal ? "INFORME PREPARADO" : "LISTO PARA FIRMA" : "EN REVISIÓN"}</text>
      </g>
    </g>
    <Trace d="M424 211h42q12 0 12-12v-40" on={stage >= 1} />
    <Reveal show={stage >= 1}>
      <circle cx="478" cy="143" r="6" fill="#83cec8" />
      <Note x="493" y="148" size={15}>{fiscal ? "Contraste" : "Revisado"}</Note>
      <Note x="467" y="174" size={12} muted>{fiscal ? "Documentos y registros" : "Alcance y obligaciones"}</Note>
    </Reveal>
    <Reveal show={stage >= 2} delay={100}>
      <path d="M425 290h30" stroke="#c5ab70" />
      <Note x="467" y="285" size={15}>{fiscal ? "Revisión humana" : "Decisión clara"}</Note>
      <Note x="467" y="305" size={12} muted>{fiscal ? "Diferencias explicadas" : "Comentarios resueltos"}</Note>
    </Reveal>
    <Note x="146" y="408" size={11} muted>{fiscal ? "DOCUMENTOS · REVISIÓN · SEGUIMIENTO" : "VERSIÓN · REVISIÓN · FIRMA"}</Note>
  </>;
}

function FiscalMoment(props) { return <DocumentMoment {...props} fiscal />; }

function AgentMoment({ stage, ids }) {
  const sourceYs = [89, 191, 293];
  return <>
    {sourceYs.map((y, i) => <g key={y}>
      <g className="mm-transform" style={{ transform: `translateX(${stage >= 1 ? 0 : -8}px)` }}>
        <path d={`M40 ${y}h131l13 13v59H40Z`} fill={`url(#${ids.surface})`} stroke="#435255" />
        <Note x="54" y={y + 24} size={12} accent>0{i + 1}</Note>
        <Note x="54" y={y + 46} size={14}>{["Documentos", "Base interna", "Herramientas"][i]}</Note>
      </g>
      <Trace d={`M184 ${y + 36}H230Q246 ${y + 36} 246 ${y + (i === 0 ? 68 : i === 2 ? 4 : 36)}V226H285`} on={stage >= 1} />
    </g>)}
    <g>
      <path d="m303 195 31 31-31 31-31-31Z" fill="#142b2b" stroke="#83cec8" />
      <Note x="303" y="232" size={15} anchor="middle" accent>IA</Note>
      <Note x="303" y="288" size={11} anchor="middle" muted>PERMISOS</Note>
      <Trace d="M334 226h39" on={stage >= 2} />
    </g>
    <g className="mm-transform" opacity={stage >= 2 ? 1 : .42}>
      <rect x="374" y="92" width="236" height="278" rx="4" fill={`url(#${ids.surface})`} stroke={stage >= 2 ? "#698a87" : "#344244"} />
      <Note x="398" y="126" size={11} accent>RESPUESTA CON CONTEXTO</Note>
      <path d="M398 146h188" stroke="#344244" />
      <Note x="398" y="183" size={19}>Esto es lo que</Note>
      <Note x="398" y="209" size={19}>necesita tu equipo.</Note>
      <PaperLines x={398} y={237} lengths={[183, 158, 169]} color="#9aafac" gap={13} opacity={stage >= 2 ? .72 : .22} />
      <Reveal show={stage >= 2}>
        {[0, 1, 2].map(i => <g key={i}><rect x={398 + i * 46} y="291" width="32" height="23" rx="3" fill="#1a3532" stroke="#568981" /><Note x={414 + i * 46} y="307" size={11} anchor="middle" accent>[{i + 1}]</Note></g>)}
        <Note x="398" y="346" size={11} muted>Referencias disponibles</Note>
      </Reveal>
    </g>
    <Reveal show={stage >= 3}>
      <Tick x="594" y="90" active />
      <Note x="490" y="404" size={12} anchor="middle" accent>Revisión humana antes de actuar</Note>
    </Reveal>
  </>;
}

function FlowMoment({ stage, ids }) {
  return <>
    <g filter={`url(#${ids.shadow})`}>
      <rect x="37" y="172" width="154" height="119" rx="4" fill={`url(#${ids.surface})`} stroke="#506164" />
      <Note x="55" y="199" size={10} accent>SOLICITUD / 024</Note>
      <Note x="55" y="229" size={17}>Nuevo proveedor</Note>
      <PaperLines x={55} y={250} lengths={[114, 74]} gap={12} color="#97aaa7" />
    </g>
    <Trace d="M191 231h67" on={stage >= 1} />
    <path d="m300 187 44 44-44 44-44-44Z" fill="#142726" stroke={stage >= 1 ? "#83cec8" : "#536563"} />
    <Note x="300" y="228" size={12} anchor="middle" accent>¿Requiere</Note>
    <Note x="300" y="244" size={12} anchor="middle" accent>aprobación?</Note>
    <Trace d="M300 187v-67q0-15 15-15h81" on={stage >= 1} gold />
    <Note x="314" y="151" size={11} muted>SÍ · REVISA UNA PERSONA</Note>
    <g className="mm-transform" opacity={stage >= 1 ? 1 : .4}>
      <rect x="397" y="69" width="207" height="74" rx="37" fill="#1c2525" stroke={stage >= 2 ? "#83cec8" : "#80724e"} />
      <circle cx="433" cy="106" r="18" fill="#354442" />
      <Note x="433" y="111" size={12} anchor="middle">RM</Note>
      <Note x="462" y="100" size={14}>Responsable</Note>
      <Note x="462" y="119" size={11} accent>{stage >= 2 ? "Aprobación registrada" : "Pendiente de revisión"}</Note>
    </g>
    <Trace d="M344 231h97" on={stage >= 2} />
    <Trace d="M500 143v57" on={stage >= 2} />
    <Note x="356" y="215" size={10} muted>REGLA CUMPLIDA</Note>
    <g className="mm-transform" opacity={stage >= 2 ? 1 : .35}>
      <rect x="444" y="200" width="160" height="65" rx="4" fill="#123632" stroke="#528c81" />
      <Note x="524" y="229" size={16} anchor="middle">Alta en el sistema</Note>
      <Note x="524" y="247" size={10} anchor="middle" accent>ACCIÓN VERIFICADA</Note>
    </g>
    <Trace d="M524 265v55H126" on={stage >= 3} />
    <Reveal show={stage >= 3}>
      <Tick x="107" y="320" active />
      <Note x="107" y="365" size={13}>Entrada · aprobación · acción</Note>
      <Note x="107" y="388" size={12} muted>Todo queda en el mismo historial.</Note>
    </Reveal>
  </>;
}

function EntityMoment({ stage, ids }) {
  const people = [{ x: 145, label: "Socio A", initials: "A" }, { x: 325, label: "Socio B", initials: "B" }, { x: 505, label: "Socio C", initials: "C" }];
  return <>
    {people.map(({ x, label, initials }) => <g key={label}>
      <circle cx={x} cy="80" r="26" fill={`url(#${ids.surface})`} stroke="#637370" />
      <Note x={x} y="87" size={18} anchor="middle">{initials}</Note>
      <Note x={x} y="126" size={13} anchor="middle" muted>{label}</Note>
      <Trace d={`M${x} 145v28q0 13 ${x < 325 ? 13 : x > 325 ? -13 : 0} 13H325v36`} on={stage >= 1} />
    </g>)}
    <g filter={`url(#${ids.shadow})`}>
      <path d="M188 225h274v154H188Z" fill={`url(#${ids.paper})`} />
      <text x="213" y="258" fill="#536d5d" fontSize="11" letterSpacing="1.4">ACUERDO FUNDACIONAL</text>
      <text x="213" y="292" fill="#192f28" fontSize="24">Cómo vamos a operar.</text>
      <path d="M213 308h224" stroke="#a7b8ab" />
      {["Aportaciones", "Gobierno", "Representación"].map((text, i) => <g key={text}>
        <text x={213 + i * 75} y="334" fill="#597267" fontSize="10">{text}</text>
        <Tick x={238 + i * 75} y="353" active={stage >= 2} light />
      </g>)}
    </g>
    <Reveal show={stage >= 3}>
      <path d="M463 307h33" stroke="#83cec8" />
      <circle cx="542" cy="307" r="37" fill="#102725" stroke="#83cec8" />
      <path d="m527 307 10 10 19-22" fill="none" stroke="#a9ded5" strokeWidth="2" />
      <Note x="542" y="365" size={11} anchor="middle" accent>Documentación</Note>
      <Note x="542" y="382" size={11} anchor="middle" muted>coordinada</Note>
    </Reveal>
    <Note x="325" y="420" size={11} anchor="middle" muted>ESTRUCTURA ACORDADA ANTES DE FORMALIZAR</Note>
  </>;
}

function ArchitectureMoment({ stage, ids }) {
  const sources = [{ y: 80, title: "Ventas · hoja de cálculo", value: "Cliente / 017", width: 111 }, { y: 188, title: "Administración · correo", value: "Cambio pendiente", width: 135 }, { y: 296, title: "Operaciones · aplicación", value: "Estado distinto", width: 94 }];
  return <>
    {sources.map(({ y, title, value, width }, i) => <g key={title} className="mm-transform" style={{ transform: `translateX(${stage >= 2 ? 8 : 0}px)`, opacity: stage >= 3 ? .6 : 1 }}>
      <rect x={40 + i * 7} y={y} width="174" height="79" rx="2" fill={`url(#${ids.surface})`} stroke="#3d4e50" />
      <Note x={55 + i * 7} y={y + 25} size={11} muted>{title}</Note>
      <Note x={55 + i * 7} y={y + 50} size={14}>{value}</Note>
      <path d={`M${55 + i * 7} ${y + 63}h${width}`} stroke="#2f4645" />
      <Trace d={`M${214 + i * 7} ${y + 40}h30Q278 ${y + 40} 278 ${y < 188 ? y + 70 : y > 188 ? y + 10 : y + 40}V228h66`} on={stage >= 1} />
    </g>)}
    <g className="mm-transform" opacity={stage >= 1 ? 1 : .45}>
      <rect x="351" y="99" width="251" height="270" rx="5" fill={`url(#${ids.surface})`} stroke={stage >= 3 ? "#83cec8" : "#4c6564"} />
      <Note x="374" y="131" size={10} accent>UN REGISTRO COMPARTIDO</Note>
      <Note x="374" y="167" size={24}>Cliente / 017</Note>
      <path d="M374 188h204" stroke="#3b5151" />
      {[['Datos', 'Validados'], ['Responsable', 'Operaciones'], ['Estado', 'Actualizado']].map(([key, value], i) => <g key={key}>
        <Note x="374" y={218 + i * 44} size={12} muted>{key}</Note>
        <Note x="576" y={218 + i * 44} size={12} anchor="end" accent={stage >= i + 1}>{stage >= i + 1 ? value : "—"}</Note>
        <path d={`M374 ${232 + i * 44}h204`} stroke="#243b3b" />
      </g>)}
      <Reveal show={stage >= 3}><Tick x="584" y="99" active /></Reveal>
    </g>
    <Note x="480" y="402" size={12} anchor="middle" muted>El equipo trabaja sobre la misma versión.</Note>
  </>;
}

function ScenariosMoment({ stage }) {
  const lines = ["M92 295C156 291 201 242 270 248S381 228 448 192S526 171 566 155", "M92 295C155 276 196 235 270 248S382 264 448 230S520 224 566 207", "M92 295C157 268 202 261 270 248S371 299 448 296S526 329 566 322"];
  const colors = ["#83cec8", "#c5ab70", "#758995"];
  return <>
    <Note x="72" y="66" size={11} accent>COMPARAR ANTES DE DECIDIR</Note>
    <Note x="72" y="99" size={23}>¿Qué cambia si cambia el contexto?</Note>
    {[166, 228, 290, 352].map(y => <path key={y} d={`M72 ${y}h510`} stroke="#263a3c" strokeWidth=".8" />)}
    <path d="M72 139v214h510" fill="none" stroke="#6b7d7c" />
    <path d="M270 139v214" stroke="#5b7371" strokeDasharray="3 6" />
    <Note x="270" y="375" size={11} anchor="middle" muted>SUPUESTO INICIAL</Note>
    <circle cx="92" cy="295" r="5" fill="#f1f2ed" />
    {lines.map((d, i) => <g key={d}>
      <path className="mm-trace" d={d} fill="none" stroke={colors[i]} strokeWidth={i === 0 ? "2" : "1.5"} pathLength="1" strokeDasharray="1" strokeDashoffset={stage >= (i === 0 ? 1 : 2) ? 0 : 1} />
      <Reveal show={stage >= (i === 0 ? 1 : 2)}><circle cx="566" cy={[155,207,322][i]} r="4" fill={colors[i]} /></Reveal>
    </g>)}
    <Reveal show={stage >= 2}>
      {["Expansivo", "Base", "Restrictivo"].map((label, i) => <g key={label}><path d={`M${88 + i * 169} 408h18`} stroke={colors[i]} strokeWidth="2" /><Note x={114 + i * 169} y="412" size={12}>{label}</Note></g>)}
    </Reveal>
    <Reveal show={stage >= 3}>
      <rect x="387" y="119" width="174" height="36" rx="18" fill="#142d2b" stroke="#547b72" />
      <Note x="474" y="142" size={12} anchor="middle" accent>Supuestos documentados</Note>
    </Reveal>
    <Note x="325" y="439" size={9} anchor="middle" muted>Comparación ilustrativa. No representa una previsión de rentabilidad.</Note>
  </>;
}

function GrowthMoment({ stage, ids }) {
  return <>
    <g className="mm-transform" style={{ transform: `translateX(${stage >= 2 ? -8 : 0}px)` }}>
      <rect x="64" y="84" width="220" height="276" rx="3" fill={`url(#${ids.paper})`} />
      <text x="85" y="117" fill="#3d6254" fontSize="10" letterSpacing="1.8">PROPUESTA</text>
      <text x="85" y="162" fill="#1b352e" fontSize="25">Un problema.</text>
      <text x="85" y="194" fill="#1b352e" fontSize="25">Una respuesta</text>
      <text x="85" y="226" fill="#1b352e" fontSize="25">relevante.</text>
      <PaperLines x={85} y={259} lengths={[165, 144, 115]} color="#6a897b" gap={12} />
      <rect className="mm-transform" x="85" y="310" width={stage >= 1 ? 158 : 57} height="25" rx="12.5" fill="#215d51" />
      <text x="99" y="327" fill="#e1eee2" fontSize="10">{stage >= 1 ? "Conocer la propuesta  ↗" : "↗"}</text>
    </g>
    <Trace d="M279 224h60q15 0 15 15v28h30" on={stage >= 2} />
    <g className="mm-transform" opacity={stage >= 2 ? 1 : .38}>
      <rect x="385" y="116" width="221" height="247" rx="4" fill={`url(#${ids.surface})`} stroke={stage >= 3 ? "#83cec8" : "#465958"} />
      <Note x="406" y="147" size={10} accent>OPORTUNIDAD / 012</Note>
      <Note x="406" y="183" size={19}>Interés con contexto</Note>
      <PaperLines x={406} y={204} lengths={[167, 129]} color="#9bb2ac" gap={13} />
      <path d="M406 239h177" stroke="#36534f" />
      <Reveal show={stage >= 3}>
        <circle cx="423" cy="273" r="17" fill="#275349" />
        <Note x="423" y="278" size={11} anchor="middle">AM</Note>
        <Note x="451" y="267" size={12}>Responsable asignado</Note>
        <Note x="451" y="286" size={11} accent>Próximo paso confirmado</Note>
        <rect x="406" y="311" width="177" height="29" rx="3" fill="#193b32" />
        <Note x="494" y="330" size={11} anchor="middle" accent>Preparar conversación</Note>
      </Reveal>
    </g>
    <Note x="326" y="410" size={12} anchor="middle" muted>De la propuesta al seguimiento, sin perder el contexto.</Note>
  </>;
}

function IntakeMoment({ stage, ids }) {
  const fields = [["Nombre", "Laura Martín"], ["Empresa", "Proyecto de ejemplo"], ["Necesidad", "Conectar la operación"]];
  return <>
    <g filter={`url(#${ids.shadow})`}>
      <rect x="55" y="71" width="274" height="317" rx="5" fill={`url(#${ids.paper})`} />
      <text x="78" y="109" fill="#244739" fontSize="22">Cuéntanos tu proyecto.</text>
      {fields.map(([label, value], i) => <g key={label}>
        <text x="79" y={147 + i * 62} fill="#67796e" fontSize="11">{label}</text>
        <path d={`M79 ${182 + i * 62}h224`} stroke="#a3b3a6" />
        <text className="mm-reveal" x="79" y={170 + i * 62} fill="#243b30" fontSize="13" opacity={stage >= 0 ? 1 : 0}>{value}</text>
        <Tick x="293" y={165 + i * 62} active={stage >= 1} light />
      </g>)}
      <rect x="79" y="331" width="224" height="31" rx="15" fill="#215c50" />
      <text x="191" y="351" textAnchor="middle" fill="#eaf0e8" fontSize="12">{stage >= 1 ? "Datos validados  ✓" : "Revisar y continuar  →"}</text>
    </g>
    <Trace d="M329 223h60q14 0 14 14v40" on={stage >= 2} />
    <Note x="374" y="202" size={10} accent>REGLA DE ASIGNACIÓN</Note>
    <g className="mm-transform" opacity={stage >= 2 ? 1 : .28}>
      <path d="m403 275 23 23-23 23-23-23Z" fill="#12322c" stroke="#638f83" />
      <Note x="403" y="303" size={14} anchor="middle" accent>↳</Note>
      <Trace d="M426 298h28V138" on={stage >= 3} />
    </g>
    <g className="mm-transform" opacity={stage >= 3 ? 1 : .33}>
      <rect x="425" y="78" width="181" height="123" rx="4" fill={`url(#${ids.surface})`} stroke={stage >= 3 ? "#83cec8" : "#385550"} />
      <Note x="447" y="108" size={10} accent>REGISTRO / 017</Note>
      <Note x="447" y="137" size={17}>Operaciones</Note>
      <Note x="447" y="161" size={12} muted>{stage >= 3 ? "Solicitud recibida" : "Esperando información"}</Note>
      <Reveal show={stage >= 3}><Tick x="584" y="79" active /></Reveal>
    </g>
    <Reveal show={stage >= 3}><Note x="462" y="357" size={13} anchor="middle" accent>Sin copiar datos.</Note><Note x="462" y="380" size={12} anchor="middle" muted>Con responsable y seguimiento.</Note></Reveal>
  </>;
}

export default function ServiceMoment({ mode = "flow", stage = 0, playing = false, reducedMotion = false }) {
  const seed = React.useId().replace(/:/g, "");
  const ids = { paper: `mm-paper-${seed}`, surface: `mm-surface-${seed}`, shadow: `mm-shadow-${seed}`, title: `mm-title-${seed}` };
  const phase = Math.min(3, Math.max(0, Number(stage) || 0));
  const Scene = { document: DocumentMoment, fiscal: FiscalMoment, agent: AgentMoment, flow: FlowMoment, entity: EntityMoment, architecture: ArchitectureMoment, scenarios: ScenariosMoment, growth: GrowthMoment, intake: IntakeMoment }[mode] || FlowMoment;
  return <div className="medla-moment" data-mode={mode} data-stage={phase} data-playing={playing} data-reduced={reducedMotion}>
    <style>{`
      .medla-moment{position:relative;width:100%;isolation:isolate}
      .medla-moment>svg{display:block;width:100%;height:auto;overflow:visible;font-family:Manrope,system-ui,sans-serif}
      .medla-moment .mm-trace{transition:stroke-dashoffset 1.15s cubic-bezier(.22,1,.36,1),stroke .55s ease}
      .medla-moment .mm-reveal{transition:opacity .6s ease,transform .8s cubic-bezier(.22,1,.36,1)}
      .medla-moment .mm-transform{transition:transform 1s cubic-bezier(.22,1,.36,1),opacity .75s ease,width .85s cubic-bezier(.22,1,.36,1)}
      .medla-moment[data-reduced="true"] .mm-trace,.medla-moment[data-reduced="true"] .mm-reveal,.medla-moment[data-reduced="true"] .mm-transform{transition:none}
      @media(prefers-reduced-motion:reduce){.medla-moment .mm-trace,.medla-moment .mm-reveal,.medla-moment .mm-transform{transition:none}}
    `}</style>
    <svg viewBox="0 0 650 450" role="img" aria-labelledby={ids.title}>
      <title id={ids.title}>{MOMENT_TITLES[mode] || MOMENT_TITLES.flow}. Demostración ilustrativa, fase {phase + 1} de 4.</title>
      <defs>
        <linearGradient id={ids.paper} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f1f2ed" /><stop offset="1" stopColor="#c4d0c3" /></linearGradient>
        <linearGradient id={ids.surface} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1b2b2d" /><stop offset="1" stopColor="#0b1518" /></linearGradient>
        <filter id={ids.shadow} x="-35%" y="-25%" width="175%" height="170%"><feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity=".4" /></filter>
      </defs>
      <g aria-hidden="true"><Scene stage={phase} ids={ids} /></g>
    </svg>
  </div>;
}
