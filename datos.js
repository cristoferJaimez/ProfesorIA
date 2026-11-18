// Datos simulados del prototipo. No hay servidor ni cuentas reales.
const DATOS = {
  diagnostico: [
    { p: '¿Ha usado alguna herramienta de IA en su trabajo?', o: ['Nunca', 'Algunas veces', 'Con frecuencia'] },
    { p: '¿En qué tarea le gustaría empezar a usar la IA?', o: ['Planear clases', 'Calificar', 'Crear material', 'Informes'] },
    { p: '¿Qué tanto confía en las respuestas de la IA?', o: ['Nada', 'Algo', 'Bastante'] },
    { p: '¿Cuánto tiempo puede dedicarle al día?', o: ['5 minutos', '10 minutos', '20 minutos'] },
    { p: '¿Qué le preocupa más de la IA en su clase?', o: ['Que los estudiantes copien', 'Que la IA se equivoque', 'No saber usarla'] },
  ],

  lecciones: [
    {
      id: 'l1', tarea: 'Primeros pasos', min: 5, titulo: 'Qué es la IA y qué no hace',
      intro: 'La IA generativa escribe textos, crea imágenes y responde preguntas a partir de lo que usted le pide. No piensa ni sabe si algo es cierto: predice la respuesta más probable.',
      pasos: ['Úsela como asistente: usted decide y revisa.', 'Puede inventar datos, fechas o citas. Verifique siempre.', 'No comparta datos personales de sus estudiantes.'],
      prompt: 'Explícame en 5 frases sencillas qué es la inteligencia artificial generativa, para docentes que nunca la han usado.',
      resultado: 'Una explicación corta y clara que puede usar en una reunión de área.',
      respuesta: '1. La inteligencia artificial generativa es un programa que crea textos, imágenes o ideas a partir de lo que usted le pide.\n2. Aprendió de millones de ejemplos y responde con lo que parece más probable.\n3. No piensa ni entiende como una persona, y puede equivocarse.\n4. Sirve para ahorrar tiempo en tareas como planear o redactar.\n5. Usted siempre revisa y decide qué usar.',
    },
    {
      id: 'l2', tarea: 'Primeros pasos', min: 8, titulo: 'Su primera instrucción (prompt)',
      intro: 'Una buena instrucción le dice a la IA quién es, qué necesita, para quién y en qué formato.',
      pasos: ['Rol: "Actúa como docente de…".', 'Tarea y contexto: grado, tema y tiempo.', 'Formato: lista, tabla o pasos.', 'Revise y pida ajustes: "hazlo más corto", "agrega un ejemplo".'],
      prompt: 'Actúa como docente de lenguaje de grado 5.°. Propón 3 preguntas para iniciar una clase sobre la fábula, en lenguaje sencillo.',
      resultado: 'Tres preguntas listas para empezar la clase.',
      respuesta: '1. ¿Qué animales has visto en un cuento que hablen o actúen como personas?\n2. ¿Por qué crees que algunos cuentos terminan con una enseñanza?\n3. Si fueras un animal de una fábula, ¿cuál serías y qué enseñarías?',
    },
    {
      id: 'l3', tarea: 'Planear clases', min: 8, titulo: 'Planear una clase con IA',
      intro: 'La IA puede darle una primera versión de su planeación en segundos. Usted la ajusta a su grupo.',
      pasos: ['Indique grado, área, tema y duración.', 'Pida momentos de la clase: inicio, desarrollo y cierre.', 'Pida al menos una actividad donde el estudiante explique con sus palabras.', 'Ajuste lo que no corresponda a su contexto.'],
      prompt: 'Actúa como docente de ciencias naturales de grado 7.° en Colombia. Diseña una clase de 50 minutos sobre el ciclo del agua con: objetivo, actividad de inicio, desarrollo, cierre y una pregunta para que los estudiantes expliquen con sus palabras.',
      resultado: 'Una planeación de 50 minutos con objetivo, tres momentos y una pregunta de reflexión.',
      respuesta: 'Clase: El ciclo del agua (grado 7.°, 50 minutos)\n\nObjetivo: explicar las etapas del ciclo del agua y su importancia.\n\nInicio (10 min): pregunte «¿De dónde viene el agua de la lluvia?» y anote las ideas en el tablero.\n\nDesarrollo (30 min): en grupos, dibujan el ciclo con evaporación, condensación, precipitación y escorrentía, y explican cada etapa con un ejemplo de su región.\n\nCierre (10 min): cada grupo presenta su dibujo.\n\nPregunta de reflexión: ¿qué pasaría en tu municipio si una de las etapas se detuviera? Explícalo con tus palabras.',
    },
    {
      id: 'l4', tarea: 'Calificar', min: 10, titulo: 'Rúbricas para calificar más rápido',
      intro: 'Con una rúbrica clara califica más rápido y el estudiante entiende qué se espera.',
      pasos: ['Indique la actividad y los criterios que le importan.', 'Pida 4 niveles de desempeño.', 'Revise que el lenguaje sea claro para el estudiante.'],
      prompt: 'Crea una rúbrica de 4 niveles (superior, alto, básico, bajo) para evaluar un ensayo corto de grado 9.° con estos criterios: idea principal, argumentos, ortografía y conclusión. Preséntala en tabla.',
      resultado: 'Una tabla con criterios y niveles que puede imprimir o compartir.',
      respuesta: 'Criterio | Superior | Alto | Básico | Bajo\nIdea principal | Clara y original | Clara | Poco clara | No se identifica\nArgumentos | 3 o más, bien sustentados | 2 sustentados | 1 o sin sustento | No presenta\nOrtografía | Sin errores | 1 a 3 errores | 4 a 6 errores | Más de 6 errores\nConclusión | Retoma la idea y aporta | Retoma la idea | Incompleta | No tiene',
    },
    {
      id: 'l5', tarea: 'Crear material', min: 7, titulo: 'Revisar los errores de la IA',
      intro: 'La IA puede sonar segura y estar equivocada. Revisar sus respuestas es parte del trabajo.',
      pasos: ['Verifique fechas, nombres y cifras en una fuente confiable.', 'Pida a la IA que cite de dónde sale el dato y compruébelo.', 'Practique con el detector de errores de la app.'],
      prompt: 'Revisa el siguiente texto y señala qué afirmaciones debería verificar en una fuente confiable antes de usarlo en clase: [pegue aquí el texto].',
      resultado: 'Una lista de datos a verificar antes de llevar el material al aula.',
      respuesta: 'Afirmaciones que debe verificar:\n1. Las fechas y años que menciona el texto.\n2. Los nombres de personas y lugares.\n3. Las cifras y porcentajes.\n4. Las citas textuales: confirme quién lo dijo y dónde.\n\nSugerencia: compare con el libro de texto o una fuente oficial antes de llevarlo a clase.',
    },
    {
      id: 'l6', tarea: 'Uso responsable', min: 8, titulo: 'Uso responsable en clase',
      intro: 'El objetivo no es prohibir la IA, sino diseñar actividades donde el estudiante tenga que pensar.',
      pasos: ['Pida el proceso, no solo la respuesta.', 'Use la IA como punto de partida para comparar y corregir.', 'Cierre con una explicación oral o escrita sin pantalla.'],
      prompt: 'Propón una actividad de 20 minutos para grado 8.° en la que los estudiantes usen la IA para obtener una respuesta sobre la Independencia de Colombia y luego tengan que verificarla y corregirla en grupo.',
      resultado: 'Una actividad donde la IA es el inicio y el estudiante hace el trabajo de pensar.',
      respuesta: 'Actividad: «La IA dijo… ¿es cierto?» (20 minutos)\n\n1. (5 min) Cada grupo pregunta a la IA: ¿cuándo y cómo fue la Independencia de Colombia?\n2. (8 min) Con el libro de sociales, marcan qué datos son correctos y cuáles deben corregirse o ampliarse.\n3. (5 min) Escriben con sus palabras una versión corregida.\n4. (2 min) Cierre: ¿qué aprendimos sobre confiar en la IA?',
    },
    {
      id: 'l7', tarea: 'Informes', min: 8, titulo: 'Observaciones para informes',
      intro: 'La IA le ayuda a redactar observaciones claras y respetuosas a partir de sus notas.',
      pasos: ['Escriba sus notas sin nombres reales.', 'Pida un tono respetuoso y una recomendación concreta.', 'Revise y personalice antes de enviar.'],
      prompt: 'Con estas notas, redacta una observación de 3 frases para el informe de un estudiante de grado 4.°, en tono respetuoso y con una recomendación para la casa: participa poco, buena comprensión lectora, le cuesta la entrega a tiempo.',
      resultado: 'Una observación lista para el informe, sin datos personales.',
      respuesta: 'El estudiante demuestra buena comprensión lectora y entiende con facilidad los textos trabajados en clase. Se le invita a participar más en las actividades grupales y a cumplir con las entregas en las fechas acordadas. En casa, se recomienda establecer un horario fijo para revisar las tareas pendientes.',
    },
    {
      id: 'l8', tarea: 'Diseñar evaluaciones', min: 9, titulo: 'Preguntas de evaluación con IA',
      intro: 'Pida preguntas variadas y revise que midan lo que usted enseñó.',
      pasos: ['Indique tema, grado y número de preguntas.', 'Pida diferentes niveles: recordar, comprender y aplicar.', 'Incluya las respuestas para revisarlas usted.'],
      prompt: 'Crea 6 preguntas sobre fracciones para grado 5.°: 2 de recordar, 2 de comprender y 2 de aplicar en situaciones de la vida diaria. Incluye las respuestas al final.',
      resultado: 'Seis preguntas organizadas por nivel, con sus respuestas.',
      respuesta: 'Recordar\n1. ¿Qué indica el denominador de una fracción?\n2. Escribe la fracción que representa tres partes de un total de ocho.\n\nComprender\n3. ¿Qué fracción es mayor, 1/2 o 1/4? Explica por qué.\n4. Representa 2/3 con un dibujo.\n\nAplicar\n5. Una pizza se divide en 8 porciones y te comes 3. ¿Qué fracción queda?\n6. Tienes $10.000 y gastas la mitad. ¿Cuánto dinero te queda?\n\nRespuestas: 1. En cuántas partes iguales se divide el total. 2. 3/8. 3. 1/2, porque sus partes son más grandes. 4. Un dibujo con 2 de 3 partes coloreadas. 5. 5/8. 6. $5.000.',
    },
    {
      id: 'l9', tarea: 'Padres y estudiantes', min: 6, titulo: 'Mensajes para padres de familia',
      intro: 'Redacte mensajes claros y cordiales en menos tiempo.',
      pasos: ['Indique el propósito del mensaje.', 'Pida un tono cordial y breve.', 'Revise que no tenga datos sensibles.'],
      prompt: 'Redacta un mensaje corto y cordial para los padres de grado 3.° recordando la reunión del viernes a las 7:00 a. m. y pidiendo confirmar asistencia.',
      resultado: 'Un mensaje listo para enviar por la agenda o el grupo de padres.',
      respuesta: 'Estimados padres de familia de grado 3.°:\n\nLes recordamos que el viernes a las 7:00 a. m. tendremos reunión en el salón. Les agradecemos confirmar su asistencia respondiendo este mensaje.\n\nCordialmente,\nDocente de grado 3.°',
    },
  ],

  ruta: ['l1', 'l2', 'l3', 'l5', 'l6'],

  tareas: [
    { nombre: 'Planear clases', ic: 'P' },
    { nombre: 'Calificar', ic: 'C' },
    { nombre: 'Informes', ic: 'I' },
    { nombre: 'Crear material', ic: 'M' },
    { nombre: 'Diseñar evaluaciones', ic: 'E' },
    { nombre: 'Padres y estudiantes', ic: 'F' },
  ],

  herramientas: [
    { id: 'chatgpt', nombre: 'ChatGPT', empresa: 'OpenAI', tipo: 'Textos', uso: 'Planeaciones, explicaciones, preguntas y textos.', limites: 'Puede inventar datos y citas. Verifique fechas y cifras.', costo: 'Gratis con límites · plan pago opcional', ideal: 'Primera versión de una planeación' },
    { id: 'gemini', nombre: 'Gemini', empresa: 'Google', tipo: 'Textos', uso: 'Respuestas, resúmenes y apoyo con documentos de Google.', limites: 'Puede equivocarse con datos recientes. Requiere cuenta de Google.', costo: 'Gratis con límites · plan pago opcional', ideal: 'Buscar ideas y contenido para clase' },
    { id: 'copilot', nombre: 'Copilot', empresa: 'Microsoft', tipo: 'Textos', uso: 'Textos, resúmenes y apoyo en Word y PowerPoint.', limites: 'Algunas funciones dentro de Office requieren licencia.', costo: 'Gratis con límites · plan pago opcional', ideal: 'Informes y presentaciones' },
    { id: 'claude', nombre: 'Claude', empresa: 'Anthropic', tipo: 'Textos', uso: 'Textos largos, rúbricas y revisión de documentos.', limites: 'Puede equivocarse. Verifique la información importante.', costo: 'Gratis con límites · plan pago opcional', ideal: 'Revisar y mejorar textos largos' },
    { id: 'notebooklm', nombre: 'NotebookLM', empresa: 'Google', tipo: 'Textos', uso: 'Resúmenes y preguntas a partir de documentos que usted carga.', limites: 'Solo responde con base en las fuentes que usted le da.', costo: 'Gratis con límites', ideal: 'Estudiar un documento o guía' },
    { id: 'canva', nombre: 'Canva IA', empresa: 'Canva', tipo: 'Imágenes', uso: 'Presentaciones, imágenes y material visual.', limites: 'Las imágenes pueden traer errores en los textos.', costo: 'Gratis con límites · cuentas educativas', ideal: 'Material visual para la clase' },
  ],

  detector: {
    tema: 'Respuesta de una IA sobre geografía de Colombia',
    frases: [
      { t: 'Colombia está ubicada en el noroccidente de América del Sur.', error: false },
      { t: 'Su capital es Bogotá, ubicada en la cordillera Oriental.', error: false },
      { t: 'El río Magdalena desemboca en el océano Pacífico.', error: true, nota: 'El río Magdalena desemboca en el mar Caribe, cerca de Barranquilla.' },
      { t: 'Colombia tiene costas sobre el mar Caribe y el océano Pacífico.', error: false },
      { t: 'La capital del departamento de Antioquia es Cali.', error: true, nota: 'La capital de Antioquia es Medellín. Cali es la capital del Valle del Cauca.' },
      { t: 'El país se divide en 32 departamentos y un distrito capital.', error: false },
    ],
  },

  actividades: [
    { titulo: 'Compare y corrija', grado: '6.° a 11.°', min: 20, desc: 'Los estudiantes piden a la IA una respuesta sobre el tema y, en grupo, la verifican y corrigen con el libro o fuentes confiables.', pasos: ['Formule una pregunta del tema.', 'Cada grupo consulta la IA.', 'Verifican tres datos en una fuente.', 'Presentan qué corrigieron y por qué.'] },
    { titulo: 'Primero la pregunta', grado: '3.° a 9.°', min: 15, desc: 'Antes de usar la IA, el estudiante escribe sus propias preguntas e hipótesis. Después compara con lo que responde la IA.', pasos: ['Escriban tres preguntas propias.', 'Respondan lo que creen.', 'Consulten la IA.', 'Comparen: ¿en qué acertaron?'] },
    { titulo: 'Defienda su respuesta', grado: '5.° a 11.°', min: 20, desc: 'El estudiante explica sin pantalla lo que aprendió y responde preguntas de sus compañeros.', pasos: ['Cada estudiante prepara 1 minuto de explicación.', 'Expone sin pantalla.', 'Responde dos preguntas.'] },
    { titulo: 'Encuentre el error', grado: '4.° a 11.°', min: 15, desc: 'El docente lleva un texto generado por IA con errores escondidos. Gana quien los encuentre y explique.', pasos: ['Entregue el texto impreso.', 'Busquen errores en parejas.', 'Expliquen cómo verificaron.'] },
    { titulo: 'Mejore la instrucción', grado: '8.° a 11.°', min: 25, desc: 'Los estudiantes mejoran una instrucción mal escrita y comparan los resultados.', pasos: ['Muestre una instrucción vaga.', 'Los grupos la mejoran.', 'Comparan resultados.', 'Concluyen qué hace buena una instrucción.'] },
    { titulo: 'Bitácora de uso', grado: '6.° a 11.°', min: 10, desc: 'Cada vez que usen IA en una tarea, anotan qué pidieron, qué verificaron y qué cambiaron.', pasos: ['Entregue el formato de bitácora.', 'Revise la bitácora junto con la tarea.'] },
  ],

  plantillas: [
    { id: 'plan', titulo: 'Planeación de clase', desc: 'Objetivo, momentos de la clase, evaluación y la instrucción para la IA.',
      texto: 'PLANEACIÓN DE CLASE\n\nÁrea:\nGrado:\nTema:\nDuración:\n\nObjetivo de aprendizaje:\n\nInicio (10 min):\nDesarrollo (30 min):\nCierre (10 min):\n\nPregunta para que el estudiante explique con sus palabras:\n\nEvaluación:\n\nInstrucción sugerida para la IA:\nActúa como docente de [área] de grado [grado] en Colombia. Diseña una clase de [duración] sobre [tema] con objetivo, inicio, desarrollo, cierre y una pregunta de reflexión.\n\nRecuerde: revise y ajuste la propuesta a su grupo.' },
    { id: 'rubrica', titulo: 'Rúbrica de evaluación', desc: 'Tabla de criterios con cuatro niveles de desempeño.',
      texto: 'RÚBRICA DE EVALUACIÓN\n\nActividad:\nGrado:\n\nCriterio | Superior | Alto | Básico | Bajo\n1.\n2.\n3.\n4.\n\nInstrucción sugerida para la IA:\nCrea una rúbrica de 4 niveles (superior, alto, básico, bajo) para evaluar [actividad] de grado [grado] con estos criterios: [criterios]. Preséntala en tabla.' },
    { id: 'informe', titulo: 'Observación para informe', desc: 'Estructura para redactar observaciones claras y respetuosas.',
      texto: 'OBSERVACIÓN PARA INFORME\n\nFortalezas:\nAspectos por mejorar:\nRecomendación para la casa:\n\nInstrucción sugerida para la IA (sin nombres reales):\nCon estas notas, redacta una observación de 3 frases para el informe de un estudiante de grado [grado], en tono respetuoso y con una recomendación para la casa: [notas].' },
  ],

  comunidad: [
    { autor: 'Docente de matemáticas · Bogotá', ini: 'M', texto: 'Usé la lección de rúbricas y califiqué los talleres de grado 9.° en la mitad del tiempo. Lo que más me sirvió fue pedir la tabla con 4 niveles.', likes: 14 },
    { autor: 'Docente de preescolar · Cali', ini: 'P', texto: '¿Alguien ha usado la IA para redactar las observaciones de los informes? Me cuesta mucho escribir 30 observaciones diferentes.', likes: 9 },
    { autor: 'Docente de ciencias · Bucaramanga', ini: 'C', texto: 'Hice la actividad "Compare y corrija" con grado 8.°. Encontraron dos errores de la IA y quedaron muy motivados.', likes: 21 },
  ],

  panel: [
    { nombre: 'Docente 1 · Matemáticas', avance: 80 },
    { nombre: 'Docente 2 · Lenguaje', avance: 60 },
    { nombre: 'Docente 3 · Ciencias', avance: 100 },
    { nombre: 'Docente 4 · Sociales', avance: 20 },
    { nombre: 'Docente 5 · Inglés', avance: 40 },
  ],
};
