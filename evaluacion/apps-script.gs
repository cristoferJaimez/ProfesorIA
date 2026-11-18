/**
 * ProfeIA · Recepción de evaluaciones del prototipo en Google Sheets.
 * Pegue este código en Extensiones > Apps Script de la hoja de cálculo y publíquelo como aplicación web
 * (ver evaluacion/README.md). Cada evaluación llega como una fila; las columnas se crean solas.
 */
const HOJA = 'Evaluaciones';
const MAX_TEXTO = 1000;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const datos = JSON.parse(e.postData.contents);
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);

    // Encabezados: se agregan las columnas nuevas al final, sin mover las existentes
    let encabezados = hoja.getLastColumn() ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0] : [];
    const nuevas = Object.keys(datos).filter((k) => !encabezados.includes(k));
    if (nuevas.length) {
      hoja.getRange(1, encabezados.length + 1, 1, nuevas.length).setValues([nuevas]).setFontWeight('bold');
      encabezados = encabezados.concat(nuevas);
      hoja.setFrozenRows(1);
    }

    // Se recorta el texto y se evita que una respuesta se interprete como fórmula
    const limpiar = (v) => {
      const s = String(v === undefined || v === null ? '' : v).slice(0, MAX_TEXTO);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };
    hoja.appendRow(encabezados.map((k) => limpiar(datos[k])));
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
