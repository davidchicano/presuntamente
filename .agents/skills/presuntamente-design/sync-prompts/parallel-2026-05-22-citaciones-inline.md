# Prompt para sesión paralela de Claude Code — Citaciones inline (RichProse v1)

Pega esto en una sesión NUEVA de Claude Code sobre el mismo repo `presuntamente`. No colisiona con la sesión actual del rediseño de badges: toca ficheros disjuntos (`src/lib/richProse.ts`, `src/components/Money.astro`, `src/components/Acronym.astro`, posibles ampliaciones del diccionario). Si hay merge conflict mínimo será solo en `ROADMAP.md`, fácil de resolver.

---

Hola. Toma el ROADMAP.md y léelo entero antes de hacer nada (es obligatorio en este repo). El backlog tiene una sección "Sistema de citaciones inline — pendientes para v1 / v2" que es lo que vas a abordar tú. La v0 ya está en producción: enlaza acrónimos institucionales (UDEF, AN, JCI…) a `/organizaciones/<slug>` y formatea money. Falta llevarla a v1.

## Tu objetivo

Llevar `src/lib/richProse.ts` y los micro-componentes de citación a v1, haciendo que las fichas se "sientan conectadas" sin que el editor de YAML tenga que marcar manualmente cada referencia. **Objetivo de calidad alto**: cero falsos positivos en cabeceras / títulos / nombres oficiales del propio caso.

Cinco entregables, en este orden:

1. **Acortar money largo**. Hoy `richProse.ts` formatea cifras pero no las acorta. Si el YAML dice "53 millones de euros" o "5.000.000 €" o "53,5 millones", el chip debe renderizar la forma corta canónica (`53 M€`, `5 M€`, `53,5 M€`). El `data-attribute` con la forma original se mantiene para tooltip. Detectar: "X millones de euros", "X mill. de euros", "X €" en formato europeo. Mantener compatibilidad con la forma corta ya cubierta.

2. **Diccionario extensible de organizaciones por nombre completo**. Hoy solo detecta siglas cortas. Extender para que también linke por `nombre` + `nombres_alternativos` (campos de la collection `organizaciones`). Ejemplos: "Plus Ultra Líneas Aéreas", "Audiencia Nacional", "Sociedad Estatal de Participaciones Industriales", "Universidad Complutense de Madrid" → link a su slug. Cuidado con falsos positivos: no enlazar dentro de headers de la propia ficha, ni dentro del `nombre_oficial` del caso, ni en breadcrumbs. Word boundary obligatorio. Regex case-sensitive (no enlazar "audiencia nacional" en minúsculas si solo aparece como "Audiencia Nacional" en el YAML de la organización).

3. **Diccionario de personas**. Cuando "José Luis Rodríguez Zapatero", "Julio Martínez Sola", "Joaquín Goyache" aparezcan en prosa de un Hecho/Hito que NO sea su propia ficha, linkar a `/personas/<slug>`. Mismo patrón que organizaciones: lookup por `nombre_completo` + `nombres_alternativos`. Mismas restricciones contra falsos positivos.

4. **Diccionario de delitos** (preparado pero opcional si no hay tiempo). "tráfico de influencias", "blanqueo de capitales", "malversación" → link a `/delitos/<slug>` cuando exista la página. Hoy `/delitos/` no se renderiza como ruta web (los delitos son metadata). Si no hay rutas, dejar el regex de detección listo pero deshabilitado por flag para activar cuando la página `/delitos/[slug].astro` exista (probablemente Fase 2).

5. **Marcado explícito opcional** (escape hatch). Cuando la auto-detección falle o queramos forzar comportamiento, permitir sintaxis en el YAML `[[org:plus-ultra-lineas-aereas|Plus Ultra]]` o `[[€:53,5 M€]]` o `[[persona:joaquin-goyache|Goyache]]`. Solo se aplica si el autor del YAML lo escribe; la auto-detección sigue siendo el camino normal. Documentar el escape hatch en la skill `investigar-caso` (SKILL.md) cuando termines.

## Restricciones duras

- **NUNCA link a Wikipedia**. La regla está en DESIGN.md §4 "Micro-componentes". Falsos positivos potenciales de personas hacia Wikipedia están EXPLÍCITAMENTE prohibidos.
- **Workflow main directo**: commits directos a `main`, sin ramas ni PRs. NO push — el push lo decide el maintainer. Norma de [AGENTS.md](AGENTS.md) §"Workflow de rama y PRs".
- **No tocar nada del sistema de badges**. Hay una sesión paralela trabajando en `src/styles/global.css`, `src/components/RolBadge.astro`, `src/components/EpistemicBadge.astro`, `src/components/PhaseBadge.astro`, `src/components/Hito.astro` y `DESIGN.md`. Si tu trabajo necesita tocar alguno de esos ficheros, **párate y pregunta al maintainer**.
- **Verificación obligatoria antes de commit**: `pnpm validate` + `pnpm exec astro check` + `pnpm build` verdes. Y verificar visualmente en `pnpm dev` que los enunciados de hecho del caso Begoña Gómez y Plus Ultra renderizan las nuevas citas sin romper la prosa.
- **Test contra falsos positivos**: probar que el nombre del propio caso en su ficha no se autoenlaza (Begoña Gómez en `/casos/begona-gomez` no debe linkar a `/personas/begona-gomez`); que los nombres en breadcrumbs no se autoenlazan; que las cabeceras de tabla no se autoenlazan.

## Cuando termines

1. Actualiza `ROADMAP.md`: marca los items completados en "Sistema de citaciones inline — pendientes para v1 / v2", añade lecciones aprendidas en "Aprendizajes y notas".
2. Commit en `main` con mensaje descriptivo. NO push.
3. Resumen al maintainer con: qué se cubrió, qué falsos positivos detectaste y cómo los resolviste, qué queda para v2.
