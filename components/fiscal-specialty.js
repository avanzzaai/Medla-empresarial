// Service scope, not individual tax advice or a statutory audit opinion.
export default {
  descriptor: "Auditoría y asesoría fiscal",
  eyebrow: "Contabilidad, impuestos y revisión fiscal",
  accent: "#79d2c5",
  hero: {
    before: "Tus números, claros. ", emphasis: "Tus obligaciones, previstas.", after: "",
    lead: "Revisamos la documentación contable y fiscal, detectamos diferencias y organizamos las obligaciones de tu empresa. Puedes contar con una revisión puntual o con acompañamiento recurrente.",
    note: "El alcance se acuerda según la actividad, la jurisdicción y los periodos a revisar.",
  },
  context: "fiscal", secondary: "Ver qué incluye",
  scene: {
    mode: "fiscal", code: "REVISIÓN FISCAL / 01", core: "REVISIÓN", mark: "F",
    caption: "Los documentos se contrastan con los registros y las declaraciones para preparar una revisión con pendientes y responsables.",
    nodes: [
      { label: "Documentos", detail: "Reunimos facturas, registros contables y declaraciones de los periodos acordados." },
      { label: "Contraste", detail: "Revisamos que los importes y su documentación de soporte sean consistentes." },
      { label: "Revisión", detail: "Una persona revisa las diferencias, solicita lo que falta y define los siguientes pasos." },
      { label: "Seguimiento", detail: "Entregamos las observaciones, las acciones pendientes y un calendario de trabajo." },
    ],
  },
  problem: {
    label: "Cuándo podemos ayudarte",
    headline: "Que el próximo cierre no empiece buscando lo que falta.",
    body: "Ponemos orden en la información antes de valorar obligaciones, incidencias o decisiones.",
    signals: [
      { title: "Cifras que no coinciden", text: "Facturas, cobros, pagos y registros muestran diferencias que conviene explicar y documentar." },
      { title: "Obligaciones sin calendario", text: "Los documentos se preparan a última hora y el equipo no tiene claro qué entregar ni a quién." },
      { title: "Una operación que necesita revisión", text: "Un cambio de actividad, una inversión o una nueva sociedad plantea cuestiones contables y fiscales." },
    ],
  },
  scope: [
    { name: "Auditoría fiscal", signal: "Quieres revisar el estado de la documentación y las obligaciones de unos periodos concretos.", work: "Contrastamos registros y declaraciones con su soporte, identificamos diferencias y documentamos las cuestiones que requieren revisión. La propuesta concreta el alcance de las comprobaciones.", outputs: ["Relación de diferencias", "Documentación pendiente", "Plan de revisión"] },
    { name: "Asesoría recurrente", signal: "La empresa necesita acompañamiento durante el ejercicio, no solo al cierre.", work: "Acordamos un calendario documental, atendemos las consultas incluidas y preparamos o revisamos las obligaciones y presentaciones expresamente contratadas.", outputs: ["Calendario de trabajo", "Revisión periódica", "Seguimiento de obligaciones"] },
    { name: "Contabilidad y cierres", signal: "Necesitas una base contable ordenada para entender los resultados.", work: "Revisamos la clasificación de operaciones, las conciliaciones y los pendientes del cierre dentro del alcance acordado, coordinándonos con quien lleva la contabilidad.", outputs: ["Conciliaciones revisadas", "Pendientes de cierre", "Información para dirección"] },
    { name: "Operaciones y consultas", signal: "Una decisión empresarial necesita valorar sus implicaciones fiscales.", work: "Recogemos los hechos, la documentación y la jurisdicción para estudiar el caso. Si requiere otro perfil o una intervención adicional, lo delimitamos antes de actuar.", outputs: ["Cuestiones a resolver", "Análisis del caso", "Próximos pasos"] },
  ],
  deliverables: [
    { code: "FI-01", title: "Informe de revisión", text: "Observaciones respaldadas por la información revisada, con los límites y pendientes del análisis.", contents: ["Periodos y documentos", "Diferencias identificadas", "Cuestiones pendientes"] },
    { code: "FI-02", title: "Plan de trabajo", text: "Qué documentación completar, qué revisar primero y quién se ocupa de cada punto.", contents: ["Acciones priorizadas", "Responsables", "Fechas acordadas"] },
    { code: "FI-03", title: "Calendario y archivo", text: "Una referencia para coordinar documentos, revisiones y las obligaciones incluidas en el encargo.", contents: ["Calendario documental", "Expediente ordenado", "Seguimiento acordado"] },
  ],
  process: [
    { phase: "Delimitar", text: "Confirmamos actividad, jurisdicción, periodos y documentación disponible.", check: "Alcance acordado" },
    { phase: "Contrastar", text: "Revisamos la información y pedimos los documentos que faltan.", check: "Base de revisión preparada" },
    { phase: "Explicar", text: "Compartimos las observaciones y las cuestiones que necesitan una decisión.", check: "Resultados comentados" },
    { phase: "Acompañar", text: "Organizamos las acciones y el seguimiento incluidos en la propuesta.", check: "Responsables y calendario" },
  ],
  boundary: {
    kicker: "Qué significa esta revisión",
    title: "Un alcance claro desde el principio.",
    body: "La auditoría fiscal aquí descrita es una revisión de documentación y cumplimiento; no equivale a una auditoría legal de cuentas ni a una certificación. El encargo identifica los periodos, las obligaciones y los profesionales que intervienen. No se garantizan ahorros fiscales ni resultados ante la Administración.",
  },
  cta: { title: "Cuéntanos qué necesitas revisar.", body: "Indica la actividad, el país y si buscas una revisión puntual o asesoramiento recurrente. No envíes documentación fiscal sensible en este primer formulario.", button: "Consultar sobre fiscalidad" },
};
