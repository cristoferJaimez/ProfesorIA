// Evaluación del prototipo con los participantes (Guía 2, punto 4: validación).
// Cada pregunta valida un punto de la Guía 2: 1 funcionalidades, 2 dimensiones, 3 implementación de los prototipos.
// Para recibir las respuestas en Google Sheets, pegue aquí la URL de la aplicación web de Apps Script
// (ver evaluacion/README.md). Si queda vacía, las respuestas se guardan en el dispositivo y se descargan en CSV.
const ENDPOINT_EVALUACION = 'https://script.google.com/macros/s/AKfycbzYsTG7-xEPWDETrIj0JyKU2s3wDm8HZThTY3Iy3JRmBq3e6Hk0Af-XFQbaUh0JI-KMpw/exec';

const EVALUACION = {
  // Punto 3: pantallas implementadas en cada prototipo
  pantallas: {
    app: [
      ['bienvenida', 'Bienvenida y registro'],
      ['diagnostico', 'Diagnóstico'],
      ['inicio', 'Inicio y camino'],
      ['leccion', 'Lección por pasos'],
      ['practica', 'Pruébelo (práctica)'],
      ['respuesta', 'Respuesta de la IA'],
      ['detector', 'Detector de errores'],
      ['herramientas', 'Herramientas'],
      ['clase', 'Para clase'],
      ['comunidad', 'Comunidad'],
      ['perfil', 'Perfil y recordatorio'],
      ['planes', 'Planes y panel del colegio'],
    ],
    bocetos: [
      ['b_registro', '1. Registro e inicio de sesión'],
      ['b_perfil', '2. Perfil del docente'],
      ['b_diagnostico', '3. Diagnóstico inicial'],
      ['b_ruta', '4. Ruta «por dónde empezar»'],
      ['b_lecciones', '5. Lecciones por tarea'],
      ['b_leccion', '6. Lección corta'],
      ['b_practica', '7. Práctica con una tarea real'],
      ['b_herramientas', '8. Fichas de herramientas'],
      ['b_responsable', '9. Uso responsable'],
      ['b_planes', '10. Planes y licencias'],
    ],
  },

  // Punto 1: funcionalidades definidas para cada prototipo (tablas 1.1 y 1.2)
  funcionalidades: {
    bocetos: ['Registro e inicio de sesión', 'Perfil del docente', 'Diagnóstico inicial', 'Ruta «por dónde empezar»', 'Lecciones por tarea docente',
      'Lección corta', 'Práctica con una tarea real', 'Fichas de herramientas', 'Uso responsable con estudiantes', 'Planes y licencias'],
    app: ['Registro e inicio de sesión', 'Diagnóstico con resultado', 'Inicio con progreso', 'Lección interactiva', 'Práctica guiada',
      'Comparador de herramientas', 'Detector de errores', 'Actividades «pensar con IA»', 'Plantillas descargables', 'Comunidad de docentes',
      'Recordatorios', 'Planes y panel del colegio'],
  },

  // versiones: en qué evaluación aparece cada pregunta (sin el campo, aparece en las dos)
  preguntas: [
    { id: 'f_utiles', punto: '1. Funcionalidades', tipo: 'multiple', p: '¿Qué funcionalidades le parecen más útiles para su trabajo?', ayuda: 'Puede marcar varias', o: 'funcionalidades' },
    { id: 'f_falta', punto: '1. Funcionalidades', tipo: 'texto', p: '¿Qué funcionalidad le falta a ProfeIA?', opcional: true },
    { id: 'f_sobra', punto: '1. Funcionalidades', tipo: 'texto', p: '¿Qué funcionalidad sobra o no entendió?', opcional: true },

    // Bocetos: se valida la idea y el flujo, no el detalle visual
    { id: 'd_representacion', versiones: ['bocetos'], punto: '2. Dimensiones: representación', tipo: 'escala', p: '¿Los bocetos le permitieron entender la idea general de ProfeIA?', min: 'Nada', max: 'Totalmente' },
    { id: 'd_precision', versiones: ['bocetos'], punto: '2. Dimensiones: precisión', tipo: 'unica', p: '¿Qué tanto detalle necesitaría para entender mejor las pantallas?',
      o: ['Así es suficiente', 'Necesito ver más contenido (textos y ejemplos)', 'Necesito ver colores e imágenes reales'] },
    { id: 'd_interactividad', versiones: ['bocetos'], punto: '2. Dimensiones: interactividad', tipo: 'escala', p: '¿El orden de las pantallas (mapa de navegación) le pareció lógico?', min: 'Confuso', max: 'Muy lógico' },
    { id: 'd_evolucion', versiones: ['bocetos'], punto: '2. Dimensiones: evolución', tipo: 'unica', p: '¿La idea está lista para pasar a la versión digital (app)?',
      o: ['Sí, tal como está', 'Sí, con algunos ajustes', 'No, necesita cambios grandes'] },

    // App: se valida la experiencia de uso
    { id: 'd_representacion', versiones: ['app'], punto: '2. Dimensiones: representación', tipo: 'escala', p: '¿La app en el celular le permitió entender cómo funcionaría ProfeIA?', min: 'Nada', max: 'Totalmente' },
    { id: 'd_precision', versiones: ['app'], punto: '2. Dimensiones: precisión', tipo: 'escala', p: '¿El nivel de detalle (textos, imágenes y contenido) fue suficiente para entender cada pantalla?', min: 'Insuficiente', max: 'Suficiente' },
    { id: 'd_interactividad', versiones: ['app'], punto: '2. Dimensiones: interactividad', tipo: 'escala', p: '¿Qué tan fácil fue moverse entre las pantallas e interactuar con la app?', min: 'Muy difícil', max: 'Muy fácil' },
    { id: 'd_evolucion', versiones: ['app'], punto: '2. Dimensiones: evolución', tipo: 'unica', p: '¿En qué estado está la app para la siguiente versión?',
      o: ['Lista, solo detalles menores', 'Necesita algunos ajustes', 'Necesita cambios grandes'] },

    { id: 'mejora', punto: '4. Mejora propuesta', tipo: 'texto', p: '¿Qué mejora le propone al prototipo?' },
  ],
};
