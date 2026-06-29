# Aclaraciones editoriales

> Archivos clave: `src/components/Aclaracion.astro`

## Qué hace

Un único componente `<Aclaracion>` para las notas, intros, avisos y disclaimers editoriales que aparecen a lo largo del sitio. Tres niveles (`alta` / `media` / `baja`) que determinan estilo visual y posición default (antes o después del contenido al que aplican).

## Para qué sirve

Homogeneizar visualmente y conceptualmente las aclaraciones editoriales: que el lector identifique con un solo golpe de vista si lo que está leyendo es una advertencia normativa irrenunciable (presunción de inocencia, "lo que viene es preliminar"), una aclaración metodológica de alcance ("qué es y qué no es esta sección"), o una nota auxiliar de cierre (créditos, recordatorio operativo, fuente de verdad). Antes había diez clases CSS distintas haciendo esto a mano en cada página, con border-left de grosor variable, fondos discordantes y nombres opuestos al uso (`clasif-intro` aparecía al final de un bloque, `org-afectadas__note` era en realidad una intro).

## Cómo funciona

```astro
import Aclaracion from '@/components/Aclaracion.astro';

<Aclaracion nivel="alta">
  Las personas en esta sección tienen un rol procesal activo de imputación.
  Conforme al principio de presunción de inocencia, su condición no implica
  valoración de culpabilidad mientras no recaiga resolución firme.
</Aclaracion>

<Aclaracion nivel="media" posicion="bottom" titulo="Alcance y límites del rastreo">
  <p>Este bloque resume cómo aparece el caso en una muestra sistemática…</p>
  <p>Se incluyen piezas donde el caso aparece en titular o entradilla…</p>
  <p class="aclaracion__meta">Última revisión: <span class="mono">2026-05-20</span>.</p>
</Aclaracion>

<Aclaracion nivel="baja" class="aclaracion--centered">
  Esta página es un panel agregado del inventario. La fuente de verdad de cada
  cifra es el <a href="https://github.com/davidchicano/presuntamente">repositorio público</a>.
</Aclaracion>

<Aclaracion nivel="baja" class="aclaracion--full">
  Esta nota cierra una sección de datos y ocupa todo el ancho útil del bloque.
</Aclaracion>
```

### Props

| Prop | Tipo | Default | Notas |
|---|---|---|---|
| `nivel` | `'alta' \| 'media' \| 'baja'` | (obligatorio) | Único eje editorialmente significativo. |
| `posicion` | `'top' \| 'bottom'` | derivada: `alta`/`media` → `top`, `baja` → `bottom` | Sólo se pasa explícita cuando hay que romper el default justificadamente (e.g. `media-bottom` para disclaimer metodológico que cierra un bloque). |
| `titulo` | `string` | `undefined` | Renderiza un `<h3>` interno y asocia `aria-labelledby`. Sólo cuando la aclaración necesita encabezado propio (multi-párrafo extenso). |
| `id` | `string` | autogenerado del `titulo` | Override del id del heading interno. Útil cuando hay fragment links externos al heading. |
| `class` | `string` | — | Clase extra (e.g. `aclaracion--centered` para baja al pie de página completa; `aclaracion--full` para baja de sección a ancho completo). |

### Niveles, visualmente

- **`alta`** — mostaza institucional. Border-left 4 px sólido (`--color-accent-secondary`), fondo `--color-accent-secondary-soft`, texto `#6b4d00` (en oscuro: `--color-fg`). Tipografía 13 px regular. Presunción de inocencia, advertencia normativa irrenunciable, "hechos bajo investigación", "lo que viene es preliminar". Va antes del contenido por defecto.
- **`media`** — gris fuerte. Border-left 3 px (`--color-border-strong`), fondo `--color-surface-muted`, texto `--color-fg`. Aclaración metodológica o de alcance ("organizaciones afectadas", "alcance y límites del rastreo", fallbacks funcionales tipo "requiere JavaScript"). Va antes del contenido por defecto; admite `bottom` cuando cierra un bloque.
- **`baja`** — sin caja. Border-top 1 px sutil opcional, texto `--color-fg-subtle`, 12 px, `max-width: 76ch`. Nota auxiliar, créditos, recordatorio operativo, pie de página. Va después del contenido por defecto. Con `class="aclaracion--centered"`, queda centrada y `max-width: 64ch` para cierres de página completa. Con `class="aclaracion--full"`, conserva el tratamiento de nota baja pero ocupa todo el ancho útil de la sección.

### Sub-clases internas opcionales

Cuando una aclaración tiene varios párrafos y el último es una línea de metadatos pequeña (e.g. "última revisión: 2026-05-20"), se le pone `class="aclaracion__meta"` al `<p>`. El componente lo estiliza en `--color-fg-muted` a 12 px desde dentro vía `:global()`. La clase `.mono` también se reconoce dentro del cuerpo para spans con la fecha en monospace.

## Estado actual

Migrados 22 puntos de uso en 13 ficheros (`PgCasoDetalle`, `PgPersonaDetalle`, `PgOrganizacionDetalle`, `PgDelitoDetalle`, `PgInicio`, `PgCifras`, `PgDelitos`, `PgSobre`, `PgAportar`, `PgRectificar`, `PgBuscar`, `ConexionesExplorer`). Borradas las clases legacy: `.aviso`, `.aviso--accent`, `.aviso--mostaza`, `.grupo__intro`, `.contexto-intro`, `.clasif-intro`, `.legal-note`, `.bottom-note`, `.coverage-disclaimer*`, `.org-afectadas__note`, `.org-procesal__note`, `.disclaimer` (scoped en PgCifras).

`pnpm validate` y `pnpm build` verdes tras la migración.

Fuera del scope (no son aclaraciones editoriales y se documentan aparte si toca):

- `CatalogoLeyenda` — bloque colapsable que envuelve contenido en los catálogos. Es un patrón distinto (panel explicativo con `<details>/<summary>`).
- El componente `<noscript>` y los empty/fallback states de búsqueda mantienen el mismo `<Aclaracion nivel="media">` por consistencia visual ("falta algo"), aunque conceptualmente no son aclaraciones editoriales. La alternativa sería un componente `FallbackWarning` propio, pero hoy no merece la pena duplicar.

## Decisiones editoriales y aprendizajes

### Por qué tres niveles y no cuatro o cinco

Probé mentalmente cinco ejes (importancia, urgencia, posición, tono, formato) y todos colapsan en uno: **prioridad editorial**. La posición se deriva (alta y media → top porque preceden contenido que el lector debe contextualizar antes de leer; baja → bottom porque es cierre auxiliar). El estilo deriva (alta mostaza llama, media gris explica, baja sin caja recuerda). El tamaño deriva. No hay que multiplicar nada.

### Por qué el disclaimer global de pie de ficha es `media-bottom`, no `alta-bottom`

El disclaimer general de presunción de inocencia que aparece al final de cada ficha de caso, persona y delito quedaba en tensión con la regla "alta → top". La opción de subirlo arriba se descartó: la presunción de inocencia ya se enuncia con `alta-top` justo donde aplica (sección de personas implicadas, sección de hechos bajo investigación). El bloque al pie funciona como recapitulación, no como advertencia primaria; eso es exactamente lo que `media-bottom` significa. Decisión tomada el 2026-05-27.

### Por qué los fallbacks de JavaScript usan `media`, no una clase aparte

PgBuscar (cuando Pagefind no carga) y ConexionesExplorer (cuando no hay JS) muestran un aviso explicativo. Conceptualmente son empty states funcionales, no aclaraciones editoriales. Pero visualmente son lo mismo: gris muted con border-left gris fuerte. Crearles un componente `FallbackWarning` propio duplicaría CSS para dos sitios. Reutilizar `<Aclaracion nivel="media">` es pragmático y mantiene el lenguaje visual coherente; el día que aparezca un tercer fallback con necesidades distintas (e.g. botón de acción dentro), se extrae componente nuevo.

### El `<noscript>` literal

En `PgBuscar`, una de las dos aclaraciones vive dentro de `<noscript>`. Astro renderiza el componente en build-time (lo que hace `<Aclaracion>` es generar HTML), así que el `<noscript>` queda con HTML literal correcto cuando el navegador no ejecuta JS. Ningún cambio de patrón necesario.

### El fallback con `id` y `hidden`

Como `Aclaracion.astro` no expone el atributo `hidden` HTML nativo (es un `<aside>` con su propio scope), el fallback de Pagefind se envuelve en un `<div id="pagefind-fallback" hidden>` con el `<Aclaracion>` dentro. El JS sigue funcionando con `getElementById('pagefind-fallback')` y `.hidden = false`. Patrón replicable si aparece otro caso similar.

### Naming: por qué `Aclaracion` y no `Aviso` o `NotaEditorial`

- `Aviso` colisionaría con `/aviso-legal` y con el lenguaje BOE-ish que el proyecto usa para la página jurisdiccional de aviso legal.
- `NotaEditorial` pisa la idea de "nota" como columna periodística y no transmite que pueda tener nivel alto.
- `Aclaracion` es explícito, hispano, neutro. Cubre los tres niveles sin connotar.

## Ideas futuras

### Sin compromiso

- Que `aclaracion__meta` se pase como prop (`meta?: string`) en lugar de markup interno, para uniformar y eliminar la sub-clase. Hoy se mantiene con sub-clase porque el meta puede llevar `<span class="mono">` y un texto compuesto, y forzarlo a string plano perdería expresividad.
- Variante `aclaracion--inline` (sin caja, sin margen, sólo color/peso) para aclaraciones muy cortas que vayan a la derecha de un dato. No hay caso de uso hoy.
- Carpeta `docs/web/components/` para fichas de componentes puros (Hecho, Hito, PersonaCard, este mismo Aclaracion). Cuando se cree, mover esta ficha allí y dejar redirect en features/. Decisión pendiente de cuándo merezca la pena (probablemente cuando existan ≥3 componentes con doc propio que NO sean features transversales).

## Pendientes operativos

- [ ] Validar visualmente en cierre de sesión (verificación con preview) que los tres niveles se diferencian bien en oscuro: el texto `#6b4d00` de `alta` puede quedar bajo de contraste; ya hay override que lo lleva a `--color-fg` en `html.theme-dark`, pero conviene confirmarlo de un vistazo cuando toque la próxima sesión interactiva.
- [ ] Si aparece un tercer fallback funcional con necesidades distintas (e.g. botón de acción dentro), extraer `FallbackWarning` aparte y dejar `Aclaracion` sólo para uso editorial.
