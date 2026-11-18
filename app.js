// ProfeIA · prototipo de alta resolución. Concepto: "una cosa a la vez".
// Navegación por #rutas, datos simulados y estado guardado solo en este navegador.
(function () {
  'use strict';

  const app = document.getElementById('app');
  const menu = document.getElementById('menu');
  const velo = document.getElementById('velo');
  const hoja = document.getElementById('hoja');
  const aviso = document.getElementById('aviso');
  const CLAVE = 'profeia-prototipo-v1b';
  const PUNTOS_LECCION = 10;

  // ---------- Estado ----------
  const inicial = () => ({
    usuario: null, diag: [], nivel: null, ruta: DATOS.ruta.slice(),
    completadas: [], guardadas: [], posts: [], likes: {},
    recordatorio: { on: false, hora: '6 p. m.' }, plan: 'gratis',
  });
  let E = inicial();
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (g) E = { ...inicial(), ...g };
  } catch (e) { console.warn('Sin almacenamiento local; el prototipo funciona sin guardar.', e); }
  const guardar = () => {
    try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (e) { console.warn('No se pudo guardar el progreso.', e); }
  };

  // Modo demostración (?demo=1): entra con un docente de ejemplo
  if (new URLSearchParams(location.search).has('demo') && !E.usuario) {
    E.usuario = { nombre: 'Laura Gómez', correo: 'demo@profeia.co', area: 'Ciencias naturales' };
    E.diag = [1, 0, 1, 1, 0];
    E.nivel = 'Intermedio';
    E.ruta = ['l1', 'l2', 'l3', 'l5', 'l6'];
    E.completadas = ['l1'];
  }

  // Enlace directo a la evaluación (?evaluar=1), útil para compartir con los participantes
  if (new URLSearchParams(location.search).has('evaluar') && !location.hash) location.hash = '#/evaluar';

  // ---------- Utilidades ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ir = (r) => { location.hash = r; };
  const leccion = (id) => DATOS.lecciones.find((l) => l.id === id);
  const siguiente = () => E.ruta.find((id) => !E.completadas.includes(id));
  const hechasRuta = () => E.ruta.filter((id) => E.completadas.includes(id)).length;
  const puntos = () => E.completadas.length * PUNTOS_LECCION;
  const iniciales = (n) => (n || 'D').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  const nombreCorto = () => ((E.usuario && E.usuario.nombre) || 'docente').split(' ')[0];

  function avisar(t) {
    aviso.textContent = t;
    aviso.classList.add('ver');
    clearTimeout(avisar.t);
    avisar.t = setTimeout(() => aviso.classList.remove('ver'), 2000);
  }
  async function copiar(texto) {
    try { await navigator.clipboard.writeText(texto); avisar('Copiado'); } catch (e) { avisar('No se pudo copiar aquí'); }
  }
  function descargar(nombre, texto) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
    a.download = nombre;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    avisar('Descargado');
  }

  // Panel que sube desde abajo
  function abrirHoja(html) {
    hoja.innerHTML = `<div class="asa"></div>${html}<button class="btn sec" data-cerrar-hoja>Cerrar</button>`;
    velo.hidden = false;
    hoja.scrollTop = 0;
  }
  function cerrarHoja() { velo.hidden = true; hoja.innerHTML = ''; }
  velo.addEventListener('click', (e) => { if (e.target === velo) cerrarHoja(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !velo.hidden) cerrarHoja(); });

  // ---------- Pantallas ----------
  const V = {};

  V.bienvenida = () => `
    <section class="vista bienvenida">
      <div class="empuje"></div>
      <div class="logo" aria-hidden="true">IA</div>
      <div class="grupo-s"><h1>ProfeIA</h1><p class="suave">Aprenda a usar la inteligencia artificial en su trabajo docente. Una lección corta al día.</p></div>
      <div class="grupo empuje">
        <button class="btn" data-ir="#/registro">Empezar gratis</button>
        <button class="btn sec" data-ir="#/ingresar">Ya tengo cuenta</button>
        <button class="btn sec" data-ir="#/evaluar">Evaluar el prototipo</button>
        <p class="version">Prototipo · datos simulados</p>
      </div>
    </section>`;

  V.ingresar = () => `
    <section class="vista">
      <div class="cabeza"><button class="cerrar" data-ir="#/bienvenida" aria-label="Volver">‹</button></div>
      <div class="grupo-s"><h1>Bienvenido de nuevo</h1><p class="suave">Ingrese con su correo o con la cuenta de su colegio.</p></div>
      <form class="grupo" id="f-ingresar">
        <label class="campo">Correo<input type="email" required placeholder="nombre@correo.com" autocomplete="email"></label>
        <label class="campo">Contraseña<input type="password" required placeholder="••••••••" autocomplete="current-password"></label>
        <button type="button" class="enlace" data-accion="olvido" style="align-self:flex-end">¿Olvidó su contraseña?</button>
      </form>
      <div class="pie">
        <button class="btn" type="submit" form="f-ingresar">Ingresar</button>
        <button class="btn sec" data-accion="institucional">Usar cuenta del colegio</button>
      </div>
    </section>`;

  V.registro = () => {
    const areas = ['Matemáticas', 'Lenguaje', 'Ciencias naturales', 'Ciencias sociales', 'Inglés', 'Artes', 'Educación física', 'Tecnología', 'Preescolar', 'Otra'];
    return `
    <section class="vista">
      <div class="cabeza"><button class="cerrar" data-ir="#/bienvenida" aria-label="Volver">‹</button></div>
      <div class="grupo-s"><h1>Cree su cuenta</h1><p class="suave">Solo tres datos. Luego le hacemos 5 preguntas para armar su ruta.</p></div>
      <form class="grupo" id="f-registro">
        <label class="campo">Su nombre<input name="nombre" required placeholder="Ej.: Laura Gómez" autocomplete="name"></label>
        <label class="campo">Correo<input name="correo" type="email" required placeholder="nombre@correo.com" autocomplete="email"></label>
        <label class="campo">Área que enseña<select name="area">${areas.map((a) => `<option>${a}</option>`).join('')}</select></label>
        <label class="chequeo"><input type="checkbox" required> Acepto el tratamiento de mis datos. No pedimos datos de estudiantes.</label>
      </form>
      <div class="pie"><button class="btn" type="submit" form="f-registro">Continuar</button></div>
    </section>`;
  };

  V.diagnostico = (paso) => {
    const total = DATOS.diagnostico.length;
    const i = Math.min(Number(paso) || 0, total - 1);
    const q = DATOS.diagnostico[i];
    return `
    <section class="vista">
      <div class="cabeza">
        <button class="cerrar" data-atras aria-label="Volver">‹</button>
        <div class="progreso" role="progressbar" aria-valuenow="${i + 1}" aria-valuemax="${total}"><span style="width:${(i / total) * 100}%"></span></div>
      </div>
      <div class="grupo-s"><p class="suave pequeno">Pregunta ${i + 1} de ${total}</p><h1>${q.p}</h1></div>
      <div class="grupo">${q.o.map((o, k) => `<button class="opcion ${E.diag[i] === k ? 'on' : ''}" data-diag="${i}:${k}"><span class="letra">${'ABCD'[k]}</span>${o}</button>`).join('')}</div>
    </section>`;
  };

  function calcularRuta() {
    const pts = (E.diag[0] || 0) + (E.diag[2] || 0);
    if (pts <= 1) E.nivel = 'Principiante';
    else if (pts <= 3) E.nivel = 'Intermedio';
    else E.nivel = 'Avanzado';
    const porTarea = { 0: 'l3', 1: 'l4', 2: 'l8', 3: 'l7' };
    E.ruta = ['l1', 'l2', porTarea[E.diag[1]] || 'l3', 'l5', 'l6'];
    guardar();
  }

  V.resultado = () => `
    <section class="vista fin">
      <div class="medalla" aria-hidden="true">✓</div>
      <div class="grupo-s"><p class="suave">Su nivel</p><h1>${E.nivel}</h1>
        <p class="suave">Preparamos una ruta de ${E.ruta.length} lecciones cortas, pensada para su trabajo.</p></div>
      <div class="pie" style="width:100%"><button class="btn" data-ir="#/inicio">Ver mi ruta</button></div>
    </section>`;

  V.inicio = () => {
    const sig = siguiente();
    const l = sig && leccion(sig);
    const camino = E.ruta.map((id, i) => {
      const est = E.completadas.includes(id) ? 'hecho' : id === sig ? 'actual' : '';
      return `<button class="nodo ${est}" data-abrir-leccion="${id}" aria-label="Lección ${i + 1}: ${leccion(id).titulo}">
        <span class="bola">${est === 'hecho' ? '✓' : i + 1}</span><span class="nombre">${leccion(id).titulo}</span></button>`;
    }).join('');
    return `
    <section class="vista">
      <div class="fila saludo"><div class="crece"><h2>Hola, ${esc(nombreCorto())}</h2><p class="pequeno">${hechasRuta()} de ${E.ruta.length} lecciones · Nivel ${E.nivel || 'Principiante'}</p></div>
        <span class="puntos" aria-label="${puntos()} puntos">★ ${puntos()}</span></div>
      ${l ? `<div class="siguiente">
          <p class="suave pequeno">Siguiente lección · ${l.min} min</p>
          <h2>${l.titulo}</h2>
          <button class="btn" data-abrir-leccion="${l.id}">${hechasRuta() ? 'Continuar' : 'Empezar'}</button></div>`
        : `<div class="siguiente"><h2>¡Terminó su ruta!</h2><p class="suave">Siga aprendiendo en Explorar.</p><button class="btn" data-ir="#/explorar">Explorar</button></div>`}
      <div class="camino">${camino}</div>
      ${hechasRuta() ? '<button class="item" data-ir="#/evaluar"><span class="icono" style="background:var(--verde-claro);color:var(--verde)">★</span><span class="crece"><h3>¿Qué le pareció ProfeIA?</h3><span class="suave pequeno">Evalúe el prototipo en 3 minutos</span></span><span class="flecha">›</span></button>' : ''}
    </section>`;
  };

  // ---------- Lección por pasos ----------
  let L = null; // { id, paso, revisado, marcadas, detectorListo }
  const pasosDe = (l) => (l.id === 'l5' ? ['idea', 'ejemplo', 'detector', 'fin'] : ['idea', 'ejemplo', 'practica', 'respuesta', 'fin']);

  V.leccion = (id) => {
    const l = leccion(id);
    if (!l) return V.inicio();
    if (!L || L.id !== id) L = { id, paso: 0, revisado: null, marcadas: new Set(), detectorListo: false };
    const pasos = pasosDe(l);
    const tipo = pasos[L.paso];
    const avance = (L.paso / (pasos.length - 1)) * 100;
    let cuerpo = '';
    let pie = '';

    if (tipo === 'idea') {
      cuerpo = `<p class="tipo">La idea</p><h1>${l.titulo}</h1><p>${l.intro}</p>
        <ul class="idea-lista">${l.pasos.map((p, i) => `<li><span class="n">${i + 1}</span><span>${p}</span></li>`).join('')}</ul>`;
      pie = '<button class="btn" data-paso-sig>Ver un ejemplo</button>';
    } else if (tipo === 'ejemplo') {
      cuerpo = `<p class="tipo">Ejemplo</p><h2>Así se le pide a la IA</h2><div class="prompt">${esc(l.prompt)}</div>
        <button class="btn peq sec" data-copiar style="align-self:flex-start">Copiar instrucción</button>
        <div class="tarjeta partes"><h3>Una buena instrucción tiene</h3>
          <div><b>Rol</b><span>quién es la IA: «Actúa como docente de…»</span></div>
          <div><b>Contexto</b><span>grado, tema y tiempo</span></div>
          <div><b>Formato</b><span>lista, tabla o pasos</span></div>
          <div><b>Pensar</b><span>algo que el estudiante deba explicar</span></div></div>`;
      pie = `<button class="btn" data-paso-sig>${l.id === 'l5' ? 'Practicar' : 'Ahora inténtelo usted'}</button>`;
    } else if (tipo === 'practica') {
      cuerpo = `<p class="tipo">Pruébelo</p><h2>Escriba su propia instrucción</h2>
        <p class="suave pequeno">Piense en su próxima clase. No use nombres de estudiantes.</p>
        <textarea id="mi-prompt" placeholder="Actúa como docente de…" aria-label="Su instrucción">${esc(L.texto || '')}</textarea>
        ${L.revisado ? `<div class="grupo-s"><h3>${L.revisado.ok} de ${L.revisado.res.length} puntos clave</h3>
          <div class="checks">${L.revisado.res.map(([n, b]) => `<span class="check ${b ? 'ok' : ''}">${b ? '✓' : '✗'} ${n}</span>`).join('')}</div></div>` : ''}`;
      pie = L.revisado
        ? '<button class="btn" data-paso-sig>Ver qué respondería la IA</button><button class="enlace" data-reintentar>Mejorar mi instrucción</button>'
        : '<button class="btn" data-revisar>Revisar mi instrucción</button><button class="enlace" data-paso-sig>Saltar</button>';
    } else if (tipo === 'respuesta') {
      cuerpo = `<p class="tipo">Resultado</p><div class="fila"><h2 class="crece">Esto respondería la IA</h2><span class="etiqueta amarillo">Simulada</span></div>
        <div class="texto-ia">${esc(l.respuesta)}</div>
        <p class="suave pequeno">Revise siempre antes de usarla: la IA puede equivocarse o inventar datos.</p>`;
      pie = '<button class="btn verde" data-paso-sig>Terminar lección</button>';
    } else if (tipo === 'detector') {
      const d = DATOS.detector;
      const errores = d.frases.filter((f) => f.error).length;
      cuerpo = `<p class="tipo">Pruébelo</p><h2>¿Dónde se equivocó la IA?</h2>
        <p class="suave pequeno">Toque las ${errores} frases que tienen un error.</p>
        <div class="grupo-s">${d.frases.map((f, i) => {
          let c = L.marcadas.has(i) ? 'marcada' : '';
          if (L.detectorListo) c = f.error ? (L.marcadas.has(i) ? 'bien' : 'mal') : (L.marcadas.has(i) ? 'mal' : '');
          const nota = L.detectorListo && f.error ? `<span class="nota">${f.nota}</span>` : '';
          return `<button class="frase ${c}" data-frase="${i}" ${L.detectorListo ? 'disabled' : ''}>${f.t}${nota}</button>`;
        }).join('')}</div>`;
      const acertadas = d.frases.filter((f, i) => f.error && L.marcadas.has(i)).length;
      pie = L.detectorListo
        ? `<p class="centro"><b>Encontró ${acertadas} de ${errores} errores.</b></p><button class="btn verde" data-paso-sig>Terminar lección</button>`
        : `<button class="btn" data-detector ${L.marcadas.size ? '' : 'disabled'}>Comprobar</button>`;
    } else {
      if (!E.completadas.includes(id)) { E.completadas.push(id); guardar(); }
      const colores = ['#f5b83d', '#2b5aa0', '#2e8b57', '#c0392b', '#7fb3ff'];
      const confeti = Array.from({ length: 28 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${colores[i % 5]};animation-delay:${(i % 7) * 0.08}s"></i>`).join('');
      return `<section class="vista fin"><div class="confeti" aria-hidden="true">${confeti}</div>
        <div class="medalla" aria-hidden="true">★</div>
        <div class="grupo-s"><h1>¡Lección completada!</h1><p class="suave">+${PUNTOS_LECCION} puntos · ${hechasRuta()} de ${E.ruta.length} en su ruta</p></div>
        <div class="pie" style="width:100%"><button class="btn" data-salir-leccion>Continuar</button></div></section>`;
    }

    return `<section class="vista leccion">
      <div class="cabeza"><button class="cerrar" data-salir-leccion aria-label="Salir de la lección">✕</button>
        <div class="progreso" role="progressbar" aria-valuenow="${Math.round(avance)}" aria-valuemax="100"><span style="width:${avance}%"></span></div></div>
      <div class="paso">${cuerpo}</div>
      <div class="pie">${pie}</div>
    </section>`;
  };

  function revisarPrompt() {
    const t = (document.getElementById('mi-prompt').value || '').toLowerCase();
    L.texto = document.getElementById('mi-prompt').value;
    if (t.trim().length < 10) return avisar('Escriba su instrucción primero');
    const criterios = [
      ['Rol', /act[uú]a|eres|como docente|como profesor/],
      ['Grado', /grado|°|º|primaria|secundaria|preescolar|curso|universidad/],
      ['Tema claro', { test: (s) => s.trim().length >= 60 }],
      ['Formato', /lista|tabla|pasos|inicio|cierre|preguntas|niveles|frases|minutos/],
      ['Hace pensar', /explique|explica|reflex|sus palabras|argument|pregunta|verifi|compar/],
    ];
    const res = criterios.map(([n, r]) => [n, r.test(t)]);
    L.revisado = { res, ok: res.filter((x) => x[1]).length };
    render();
  }

  // ---------- Explorar ----------
  let seccion = 'herramientas';
  const SECCIONES = { herramientas: 'Herramientas', lecciones: 'Lecciones', clase: 'Para clase', comunidad: 'Comunidad' };

  V.explorar = () => {
    let lista = '';
    if (seccion === 'herramientas') {
      lista = DATOS.herramientas.map((h) => `<button class="item" data-herr="${h.id}"><span class="icono">${h.nombre[0]}</span>
        <span class="crece"><h3>${h.nombre}</h3><span class="suave pequeno">${h.ideal}</span></span><span class="flecha">›</span></button>`).join('')
        + '<button class="btn sec" data-comparar>Comparar todas</button>';
    } else if (seccion === 'lecciones') {
      lista = DATOS.lecciones.map((l) => `<button class="item" data-abrir-leccion="${l.id}">
        <span class="icono" ${E.completadas.includes(l.id) ? 'style="background:var(--verde-claro);color:var(--verde)"' : ''}>${E.completadas.includes(l.id) ? '✓' : l.min}</span>
        <span class="crece"><h3>${l.titulo}</h3><span class="suave pequeno">${l.tarea} · ${l.min} min</span></span><span class="flecha">›</span></button>`).join('');
    } else if (seccion === 'clase') {
      lista = '<h3>Actividades para que sus estudiantes piensen</h3>'
        + DATOS.actividades.map((a, i) => `<button class="item" data-act="${i}"><span class="icono" style="background:var(--verde-claro);color:var(--verde)">?</span>
          <span class="crece"><h3>${a.titulo}</h3><span class="suave pequeno">${a.min} min · grados ${a.grado}</span></span>${E.guardadas.includes('a' + i) ? '<span class="etiqueta verde">Guardada</span>' : '<span class="flecha">›</span>'}</button>`).join('')
        + '<h3 style="margin-top:8px">Plantillas</h3>'
        + DATOS.plantillas.map((p) => `<button class="item" data-plantilla="${p.id}"><span class="icono" style="background:var(--amarillo-claro);color:#8a5a00">↓</span>
          <span class="crece"><h3>${p.titulo}</h3><span class="suave pequeno">${p.desc}</span></span><span class="flecha">›</span></button>`).join('');
    } else {
      const posts = [...E.posts, ...DATOS.comunidad.map((p, i) => ({ id: 'c' + i, ...p }))];
      lista = '<button class="btn" data-escribir>Compartir una experiencia</button>'
        + posts.map((p) => {
          const on = !!E.likes[p.id];
          return `<div class="tarjeta post grupo-s"><div class="fila"><span class="autor">${esc(p.ini)}</span><span class="suave pequeno crece">${esc(p.autor)}</span></div>
            <p>${esc(p.texto)}</p><button class="me-gusta ${on ? 'on' : ''}" data-like="${p.id}">${on ? '♥' : '♡'} ${p.likes + (on ? 1 : 0)} me sirve</button></div>`;
        }).join('');
    }
    return `
    <section class="vista">
      <h1>Explorar</h1>
      <div class="segmento" role="tablist">${Object.entries(SECCIONES).map(([k, n]) => `<button role="tab" aria-selected="${k === seccion}" class="${k === seccion ? 'on' : ''}" data-seccion="${k}">${n}</button>`).join('')}</div>
      <div class="grupo">${lista}</div>
    </section>`;
  };

  function hojaHerramienta(id) {
    const h = DATOS.herramientas.find((x) => x.id === id);
    abrirHoja(`<div class="fila"><span class="icono">${h.nombre[0]}</span><div class="crece"><h2>${h.nombre}</h2><p class="suave pequeno">${h.empresa}</p></div></div>
      <div class="grupo-s"><h3>Para qué sirve</h3><p>${h.uso}</p></div>
      <div class="grupo-s"><h3>Cuidado con</h3><p>${h.limites}</p></div>
      <div class="fila"><span class="etiqueta verde">${h.costo}</span></div>`);
  }
  function hojaComparar() {
    abrirHoja(`<h2>Comparar herramientas</h2>
      <table class="tabla"><thead><tr><th>Herramienta</th><th>Ideal para</th><th>Cuidado con</th></tr></thead><tbody>
      ${DATOS.herramientas.map((h) => `<tr><td><b>${h.nombre}</b></td><td>${h.ideal}</td><td>${h.limites}</td></tr>`).join('')}</tbody></table>
      <p class="suave pequeno">Todas tienen versión gratuita con límites.</p>`);
  }
  function hojaActividad(i) {
    const a = DATOS.actividades[i];
    const g = E.guardadas.includes('a' + i);
    abrirHoja(`<div class="grupo-s"><span class="etiqueta">${a.min} min · grados ${a.grado}</span><h2>${a.titulo}</h2><p>${a.desc}</p></div>
      <div class="grupo-s"><h3>Paso a paso</h3><ol class="pasos">${a.pasos.map((p) => `<li>${p}</li>`).join('')}</ol></div>
      <button class="btn ${g ? 'sec' : 'verde'}" data-guardar="a${i}">${g ? 'Quitar de mi clase' : 'Llevar a mi clase'}</button>`);
  }
  function hojaPlantilla(id) {
    const p = DATOS.plantillas.find((x) => x.id === id);
    abrirHoja(`<div class="grupo-s"><h2>${p.titulo}</h2><p class="suave">${p.desc}</p></div>
      <div class="texto-ia" style="max-height:220px;overflow:auto">${esc(p.texto)}</div>
      <button class="btn" data-descargar="${p.id}">Descargar</button>`);
  }
  function hojaEscribir() {
    abrirHoja(`<h2>Compartir una experiencia</h2>
      <textarea id="nuevo-post" placeholder="¿Cómo le fue usando la IA en clase?" aria-label="Su publicación"></textarea>
      <button class="btn" data-publicar>Publicar</button>`);
  }

  // ---------- Perfil ----------
  V.perfil = () => {
    const u = E.usuario || {};
    const horas = ['6 a. m.', '12 m.', '6 p. m.', '8 p. m.'];
    if (!horas.includes(E.recordatorio.hora)) E.recordatorio.hora = '6 p. m.';
    const nombrePlan = { gratis: 'Gratis', docente: 'Docente', colegio: 'Colegio' }[E.plan];
    return `
    <section class="vista">
      <div class="fila"><span class="icono" style="width:64px;height:64px;border-radius:50%;font-size:1.4rem">${esc(iniciales(u.nombre))}</span>
        <div class="crece"><h2>${esc(u.nombre || 'Docente')}</h2><p class="suave pequeno">${esc(u.area || '')} · Nivel ${E.nivel || '—'}</p></div></div>
      <div class="stats">
        <div class="stat"><b>${E.completadas.length}</b><span>Lecciones</span></div>
        <div class="stat"><b>${puntos()}</b><span>Puntos</span></div>
        <div class="stat"><b>${E.guardadas.length}</b><span>Guardadas</span></div>
      </div>
      <div class="tarjeta grupo">
        <div class="fila"><div class="crece"><h3>Recordatorio diario</h3><p class="suave pequeno">${E.recordatorio.on ? 'Le avisamos a las ' + E.recordatorio.hora : 'Un aviso corto para no perder el ritmo'}</p></div>
          <label class="interruptor"><input type="checkbox" id="rec-on" ${E.recordatorio.on ? 'checked' : ''} aria-label="Activar recordatorio"><span></span></label></div>
        ${E.recordatorio.on ? `<div class="segmento">${horas.map((h) => `<button class="${h === E.recordatorio.hora ? 'on' : ''}" data-hora="${h}">${h}</button>`).join('')}</div>` : ''}
      </div>
      <div class="grupo">
        <button class="item" data-ir="#/planes"><span class="icono" style="background:var(--amarillo-claro);color:#8a5a00">$</span><span class="crece"><h3>Planes</h3><span class="suave pequeno">Plan actual: ${nombrePlan}</span></span><span class="flecha">›</span></button>
        <button class="item" data-ir="#/panel"><span class="icono">▦</span><span class="crece"><h3>Panel del colegio</h3><span class="suave pequeno">Demostración para colegios</span></span><span class="flecha">›</span></button>
        <button class="item" data-ir="#/evaluar"><span class="icono" style="background:var(--verde-claro);color:var(--verde)">★</span><span class="crece"><h3>Evaluar el prototipo</h3><span class="suave pequeno">Su opinión en 3 minutos</span></span><span class="flecha">›</span></button>
        <button class="item" data-accion="rehacer"><span class="icono">↻</span><span class="crece"><h3>Repetir diagnóstico</h3></span><span class="flecha">›</span></button>
      </div>
      <div class="grupo-s empuje">
        <button class="btn sec" data-accion="salir">Cerrar sesión</button>
        <button class="enlace" data-accion="reiniciar">Reiniciar prototipo</button>
      </div>
    </section>`;
  };

  V.planes = () => {
    const planes = [
      ['gratis', 'Gratis', '$0', ['Ruta básica de 5 lecciones', 'Herramientas y detector de errores']],
      ['docente', 'Docente', '$9.900/mes', ['Todas las lecciones', 'Plantillas y actividades', 'Certificado']],
      ['colegio', 'Colegio', 'Licencia', ['Todo el plan Docente para el equipo', 'Panel de avance', 'Acompañamiento']],
    ];
    return `
    <section class="vista">
      <div class="cabeza"><button class="cerrar" data-ir="#/perfil" aria-label="Volver">‹</button><h2>Planes</h2></div>
      ${planes.map(([id, n, pr, items]) => `<div class="tarjeta plan ${id === 'docente' ? 'destacado' : ''}">
        <div class="fila"><h2 class="crece">${n}</h2><span class="precio">${pr}</span></div>
        <ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>
        ${E.plan === id ? '<button class="btn sec" disabled>Plan actual</button>'
          : id === 'colegio' ? '<button class="btn sec" data-accion="cotizar">Solicitar para mi colegio</button>'
          : `<button class="btn" data-plan="${id}">Elegir</button>`}
      </div>`).join('')}
      <p class="suave pequeno centro">Precios de prueba para validar con docentes y colegios.</p>
    </section>`;
  };

  V.panel = () => {
    const ds = DATOS.panel;
    const prom = Math.round(ds.reduce((s, d) => s + d.avance, 0) / ds.length);
    return `
    <section class="vista">
      <div class="cabeza"><button class="cerrar" data-ir="#/perfil" aria-label="Volver">‹</button><h2>Panel del colegio</h2></div>
      <div class="stats" style="grid-template-columns:1fr 1fr">
        <div class="stat"><b>${ds.length}</b><span>Docentes</span></div>
        <div class="stat"><b>${prom}%</b><span>Avance promedio</span></div>
      </div>
      <div class="tarjeta grupo">${ds.map((d) => `<div class="grupo-s"><p class="pequeno"><b>${d.nombre}</b></p>
        <div class="barra-h"><div class="progreso"><span style="width:${d.avance}%"></span></div><b>${d.avance}%</b></div></div>`).join('')}</div>
      <div class="pie"><button class="btn" data-accion="reporte">Descargar reporte</button><p class="suave pequeno centro">Datos de demostración</p></div>
    </section>`;
  };

  // ---------- Evaluación del prototipo (Guía 2, punto 4) ----------
  const CLAVE_EVAL = 'profeia-evaluaciones';
  let EV = null; // { paso, r: respuestas }
  const evalNueva = () => ({ paso: 0, r: { version: 'app', pantallas: {} } });
  const leerEvaluaciones = () => { try { return JSON.parse(localStorage.getItem(CLAVE_EVAL) || '[]'); } catch (e) { console.warn(e); return []; } };
  const guardarEvaluacion = (fila) => {
    const todas = leerEvaluaciones();
    todas.push(fila);
    try { localStorage.setItem(CLAVE_EVAL, JSON.stringify(todas)); } catch (e) { console.warn('No se pudo guardar la evaluación en el dispositivo.', e); }
  };
  const textoPregunta = (q) => q.p.replace('{forma}', EVALUACION.forma[EV.r.version]);

  function pasoListo() {
    const r = EV.r;
    if (EV.paso === 0) return !!(r.iniciales && r.rol && r.primera_encuesta && r.version);
    if (EV.paso === 1) return EVALUACION.pantallas[r.version].every(([id]) => r.pantallas[id]);
    const q = EVALUACION.preguntas[EV.paso - 2];
    if (!q) return true;
    if (q.opcional) return true;
    const v = r[q.id];
    return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
  }

  V.evaluar = () => {
    if (!EV) EV = evalNueva();
    const r = EV.r;
    const total = EVALUACION.preguntas.length + 2;
    const fin = EV.paso >= total;
    if (fin) {
      return `<section class="vista fin">
        <div class="medalla" aria-hidden="true">✓</div>
        <div class="grupo-s"><h1>¡Gracias!</h1><p class="suave">${EV.enviado ? 'Su evaluación fue enviada.' : 'Su evaluación quedó guardada en este dispositivo.'} Sus respuestas ayudan a mejorar ProfeIA.</p></div>
        <div class="pie" style="width:100%"><button class="btn" data-eval-nueva>Nueva evaluación</button><button class="btn sec" data-ir="#/${E.usuario ? 'inicio' : 'bienvenida'}">Volver a la app</button></div>
      </section>`;
    }
    let cuerpo = '';
    if (EV.paso === 0) {
      const areas = ['Matemáticas', 'Lenguaje', 'Ciencias naturales', 'Ciencias sociales', 'Inglés', 'Artes', 'Educación física', 'Tecnología', 'Preescolar', 'Salud', 'Otra'];
      const chips = (campo, ops) => `<div class="chips">${ops.map(([v, t]) => `<button class="chip ${r[campo] === v ? 'on' : ''}" data-eval-set="${campo}" data-valor="${esc(v)}">${t}</button>`).join('')}</div>`;
      cuerpo = `<p class="tipo">Evaluación del prototipo</p><h1>Antes de empezar</h1>
        <p class="suave pequeno">Toma unos 3 minutos. Solo pedimos sus iniciales.</p>
        <label class="campo">Iniciales<input id="ev-iniciales" maxlength="12" placeholder="Ej.: K.G." value="${esc(r.iniciales || '')}" autocomplete="off"></label>
        <label class="campo">Área<select id="ev-area">${areas.map((a) => `<option ${r.area === a ? 'selected' : ''}>${a}</option>`).join('')}</select></label>
        <div class="grupo-s"><b class="pequeno">Rol</b>${chips('rol', [['Docente', 'Docente'], ['Directivo docente', 'Directivo'], ['Otro', 'Otro']])}</div>
        <div class="grupo-s"><b class="pequeno">¿Respondió la primera encuesta de ProfeIA?</b>${chips('primera_encuesta', [['Sí', 'Sí'], ['No', 'No']])}</div>
        <div class="grupo-s"><b class="pequeno">¿Qué versión revisó?</b>${chips('version', [['bocetos', 'Bocetos en papel'], ['app', 'App en el celular']])}</div>`;
    } else if (EV.paso === 1) {
      const ps = EVALUACION.pantallas[r.version];
      cuerpo = `<p class="punto-guia">3. Implementación del prototipo</p><h2>Califique cada pantalla</h2>
        <p class="suave pequeno">¿Qué tan clara y útil le pareció? 1 estrella = nada, 5 = mucho.</p>
        <div class="grupo-s">${ps.map(([id, n]) => `<div class="fila-eval"><span>${n}</span><div class="estrellas" role="radiogroup" aria-label="${n}">
          ${[1, 2, 3, 4, 5].map((k) => `<button class="${(r.pantallas[id] || 0) >= k ? 'on' : ''}" data-estrella="${id}:${k}" aria-label="${k} de 5">★</button>`).join('')}</div></div>`).join('')}</div>
        <label class="campo">¿Alguna pantalla le pareció confusa? ¿Cuál y por qué? (opcional)<textarea id="ev-coment" style="min-height:80px">${esc(r.comentario_pantallas || '')}</textarea></label>`;
    } else {
      const q = EVALUACION.preguntas[EV.paso - 2];
      const v = r[q.id];
      let campo = '';
      if (q.tipo === 'escala') {
        campo = `<div class="escala">${[1, 2, 3, 4, 5].map((k) => `<button class="${v === k ? 'on' : ''}" data-eval-set="${q.id}" data-valor="${k}" data-num>${k}</button>`).join('')}</div>
          <div class="extremos"><span>${q.min}</span><span>${q.max}</span></div>`;
      } else if (q.tipo === 'unica') {
        campo = `<div class="grupo">${q.o.map((o, k) => `<button class="opcion ${v === o ? 'on' : ''}" data-eval-set="${q.id}" data-valor="${esc(o)}"><span class="letra">${'ABCDE'[k]}</span>${o}</button>`).join('')}</div>`;
      } else if (q.tipo === 'multiple') {
        const ops = EVALUACION.funcionalidades[r.version];
        const sel = v || [];
        campo = `<div class="chips">${ops.map((o) => `<button class="chip ${sel.includes(o) ? 'on' : ''}" data-eval-multi="${q.id}" data-valor="${esc(o)}">${o}</button>`).join('')}</div>`;
      } else {
        campo = `<textarea id="ev-texto" data-campo="${q.id}" placeholder="Escriba aquí…">${esc(v || '')}</textarea>`;
      }
      cuerpo = `<p class="punto-guia">${q.punto}</p><h2>${textoPregunta(q)}</h2>${q.ayuda ? `<p class="suave pequeno">${q.ayuda}</p>` : ''}${q.opcional ? '<p class="suave pequeno">Opcional</p>' : ''}${campo}`;
    }
    const ultimo = EV.paso === total - 1;
    return `<section class="vista leccion">
      <div class="cabeza"><button class="cerrar" data-eval-atras aria-label="Volver">‹</button>
        <div class="progreso"><span style="width:${(EV.paso / total) * 100}%"></span></div></div>
      <div class="paso">${cuerpo}</div>
      <div class="pie"><button class="btn ${ultimo ? 'verde' : ''}" data-eval-sig ${pasoListo() ? '' : 'disabled'}>${ultimo ? 'Enviar evaluación' : 'Siguiente'}</button></div>
    </section>`;
  };

  function filaEvaluacion() {
    const r = EV.r;
    const fila = { fecha: new Date().toISOString(), version: r.version === 'app' ? 'Alta resolución (app)' : 'Baja resolución (bocetos)',
      iniciales: r.iniciales, area: r.area, rol: r.rol, primera_encuesta: r.primera_encuesta };
    EVALUACION.pantallas[r.version].forEach(([id, n]) => { fila['pantalla: ' + n] = r.pantallas[id]; });
    fila.comentario_pantallas = r.comentario_pantallas || '';
    EVALUACION.preguntas.forEach((q) => {
      const v = r[q.id];
      fila[q.id] = Array.isArray(v) ? v.join('; ') : (v ?? '');
    });
    return fila;
  }

  async function enviarEvaluacion() {
    const fila = filaEvaluacion();
    guardarEvaluacion(fila);
    EV.enviado = false;
    if (ENDPOINT_EVALUACION) {
      try {
        await fetch(ENDPOINT_EVALUACION, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(fila) });
        EV.enviado = true;
      } catch (e) { console.warn('No se pudo enviar; quedó guardada en el dispositivo.', e); }
    }
    EV.paso += 1;
    render();
  }

  function capturarTextoEval() {
    if (!EV) return;
    const ini = document.getElementById('ev-iniciales');
    if (ini) EV.r.iniciales = ini.value.trim();
    const area = document.getElementById('ev-area');
    if (area) EV.r.area = area.value;
    const com = document.getElementById('ev-coment');
    if (com) EV.r.comentario_pantallas = com.value.trim();
    const tx = document.getElementById('ev-texto');
    if (tx) EV.r[tx.dataset.campo] = tx.value.trim();
  }

  // Resultados guardados en este dispositivo (respaldo y evidencia)
  V.resultados = () => {
    const todas = leerEvaluaciones();
    const por = (v) => todas.filter((f) => f.version.startsWith(v)).length;
    return `<section class="vista">
      <div class="cabeza"><button class="cerrar" data-ir="#/bienvenida" aria-label="Volver">‹</button><h2>Evaluaciones</h2></div>
      <div class="stats">
        <div class="stat"><b>${todas.length}</b><span>Total</span></div>
        <div class="stat"><b>${por('Baja')}</b><span>Bocetos</span></div>
        <div class="stat"><b>${por('Alta')}</b><span>App</span></div>
      </div>
      <p class="suave pequeno">${ENDPOINT_EVALUACION ? 'Las evaluaciones se envían a la hoja de Google Sheets y además quedan aquí como respaldo.' : 'Aún no hay hoja de Google Sheets conectada: las evaluaciones solo están en este dispositivo. Descárguelas antes de borrar los datos del navegador.'}</p>
      <div class="pie"><button class="btn" data-descargar-csv ${todas.length ? '' : 'disabled'}>Descargar en Excel (CSV)</button></div>
    </section>`;
  };

  function descargarCSV() {
    const todas = leerEvaluaciones();
    const cols = [...new Set(todas.flatMap((f) => Object.keys(f)))];
    const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + [cols.map(celda).join(';'), ...todas.map((f) => cols.map((c) => celda(f[c])).join(';'))].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'ProfeIA - evaluaciones.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    avisar('Descargado');
  }

  // ---------- Enrutador ----------
  const TABS = { inicio: ['⌂', 'Inicio'], explorar: ['◎', 'Explorar'], perfil: ['◉', 'Perfil'] };
  const PUBLICAS = ['bienvenida', 'ingresar', 'registro', 'evaluar', 'resultados'];

  function render() {
    const partes = (location.hash || '#/').replace(/^#\/?/, '').split('/');
    let vista = partes[0] || (E.usuario ? 'inicio' : 'bienvenida');
    if (!E.usuario && !PUBLICAS.includes(vista)) vista = 'bienvenida';
    if (!V[vista]) vista = E.usuario ? 'inicio' : 'bienvenida';
    if (vista !== 'leccion') L = null;
    cerrarHoja();
    // Solo se vuelve arriba (y se anima la entrada) al cambiar de pantalla o de paso;
    // al seleccionar algo dentro de la misma pantalla se conserva la posición.
    const llave = `${location.hash}|${L ? L.paso : ''}|${EV ? EV.paso : ''}|${vista === 'explorar' ? seccion : ''}`;
    const misma = llave === render.llave;
    const pos = app.scrollTop;
    render.llave = llave;
    app.innerHTML = V[vista](partes[1]);
    const v = app.firstElementChild;
    if (misma) {
      if (v) [v, ...v.querySelectorAll('.paso, .medalla')].forEach((el) => { el.style.animation = 'none'; });
      app.scrollTop = pos;
    } else {
      app.scrollTop = 0;
    }
    const conMenu = !!E.usuario && ['inicio', 'explorar', 'perfil', 'planes', 'panel'].includes(vista);
    menu.classList.toggle('visible', conMenu);
    const activa = TABS[vista] ? vista : 'perfil';
    menu.innerHTML = Object.entries(TABS).map(([k, [ic, n]]) => `<a href="#/${k}" class="${k === activa ? 'on' : ''}" ${k === activa ? 'aria-current="page"' : ''}><span class="ic" aria-hidden="true">${ic}</span>${n}</a>`).join('');
    const t = app.querySelector('h1, h2');
    document.title = 'ProfeIA · ' + (t ? t.textContent : 'Prototipo');
  }
  window.addEventListener('hashchange', render);

  // ---------- Eventos ----------
  const ACCIONES = {
    olvido: () => avisar('Le enviamos un enlace (simulado)'),
    institucional: () => (E.usuario ? ir('#/inicio') : (avisar('Primero cree su cuenta'), ir('#/registro'))),
    rehacer: () => { E.diag = []; E.nivel = null; guardar(); ir('#/diagnostico/0'); },
    salir: () => { E.usuario = null; guardar(); ir('#/bienvenida'); },
    reiniciar: () => {
      E = inicial();
      try { localStorage.removeItem(CLAVE); } catch (e) { console.warn(e); }
      avisar('Prototipo reiniciado'); ir('#/bienvenida');
    },
    cotizar: () => avisar('Solicitud enviada (simulado)'),
    reporte: () => descargar('ProfeIA - Reporte del colegio (demo).txt', 'REPORTE DE DEMOSTRACIÓN\n\n' + DATOS.panel.map((x) => `${x.nombre}: ${x.avance}%`).join('\n')),
  };

  function alClic(ev) {
    const b = ev.target.closest('button, [data-ir]');
    if (!b) return;
    const d = b.dataset;
    if ('cerrarHoja' in d) return cerrarHoja();
    // Evaluación
    if (d.evalSet) {
      capturarTextoEval();
      EV.r[d.evalSet] = 'num' in d ? Number(d.valor) : d.valor;
      if (d.evalSet === 'version') EV.r.pantallas = {};
      return render();
    }
    if (d.evalMulti) {
      capturarTextoEval();
      const sel = EV.r[d.evalMulti] || (EV.r[d.evalMulti] = []);
      const i = sel.indexOf(d.valor);
      if (i >= 0) sel.splice(i, 1); else sel.push(d.valor);
      return render();
    }
    if (d.estrella) {
      capturarTextoEval();
      const [pid, k] = d.estrella.split(':');
      EV.r.pantallas[pid] = Number(k);
      return render();
    }
    if ('evalSig' in d) {
      capturarTextoEval();
      if (!pasoListo()) return avisar('Complete este paso para continuar');
      if (EV.paso === EVALUACION.preguntas.length + 1) return enviarEvaluacion();
      EV.paso += 1;
      return render();
    }
    if ('evalAtras' in d) {
      capturarTextoEval();
      if (EV.paso === 0) return ir(E.usuario ? '#/inicio' : '#/bienvenida');
      EV.paso -= 1;
      return render();
    }
    if ('evalNueva' in d) { EV = evalNueva(); return render(); }
    if ('descargarCsv' in d) return descargarCSV();
    if (d.ir) return ir(d.ir);
    if ('atras' in d) return history.back();
    if (d.accion && ACCIONES[d.accion]) return ACCIONES[d.accion]();
    if (d.diag) {
      const [i, k] = d.diag.split(':').map(Number);
      E.diag[i] = k; guardar();
      b.classList.add('on');
      setTimeout(() => {
        if (i < DATOS.diagnostico.length - 1) ir('#/diagnostico/' + (i + 1));
        else { calcularRuta(); ir('#/resultado'); }
      }, 260);
      return;
    }
    if (d.abrirLeccion) return ir('#/leccion/' + d.abrirLeccion);
    if ('salirLeccion' in d) return ir('#/inicio');
    if ('pasoSig' in d) { L.paso += 1; return render(); }
    if ('copiar' in d) return copiar(leccion(L.id).prompt);
    if ('revisar' in d) return revisarPrompt();
    if ('reintentar' in d) { L.revisado = null; return render(); }
    if (d.frase !== undefined) {
      const i = Number(d.frase);
      if (L.marcadas.has(i)) L.marcadas.delete(i); else L.marcadas.add(i);
      return render();
    }
    if ('detector' in d) { L.detectorListo = true; return render(); }
    if (d.seccion) { seccion = d.seccion; return render(); }
    if (d.herr) return hojaHerramienta(d.herr);
    if ('comparar' in d) return hojaComparar();
    if (d.act !== undefined) return hojaActividad(Number(d.act));
    if (d.plantilla) return hojaPlantilla(d.plantilla);
    if (d.descargar) { const p = DATOS.plantillas.find((x) => x.id === d.descargar); return descargar(`ProfeIA - ${p.titulo}.txt`, p.texto); }
    if ('escribir' in d) return hojaEscribir();
    if ('publicar' in d) {
      const t = document.getElementById('nuevo-post').value.trim();
      if (!t) return avisar('Escriba algo primero');
      const u = E.usuario || {};
      E.posts.unshift({ id: 'p' + Date.now(), autor: `${u.nombre || 'Docente'} · ${u.area || ''}`, ini: iniciales(u.nombre), texto: t, likes: 0 });
      guardar(); avisar('Publicado'); return render();
    }
    if (d.guardar) {
      const i = E.guardadas.indexOf(d.guardar);
      if (i >= 0) E.guardadas.splice(i, 1); else E.guardadas.push(d.guardar);
      guardar(); avisar(i >= 0 ? 'Quitada de su clase' : 'Guardada para su clase'); return render();
    }
    if (d.like) { E.likes[d.like] = !E.likes[d.like]; guardar(); return render(); }
    if (d.hora) { E.recordatorio.hora = d.hora; guardar(); avisar('Recordatorio a las ' + d.hora); return render(); }
    if (d.plan) { E.plan = d.plan; guardar(); avisar('Plan elegido (simulado)'); return render(); }
  }
  app.addEventListener('click', alClic);
  hoja.addEventListener('click', alClic);

  app.addEventListener('input', (ev) => {
    if (ev.target.id === 'mi-prompt' && L) L.texto = ev.target.value;
    if (EV && ['ev-iniciales', 'ev-texto'].includes(ev.target.id)) {
      capturarTextoEval();
      const b = app.querySelector('[data-eval-sig]');
      if (b) b.disabled = !pasoListo();
    }
  });
  app.addEventListener('change', (ev) => {
    if (ev.target.id === 'rec-on') {
      E.recordatorio.on = ev.target.checked; guardar();
      avisar(E.recordatorio.on ? 'Recordatorio activado' : 'Recordatorio desactivado'); render();
    }
  });
  app.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (ev.target.id === 'f-ingresar') {
      if (!E.usuario) { avisar('No encontramos su cuenta. Créela primero'); return ir('#/registro'); }
      return ir(E.nivel ? '#/inicio' : '#/diagnostico/0');
    }
    if (ev.target.id === 'f-registro') {
      const f = new FormData(ev.target);
      E.usuario = { nombre: f.get('nombre').trim(), correo: f.get('correo'), area: f.get('area') };
      E.diag = []; E.nivel = null; E.completadas = [];
      guardar();
      ir('#/diagnostico/0');
    }
  });

  render();
})();
