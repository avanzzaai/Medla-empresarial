import ServiceMoment from "./components/service-moment.jsx";
import useScrollScene from "./components/use-scroll-scene.jsx";

const { useEffect, useRef, useState } = React;

const SPECIALTIES = {
  legal: {
    descriptor: "Asesoría legal empresarial",
    eyebrow: "Criterio jurídico conectado con la ejecución",
    accent: "#79d2c5",
    hero: {
      before: "Cada decisión, ",
      emphasis: "bien respaldada.",
      after: "",
      lead: "Ordenamos hechos, riesgos, responsables y documentos; dejamos preparada la aprobación, firma o actuación incluida en el encargo.",
      note: "El encargo y la jurisdicción aplicable se confirman antes de intervenir.",
    },
    context: "legal",
    secondary: "Revisar el alcance",
    scene: {
      mode: "document",
      code: "EXPEDIENTE / 01",
      core: "CRITERIO",
      mark: "§",
      caption: "Un expediente conecta hechos, decisión, documento y responsable.",
      nodes: [
        { label: "Hechos", detail: "Qué ha ocurrido, quién interviene y qué documentación existe." },
        { label: "Marco", detail: "Normas, acuerdos y jurisdicción que delimitan la decisión." },
        { label: "Decisión", detail: "Opciones, riesgos y aprobación que deben quedar claros." },
        { label: "Ejecución", detail: "Documento, firma, registro y responsable del siguiente paso." },
      ],
    },
    problem: {
      label: "Señales del problema",
      headline: "Lo jurídico no debería aparecer al final, cuando la operación ya está comprometida.",
      body: "Entramos donde la decisión empresarial y su soporte documental empiezan a separarse.",
      signals: [
        { title: "Contratos que llegan tarde", text: "La revisión empieza cuando la negociación, el proveedor o el calendario ya han fijado las condiciones de hecho." },
        { title: "Gobierno que no refleja la realidad", text: "Los acuerdos formales no siguen el reparto efectivo de responsabilidades, aportaciones o capacidad de decisión." },
        { title: "Cambios sin rastro documental", text: "Se modifican relaciones, poderes o procesos sin un registro claro de quién aprobó qué y con qué alcance." },
      ],
    },
    scope: [
      { name: "Contratos", signal: "Una relación comercial necesita reglas claras antes de firmar o renovar.", work: "Ordenamos antecedentes, posiciones y puntos de negociación; revisamos o preparamos el documento dentro del alcance acordado.", outputs: ["Mapa de cuestiones", "Versión comentada", "Cierre de pendientes"] },
      { name: "Gobierno societario", signal: "Una decisión de socios o administradores debe quedar alineada con la realidad operativa.", work: "Identificamos el órgano, la secuencia de aprobación y la documentación necesaria según el caso y la jurisdicción confirmada.", outputs: ["Secuencia de decisión", "Documentación del acuerdo", "Responsables y firmas"] },
      { name: "Cumplimiento", signal: "Una obligación necesita dueño, evidencia y criterio de revisión.", work: "Traducimos el requisito aplicable en controles, responsabilidades y evidencias que puedan sostenerse en la operación diaria.", outputs: ["Matriz de obligaciones", "Controles aplicables", "Registro de evidencias"] },
      { name: "Coordinación", signal: "El asunto requiere perfiles o jurisdicciones adicionales.", work: "Separamos qué puede resolverse en el encargo y qué exige un especialista externo, coordinando la información sin borrar responsabilidades.", outputs: ["Alcance delimitado", "Paquete de antecedentes", "Puntos de coordinación"] },
    ],
    deliverables: [
      { code: "D-01", title: "Mapa jurídico de la decisión", text: "Una lectura compacta de hechos, actores, documentos, cuestiones abiertas y siguiente aprobación.", contents: ["Antecedentes relevantes", "Preguntas pendientes", "Responsable por decisión"] },
      { code: "D-02", title: "Documentación de trabajo", text: "Borradores, revisiones y versiones finales organizadas para que el proceso de decisión pueda reconstruirse.", contents: ["Control de versiones", "Comentarios resueltos", "Documento listo para el paso acordado"] },
      { code: "D-03", title: "Guía de ejecución", text: "Qué ocurre después del análisis: quién aprueba, quién firma, qué se registra y qué conviene revisar más adelante.", contents: ["Secuencia operativa", "Dependencias externas", "Punto de revisión"] },
    ],
    process: [
      { phase: "Contexto", text: "Recogemos hechos, documentos, interlocutores y objetivo empresarial.", check: "Expediente de partida confirmado" },
      { phase: "Criterio", text: "Delimitamos el marco aplicable, las opciones y los puntos que requieren decisión.", check: "Alcance y cuestiones abiertas" },
      { phase: "Documento", text: "Preparamos o revisamos la pieza jurídica y resolvemos comentarios con los responsables.", check: "Versión acordada" },
      { phase: "Ejecución", text: "Ordenamos firmas, registros o acciones posteriores dentro del encargo.", check: "Próximo control definido" },
    ],
    boundary: {
      kicker: "Límite explícito",
      title: "Primero se confirma el encargo. Después se aplica el criterio.",
      body: "La página describe un método de trabajo, no una respuesta jurídica para un caso concreto. El servicio se delimita por materia, documentación disponible y jurisdicción aplicable; cuando hace falta un especialista externo, se identifica antes de actuar.",
    },
    cta: { title: "Plantea la decisión o relación contractual.", body: "Indica el objetivo, la jurisdicción y la documentación disponible. Confirmaremos el alcance y la información necesaria.", button: "Plantear este frente" },
  },

  ia: {
    descriptor: "Agentes de inteligencia artificial",
    eyebrow: "IA integrada en el trabajo",
    accent: "#68bcb4",
    hero: {
      before: "IA que trabaja ",
      emphasis: "con tu equipo.",
      after: "",
      lead: "Diseñamos e implantamos agentes para consultar información, preparar tareas y activar acciones con permisos, evaluación y revisión humana.",
      note: "Cada caso de uso define qué puede hacer el agente, qué debe validar una persona y qué queda fuera.",
    },
    context: "ia",
    secondary: "Explorar el sistema",
    scene: {
      mode: "agent",
      code: "AGENTE / 01",
      core: "AGENTE",
      mark: "IA",
      caption: "Fuentes, permisos, herramientas y validación se definen antes de poner el agente en operación.",
      nodes: [
        { label: "Fuentes", detail: "Documentos, bases y sistemas autorizados para responder con contexto." },
        { label: "Reglas", detail: "Instrucciones, límites y criterios de escalado definidos con el equipo." },
        { label: "Acciones", detail: "Consultas, borradores o tareas concretas ejecutadas mediante integraciones." },
        { label: "Control", detail: "Registro, permisos y revisión humana donde la decisión lo requiere." },
      ],
    },
    problem: {
      label: "Señales del problema",
      headline: "Una respuesta correcta no basta si el agente carece de permisos, registro y escalado.",
      body: "Definimos fuentes, acciones autorizadas, controles y responsable antes de implantarlo.",
      signals: [
        { title: "Conocimiento disperso", text: "Las respuestas dependen de buscar en carpetas, correos y personas distintas, sin una fuente acordada." },
        { title: "Instrucciones sin operación", text: "Hay pruebas aisladas, pero ninguna está conectada con responsables, herramientas o criterios de validación." },
        { title: "Acciones sin control", text: "El sistema puede proponer o ejecutar tareas sin distinguir bien entre autonomía, revisión y escalado." },
      ],
    },
    scope: [
      { name: "Caso y límites", signal: "Hay una tarea repetida que podría recibir apoyo, pero todavía no está bien definida.", work: "Descomponemos la tarea, los datos necesarios, las decisiones sensibles y los momentos en los que debe intervenir una persona.", outputs: ["Mapa de tarea", "Límites del agente", "Criterios de escalado"] },
      { name: "Conocimiento", signal: "Las respuestas existen, pero están repartidas entre documentos y sistemas.", work: "Seleccionamos fuentes, definimos jerarquías y preparamos un recorrido de recuperación con referencias y control de acceso.", outputs: ["Inventario de fuentes", "Política de acceso", "Pruebas de recuperación"] },
      { name: "Herramientas", signal: "El agente necesita consultar, redactar o activar una tarea en otro sistema.", work: "Conectamos solo las acciones necesarias, con permisos mínimos, validación de entradas y registro del resultado.", outputs: ["Contrato de integración", "Acciones autorizadas", "Registro de actividad"] },
      { name: "Evaluación", signal: "Hace falta comprobar calidad antes de llevar el agente al trabajo diario.", work: "Construimos casos de prueba, criterios de respuesta y revisión de fallos; documentamos el comportamiento esperado y el mantenimiento.", outputs: ["Banco de pruebas", "Criterios de aceptación", "Manual de operación"] },
    ],
    deliverables: [
      { code: "IA-01", title: "Arquitectura del agente", text: "Una definición legible de entradas, contexto, herramientas, decisiones y salidas.", contents: ["Caso de uso delimitado", "Permisos por acción", "Puntos de validación"] },
      { code: "IA-02", title: "Agente probado en su contexto", text: "La solución conectada a las fuentes y herramientas acordadas, evaluada con situaciones representativas.", contents: ["Integraciones necesarias", "Casos de prueba", "Registro de incidencias"] },
      { code: "IA-03", title: "Protocolo de operación", text: "El equipo sabe qué esperar, cómo revisar el resultado y qué hacer cuando el agente no debe continuar.", contents: ["Uso y supervisión", "Escalado", "Mantenimiento de fuentes"] },
    ],
    process: [
      { phase: "Tarea", text: "Elegimos un caso concreto y separamos información, decisión y acción.", check: "Caso y límites aprobados" },
      { phase: "Contexto", text: "Conectamos fuentes autorizadas y preparamos las reglas que guían el comportamiento.", check: "Fuentes y permisos verificados" },
      { phase: "Prototipo", text: "Construimos el recorrido completo y observamos dónde responde, pregunta o escala.", check: "Flujo funcional" },
      { phase: "Evaluación", text: "Probamos casos normales y excepciones antes de documentar la operación.", check: "Criterios de aceptación cumplidos" },
    ],
    boundary: {
      kicker: "Control operativo",
      title: "La autonomía se diseña. No se presupone.",
      body: "Definimos qué información puede usar el agente, qué acciones puede iniciar y cuáles requieren validación. El equipo conserva acceso al registro, a las reglas y al procedimiento de escalado.",
    },
    cta: { title: "Cuéntanos qué tarea quieres mejorar.", body: "Descríbenos qué recibe el equipo, qué resultado necesita y qué sistemas utiliza. Valoraremos si conviene un agente, una automatización o una solución más simple.", button: "Plantear este frente" },
  },

  automatizacion: {
    descriptor: "Automatización de procesos",
    eyebrow: "Flujos conectados y trazables",
    accent: "#79d2c5",
    hero: {
      before: "El trabajo avanza. ",
      emphasis: "Tú mantienes el control.",
      after: "",
      lead: "Conectamos tus herramientas para que solicitudes, aprobaciones y tareas sigan su curso. Cada regla se entiende. Cada excepción tiene responsable.",
      note: "Automatizamos después de entender el proceso, no antes.",
    },
    context: "automatizacion",
    secondary: "Ver el flujo",
    scene: {
      mode: "flow",
      code: "FLUJO / 01",
      core: "REGLA",
      mark: "↳",
      caption: "Cada solicitud o cambio termina en una acción registrada o en una excepción con responsable.",
      nodes: [
        { label: "Evento", detail: "Una entrada verificable inicia el flujo en el momento correcto." },
        { label: "Regla", detail: "Condiciones explícitas deciden qué camino sigue cada caso." },
        { label: "Acción", detail: "El sistema crea, actualiza, notifica o prepara la tarea acordada." },
        { label: "Registro", detail: "Cada resultado y excepción queda disponible para revisión." },
      ],
    },
    problem: {
      label: "Señales del problema",
      headline: "Los fallos aparecen en copias manuales, aprobaciones sin plazo y excepciones sin responsable.",
      body: "Mapeamos esos puntos antes de definir reglas e integraciones.",
      signals: [
        { title: "Datos copiados entre herramientas", text: "La misma información se vuelve a escribir, cambia de formato y pierde contexto en cada traspaso." },
        { title: "Aprobaciones perseguidas a mano", text: "El equipo depende de mensajes y recordatorios para saber quién debe decidir y qué falta." },
        { title: "Excepciones sin responsable", text: "Cuando algo no encaja, el caso queda detenido porque el sistema no sabe a quién escalarlo." },
      ],
    },
    scope: [
      { name: "Proceso", signal: "El equipo conoce los pasos, pero no existe una versión común del recorrido.", work: "Observamos entradas, decisiones, herramientas y excepciones; dibujamos el proceso real antes de proponer cambios.", outputs: ["Mapa actual", "Puntos de fricción", "Prioridad de intervención"] },
      { name: "Integraciones", signal: "La información necesita cruzar aplicaciones sin duplicarse.", work: "Definimos qué sistema origina cada dato, cómo se valida y qué integración puede moverlo con el menor acceso necesario.", outputs: ["Mapa de sistemas", "Contrato de datos", "Permisos técnicos"] },
      { name: "Lógica", signal: "Las decisiones repetitivas pueden formularse como reglas y excepciones.", work: "Convertimos criterios operativos en condiciones legibles, rutas alternativas y escalados que el equipo puede revisar.", outputs: ["Reglas de negocio", "Rutas de excepción", "Responsable por decisión"] },
      { name: "Seguimiento", signal: "El flujo funciona, pero nadie ve con claridad dónde se detiene.", work: "Añadimos estados, registros y avisos útiles para revisar incidencias sin convertir la operación en un panel innecesario.", outputs: ["Registro de ejecuciones", "Alertas relevantes", "Guía de recuperación"] },
    ],
    deliverables: [
      { code: "AU-01", title: "Mapa operativo completo", text: "Una lectura compartida del proceso actual, sus responsables, sistemas y excepciones.", contents: ["Entradas y salidas", "Decisiones", "Puntos de bloqueo"] },
      { code: "AU-02", title: "Flujo implantado", text: "La automatización conectada con las herramientas acordadas, incluyendo validaciones y rutas de error.", contents: ["Integraciones", "Reglas de negocio", "Tratamiento de excepciones"] },
      { code: "AU-03", title: "Operación transferida", text: "Documentación para entender el flujo, revisar registros y resolver los fallos previstos.", contents: ["Manual de operación", "Responsables", "Plan de cambios"] },
    ],
    process: [
      { phase: "Observar", text: "Seguimos el proceso real y recogemos variantes, sistemas y decisiones.", check: "Mapa actual validado" },
      { phase: "Diseñar", text: "Definimos el nuevo recorrido, las reglas y las excepciones que seguirán siendo humanas.", check: "Flujo objetivo acordado" },
      { phase: "Conectar", text: "Implementamos por tramos y verificamos cada entrada, acción y registro.", check: "Recorrido funcional" },
      { phase: "Transferir", text: "Documentamos operación, incidencias y responsabilidades antes del cierre.", check: "Equipo preparado" },
    ],
    boundary: {
      kicker: "Principio de diseño",
      title: "Un paso automático sigue necesitando criterio y dueño.",
      body: "No ocultamos las excepciones ni dejamos reglas críticas enterradas en una integración. El proceso, sus permisos y el procedimiento de recuperación quedan documentados para el equipo.",
    },
    cta: { title: "Muéstranos el proceso actual.", body: "Con una entrada, una salida y los principales bloqueos podemos localizar el primer tramo que merece automatizarse.", button: "Plantear este frente" },
  },

  constitucion: {
    descriptor: "Constitución de sociedades",
    eyebrow: "Decisiones societarias de origen",
    accent: "#64b7ae",
    hero: {
      before: "Una empresa preparada ",
      emphasis: "desde el principio.",
      after: "",
      lead: "Ordenamos socios, aportaciones, gobierno, documentación y trámites para que la estructura refleje cómo funcionará el proyecto.",
      note: "La secuencia concreta depende de la jurisdicción y de las características del caso.",
    },
    context: "constitucion",
    secondary: "Ordenar las decisiones",
    scene: {
      mode: "entity",
      code: "SOCIEDAD / 01",
      core: "ACUERDO",
      mark: "ACTA",
      caption: "Antes de formalizar, se acuerdan aportaciones, gobierno, representación y pasos posteriores.",
      nodes: [
        { label: "Socios", detail: "Quién participa, qué aporta y qué decisiones necesita proteger." },
        { label: "Gobierno", detail: "Órganos, representación y reparto de responsabilidades." },
        { label: "Documentos", detail: "Piezas que formalizan la estructura dentro del alcance aplicable." },
        { label: "Trámites", detail: "Secuencia, dependencias y responsables hasta completar el encargo." },
      ],
    },
    problem: {
      label: "Decisiones que conviene cerrar",
      headline: "La constitución empieza antes de firmar y sigue después de obtener la documentación.",
      body: "La estructura inicial debe sostener el modo real de aportar, decidir, representar y operar.",
      signals: [
        { title: "Aportaciones sin traducir", text: "Dinero, trabajo, activos o compromisos se comentan, pero no se convierten en una estructura documentada." },
        { title: "Gobierno por defecto", text: "Se elige una fórmula sin revisar cómo se aprobarán decisiones, quién representará a la sociedad o qué ocurre ante un desacuerdo." },
        { title: "Trámites sin secuencia", text: "Documentos, firmas y altas avanzan por separado, sin un responsable que controle dependencias y cierre." },
      ],
    },
    scope: [
      { name: "Decisiones iniciales", signal: "El equipo fundador necesita acordar la lógica de la sociedad antes de documentarla.", work: "Recogemos participantes, aportaciones, actividad prevista y reglas de decisión que afectan a la estructura del encargo.", outputs: ["Mapa de participantes", "Cuestiones por decidir", "Secuencia de aprobación"] },
      { name: "Estructura", signal: "La forma elegida debe ser coherente con actividad, gobierno y jurisdicción.", work: "Contrastamos las alternativas que entran en el alcance, sus implicaciones operativas y la información necesaria para decidir.", outputs: ["Criterios de elección", "Estructura acordada", "Dependencias identificadas"] },
      { name: "Documentación", signal: "Las decisiones deben quedar reflejadas en documentos consistentes.", work: "Preparamos y coordinamos las piezas aplicables al caso, revisando nombres, roles, aportaciones y facultades antes de firma.", outputs: ["Paquete documental", "Control de consistencia", "Ruta de firmas"] },
      { name: "Cierre", signal: "La constitución formal necesita conectarse con la operación que empieza después.", work: "Ordenamos los pasos posteriores incluidos en el encargo y dejamos identificados los que corresponden al equipo o a terceros.", outputs: ["Lista de cierre", "Responsables", "Carpeta societaria inicial"] },
    ],
    deliverables: [
      { code: "SO-01", title: "Mapa de decisiones fundacionales", text: "Las cuestiones que condicionan estructura, gobierno, representación y aportaciones, reunidas antes de documentar.", contents: ["Participantes", "Aportaciones", "Reglas de decisión"] },
      { code: "SO-02", title: "Paquete documental coordinado", text: "Las piezas incluidas en el encargo, consistentes entre sí y preparadas para la secuencia de formalización aplicable.", contents: ["Datos verificados", "Documentos", "Control de firmas"] },
      { code: "SO-03", title: "Carpeta de arranque", text: "Un cierre ordenado con documentación, responsables y próximos pasos operativos identificados.", contents: ["Archivo societario", "Lista de cierre", "Próximas obligaciones"] },
    ],
    process: [
      { phase: "Alinear", text: "Ponemos por escrito participantes, aportaciones, actividad y forma de decidir.", check: "Cuestiones iniciales cerradas" },
      { phase: "Estructurar", text: "Confirmamos la solución dentro de la jurisdicción y el alcance aplicables.", check: "Estructura acordada" },
      { phase: "Documentar", text: "Preparamos, revisamos y coordinamos las piezas y firmas del encargo.", check: "Documentación consistente" },
      { phase: "Cerrar", text: "Reunimos el expediente y asignamos los pasos posteriores a cada responsable.", check: "Carpeta de arranque entregada" },
    ],
    boundary: {
      kicker: "Alcance por jurisdicción",
      title: "La estructura correcta depende del caso; la coordinación no.",
      body: "Confirmamos jurisdicción, participantes y actividad antes de definir el encargo. Los trámites, documentos y perfiles profesionales que intervienen pueden variar; se identifican expresamente en la propuesta de trabajo.",
    },
    cta: { title: "Cuéntanos cómo será la sociedad.", body: "Indica quién participa, qué actividad se prevé y en qué jurisdicción se quiere constituir. Prepararemos las preguntas que conviene resolver primero.", button: "Plantear este frente" },
  },

  digitalizacion: {
    descriptor: "Digitalización operativa",
    eyebrow: "Sistemas para la operación",
    accent: "#68bcb4",
    hero: {
      before: "Tu operación, ",
      emphasis: "bien conectada.",
      after: "",
      lead: "Convertimos procesos repartidos entre hojas, correos y conocimiento informal en una solución conectada, documentada y mantenible.",
      note: "La tecnología se elige después de entender decisiones, usuarios y datos.",
    },
    context: "digitalizacion",
    secondary: "Mapear el sistema",
    scene: {
      mode: "architecture",
      code: "SISTEMA / 01",
      core: "OPERACIÓN",
      mark: "01",
      caption: "Personas, datos, decisiones y herramientas deben compartir el mismo recorrido.",
      nodes: [
        { label: "Personas", detail: "Roles, permisos y momentos en los que alguien debe decidir." },
        { label: "Datos", detail: "Información de origen, validaciones y registro que se necesita conservar." },
        { label: "Proceso", detail: "Estados, reglas y excepciones que articulan el trabajo cotidiano." },
        { label: "Sistema", detail: "Interfaces e integraciones que sostienen el proceso sin ocultarlo." },
      ],
    },
    problem: {
      label: "Señales del problema",
      headline: "Un sistema nuevo no corrige por sí solo un proceso sin estados, responsables o datos comunes.",
      body: "Definimos esos elementos antes de elegir o construir la herramienta.",
      signals: [
        { title: "La operación vive en archivos", text: "Estados, decisiones y datos se reparten entre hojas, mensajes y carpetas sin una fuente de referencia." },
        { title: "El proceso depende de una persona", text: "Solo alguien con experiencia sabe qué paso sigue, qué excepción importa o dónde buscar la información." },
        { title: "Las herramientas no comparten contexto", text: "Cada equipo ve una parte distinta y reconstruye el caso antes de poder continuar el trabajo." },
      ],
    },
    scope: [
      { name: "Descubrimiento", signal: "El proceso necesita una lectura común antes de hablar de plataformas.", work: "Seguimos casos reales, entrevistamos a responsables y trazamos decisiones, documentos, estados y excepciones.", outputs: ["Mapa de operación", "Inventario de datos", "Fricciones priorizadas"] },
      { name: "Arquitectura", signal: "Hay que decidir qué permanece, qué se conecta y qué conviene construir.", work: "Definimos componentes, flujos de información, permisos e integraciones con criterio de mantenimiento y propiedad.", outputs: ["Arquitectura objetivo", "Decisiones técnicas", "Plan por etapas"] },
      { name: "Implantación", signal: "El sistema debe probarse dentro de la operación sin interrumpirla.", work: "Construimos por recorridos completos, validamos con usuarios y ajustamos reglas y pantallas sobre casos representativos.", outputs: ["Flujos funcionales", "Validación de usuarios", "Registro de incidencias"] },
      { name: "Transferencia", signal: "La solución necesita quedar entendida, documentada y gobernada.", work: "Entregamos repositorio, decisiones, manuales y responsabilidades; acordamos cómo se solicitan y aprueban cambios.", outputs: ["Documentación", "Responsables", "Criterios de evolución"] },
    ],
    deliverables: [
      { code: "DI-01", title: "Plano del sistema", text: "Una arquitectura que relaciona usuarios, datos, decisiones, herramientas e integraciones.", contents: ["Flujos críticos", "Modelo de información", "Permisos y dependencias"] },
      { code: "DI-02", title: "Solución en operación", text: "Los procesos prioritarios, implantados y probados con situaciones reales del equipo.", contents: ["Interfaces", "Integraciones", "Pruebas de aceptación"] },
      { code: "DI-03", title: "Base para evolucionar", text: "El conocimiento necesario para operar y cambiar el sistema sin volver a depender de memoria informal.", contents: ["Repositorio y decisiones", "Manual de operación", "Gobierno de cambios"] },
    ],
    process: [
      { phase: "Entender", text: "Observamos la operación actual y hacemos explícitas decisiones, datos y excepciones.", check: "Proceso de referencia acordado" },
      { phase: "Diseñar", text: "Definimos la arquitectura y priorizamos recorridos completos, no pantallas sueltas.", check: "Plan de implantación" },
      { phase: "Construir", text: "Desarrollamos, conectamos y probamos cada recorrido con sus usuarios.", check: "Sistema aceptado" },
      { phase: "Transferir", text: "Documentamos operación, propiedad y forma de evolucionar la solución.", check: "Equipo con control" },
    ],
    boundary: {
      kicker: "Propiedad del sistema",
      title: "La complejidad debe quedar explicada, no escondida.",
      body: "Documentamos decisiones, integraciones, permisos y procedimientos de operación. El objetivo es que el equipo entienda qué sostiene su sistema y pueda gobernar su evolución.",
    },
    cta: { title: "Enséñanos cómo trabaja hoy el equipo.", body: "Revisaremos un caso real para identificar bloqueos, prioridades y el primer recorrido que merece diseño.", button: "Plantear este frente" },
  },

  inversiones: {
    descriptor: "Inversión y financiación",
    eyebrow: "Decisiones antes del compromiso",
    accent: "#5fa9a4",
    hero: {
      before: "Antes de invertir, ",
      emphasis: "pon los datos sobre la mesa.",
      after: "",
      lead: "Organizamos objetivos, supuestos y escenarios para que todas las partes puedan comparar alternativas sobre la misma información.",
      note: "Alcance acotado a estructura, escenarios y documentación; no incluye recomendación financiera regulada ni intermediación.",
    },
    context: "inversiones",
    secondary: "Ver el alcance",
    scene: {
      mode: "scenarios",
      code: "ESCENARIOS / 01",
      core: "DECISIÓN",
      mark: "◇",
      caption: "La decisión separa datos disponibles, hipótesis, escenarios y condiciones de cierre.",
      nodes: [
        { label: "Objetivo", detail: "Qué se quiere conseguir, con qué horizonte y bajo qué restricciones." },
        { label: "Supuestos", detail: "Qué datos se consideran hechos y qué hipótesis deben probarse." },
        { label: "Escenarios", detail: "Cómo cambia la decisión cuando varían condiciones relevantes." },
        { label: "Documentos", detail: "Qué información y acuerdos sostienen la decisión y su ejecución." },
      ],
    },
    problem: {
      label: "Señales del problema",
      headline: "Cuando los supuestos no están escritos, cada parte está evaluando una operación distinta.",
      body: "Ponemos la información, las condiciones y los escenarios en un mismo marco de decisión.",
      signals: [
        { title: "Escenarios en archivos distintos", text: "Cada participante trabaja con una versión diferente de datos, hipótesis o condiciones y las comparaciones pierden consistencia." },
        { title: "Términos sin conexión documental", text: "Las conversaciones avanzan, pero las condiciones comerciales, societarias y operativas no forman todavía un paquete coherente." },
        { title: "Decisión sin registro de supuestos", text: "No queda claro qué información sostuvo la aprobación ni qué cambio obligaría a revisar el planteamiento." },
      ],
    },
    scope: [
      { name: "Objetivo y límites", signal: "La decisión necesita criterios explícitos antes de comparar alternativas.", work: "Ordenamos objetivo, participantes, restricciones, información disponible y preguntas que condicionan el análisis.", outputs: ["Marco de decisión", "Información pendiente", "Criterios de comparación"] },
      { name: "Escenarios", signal: "Los supuestos relevantes deben poder variar sin ocultar su efecto.", work: "Construimos escenarios coherentes, documentamos hipótesis y señalamos dependencias que requieren validación adicional.", outputs: ["Matriz de supuestos", "Escenarios comparables", "Sensibilidades relevantes"] },
      { name: "Estructura", signal: "La operación necesita una lógica documental consistente con la decisión.", work: "Organizamos participantes, secuencia, condiciones y piezas documentales dentro del alcance definido y con los especialistas que correspondan.", outputs: ["Mapa de estructura", "Condiciones", "Lista documental"] },
      { name: "Dossier", signal: "La aprobación debe poder reconstruirse y compartir la misma versión de la información.", work: "Reunimos criterio, escenarios, documentos y asuntos abiertos en un paquete de decisión con control de versiones.", outputs: ["Dossier de decisión", "Asuntos abiertos", "Condiciones de revisión"] },
    ],
    deliverables: [
      { code: "IN-01", title: "Matriz de supuestos", text: "Una separación clara entre datos disponibles, hipótesis de trabajo, fuentes y cuestiones pendientes.", contents: ["Supuestos documentados", "Fuente o responsable", "Condición de revisión"] },
      { code: "IN-02", title: "Dossier de escenarios", text: "Alternativas comparables bajo un conjunto consistente de variables y restricciones.", contents: ["Escenario de referencia", "Variaciones relevantes", "Implicaciones por escenario"] },
      { code: "IN-03", title: "Paquete documental de decisión", text: "La estructura, las condiciones y los documentos necesarios para continuar el análisis o ejecutar el siguiente paso acordado.", contents: ["Mapa de estructura", "Lista documental", "Asuntos por cerrar"] },
    ],
    process: [
      { phase: "Delimitar", text: "Acordamos objetivo, información disponible, restricciones y alcance del análisis.", check: "Marco de decisión" },
      { phase: "Modelar", text: "Documentamos supuestos y construimos escenarios que puedan compararse.", check: "Escenarios revisados" },
      { phase: "Estructurar", text: "Ordenamos participantes, condiciones y documentación que sostienen el siguiente paso.", check: "Estructura coherente" },
      { phase: "Documentar", text: "Reunimos la versión de decisión, los asuntos abiertos y las condiciones de revisión.", check: "Dossier entregado" },
    ],
    boundary: {
      kicker: "Alcance deliberadamente acotado",
      title: "Estructura, escenarios y documentación. Nada de promesas de rentabilidad.",
      body: "Este servicio no comprende asesoramiento financiero regulado, recepción o transmisión de órdenes, intermediación, custodia ni recomendaciones individualizadas de compra o venta. Si el caso requiere perfiles autorizados, se identifica y coordina expresamente.",
    },
    cta: { title: "Comparte la operación que quieres evaluar.", body: "Revisaremos el objetivo, la información disponible y los supuestos para delimitar qué análisis y documentación resultan útiles.", button: "Plantear este frente" },
  },

  crecimiento: {
    descriptor: "Posicionamiento y captación",
    eyebrow: "Del mensaje al seguimiento comercial",
    accent: "#62aaa6",
    hero: {
      before: "Cada oportunidad ",
      emphasis: "tiene un siguiente paso.",
      after: "",
      lead: "Conectamos propuesta, contenido, formularios y CRM para que cada oportunidad llegue con contexto, responsable y próxima acción.",
      note: "El sistema se diseña alrededor del recorrido del cliente y de la capacidad real del equipo para atenderlo.",
    },
    context: "crecimiento",
    secondary: "Recorrer el sistema",
    scene: {
      mode: "growth",
      code: "RECORRIDO / 01",
      core: "OPORTUNIDAD",
      mark: "CRM",
      caption: "Cada oportunidad debe llegar al CRM con contexto, responsable y siguiente acción.",
      nodes: [
        { label: "Posición", detail: "A quién se habla, qué problema se resuelve y por qué resulta relevante." },
        { label: "Contenido", detail: "Piezas y secuencias que desarrollan la propuesta sin repetir eslóganes." },
        { label: "Captación", detail: "Puntos de entrada con contexto suficiente para valorar la oportunidad." },
        { label: "Seguimiento", detail: "CRM, responsabilidad y siguiente acción para que el interés no se pierda." },
      ],
    },
    problem: {
      label: "Señales del problema",
      headline: "Publicar más no arregla una propuesta difusa ni una oportunidad sin seguimiento.",
      body: "Trabajamos el sistema completo: qué se dice, cómo se capta contexto y quién continúa la conversación.",
      signals: [
        { title: "Contenido sin posición", text: "La marca comunica actividad, pero no deja claro qué problema resuelve, para quién ni con qué enfoque." },
        { title: "Interés sin contexto", text: "Los formularios y mensajes generan contactos, pero no reúnen la información necesaria para priorizar o responder bien." },
        { title: "Oportunidades fuera del CRM", text: "Las oportunidades quedan repartidas entre redes, correo y agendas; nadie ve el historial ni la siguiente acción." },
      ],
    },
    scope: [
      { name: "Posicionamiento", signal: "La oferta necesita una formulación precisa antes de producir contenido.", work: "Ordenamos audiencias, problemas, propuesta, pruebas disponibles y lenguaje; definimos qué merece repetirse y qué debe desaparecer.", outputs: ["Arquitectura de mensajes", "Prioridades de audiencia", "Guía de lenguaje"] },
      { name: "Sistema editorial", signal: "El contenido debe sostener una idea a lo largo del tiempo y de varios formatos.", work: "Diseñamos temas, series, formatos y circuitos de aprobación ajustados a la capacidad del equipo.", outputs: ["Líneas editoriales", "Formatos", "Flujo de producción"] },
      { name: "Captación", signal: "El interés necesita un siguiente paso claro y una entrada con contexto.", work: "Conectamos piezas, páginas, formularios y criterios de calificación sin añadir fricción innecesaria.", outputs: ["Recorridos de entrada", "Campos y criterios", "Mensajes de continuidad"] },
      { name: "CRM y seguimiento", signal: "Cada oportunidad necesita responsable, estado e historial.", work: "Definimos el paso al CRM, reglas de asignación, cadencias y señales para continuar, pausar o cerrar el seguimiento.", outputs: ["Modelo de oportunidad", "Responsables", "Secuencias de seguimiento"] },
    ],
    deliverables: [
      { code: "GR-01", title: "Sistema de posicionamiento", text: "Una base común para que web, contenido y conversaciones comerciales expresen la misma propuesta.", contents: ["Audiencias", "Arquitectura de mensajes", "Criterios de tono"] },
      { code: "GR-02", title: "Recorrido de captación", text: "Puntos de entrada y formularios conectados con la información que el equipo necesita para responder.", contents: ["Piezas de entrada", "Contexto capturado", "Criterios de prioridad"] },
      { code: "GR-03", title: "Operación de seguimiento", text: "Estados, responsables y secuencias para continuar cada oportunidad dentro del CRM.", contents: ["Modelo de datos", "Reglas de asignación", "Cadencias"] },
    ],
    process: [
      { phase: "Enfocar", text: "Acordamos audiencia, problema, propuesta y señales que ya existen.", check: "Posición definida" },
      { phase: "Diseñar", text: "Conectamos mensajes, contenido, puntos de entrada y modelo de oportunidad.", check: "Recorrido completo" },
      { phase: "Implantar", text: "Construimos piezas, formularios, CRM y reglas de asignación necesarias.", check: "Sistema operativo" },
      { phase: "Transferir", text: "Documentamos producción, seguimiento y criterios de revisión para el equipo.", check: "Responsables preparados" },
    ],
    boundary: {
      kicker: "Un solo recorrido",
      title: "La comunicación termina cuando el equipo sabe qué hacer con la respuesta.",
      body: "No separamos redes, página, formulario y CRM como encargos inconexos. Definimos qué contexto viaja entre ellos y quién asume la siguiente acción.",
    },
    cta: { title: "Revisemos tu recorrido comercial.", body: "Comparte la oferta, los canales actuales y cómo realiza el equipo el seguimiento. Identificaremos dónde se pierden oportunidades o información.", button: "Plantear este frente" },
  },

  jotform: {
    descriptor: "Jotform y flujos de datos",
    eyebrow: "Formularios conectados a operación",
    accent: "#79d2c5",
    hero: {
      before: "Una respuesta entra. ",
      emphasis: "El trabajo empieza.",
      after: "",
      lead: "Diseñamos formularios y portales sobre Jotform con validaciones, lógica, integraciones y seguimiento para que cada respuesta llegue al sistema y a la persona correctos.",
      note: "La herramienta es una pieza del sistema; el criterio de datos y la responsabilidad siguen perteneciendo al equipo.",
    },
    context: "jotform",
    secondary: "Seguir el dato",
    scene: {
      mode: "intake",
      code: "DATO / 01",
      core: "REGISTRO",
      mark: "{ }",
      caption: "Cada respuesta se valida, se registra y llega al sistema y al responsable definidos.",
      nodes: [
        { label: "Captura", detail: "Preguntas, ayudas y secuencia ajustadas a la información que se necesita." },
        { label: "Validación", detail: "Formatos, condiciones y comprobaciones antes de aceptar el dato." },
        { label: "Enrutado", detail: "Reglas que asignan cada respuesta al proceso y responsable adecuados." },
        { label: "Registro", detail: "Integración, estado e historial para continuar el trabajo sin copiar información." },
      ],
    },
    problem: {
      label: "Señales del problema",
      headline: "El formulario debe reducir correcciones y activar el trabajo posterior sin copias manuales.",
      body: "Su calidad se mide por los datos utilizables y el recorrido que inicia.",
      signals: [
        { title: "Datos que no se pueden usar", text: "Las respuestas llegan incompletas, ambiguas o con formatos distintos y el equipo debe reconstruir el contexto." },
        { title: "Copias entre sistemas", text: "Cada envío acaba en una bandeja, una hoja o una tarea creada a mano, multiplicando errores y tiempos de espera." },
        { title: "Sin estado ni responsable", text: "La persona que envió no sabe qué ocurre y el equipo no puede ver con claridad quién debe continuar el caso." },
      ],
    },
    scope: [
      { name: "Captura", signal: "El formulario necesita preguntar solo lo que la decisión posterior utiliza.", work: "Definimos propósito, perfiles, campos, ayudas y secuencia a partir del proceso que recibe la información.", outputs: ["Mapa de datos", "Arquitectura de campos", "Recorrido de usuario"] },
      { name: "Reglas", signal: "Distintos casos necesitan preguntas, validaciones o rutas diferentes.", work: "Diseñamos condiciones, validaciones y mensajes para reducir errores sin convertir el formulario en una barrera.", outputs: ["Lógica condicional", "Validaciones", "Mensajes de error y cierre"] },
      { name: "Integraciones", signal: "El envío debe crear o actualizar trabajo en otros sistemas.", work: "Conectamos los destinos necesarios, definimos correspondencias de datos y tratamos duplicados, fallos y reintentos.", outputs: ["Mapa de integración", "Correspondencia de campos", "Tratamiento de errores"] },
      { name: "Operación", signal: "El equipo necesita saber quién recibe, revisa y cierra cada respuesta.", work: "Establecemos estados, asignación, avisos y registro; documentamos cómo cambiar el formulario sin romper el flujo.", outputs: ["Estados y responsables", "Notificaciones", "Manual de operación"] },
    ],
    deliverables: [
      { code: "JF-01", title: "Arquitectura de captura", text: "Una relación explícita entre cada dato solicitado y la decisión o tarea que lo utiliza.", contents: ["Campos necesarios", "Lógica condicional", "Criterios de validación"] },
      { code: "JF-02", title: "Flujo conectado", text: "El formulario implantado con sus reglas, destinos y tratamiento de errores dentro del proceso acordado.", contents: ["Formulario", "Integraciones", "Rutas de excepción"] },
      { code: "JF-03", title: "Protocolo de operación", text: "El equipo puede revisar respuestas, resolver incidencias y cambiar el sistema con una referencia común.", contents: ["Estados", "Responsabilidades", "Guía de cambios"] },
    ],
    process: [
      { phase: "Definir", text: "Acordamos qué decisión o trabajo debe activar cada respuesta.", check: "Propósito y datos definidos" },
      { phase: "Diseñar", text: "Construimos preguntas, condiciones, validaciones y mensajes de continuidad.", check: "Recorrido validado" },
      { phase: "Conectar", text: "Integramos destinos, probamos errores y confirmamos el registro del estado.", check: "Flujo funcional" },
      { phase: "Operar", text: "Documentamos responsables, incidencias y forma segura de introducir cambios.", check: "Equipo preparado" },
    ],
    boundary: {
      kicker: "Herramienta dentro del sistema",
      title: "Jotform cuando encaja. Otra solución cuando el proceso lo exige.",
      body: "No presentamos la plataforma como respuesta automática a cualquier captura. Primero definimos datos, decisiones, permisos e integraciones; después confirmamos si Jotform es la pieza adecuada y hasta dónde llega la implantación.",
    },
    cta: { title: "Cuéntanos qué debe ocurrir después del envío.", body: "Muéstranos qué se pregunta, dónde llega la información y quién debe continuar el trabajo. Localizaremos los cortes del recorrido.", button: "Plantear este frente" },
  },
};

const PAGE_ALIASES = {
  "asesoria-legal": "legal",
  agentes: "ia",
  automatizacion: "automatizacion",
  constitucion: "constitucion",
  digitalizacion: "digitalizacion",
  inversiones: "inversiones",
  "redes-sociales": "crecimiento",
  jotform: "jotform",
};

function Arrow({ diagonal = false }) {
  return <span className="sp-arrow" aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
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

function SystemScene({ scene }) {
  const reducedMotion = useReducedMotion();
  const sceneRef = useRef(null);
  const tabRefs = useRef([]);
  const { phase: active, selectPhase } = useScrollScene({ ref: sceneRef, count: scene.nodes.length, reducedMotion, resetKey: scene.mode });

  const move = (event, index) => {
    let next = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % scene.nodes.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + scene.nodes.length) % scene.nodes.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = scene.nodes.length - 1;
    else return;
    event.preventDefault();
    selectPhase(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <div ref={sceneRef} className={`sp-scene sp-scene--${scene.mode}`} data-phase={active} aria-label={`Diagrama interactivo: ${scene.caption}`}>
      <div className="sp-scene__topline">
        <span>{scene.code}</span>
        <span className="sp-scene__phase-index">0{active + 1} / 0{scene.nodes.length}</span>
      </div>
      <ServiceMoment mode={scene.mode} stage={active} reducedMotion={reducedMotion} />
      <div className="sp-scene__journey">
        <div className="sp-scene__stages" role="tablist" aria-label="Secuencia de trabajo">
          {scene.nodes.map((node, index) => (
            <button
              key={node.label}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`scene-tab-${index}`}
              className={`${active === index ? "is-active" : ""}${active > index ? " is-complete" : ""}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="scene-detail"
              tabIndex={active === index ? 0 : -1}
              onClick={() => selectPhase(index)}
              onKeyDown={(event) => move(event, index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{node.label}</b>
            </button>
          ))}
        </div>
      </div>
      <div id="scene-detail" className="sp-scene__detail" role="tabpanel" aria-labelledby={`scene-tab-${active}`}>
        <div><span>{String(active + 1).padStart(2, "0")} / {scene.nodes[active].label}</span></div>
        <p key={scene.nodes[active].label}>{scene.nodes[active].detail}</p>
      </div>
      <p className="sp-scene__caption">Ejemplo ilustrativo. {scene.caption}</p>
    </div>
  );
}

function Hero({ config }) {
  return (
    <section className="sp-hero" aria-labelledby="page-title">
      <div className="sp-hero__field" aria-hidden="true"><i /><i /><i /></div>
      <div className="sp-shell sp-hero__layout">
        <div className="sp-hero__copy" data-reveal>
          <div className="sp-kicker sp-kicker--light"><span>01</span>{config.eyebrow}</div>
          <h1 id="page-title">{config.hero.before}<em>{config.hero.emphasis}</em>{config.hero.after}</h1>
          <p className="sp-hero__lead">{config.hero.lead}</p>
          <div className="sp-actions">
            <a className="sp-button sp-button--signal" href={`contacto.html?context=${config.context}`}>Hablemos de tu proyecto <Arrow /></a>
            <a className="sp-button sp-button--ghost" href="#alcance">{config.secondary} <Arrow /></a>
          </div>
          <p className="sp-hero__note"><span aria-hidden="true">◌</span>{config.hero.note}</p>
        </div>
        <div className="sp-hero__visual" data-reveal>
          <SystemScene scene={config.scene} />
        </div>
      </div>
      <div className="sp-shell sp-hero__foot" aria-label="Principios de trabajo">
        <span>Hechos antes que herramienta</span>
        <span>Alcance documentado</span>
        <span>Reglas y responsables visibles</span>
      </div>
    </section>
  );
}

function Signals({ problem }) {
  return (
    <section className="sp-signals" aria-labelledby="signals-title">
      <div className="sp-shell sp-signals__layout">
        <div className="sp-signals__intro" data-reveal>
          <div className="sp-kicker"><span>02</span>{problem.label}</div>
          <h2 id="signals-title">{problem.headline}</h2>
          <p>{problem.body}</p>
        </div>
        <ol className="sp-signals__list">
          {problem.signals.map((signal, index) => (
            <li key={signal.title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{signal.title}</h3><p>{signal.text}</p></div>
              <i aria-hidden="true">↘</i>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Scope({ scope }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const item = scope[active];

  const move = (event, index) => {
    let next = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % scope.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + scope.length) % scope.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = scope.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <section id="alcance" className="sp-scope" aria-labelledby="scope-title">
      <div className="sp-shell">
        <div className="sp-scope__head" data-reveal>
          <div className="sp-kicker sp-kicker--light"><span>03</span>Alcance del encargo</div>
          <h2 id="scope-title">Qué hacemos.<br />Y hasta dónde llegamos.</h2>
          <p>Selecciona un frente para ver la situación, el trabajo y el resultado esperado.</p>
        </div>
        <div className="sp-scope__workspace" data-reveal>
          <div className="sp-scope__tabs" role="tablist" aria-label="Frentes de trabajo">
            {scope.map((entry, index) => (
              <button
                key={entry.name}
                ref={(element) => { refs.current[index] = element; }}
                id={`scope-tab-${index}`}
                className={active === index ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="scope-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => move(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {entry.name}
                <Arrow />
              </button>
            ))}
          </div>
          <article id="scope-panel" className="sp-scope__panel" role="tabpanel" aria-labelledby={`scope-tab-${active}`} key={item.name}>
            <span className="sp-scope__watermark" aria-hidden="true">{String(active + 1).padStart(2, "0")}</span>
            <div className="sp-scope__signal"><span>Punto de partida</span><p>{item.signal}</p></div>
            <div className="sp-scope__work"><span>Trabajo</span><h3>{item.name}</h3><p>{item.work}</p></div>
            <div className="sp-scope__outputs"><span>Resultado de esta fase</span><ul>{item.outputs.map((output) => <li key={output}>{output}</li>)}</ul></div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Deliverables({ deliverables }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const item = deliverables[active];

  const selectByKeyboard = (event, index) => {
    let next = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % deliverables.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + deliverables.length) % deliverables.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = deliverables.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <section className="sp-deliverables" aria-labelledby="deliverables-title">
      <div className="sp-shell">
        <div className="sp-deliverables__head" data-reveal>
          <div className="sp-kicker"><span>04</span>Entregables</div>
          <h2 id="deliverables-title">El trabajo queda<br />en tus manos.</h2>
        </div>
        <div className="sp-deliverables__theatre" data-reveal>
          <article id="deliverable-panel" role="tabpanel" aria-labelledby={`deliverable-tab-${active}`} key={item.code}>
            <div className="sp-deliverables__folio">
              <span>{item.code}</span>
              <span>Documento de trabajo</span>
            </div>
            <div className="sp-deliverables__copy">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
            <ol>{item.contents.map((content, index) => <li key={content}><span>{index + 1}</span>{content}</li>)}</ol>
          </article>
          <div className="sp-deliverables__nav" role="tablist" aria-label="Entregables del servicio">
            {deliverables.map((entry, index) => (
              <button
                key={entry.code}
                ref={(element) => { refs.current[index] = element; }}
                id={`deliverable-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="deliverable-panel"
                tabIndex={active === index ? 0 : -1}
                className={active === index ? "is-active" : ""}
                onClick={() => setActive(index)}
                onKeyDown={(event) => selectByKeyboard(event, index)}
              >
                <span>{entry.code}</span>
                {entry.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process({ process }) {
  return (
    <section id="proceso" className="sp-process" aria-labelledby="process-title">
      <div className="sp-shell">
        <div className="sp-process__head" data-reveal>
          <div className="sp-kicker"><span>05</span>De la delimitación a la transferencia</div>
          <h2 id="process-title">De la primera pregunta<br />a la puesta en marcha.</h2>
          <p>Acordamos qué debe quedar resuelto en cada fase. Así puedes seguir el avance y decidir con toda la información.</p>
        </div>
        <ol className="sp-process__steps">
          {process.map((step, index) => (
            <li key={step.phase} data-reveal>
              <span className="sp-process__number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.phase}</h3>
              <p>{step.text}</p>
              <div><i aria-hidden="true" />{step.check}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Boundary({ boundary }) {
  return (
    <aside className="sp-boundary" aria-labelledby="boundary-title">
      <div className="sp-shell sp-boundary__layout" data-reveal>
        <div className="sp-boundary__signal" aria-hidden="true"><span /><span /><span /></div>
        <div>
          <div className="sp-kicker sp-kicker--light"><span>06</span>{boundary.kicker}</div>
          <h2 id="boundary-title">{boundary.title}</h2>
          <p>{boundary.body}</p>
        </div>
      </div>
    </aside>
  );
}

function ContactCTA({ cta, context }) {
  return (
    <section className="sp-contact" aria-labelledby="contact-title">
      <div className="sp-contact__orbit" aria-hidden="true"><i /><i /></div>
      <div className="sp-shell sp-contact__inner" data-reveal>
        <div className="sp-kicker sp-kicker--light"><span>07</span>Revisión de encaje</div>
        <h2 id="contact-title">{cta.title}</h2>
        <p>{cta.body}</p>
        <a className="sp-button sp-button--signal" href={`contacto.html?context=${context}`}>{cta.button} <Arrow /></a>
        <small>No necesitas una presentación: basta con describir el caso, quién interviene y qué debe decidirse.</small>
      </div>
    </section>
  );
}

function App() {
  const pathname = window.location.pathname.split("/").pop()?.replace(/\.html$/, "") || "";
  const requested = document.body.dataset.specialty || PAGE_ALIASES[pathname] || "legal";
  const config = SPECIALTIES[requested] || SPECIALTIES.legal;
  useReveal();

  return (
    <div className="sp-site">
      <window.MedlaSiteHeader current="services" context={config.context} />
      <main id="main-content">
        <Hero config={config} />
        <Signals problem={config.problem} />
        <Scope scope={config.scope} />
        <Deliverables deliverables={config.deliverables} />
        <Process process={config.process} />
        <Boundary boundary={config.boundary} />
        <ContactCTA cta={config.cta} context={config.context} />
      </main>
      <window.MedlaSiteFooter context={config.context} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
