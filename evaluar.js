// Evaluación del prototipo en página propia (fuera del marco de celular).
// Usa ENDPOINT_EVALUACION y EVALUACION de evaluacion.js. Guía 2, punto 4: validación.
(function () {
  'use strict';

  const raiz = document.getElementById('eval');
  const pasoGuia = document.getElementById('paso-guia');
  const aviso = document.getElementById('aviso');
  const CLAVE_EVAL = 'profeia-evaluaciones';
  const CLAVE_APP = 'profeia-prototipo-v1b';
  const params = new URLSearchParams(location.search);
  const versionInicial = params.get('version') === 'bocetos' ? 'bocetos' : 'app';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const leer = (k, def) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? def; } catch (e) { console.warn(e); return def; } };
  const escribirLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('No se pudo guardar en el dispositivo.', e); } };
  function avisar(t) {
    aviso.textContent = t;
    aviso.classList.add('ver');
    clearTimeout(avisar.t);
    avisar.t = setTimeout(() => aviso.classList.remove('ver'), 2000);
  }

  const nueva = () => ({ paso: 0, enviado: false, r: { version: versionInicial, pantallas: {} } });
  let EV = nueva();
  // Cada versión tiene sus propias preguntas de dimensiones (los bocetos no se califican por detalle visual)
  const preguntas = () => EVALUACION.preguntas.filter((q) => !q.versiones || q.versiones.includes(EV.r.version));
  const total = () => preguntas().length + 2;

  function pasoListo() {
    const r = EV.r;
    if (EV.paso === 0) return !!(r.iniciales && r.rol && r.primera_encuesta && r.version);
    if (EV.paso === 1) return EVALUACION.pantallas[r.version].every(([id]) => r.pantallas[id]);
    const q = preguntas()[EV.paso - 2];
    if (!q || q.opcional) return true;
    const v = r[q.id];
    return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
  }

  function capturar() {
    const ini = document.getElementById('ev-iniciales');
    if (ini) EV.r.iniciales = ini.value.trim();
    const area = document.getElementById('ev-area');
    if (area) EV.r.area = area.value;
    const com = document.getElementById('ev-coment');
    if (com) EV.r.comentario_pantallas = com.value.trim();
    const tx = document.getElementById('ev-texto');
    if (tx) EV.r[tx.dataset.campo] = tx.value.trim();
  }

  function cuerpoPaso() {
    const r = EV.r;
    if (EV.paso === 0) {
      const areas = ['Matemáticas', 'Lenguaje', 'Ciencias naturales', 'Ciencias sociales', 'Inglés', 'Artes', 'Educación física', 'Tecnología', 'Preescolar', 'Salud', 'Otra'];
      const chips = (campo, ops) => `<div class="chips">${ops.map(([v, t]) => `<button type="button" class="chip ${r[campo] === v ? 'on' : ''}" data-set="${campo}" data-valor="${esc(v)}">${t}</button>`).join('')}</div>`;
      return `<h1>Antes de empezar</h1>
        <p class="suave">Toma unos 3 minutos. Solo pedimos sus iniciales.</p>
        <label class="campo">Iniciales<input id="ev-iniciales" maxlength="12" placeholder="Ej.: K.G." value="${esc(r.iniciales || '')}" autocomplete="off"></label>
        <label class="campo">Área que enseña<select id="ev-area">${areas.map((a) => `<option ${r.area === a ? 'selected' : ''}>${a}</option>`).join('')}</select></label>
        <div class="grupo-s"><b>Rol</b>${chips('rol', [['Docente', 'Docente'], ['Directivo docente', 'Directivo'], ['Otro', 'Otro']])}</div>
        <div class="grupo-s"><b>¿Respondió la primera encuesta de ProfeIA?</b>${chips('primera_encuesta', [['Sí', 'Sí'], ['No', 'No']])}</div>
        <div class="grupo-s"><b>¿Qué va a evaluar?</b>${chips('version', [['bocetos', 'Los bocetos'], ['app', 'La app']])}</div>`;
    }
    if (EV.paso === 1) {
      const ps = EVALUACION.pantallas[r.version];
      if (r.version === 'bocetos') {
        return `<p class="punto-guia">3. Implementación del prototipo</p><h1>¿Entiende para qué sirve cada pantalla?</h1>
          <p class="suave">Son dibujos a mano: no califique el diseño, solo si entiende la idea. <a href="bocetos.html" target="_blank" rel="noopener">Ver los bocetos otra vez ↗</a></p>
          <div class="grupo-s">${ps.map(([id, n]) => `<div class="fila-eval columna"><span>${n}</span><div class="chips">
            ${['Sí', 'Más o menos', 'No'].map((o) => `<button type="button" class="chip ${r.pantallas[id] === o ? 'on' : ''}" data-entiende="${id}" data-valor="${o}">${o}</button>`).join('')}</div></div>`).join('')}</div>
          <label class="campo">¿Qué pantalla no entendió y por qué? (opcional)<textarea id="ev-coment">${esc(r.comentario_pantallas || '')}</textarea></label>`;
      }
      return `<p class="punto-guia">3. Implementación del prototipo</p><h1>Califique cada pantalla</h1>
        <p class="suave">¿Qué tan clara y útil le pareció? 1 estrella = nada, 5 = mucho. <a href="app.html" target="_blank" rel="noopener">Abrir la app otra vez ↗</a></p>
        <div class="grupo-s">${ps.map(([id, n]) => `<div class="fila-eval"><span>${n}</span><div class="estrellas" role="radiogroup" aria-label="${n}">
          ${[1, 2, 3, 4, 5].map((k) => `<button type="button" class="${(r.pantallas[id] || 0) >= k ? 'on' : ''}" data-estrella="${id}:${k}" aria-label="${k} de 5">★</button>`).join('')}</div></div>`).join('')}</div>
        <label class="campo">¿Alguna pantalla le pareció confusa? ¿Cuál y por qué? (opcional)<textarea id="ev-coment">${esc(r.comentario_pantallas || '')}</textarea></label>`;
    }
    const q = preguntas()[EV.paso - 2];
    const v = r[q.id];
    let campo = '';
    if (q.tipo === 'escala') {
      campo = `<div class="escala">${[1, 2, 3, 4, 5].map((k) => `<button type="button" class="${v === k ? 'on' : ''}" data-set="${q.id}" data-valor="${k}" data-num>${k}</button>`).join('')}</div>
        <div class="extremos"><span>${q.min}</span><span>${q.max}</span></div>`;
    } else if (q.tipo === 'unica') {
      campo = `<div class="grupo-s">${q.o.map((o, k) => `<button type="button" class="opcion ${v === o ? 'on' : ''}" data-set="${q.id}" data-valor="${esc(o)}"><span class="letra">${'ABCDE'[k]}</span>${o}</button>`).join('')}</div>`;
    } else if (q.tipo === 'multiple') {
      const sel = v || [];
      campo = `<div class="chips">${EVALUACION.funcionalidades[r.version].map((o) => `<button type="button" class="chip ${sel.includes(o) ? 'on' : ''}" data-multi="${q.id}" data-valor="${esc(o)}">${o}</button>`).join('')}</div>`;
    } else {
      campo = `<textarea id="ev-texto" data-campo="${q.id}" placeholder="Escriba aquí…">${esc(v || '')}</textarea>`;
    }
    return `<p class="punto-guia">${q.punto}</p><h1>${q.p}</h1>
      ${q.ayuda ? `<p class="suave">${q.ayuda}</p>` : ''}${q.opcional ? '<p class="suave">Opcional</p>' : ''}${campo}`;
  }

  function render(nuevoPaso) {
    const pos = window.scrollY;
    const n = EV.r.version === 'bocetos' ? 2 : 4;
    pasoGuia.textContent = `Paso ${n} de 4`;
    document.title = `ProfeIA · Evaluar ${EV.r.version === 'bocetos' ? 'los bocetos' : 'la app'}`;
    if (EV.paso >= total()) {
      raiz.innerHTML = `<section class="gracias">
        <div class="medalla" aria-hidden="true">✓</div>
        <h1>¡Gracias!</h1>
        <p class="suave">${EV.enviado ? 'Su evaluación fue enviada.' : 'Su evaluación quedó guardada en este dispositivo.'} Sus respuestas ayudan a mejorar ProfeIA.</p>
        <a class="btn" href="index.html">Volver a la guía</a>
        <button type="button" class="enlace" data-nueva>Hacer otra evaluación</button></section>`;
      window.scrollTo(0, 0);
      return;
    }
    const ultimo = EV.paso === total() - 1;
    raiz.innerHTML = `<div class="progreso" aria-hidden="true"><span style="width:${(EV.paso / total()) * 100}%"></span></div>
      <p class="contador">Pregunta ${EV.paso + 1} de ${total()}</p>
      <section class="tarjeta pregunta">${cuerpoPaso()}</section>
      <div class="acciones">
        ${EV.paso > 0 ? '<button type="button" class="btn sec" data-atras>Anterior</button>' : ''}
        <button type="button" class="btn ${ultimo ? 'verde' : ''}" data-sig ${pasoListo() ? '' : 'disabled'}>${ultimo ? 'Enviar evaluación' : 'Siguiente'}</button>
      </div>`;
    window.scrollTo(0, nuevoPaso ? 0 : pos);
  }

  function fila() {
    const r = EV.r;
    const f = { fecha: new Date().toISOString(), version: r.version === 'app' ? 'Alta resolución (app)' : 'Baja resolución (bocetos)',
      iniciales: r.iniciales, area: r.area, rol: r.rol, primera_encuesta: r.primera_encuesta };
    EVALUACION.pantallas[r.version].forEach(([id, n]) => { f['pantalla: ' + n] = r.pantallas[id]; });
    f.comentario_pantallas = r.comentario_pantallas || '';
    preguntas().forEach((q) => { const v = r[q.id]; f[q.id] = Array.isArray(v) ? v.join('; ') : (v ?? ''); });
    if (r.version === 'app') {
      // Comportamiento de uso registrado por la app en este mismo dispositivo (punto 4.3)
      const app = leer(CLAVE_APP, {}) || {};
      const u = app.uso || { vistas: [] };
      const nombres = { bienvenida: 'Bienvenida', registro: 'Registro', ingresar: 'Ingreso', diagnostico: 'Diagnóstico', resultado: 'Resultado',
        inicio: 'Inicio', leccion: 'Lección', explorar: 'Explorar', perfil: 'Perfil', planes: 'Planes', panel: 'Panel del colegio' };
      f['uso: pantallas visitadas'] = (u.vistas || []).filter((v) => nombres[v]).map((v) => nombres[v]).join('; ');
      f['uso: lecciones completadas'] = (u.lecciones || []).length;
      f['uso: minutos en la app'] = u.ultimo ? Math.max(1, Math.round((u.ultimo - u.inicio) / 60000)) : 0;
    }
    return f;
  }

  async function enviar() {
    const f = fila();
    const todas = leer(CLAVE_EVAL, []);
    todas.push(f);
    escribirLS(CLAVE_EVAL, todas);
    const g = leer('profeia-guia', {}) || {};
    g[EV.r.version === 'app' ? 'evalApp' : 'evalBocetos'] = true;
    escribirLS('profeia-guia', g);
    EV.enviado = false;
    if (ENDPOINT_EVALUACION) {
      try {
        await fetch(ENDPOINT_EVALUACION, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(f) });
        EV.enviado = true;
      } catch (e) { console.warn('No se pudo enviar; quedó guardada en el dispositivo.', e); }
    }
    EV.paso += 1;
    render(true);
  }

  // Resultados guardados en este dispositivo (evaluar.html#resultados)
  function resultados() {
    const todas = leer(CLAVE_EVAL, []);
    const por = (v) => todas.filter((f) => String(f.version).startsWith(v)).length;
    pasoGuia.textContent = 'Resultados';
    raiz.innerHTML = `<section class="tarjeta pregunta"><h1>Evaluaciones en este dispositivo</h1>
      <div class="stats"><div><b>${todas.length}</b><span>Total</span></div><div><b>${por('Baja')}</b><span>Bocetos</span></div><div><b>${por('Alta')}</b><span>App</span></div></div>
      <p class="suave">${ENDPOINT_EVALUACION ? 'Las evaluaciones se envían a la hoja de Google Sheets; aquí queda una copia de respaldo.' : 'No hay hoja conectada: descargue las evaluaciones antes de borrar los datos del navegador.'}</p>
      <button type="button" class="btn" data-csv ${todas.length ? '' : 'disabled'}>Descargar en Excel (CSV)</button></section>`;
  }
  function descargarCSV() {
    const todas = leer(CLAVE_EVAL, []);
    const cols = [...new Set(todas.flatMap((f) => Object.keys(f)))];
    const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + [cols.map(celda).join(';'), ...todas.map((f) => cols.map((c) => celda(f[c])).join(';'))].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'ProfeIA - evaluaciones.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  raiz.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    const d = b.dataset;
    capturar();
    if (d.set) {
      EV.r[d.set] = 'num' in d ? Number(d.valor) : d.valor;
      if (d.set === 'version') { EV.r.pantallas = {}; ['d_representacion', 'd_precision', 'd_interactividad', 'd_evolucion'].forEach((k) => delete EV.r[k]); }
      return render();
    }
    if (d.multi) {
      const sel = EV.r[d.multi] || (EV.r[d.multi] = []);
      const i = sel.indexOf(d.valor);
      if (i >= 0) sel.splice(i, 1); else sel.push(d.valor);
      return render();
    }
    if (d.entiende) { EV.r.pantallas[d.entiende] = d.valor; return render(); }
    if (d.estrella) {
      const [pid, k] = d.estrella.split(':');
      EV.r.pantallas[pid] = Number(k);
      return render();
    }
    if ('sig' in d) {
      if (!pasoListo()) return avisar('Complete este paso para continuar');
      if (EV.paso === total() - 1) { b.disabled = true; b.textContent = 'Enviando…'; return enviar(); }
      EV.paso += 1;
      return render(true);
    }
    if ('atras' in d) { EV.paso = Math.max(0, EV.paso - 1); return render(true); }
    if ('nueva' in d) { EV = nueva(); return render(true); }
    if ('csv' in d) return descargarCSV();
  });
  raiz.addEventListener('input', (ev) => {
    if (['ev-iniciales', 'ev-texto'].includes(ev.target.id)) {
      capturar();
      const b = raiz.querySelector('[data-sig]');
      if (b) b.disabled = !pasoListo();
    }
  });
  raiz.addEventListener('change', (ev) => { if (ev.target.id === 'ev-area') capturar(); });

  if (location.hash === '#resultados') resultados(); else render(true);
})();
