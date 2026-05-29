# Página /delitos

> Componente: `src/components/pages/PgDelitos.astro` · Wrapper: `src/pages/delitos/index.astro`

## Estado actual

Listado tabular con leyenda colapsable común (`CatalogoLeyenda`) antes de la sección 4.1, filtros (búsqueda, familia) + ordenación dinámica (alfabético, **nº de casos ↓**, **nº de atribuciones ↓**) + cinco columnas:

1. **Tipo penal** — nombre típico del delito según doctrina y CP.
2. **Familia** — `CategoryBadge kind="delito"` con icono Lucide por familia (contra la Administración Pública, contra el patrimonio, falsedad documental, etc.).
3. **Artículos CP** — articulado aplicable en mono, separado por «·».
4. **Casos** — número de procedimientos del inventario donde el delito aparece (combina `Caso.delitos_atribuidos_en_la_causa` y `RolEnCaso.delitos_atribuidos`).
5. **Atribuciones** — número de roles (persona u organización) que se lo atribuyen formalmente.

Al pie del listado, **aviso editorial fijo** (`legal-note`) recordando que «atribución ≠ condena». No se funde con la leyenda superior porque cumple función distinta: la leyenda explica columnas y filtros; el aviso refuerza presunción de inocencia.

**Cifras económicas (2026-05-29):** la ficha de detalle del delito ([`PgDelitoDetalle`](../../../src/components/pages/PgDelitoDetalle.astro)) gana una sección **«Cifras económicas de los casos»** con el total `objeto` y `consecuencia` de **cada caso** donde se atribuye el delito — contexto **a nivel de caso, nunca por persona ni sumado en una sola cifra**. Modelo en [`importe-presunto.md`](../features/importe-presunto.md).

## Ideas futuras

### v1.x

- Filtro adicional por **nivel de afectación** (sólo casos con `acreditado` vs. cualquier nivel) cuando esté maduro.
- Tooltip por familia con ejemplos rápidos de delitos contenidos.
- Recordar selección de filtros/orden en la URL.

### Sin compromiso

- Vista alternativa de tarjeta para móvil.

## Aprendizajes y decisiones editoriales

- **Aviso «atribución ≠ condena» se queda post-tabla.** Decisión 2026-05-27: la nota editorial mantiene su `legal-note` propio al final del listado, no se mete dentro del bloque colapsado de la leyenda. La leyenda superior incluye un párrafo equivalente para que el aviso aparezca también arriba al abrirla, pero el `legal-note` post-tabla sigue cumpliendo función de cierre y no depende del estado abierto/cerrado de la leyenda.
- **Ordenación dual: casos y atribuciones.** Decisión 2026-05-27: dos métricas distintas con desempate alfabético. «Casos» mide en cuántos procedimientos aparece el delito; «atribuciones» mide cuántas veces se ha atribuido a un sujeto. Un delito puede aparecer en pocos casos con muchas atribuciones (mismo caso, muchos imputados) o al revés.

## Pendientes operativos

- [x] **Leyenda colapsable común** (`CatalogoLeyenda`) + **ordenación dinámica** (alfabético / casos ↓ / atribuciones ↓) preservando el `legal-note` post-tabla. **Entregado 2026-05-27.** Detalle en [`../features/catalogos-comunes.md`](../features/catalogos-comunes.md).
- [x] **Pulido de iteración 2026-05-27**: botón "Limpiar filtros" en el header de §4.1 (slot por defecto de `SectionH`, atributo `form="filters-delitos"`), sección final "Más detalle metodológico" en la leyenda enlazando a [`/sobre#tipos-hecho`](../../../src/components/pages/PgSobre.astro), [`/sobre#principios`](../../../src/components/pages/PgSobre.astro) y [`/sobre#lenguaje`](../../../src/components/pages/PgSobre.astro), y fix del bug pre-existente del `<script is:inline>` per-instancia en `CustomSelect` (el select "ordenar" no había tenido listeners). Detalle en [`../features/catalogos-comunes.md § Decisiones editoriales y aprendizajes`](../features/catalogos-comunes.md#decisiones-editoriales-y-aprendizajes).
