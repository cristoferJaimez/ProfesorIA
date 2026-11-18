# ProfeIA · Prototipo de alta resolución

Prototipo navegable de **ProfeIA**, una app para que los docentes colombianos aprendan a usar la inteligencia artificial en su trabajo, con una lección corta al día en el celular.

Proyecto académico del módulo Emprendimiento de Base Tecnológica (Politécnico Grancolombiano), Entrega 2: prototipado de baja y alta resolución.

## Concepto: una cosa a la vez

- **3 pestañas:** Inicio, Explorar y Perfil.
- **Inicio:** la siguiente lección y el camino de la ruta.
- **Lección por pasos:** Idea → Ejemplo → Pruébelo → Respuesta de la IA → ¡Listo!
- **Explorar:** herramientas, lecciones, recursos para clase y comunidad, con detalles en paneles que suben desde abajo.

## Funcionalidades

| N.º | Funcionalidad | Dónde |
|---|---|---|
| 1 | Registro e inicio de sesión | Bienvenida |
| 2 | Diagnóstico con resultado y ruta personalizada | Después del registro |
| 3 | Inicio con progreso, puntos y camino | Inicio |
| 4 | Lección por pasos con instrucción para copiar y respuesta de ejemplo | Inicio → lección |
| 5 | Práctica guiada con revisión de la instrucción | Paso «Pruébelo» |
| 6 | Comparador de herramientas | Explorar → Herramientas |
| 7 | Detector de errores de la IA | Lección «Revisar los errores de la IA» |
| 8 | Actividades para que los estudiantes piensen | Explorar → Para clase |
| 9 | Plantillas descargables | Explorar → Para clase |
| 10 | Comunidad de docentes | Explorar → Comunidad |
| 11 | Recordatorio diario | Perfil |
| 12 | Planes y panel del colegio | Perfil |

## Páginas del sitio

| Página | Para qué |
|---|---|
| `index.html` | Guía para los participantes: 4 pasos (ver bocetos, evaluarlos, probar la app, evaluarla) |
| `bocetos.html` | Prototipo de baja resolución: mapa de navegación y 10 bocetos |
| `app.html` | Prototipo de alta resolución (app en el celular) |
| `app.html?demo=1` | La app con un docente de ejemplo, sin registrarse |
| `app.html?evaluar=bocetos` / `?evaluar=app` | Evaluación con la versión ya elegida |
| `app.html#/resultados` | Evaluaciones guardadas en el dispositivo y descarga en CSV |

Para verlo en local: `python -m http.server 8765` y abrir `http://localhost:8765`.

## Evaluación y comportamiento de uso

Las evaluaciones se envían a una hoja de Google Sheets (ver [`evaluacion/README.md`](evaluacion/README.md)). La evaluación de la app incluye además el comportamiento de uso de quien la respondió en ese dispositivo: pantallas visitadas, lecciones completadas y minutos en la app.

## Importante

Es un prototipo: no tiene servidor, no crea cuentas reales, no se conecta a ninguna IA y todos los datos son simulados. Las respuestas de la IA que se muestran están escritas de antemano. Lo que se escribe se guarda solo en el navegador de quien lo usa y se borra desde *Perfil → Reiniciar prototipo*.
