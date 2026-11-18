# Conectar la evaluación con Google Sheets

La evaluación del prototipo (`evaluar.html`) envía cada respuesta como una fila a una hoja de Google Sheets. Se configura una sola vez, en unos 5 minutos.

## Pasos

1. Cree una hoja de cálculo nueva en Google Sheets, por ejemplo «ProfeIA · Evaluaciones».
2. En la hoja, abra **Extensiones → Apps Script**.
3. Borre lo que aparece y pegue el contenido de [`apps-script.gs`](apps-script.gs). Guarde.
4. Haga clic en **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
5. Autorice los permisos que pide Google (es su propia hoja).
6. Copie la **URL de la aplicación web** (termina en `/exec`).
7. Pegue esa URL en `evaluacion.js`, en la línea `const ENDPOINT_EVALUACION = '';`, entre las comillas.

Desde ese momento, cada evaluación aparece como una fila nueva en la pestaña **Evaluaciones**.

## Enlace para los participantes

Envíe un solo enlace: `https://cristoferjaimez.github.io/ProfesorIA/`. Es una guía de 4 pasos que lleva al participante por los bocetos, su evaluación, la app y su evaluación, y marca con ✓ lo que ya hizo.

## Respaldo

Cada evaluación también se guarda en el dispositivo donde se respondió. En `evaluar.html#resultados` se ven los totales y se descargan en CSV (se abre en Excel). Sirve si se hacen sesiones presenciales en el celular del equipo o si todavía no se ha conectado la hoja.

## Qué valida cada pregunta (Guía 2)

Las preguntas de dimensiones cambian según la versión, porque los bocetos a mano no se juzgan por su detalle visual.

| Punto de la guía | Bocetos (baja resolución) | App (alta resolución) |
|---|---|---|
| 3. Implementación | ¿Entiende para qué sirve cada pantalla? (sí / más o menos / no) | Estrellas de 1 a 5 por pantalla |
| 1. Funcionalidades | Más útiles, faltantes y sobrantes | Igual |
| 2. Representación | ¿Los bocetos permiten entender la idea? (1 a 5) | ¿La app permite entender cómo funcionaría? (1 a 5) |
| 2. Precisión | ¿Qué detalle necesitaría? (opciones) | ¿El detalle fue suficiente? (1 a 5) |
| 2. Interactividad | ¿El orden de las pantallas es lógico? (1 a 5) | ¿Qué tan fácil fue moverse e interactuar? (1 a 5) |
| 2. Evolución | ¿Lista para pasar a la versión digital? | ¿En qué estado está para la siguiente versión? |
| 4. Mejora propuesta | Abierta | Abierta |
| 4.3 Comportamiento | No aplica | Pantallas visitadas, lecciones completadas y minutos |

## Privacidad

Solo se piden iniciales, área y rol. No se recogen correos ni nombres completos.
