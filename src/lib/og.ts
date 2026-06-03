/**
 * OG images (social cards) generadas en build estático.
 *
 * Render pipeline: satori (HTML/CSS → SVG con texto vectorizado, fuentes
 * embebidas) → @resvg/resvg-js (SVG → PNG raster). Sin browser, sin runtime
 * de Node necesario en producción: los PNGs se generan al hacer `pnpm build`
 * y se publican como ficheros estáticos bajo `/dist/og/`.
 *
 * Tamaño canónico 1200×630, el estándar Open Graph que X, WhatsApp,
 * Telegram, LinkedIn, Slack, Discord, etc. consumen como "summary_large_image".
 *
 * Identidad visual sincronizada con DESIGN.md (secciones 1–4, de "Visual Theme & Atmosphere"
 * a "Component Stylings"): banda navy con doble trim navy+mostaza, bloque blanco con borde
 * fino, escudo + wordmark "presuntamente.org" + tag identificador de tipo (CASO / PERSONA /
 * ORGANIZACIÓN / INVENTARIO). Texto y cifras en Lato (sustituto humanista libre de Gill Sans,
 * primer fallback declarado en el stack `font-sans` del sitio).
 *
 * Composición común a las 4 variantes: ver `ogChrome()`. Plantillas
 * específicas por tipo: `renderOgDefault`, `renderOgCaso`, `renderOgPersona`,
 * `renderOgOrganizacion`.
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// --- Constantes y tokens -----------------------------------------------------

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Tokens cromáticos sincronizados con src/styles/global.css. Si cambian
// los slots semánticos del sistema, replicar aquí.
const T = {
  bg: '#fafafa',
  surface: '#ffffff',
  surfaceMuted: '#f0f0f0',
  fg: '#15171a',
  fgMuted: '#5b6066',
  fgSubtle: '#8a8d93',
  border: '#dcdcd6',
  accent: '#1f3a68',
  accentSoft: '#e3e8f1',
  accentSecondary: '#c89b00',
  accentSecondarySoft: '#f7ecc5',
} as const;

// Tonos del badge de fase (mantienen la lectura de progresión navy→cargado del sistema F4
// de DESIGN.md — "Sistema de badges", simplificada a un único color de fondo en lugar de los
// 4 quesitos — el espacio de la card no da para microbarra legible).
const PHASE_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  denuncia_o_querella: { bg: '#ecf0f6', fg: T.accent, label: 'Denuncia / querella' },
  instruccion:                 { bg: '#ecf0f6', fg: T.accent, label: 'Instrucción' },
  fase_intermedia:             { bg: '#c4d0e3', fg: T.accent, label: 'Fase intermedia' },
  juicio_oral:                 { bg: '#a8b9d2', fg: T.accent, label: 'Juicio oral' },
  sentencia_primera_instancia: { bg: '#5d7090', fg: '#ffffff', label: 'Sentencia 1ª inst.' },
  recurso:                     { bg: '#5d7090', fg: '#ffffff', label: 'Recurso' },
  sentencia_firme:             { bg: '#5d7090', fg: '#ffffff', label: 'Sentencia firme' },
  ejecucion:                   { bg: '#5d7090', fg: '#ffffff', label: 'Ejecución' },
  archivo_provisional:         { bg: T.surfaceMuted, fg: T.fgMuted, label: 'Archivo provisional' },
  archivo_libre:               { bg: T.surfaceMuted, fg: T.fgMuted, label: 'Archivo libre' },
};

// --- Carga perezosa de fuentes y logo ---------------------------------------
//
// Las rutas se resuelven con `process.cwd()` (raíz del proyecto desde la que
// se ejecuta `pnpm build`), NO con `__dirname` del módulo, porque Astro
// bundlea `src/lib/og.ts` a `dist/chunks/og_<hash>.mjs` durante el build y
// `import.meta.url` apuntaría ahí, no a `src/lib/`. Los TTFs viven en
// `src/lib/og-fonts/` y solo se consumen en build (no se sirven al navegador).

type Font = { name: string; data: Buffer; weight: 400 | 700 | 900; style: 'normal' };
let __fonts: Font[] | null = null;
function loadFonts(): Font[] {
  if (__fonts) return __fonts;
  const dir = path.join(process.cwd(), 'src', 'lib', 'og-fonts');
  __fonts = [
    { name: 'Lato', data: readFileSync(path.join(dir, 'Lato-Regular.ttf')), weight: 400, style: 'normal' },
    { name: 'Lato', data: readFileSync(path.join(dir, 'Lato-Bold.ttf')),    weight: 700, style: 'normal' },
    { name: 'Lato', data: readFileSync(path.join(dir, 'Lato-Black.ttf')),   weight: 900, style: 'normal' },
  ];
  return __fonts;
}

let __logoDataUrl: string | null = null;
function logoDataUrl(): string {
  if (__logoDataUrl) return __logoDataUrl;
  const p = path.join(process.cwd(), 'public', 'branding', 'logo.png');
  const buf = readFileSync(p);
  __logoDataUrl = `data:image/png;base64,${buf.toString('base64')}`;
  return __logoDataUrl;
}

// --- Builder mínimo de VNodes (sin React/JSX) -------------------------------
//
// Satori acepta un árbol `{ type, props: { style, children } }`. Para
// no depender de React ni de un parser HTML, componemos los nodos a mano
// con dos helpers. `children` puede ser string, otro nodo, o un array.

type Style = Record<string, string | number>;
type Node = string | { type: string; props: { style?: Style; children?: any; [k: string]: any } };

function el(type: string, props: { style?: Style; [k: string]: any } = {}, children?: any): Node {
  return { type, props: { ...props, children } };
}

// --- Helpers de texto --------------------------------------------------------

function truncate(s: string, max: number): string {
  if (!s) return '';
  const clean = s.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + '…';
}

// Formatea una fecha YYYY-MM-DD a "DD mes YYYY" en castellano (sin tocar
// fechas que no cumplan el formato — devuelve la cadena original).
const MESES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
export function formatFechaEs(fecha: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha ?? '');
  if (!m) return fecha ?? '';
  const yyyy = m[1];
  const mm = parseInt(m[2], 10);
  const dd = parseInt(m[3], 10);
  if (mm < 1 || mm > 12) return fecha;
  return `${dd} ${MESES_ES[mm - 1]} ${yyyy}`;
}

// --- Pipeline de renderizado -------------------------------------------------

async function renderNodeToPng(node: Node): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await satori(node as any, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: loadFonts(),
  });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } });
  // Devolvemos Uint8Array<ArrayBuffer> (tipo web-estándar que `Response`/`BodyInit`
  // acepta), no el Buffer de Node: a partir de Astro 6 los tipos (TS 5.7+) rechazan
  // `Buffer<ArrayBufferLike>` como body, y `Uint8Array` a secas resuelve a
  // `<ArrayBufferLike>`. `Uint8Array.from` fija `<ArrayBuffer>` y copia los bytes.
  return Uint8Array.from(resvg.render().asPng());
}

// --- Layout común (chrome ministerial) --------------------------------------
//
// Banda navy 54px + filete mostaza 3px + bloque blanco con header (escudo +
// wordmark + tag) + body específico + footer opcional (cifras o slug).

function chrome(opts: {
  tag: string;           // "CASO" / "PERSONA" / "ORGANIZACIÓN" / "INVENTARIO"
  body: Node | Node[];   // contenido específico del tipo
  footer?: Node | string; // línea final (cifras agregadas o slug URL)
}): Node {
  const body = Array.isArray(opts.body) ? opts.body : [opts.body];

  return el('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: `${OG_WIDTH}px`,
      height: `${OG_HEIGHT}px`,
      background: T.bg,
      fontFamily: 'Lato',
      color: T.fg,
    },
  }, [
    // Banda navy + filete mostaza (doble trim ministerial).
    el('div', { style: { display: 'flex', height: '54px', background: T.accent } }),
    el('div', { style: { display: 'flex', height: '3px',  background: T.accentSecondary } }),

    // Bloque blanco principal.
    el('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: T.surface,
        padding: '40px 56px',
        borderBottom: `1px solid ${T.border}`,
      },
    }, [
      // Header del bloque (escudo + wordmark + tag).
      el('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          paddingBottom: '20px',
          marginBottom: '32px',
          borderBottom: `1px solid ${T.border}`,
        },
      }, [
        el('img', {
          src: logoDataUrl(),
          width: 64,
          height: 64,
          style: { display: 'block', width: '64px', height: '64px' },
        }),
        el('div', { style: { display: 'flex', flexDirection: 'column' } }, [
          el('div', {
            style: {
              fontSize: '30px',
              fontWeight: 700,
              color: T.accent,
              letterSpacing: '-0.01em',
              lineHeight: 1,
            },
          }, 'presuntamente.org'),
          el('div', {
            style: {
              fontSize: '13px',
              color: T.fgMuted,
              marginTop: '6px',
              lineHeight: 1.2,
            },
          }, 'Inventario público de casos de corrupción en España'),
        ]),
        // Tag a la derecha (push con margin-left:auto).
        el('div', {
          style: {
            display: 'flex',
            marginLeft: 'auto',
            padding: '8px 14px',
            background: T.surfaceMuted,
            border: `1px solid ${T.border}`,
            fontSize: '13px',
            letterSpacing: '0.12em',
            fontWeight: 700,
            color: T.accent,
          },
        }, opts.tag),
      ]),

      // Body específico del tipo.
      ...body,

      // Spacer flex para empujar el footer al fondo.
      el('div', { style: { display: 'flex', flex: 1 } }),

      // Footer (opcional).
      opts.footer
        ? el('div', {
            style: {
              display: 'flex',
              borderTop: `1px solid ${T.border}`,
              paddingTop: '16px',
              fontSize: '18px',
              color: T.fgMuted,
              lineHeight: 1.3,
            },
          }, opts.footer)
        : el('div', {}),
    ]),
  ]);
}

// --- Helpers visuales reusables ---------------------------------------------

function tagPill(opts: { label: string; bg: string; fg: string }): Node {
  return el('div', {
    style: {
      display: 'flex',
      alignSelf: 'flex-start',
      padding: '8px 16px',
      background: opts.bg,
      color: opts.fg,
      border: `1px solid ${T.border}`,
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '0.04em',
    },
  }, opts.label);
}

// --- Plantillas por tipo -----------------------------------------------------

export type StatItem = { label: string; value: string | number };

/** OG default — usada por inicio, /casos, /personas, /organizaciones,
 *  /biblioteca, /delitos, /cifras, /sobre, /aviso-legal, /buscar y
 *  /rectificar. Cifras agregadas del inventario.
 */
export async function renderOgDefault(opts: {
  title: string;       // p.ej. "Inventario público de casos de corrupción en España"
  subtitle?: string;   // p.ej. la descripción de la página
  stats: StatItem[];   // cifras agregadas
}): Promise<Uint8Array<ArrayBuffer>> {
  return renderNodeToPng(chrome({
    tag: 'INVENTARIO',
    body: [
      el('div', {
        style: {
          display: 'flex',
          fontSize: '56px',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
          color: T.fg,
          marginBottom: '20px',
        },
      }, truncate(opts.title, 90)),
      opts.subtitle
        ? el('div', {
            style: {
              display: 'flex',
              fontSize: '22px',
              lineHeight: 1.35,
              color: T.fgMuted,
              maxWidth: '900px',
            },
          }, truncate(opts.subtitle, 180))
        : el('div', {}),
    ],
    footer: statsLine(opts.stats),
  }));
}

/** OG ficha de caso. */
export async function renderOgCaso(opts: {
  nombreMediatico: string;
  nombreOficial?: string;
  fase: string;
  ultimoHito?: { fecha: string; titulo: string } | null;
  stats: StatItem[];
}): Promise<Uint8Array<ArrayBuffer>> {
  const phase = PHASE_STYLE[opts.fase] ?? { bg: T.surfaceMuted, fg: T.fg, label: opts.fase };

  return renderNodeToPng(chrome({
    tag: 'CASO',
    body: [
      el('div', {
        style: {
          display: 'flex',
          fontSize: '60px',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: T.fg,
          marginBottom: '14px',
        },
      }, truncate(opts.nombreMediatico, 60)),
      opts.nombreOficial
        ? el('div', {
            style: {
              display: 'flex',
              fontSize: '20px',
              lineHeight: 1.3,
              color: T.fgMuted,
              marginBottom: '24px',
              maxWidth: '900px',
            },
          }, truncate(opts.nombreOficial, 140))
        : el('div', { style: { display: 'flex', height: '8px' } }),
      tagPill({ label: phase.label, bg: phase.bg, fg: phase.fg }),
      opts.ultimoHito
        ? el('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              marginTop: '28px',
              padding: '16px 20px',
              background: T.surfaceMuted,
              borderLeft: `4px solid ${T.accent}`,
            },
          }, [
            el('div', {
              style: {
                display: 'flex',
                fontSize: '13px',
                letterSpacing: '0.1em',
                fontWeight: 700,
                color: T.fgSubtle,
                textTransform: 'uppercase',
                marginBottom: '6px',
              },
            }, `Último hito · ${formatFechaEs(opts.ultimoHito.fecha)}`),
            el('div', {
              style: {
                display: 'flex',
                fontSize: '22px',
                lineHeight: 1.3,
                color: T.fg,
              },
            }, truncate(opts.ultimoHito.titulo, 110)),
          ])
        : el('div', {}),
    ],
    footer: statsLine(opts.stats),
  }));
}

/** OG ficha de persona. */
export async function renderOgPersona(opts: {
  nombreCompleto: string;
  subtitulo?: string;       // cargo público actual o "Figura privada / pública"
  rolActualLabel?: string;  // p.ej. "Procesada" o "Desimputado"
  rolActualColor?: { bg: string; fg: string }; // tonos del rol activo
  stats: StatItem[];
}): Promise<Uint8Array<ArrayBuffer>> {
  return renderNodeToPng(chrome({
    tag: 'PERSONA',
    body: [
      el('div', {
        style: {
          display: 'flex',
          fontSize: '60px',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: T.fg,
          marginBottom: '16px',
        },
      }, truncate(opts.nombreCompleto, 50)),
      opts.subtitulo
        ? el('div', {
            style: {
              display: 'flex',
              fontSize: '22px',
              lineHeight: 1.3,
              color: T.fgMuted,
              marginBottom: '28px',
              maxWidth: '900px',
            },
          }, truncate(opts.subtitulo, 140))
        : el('div', { style: { display: 'flex', height: '8px' } }),
      opts.rolActualLabel
        ? tagPill({
            label: opts.rolActualLabel,
            bg: opts.rolActualColor?.bg ?? T.accentSoft,
            fg: opts.rolActualColor?.fg ?? T.accent,
          })
        : el('div', {}),
    ],
    footer: statsLine(opts.stats),
  }));
}

/** OG ficha de organización. */
export async function renderOgOrganizacion(opts: {
  nombre: string;
  tipoLabel?: string;        // p.ej. "Órgano judicial", "Empresa", "Partido político"
  descripcionCorta?: string; // opcional, 1-2 líneas
  stats: StatItem[];
}): Promise<Uint8Array<ArrayBuffer>> {
  return renderNodeToPng(chrome({
    tag: 'ORGANIZACIÓN',
    body: [
      el('div', {
        style: {
          display: 'flex',
          fontSize: '56px',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: T.fg,
          marginBottom: '16px',
        },
      }, truncate(opts.nombre, 60)),
      opts.tipoLabel
        ? tagPill({ label: opts.tipoLabel, bg: T.surfaceMuted, fg: T.fg })
        : el('div', {}),
      opts.descripcionCorta
        ? el('div', {
            style: {
              display: 'flex',
              fontSize: '20px',
              lineHeight: 1.35,
              color: T.fgMuted,
              marginTop: '28px',
              maxWidth: '950px',
            },
          }, truncate(opts.descripcionCorta, 220))
        : el('div', {}),
    ],
    footer: statsLine(opts.stats),
  }));
}

// --- Línea de stats reutilizable (footer) -----------------------------------

function statsLine(stats: StatItem[]): Node {
  if (!stats || stats.length === 0) return el('div', {}, '');
  const items: Node[] = [];
  stats.forEach((s, i) => {
    if (i > 0) {
      items.push(el('div', {
        style: { display: 'flex', margin: '0 14px', color: T.border },
      }, '·'));
    }
    items.push(el('div', { style: { display: 'flex' } }, [
      el('span', { style: { fontWeight: 700, color: T.fg, marginRight: '6px' } }, String(s.value)),
      el('span', { style: { color: T.fgMuted } }, s.label),
    ]));
  });
  return el('div', { style: { display: 'flex', alignItems: 'center' } }, items);
}

// --- Estilos de rol procesal para OG de Persona -----------------------------
//
// Tonos derivados de los slots --color-rol-* de src/styles/global.css
// (DESIGN.md — "Sistema de badges", familia F-estado). Mapeo simplificado:
// cuando el rol no está en la tabla, se devuelve `undefined` y la card cae al estilo neutro accentSoft.

const ROL_OG_STYLE: Record<string, { bg: string; fg: string }> = {
  investigado:        { bg: '#ffffff', fg: T.accent },
  procesado:          { bg: '#ffffff', fg: '#8a6b1f' },
  acusado:            { bg: '#f7ecc5', fg: '#8a6b1f' },
  condenado_no_firme: { bg: '#ffffff', fg: '#c44545' },
  condenado_firme:    { bg: '#c92e2e', fg: '#ffffff' },
  absuelto:           { bg: '#eef4ef', fg: '#2f6a3a' },
  desimputado:        { bg: '#ecedf1', fg: '#5b6878' },
  testigo:            { bg: '#f0f0f0', fg: T.fgMuted },
};
export function rolOgStyle(rol: string | undefined): { bg: string; fg: string } | undefined {
  if (!rol) return undefined;
  return ROL_OG_STYLE[rol];
}
