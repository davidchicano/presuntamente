/* Sample data — fixtures for the prototype.
 * Tone: castellano administrativo neutro; verbos compatibles con la fase real.
 * Personas y casos basados en información pública conocida (CGPJ, BOE, prensa)
 * para que el prototipo se lea verosímil; NO es ficha definitiva del producto.
 */
window.PRESUNTAMENTE_DATA = {
  cases: [
    {
      slug: "gurtel",
      mediatico: "Caso Gürtel",
      oficial: "DPA 275/2008",
      organo: "JCI nº6, Audiencia Nacional",
      fase: "Sentencia firme",
      phaseKind: "firme",
      implicados: 37,
      ultimo_hito: { fecha: "2024-11-18", titulo: "El TS confirma las condenas" },
      relevancia: "capital",
    },
    {
      slug: "ere-andalucia",
      mediatico: "Caso ERE de Andalucía",
      oficial: "Causa Especial · TSJA → TS",
      organo: "TSJ de Andalucía",
      fase: "Sentencia firme",
      phaseKind: "firme",
      implicados: 21,
      ultimo_hito: { fecha: "2024-06-12", titulo: "El TC anula parcialmente" },
      relevancia: "alta",
    },
    {
      slug: "plus-ultra",
      mediatico: "Caso Plus Ultra",
      oficial: "DPA 87/2021",
      organo: "JCI nº1, Audiencia Nacional",
      fase: "Instrucción",
      phaseKind: "instr",
      implicados: 4,
      ultimo_hito: { fecha: "2026-05-19", titulo: "Nuevo informe pericial UDEF" },
      relevancia: "media",
    },
    {
      slug: "kitchen",
      mediatico: "Operación Kitchen",
      oficial: "Pieza separada · DPA 96/2017",
      organo: "JCI nº6, Audiencia Nacional",
      fase: "Juicio oral",
      phaseKind: "juicio",
      implicados: 10,
      ultimo_hito: { fecha: "2026-04-02", titulo: "Auto de apertura de juicio oral" },
      relevancia: "alta",
    },
    {
      slug: "pujol",
      mediatico: "Caso Pujol",
      oficial: "DPA 132/2014",
      organo: "JCI nº5, Audiencia Nacional",
      fase: "Juicio oral",
      phaseKind: "juicio",
      implicados: 8,
      ultimo_hito: { fecha: "2026-02-21", titulo: "Inicio de las sesiones de vista oral" },
      relevancia: "alta",
    },
    {
      slug: "barcenas",
      mediatico: "Caso Bárcenas (papeles)",
      oficial: "Pieza separada · DPA 275/2008",
      organo: "JCI nº5, AN",
      fase: "Sentencia firme",
      phaseKind: "firme",
      implicados: 12,
      ultimo_hito: { fecha: "2024-09-30", titulo: "TS confirma la condena por la caja B" },
      relevancia: "alta",
    },
    {
      slug: "tito-berni",
      mediatico: "Caso Tito Berni / Mediador",
      oficial: "DPI 12/2023",
      organo: "JCI nº4, AN",
      fase: "Instrucción",
      phaseKind: "instr",
      implicados: 16,
      ultimo_hito: { fecha: "2026-03-14", titulo: "Nueva imputación de cargo público" },
      relevancia: "media",
    },
  ],

  ficha_gurtel: {
    slug: "gurtel",
    mediatico: "Caso Gürtel",
    oficial: "Diligencias previas 275/2008",
    organo: "JCI nº6, Audiencia Nacional",
    fase: "Sentencia firme",
    phaseKind: "firme",
    fiscal: "Fiscalía Anticorrupción",
    ultimo_hito: "2024-11-18 — El Tribunal Supremo confirma condenas",
    next: "—",
    cifras: "Más de 120 M€ en contratos públicos investigados",
    lede: "Trama de presunta corrupción político-empresarial vinculada a contrataciones de las administraciones autonómicas y locales del Partido Popular durante el periodo 1999–2009.",
    resumen: [
      { text: "El caso se inicia en 2007 a raíz de una denuncia anónima ante la Fiscalía Anticorrupción. La instrucción se asigna al Juzgado Central de Instrucción nº5 y posteriormente nº6 de la Audiencia Nacional.", cite: { n: "N1", label: "Auto inicial JCI nº5, 2009" } },
      { text: "Durante la instrucción se separan piezas autónomas según ámbito territorial (Madrid, Valencia, Galicia) y según objeto (caja B del PP, Operación Kitchen).", cite: { n: "N1", label: "Auto de separación, 2014" } },
      { text: "La Sala Segunda del Tribunal Supremo confirma en 2024 las condenas dictadas por la Audiencia Nacional, agotando la vía ordinaria de recurso.", cite: { n: "N1", label: "STS 1234/2024" } },
    ],

    personas: [
      { iniciales: "FC", nombre: "Francisco Correa Sánchez", cargo: "Empresario", roles: ["Condenado"], delitos: "Cohecho · falsedad · blanqueo", swim: [ {label:"Investigado", kind:"inv"}, {label:"Procesado", kind:"pro"}, {label:"Condenado", kind:"cond"} ], dates: ["2009","2014","2018"] },
      { iniciales: "LB", nombre: "Luis Bárcenas Gutiérrez", cargo: "Ex tesorero PP", roles: ["Condenado"], delitos: "Cohecho · delito fiscal", swim: [ {label:"Investigado", kind:"inv"}, {label:"Procesado", kind:"pro"}, {label:"Condenado", kind:"cond"} ], dates: ["2009","2013","2018"] },
      { iniciales: "PC", nombre: "Pablo Crespo Sabarís", cargo: "Empresario", roles: ["Condenado"], delitos: "Cohecho · falsedad", swim: [ {label:"Investigado", kind:"inv"}, {label:"Procesado", kind:"pro"}, {label:"Condenado", kind:"cond"} ], dates: ["2009","2014","2018"] },
    ],

    hitos: [
      { fecha: "2024-11-18", tipo: "jurisdiccional", icon: "gavel", titulo: "Sentencia firme del Tribunal Supremo", desc: "La Sala Segunda confirma las condenas dictadas en primera instancia y desestima los recursos de casación interpuestos.", indicadores: "+ 3 hechos nuevos · 1 corregido" },
      { fecha: "2018-05-24", tipo: "jurisdiccional", icon: "gavel", titulo: "Sentencia de la AN — primera época", desc: "La Audiencia Nacional dicta sentencia condenatoria por delitos de cohecho, falsedad documental y blanqueo de capitales." },
      { fecha: "2014-09-17", tipo: "jurisdiccional", icon: "gavel", titulo: "Auto de separación de piezas", desc: "Se separan piezas autónomas por ámbito territorial y por objeto, incluyendo la pieza «papeles de Bárcenas»." },
      { fecha: "2009-02-12", tipo: "político", icon: "landmark", titulo: "Comisión de investigación en el Congreso", desc: "El Congreso de los Diputados constituye una comisión de investigación sobre la financiación de partidos políticos." },
    ],

    hechos_acreditados: [
      { fecha: "2018-05-24", text: "Francisco Correa Sánchez ha sido condenado por delitos de cohecho, falsedad documental y blanqueo de capitales en la primera época del caso.", sources: [ { n: "N1", label: "SAN 20/2018", url: "#" } ] },
      { fecha: "2024-11-18", text: "La Sala Segunda del Tribunal Supremo ha confirmado las condenas y ha desestimado los recursos de casación.", sources: [ { n: "N1", label: "STS 1234/2024", url: "#" }, { n: "N3", label: "BOE-A-2024-19876", url: "#" } ] },
    ],

    hechos_investigados: [
      { fecha: "en curso", text: "Se investigan posibles ramificaciones de la trama en contratos de la administración autonómica gallega no incluidos en las piezas hasta ahora separadas.", sources: [ { n: "N2", label: "Informe UDEF, 2025", url: "#" } ] },
    ],

    contraposicion: {
      head: "Versiones contrapuestas — adjudicaciones autonómicas",
      a: { actor: "Sostiene la acusación popular", text: "Las adjudicaciones autonómicas de 2003–2005 forman parte del mismo entramado corruptor sentenciado en la pieza principal.", n: "N2", src: "Escrito de acusación, 2017" },
      b: { actor: "Sostienen las defensas", text: "Las adjudicaciones autonómicas siguieron procedimientos reglados y no forman parte del entramado sentenciado, sin perjuicio de irregularidades menores ya prescritas.", n: "N2", src: "Recurso de casación, 2023" },
    },

    documentos: [
      { titulo: "STS 1234/2024 — Sala Segunda", n: "N1", productor: "Tribunal Supremo", fecha: "2024-11-18", hash: "sha256:3f1a…b27d", citado: 7 },
      { titulo: "SAN 20/2018 — primera época", n: "N1", productor: "Audiencia Nacional", fecha: "2018-05-24", hash: "sha256:91c2…ee04", citado: 12 },
      { titulo: "Informe UDEF — adjudicaciones 2003-2005", n: "N2", productor: "Policía Judicial · UDEF", fecha: "2017-02-09", hash: "sha256:af14…6bd1", citado: 4 },
      { titulo: "Auto de separación de piezas", n: "N1", productor: "JCI nº6, AN", fecha: "2014-09-17", hash: "sha256:0142…91aa", citado: 9 },
      { titulo: "BOE-A-2024-19876 — publicación de la STS", n: "N3", productor: "Boletín Oficial del Estado", fecha: "2024-11-25", hash: "—", citado: 2 },
    ],

    redaccion: {
      maintainer: "@davidchicano",
      revision: "2026-05-21",
      modificado: "2026-05-20 14:32 UTC",
      niveles: "12 hechos · 8 N1 · 3 N2 · 1 N3",
    },
  },

  persona_focus: {
    slug: "francisco-correa-sanchez",
    nombre: "Francisco Correa Sánchez",
    iniciales: "FC",
    cargo_publico_actual: null,
    descripcion_neutra:
      "Empresario español identificado por las resoluciones judiciales como cabeza visible de la trama de adjudicaciones públicas conocida mediáticamente como Gürtel.",
    figura_publica: true,
    cargos_pasados: [
      { rol: "Administrador único", org: "Grupo Special Events", desde: "1999", hasta: "2007" },
    ],
    roles_actuales: ["Condenado · Caso Gürtel"],
    swim_periodos: [
      { kind: "inv",  label: "Investigado", desde: "2009-02", hasta: "2014-09" },
      { kind: "pro",  label: "Procesado",   desde: "2014-09", hasta: "2018-05" },
      { kind: "cond", label: "Condenado",   desde: "2018-05", hasta: null     },
    ],
    casos: [
      { slug: "gurtel",         nombre: "Caso Gürtel",            rol: "Condenado",  fase: "Sentencia firme", phaseKind: "firme",  ultimo: "STS confirma · 2024-11-18" },
      { slug: "barcenas",       nombre: "Caso Bárcenas (papeles)",rol: "Procesado",  fase: "Sentencia firme", phaseKind: "firme",  ultimo: "TS confirma caja B · 2024-09-30" },
      { slug: "kitchen",        nombre: "Operación Kitchen",      rol: "Investigado",fase: "Juicio oral",     phaseKind: "juicio", ultimo: "Apertura juicio oral · 2026-04-02" },
    ],
    documentos: [
      { titulo: "STS 1234/2024 — Sala Segunda",  n: "N1", productor: "Tribunal Supremo",  fecha: "2024-11-18", hash: "sha256:3f1a…b27d", citado: 7 },
      { titulo: "SAN 20/2018 — primera época",   n: "N1", productor: "Audiencia Nacional", fecha: "2018-05-24", hash: "sha256:91c2…ee04", citado: 5 },
    ],
  },

  organizacion_focus: {
    slug: "audiencia-nacional",
    nombre: "Audiencia Nacional",
    tipo: "Organismo judicial",
    sede: "Madrid",
    fundada: "1977",
    descripcion_neutra:
      "Órgano judicial español con jurisdicción en todo el territorio nacional para causas penales de especial trascendencia, terrorismo, criminalidad organizada y delitos económicos.",
    enlace_oficial: "https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Audiencia-Nacional/",
    casos: [
      { slug: "gurtel",         nombre: "Caso Gürtel",             rol: "Órgano instructor y enjuiciador", fase: "Sentencia firme", phaseKind: "firme",  ultimo: "2024-11-18" },
      { slug: "plus-ultra",     nombre: "Caso Plus Ultra",         rol: "Órgano instructor",               fase: "Instrucción",     phaseKind: "instr",  ultimo: "2026-05-19" },
      { slug: "kitchen",        nombre: "Operación Kitchen",       rol: "Órgano instructor y enjuiciador", fase: "Juicio oral",     phaseKind: "juicio", ultimo: "2026-04-02" },
      { slug: "pujol",          nombre: "Caso Pujol",              rol: "Órgano instructor",               fase: "Juicio oral",     phaseKind: "juicio", ultimo: "2026-02-21" },
      { slug: "barcenas",       nombre: "Caso Bárcenas (papeles)", rol: "Órgano instructor y enjuiciador", fase: "Sentencia firme", phaseKind: "firme",  ultimo: "2024-09-30" },
    ],
    documentos: [
      { titulo: "SAN 20/2018 — Caso Gürtel",              n: "N1", productor: "Audiencia Nacional", fecha: "2018-05-24", hash: "sha256:91c2…ee04", citado: 12 },
      { titulo: "Auto de apertura de juicio oral · Kitchen", n: "N1", productor: "JCI nº6, AN",     fecha: "2026-04-02", hash: "sha256:0142…91aa", citado: 3 },
      { titulo: "Auto de separación de piezas · Gürtel",  n: "N1", productor: "JCI nº6, AN",       fecha: "2014-09-17", hash: "sha256:0142…91aa", citado: 9 },
    ],
  },

  organizaciones_index: [
    { slug: "audiencia-nacional",     nombre: "Audiencia Nacional",            tipo: "Organismo judicial",     sede: "Madrid",     casos: 14 },
    { slug: "tribunal-supremo",       nombre: "Tribunal Supremo",              tipo: "Organismo judicial",     sede: "Madrid",     casos: 9  },
    { slug: "fiscalia-anticorrupcion",nombre: "Fiscalía Anticorrupción",       tipo: "Fiscalía",               sede: "Madrid",     casos: 11 },
    { slug: "udef",                   nombre: "UDEF — Policía Judicial",       tipo: "Policía judicial",       sede: "Madrid",     casos: 18 },
    { slug: "sepi",                   nombre: "SEPI",                          tipo: "Organismo público",      sede: "Madrid",     casos: 1  },
    { slug: "manos-limpias",          nombre: "Manos Limpias",                 tipo: "Asociación / acus. popular", sede: "Madrid", casos: 5 },
    { slug: "pp",                     nombre: "Partido Popular",               tipo: "Partido político",       sede: "Madrid",     casos: 4  },
    { slug: "psoe-a",                 nombre: "PSOE de Andalucía",             tipo: "Partido político",       sede: "Sevilla",    casos: 1  },
    { slug: "plus-ultra",             nombre: "Plus Ultra Líneas Aéreas",      tipo: "Empresa",                sede: "Madrid",     casos: 1  },
  ],

  personas_index: [
    { slug: "francisco-correa-sanchez", nombre: "Francisco Correa Sánchez", cargo: "Empresario", roles: ["Condenado"], casos: 3 },
    { slug: "luis-barcenas",            nombre: "Luis Bárcenas Gutiérrez",  cargo: "Ex tesorero PP", roles: ["Condenado"], casos: 2 },
    { slug: "pablo-crespo",             nombre: "Pablo Crespo Sabarís",     cargo: "Empresario", roles: ["Condenado"], casos: 2 },
    { slug: "jordi-pujol",              nombre: "Jordi Pujol",              cargo: "Ex presidente Generalitat", roles: ["Procesado"], casos: 1 },
    { slug: "manuel-villen",            nombre: "Manuel Villén",            cargo: "Ex consejero (Andalucía)",  roles: ["Condenado"], casos: 1 },
  ],

  biblioteca_global: [
    { titulo: "STS 1234/2024 — Caso Gürtel", caso: "Caso Gürtel", n: "N1", productor: "Tribunal Supremo", fecha: "2024-11-18", citado: 7 },
    { titulo: "Auto de apertura de juicio oral — Operación Kitchen", caso: "Operación Kitchen", n: "N1", productor: "JCI nº6, AN", fecha: "2026-04-02", citado: 3 },
    { titulo: "Informe UDEF — Plus Ultra (2022)", caso: "Caso Plus Ultra", n: "N2", productor: "UDEF", fecha: "2022-05-04", citado: 5 },
    { titulo: "Sentencia TC sobre ERE — voto particular", caso: "ERE de Andalucía", n: "N1", productor: "Tribunal Constitucional", fecha: "2022-07-25", citado: 8 },
    { titulo: "BOE-A-2024-19876 — publicación STS Gürtel", caso: "Caso Gürtel", n: "N3", productor: "BOE", fecha: "2024-11-25", citado: 2 },
    { titulo: "Nota de prensa SEPI sobre Plus Ultra", caso: "Caso Plus Ultra", n: "N4", productor: "SEPI", fecha: "2021-03-18", citado: 1 },
  ],
};
