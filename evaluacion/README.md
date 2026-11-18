# Conectar la evaluación con Google Sheets

La evaluación del prototipo (`#/evaluar`) envía cada respuesta como una fila a una hoja de Google Sheets. Se configura una sola vez, en unos 5 minutos.

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

Cada evaluación también se guarda en el dispositivo donde se respondió. En `#/resultados` se ven los totales y se descargan en CSV (se abre en Excel). Sirve si se hacen sesiones presenciales en el celular del equipo o si todavía no se ha conectado la hoja.

## Qué valida cada pregunta (Guía 2)

| Bloque | Punto de la guía |
|---|---|
| Calificación de cada pantalla (1 a 5) | 3. Implementación del prototipo |
| Funcionalidades más útiles, faltantes y sobrantes | 1. Funcionalidades |
| Representación, precisión e interactividad (1 a 5) | 2. Dimensiones |
| Estado para la siguiente versión | 2. Dimensiones: evolución |
| Mejora propuesta | 4. Tablas de sesiones (columna «Mejora propuesta») |
| Uso: pantallas visitadas, lecciones completadas y minutos (solo app) | 4.3 Comportamiento de los participantes |

## Privacidad

Solo se piden iniciales, área y rol. No se recogen correos ni nombres completos.
