# Cloudflare Pages deploy

> Archivos clave: `public/_headers` · `astro.config.mjs` · `.nvmrc` · `package.json`

## Qué hace

Convierte cada `git push` a `main` (más cualquier commit en ramas) en un build automático servido por la CDN de Cloudflare. Es el mecanismo de publicación del sitio mientras vivimos sin DNS apex propio (fase preview `*.pages.dev`) y será el mismo mecanismo cuando se active el dominio `presuntamente.org`.

## Para qué sirve

- **Validación pre-launch**: el maintainer y revisores externos pueden ver el sitio bajo URL pública estable sin tener que correr `pnpm preview` localmente.
- **Auto-deploy en `push main`**: integración GitHub ↔ Cloudflare. No hay GitHub Actions propio; Cloudflare se encarga del clon, build y rollout.
- **Previews por commit**: Cloudflare genera URL única por cada commit (`<hash>.presuntamente.pages.dev`) útil para compartir diff visual o para abrir una pieza concreta a revisión.
- **Métrica RGPD-friendly**: vía el toggle "Web Analytics" del panel de Pages — sin token en el repo. Decisión 2026-05-26 (preferida sobre `CF_ANALYTICS_TOKEN` en env del CI).

## Cómo funciona

### Configuración de Pages (panel)

Una vez por proyecto, desde [Cloudflare → Workers & Pages → Create application → Pages → Connect to Git](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages):

| Campo | Valor | Por qué |
|---|---|---|
| Repository | `davidchicano/presuntamente` | Cloudflare instala su GitHub App; autoriza sólo este repo. |
| Production branch | `main` | El workflow del proyecto es push directo a `main` (ver [AGENTS.md — "Workflow de rama y PRs"](../../../AGENTS.md)). |
| Framework preset | `Astro` | Detecta también pnpm desde `packageManager`. |
| Build command | `pnpm build` | Equivalente a `astro build && pagefind --site dist`. Indexa Pagefind: sin este paso, `/buscar` se rompe en producción. |
| Build output directory | `dist` | Default de Astro. |
| Root directory | _(vacío)_ | Repo monorraíz. |

Variables de entorno **no necesarias** para el build estándar. Si en el futuro se quiere inyectar `CF_ANALYTICS_TOKEN` desde build (alternativa al toggle del panel), se añade en _Settings → Environment variables_ para "Production" y, opcionalmente, para "Preview".

Versión de Node: Pages la coge de [`.nvmrc`](../../../.nvmrc) (hoy `24`). Si Pages no la detecta por algún motivo, fijar `NODE_VERSION=24` como variable de entorno.

### Cabeceras (`public/_headers`)

Astro copia [`public/_headers`](../../../public/_headers) a `dist/_headers` durante el build. Cloudflare Pages lo lee y aplica las cabeceras a las respuestas. Sintaxis: [`developers.cloudflare.com/pages/configuration/headers`](https://developers.cloudflare.com/pages/configuration/headers/).

Hoy contiene una sola regla:

```
/*
  X-Robots-Tag: noindex, nofollow
```

Aplicada **sólo durante la fase preview** (mientras no haya DNS apex). Cuando se active `presuntamente.org`, la regla se retira en un commit dedicado: el `robots.txt` ya está abierto y queremos indexación máxima desde el primer día público. Documentado también en la cabecera del propio fichero.

### Analytics

Vía toggle del panel de Pages → _Settings → Web Analytics → Add Web Analytics_. Cloudflare inyecta `https://static.cloudflareinsights.com/beacon.min.js` directamente en cada respuesta HTML que sirve, sin que el repo tenga que conocer el token.

La rama alternativa sigue cableada en código por si conviene cambiar de modelo: [BaseLayout.astro:154](../../../src/layouts/BaseLayout.astro) emite el beacon condicional a `import.meta.env.CF_ANALYTICS_TOKEN`. Si se activa el toggle del panel **y** además existe la env var, se emitiría el script dos veces; mantener una sola vía a la vez.

Cloudflare Web Analytics cumple RGPD sin banner de consentimiento (sin cookies, sin fingerprinting). Más detalle en [higiene-tecnica.md](higiene-tecnica.md).

### Relación con `validate.yml` (GitHub Actions)

[`.github/workflows/validate.yml`](../../../.github/workflows/validate.yml) sigue ejecutándose en cada push/PR: corre `pnpm validate` (schemas + V-rules) y `pnpm build`. Es la red de seguridad editorial; el deploy de Pages es independiente y se ejecuta sólo con `pnpm build`. Un push que rompa schemas:

- **GitHub Actions** falla en `pnpm validate` → marca el commit en rojo.
- **Cloudflare Pages** no corre `pnpm validate`; si `pnpm build` también falla (porque el schema roto rompe la generación), el deploy queda en error y la versión previa sigue servida.

Si en algún momento se considera bloquear el deploy de Pages cuando GitHub Actions falla, se puede pasar a usar un workflow propio que invoque la API de Pages tras `validate` verde. No es necesario hoy.

## Estado actual

**Conectado y operativo desde 2026-05-26.**

- Proyecto Pages: `presuntamente`. Production branch `main`. Build command `pnpm build`. Output `dist`.
- URL preview: [`https://presuntamente.pages.dev`](https://presuntamente.pages.dev). Respondiendo HTTP 200 desde el PoP de Madrid (≈100 ms al primer byte). Cabecera `x-robots-tag: noindex, nofollow` activa, vía [`public/_headers`](../../../public/_headers).
- Web Analytics activado a nivel de proyecto Pages (toggle del panel, sin token en repo). Empieza a contar tráfico a partir del siguiente deploy posterior a la activación; Cloudflare lo avisa con banner.
- Auto-deploy en `git push origin main` operativo: cada commit dispara build + rollout sin intervención.
- Node 24.13.1 detectado automáticamente desde [`.nvmrc`](../../../.nvmrc); pnpm 11.1.3 desde `packageManager`. No fue necesario fijar `NODE_VERSION` ni nada equivalente.
- Functions Metrics del panel a cero, esperable: el sitio es estático puro, no hay Pages Functions.

## Decisiones editoriales y aprendizajes

- **Sin GitHub Action propio para deploy.** La integración nativa de Pages basta. Añadir un workflow `deploy.yml` propio sería duplicar trabajo y mover el secreto `CLOUDFLARE_API_TOKEN` al repo. Si en el futuro hace falta orquestar (deploy condicionado a `validate` verde, deploy de previews sólo para PRs etiquetados), entonces sí.
- **`X-Robots-Tag: noindex` sólo durante fase preview.** El `robots.txt` actual indexa todo porque la intención editorial es máxima difusión bajo dominio propio. El header HTTP `noindex` gana sobre `robots.txt` y se retira en un commit cuando se active DNS apex. Patrón intencionalmente reversible.
- **Build command incluye Pagefind.** `pnpm build:no-index` existe para depuración local pero no debe usarse en Pages: rompería `/buscar`.
- **Analytics: toggle del panel sobre env var.** Mantiene el token fuera del repo y del CI. Decisión revisable si en algún momento hace falta inyectar variantes (ej. eventos custom desde build).
- **Preview por commit es una forma natural de compartir cambios sin push a main**. Si en algún momento se reactiva el modelo de ramas + PR (cuando entren contribuyentes externos, ver AGENTS.md), Pages ya genera la URL preview automáticamente.
- **El panel acepta literalmente lo que se teclea en "Build command".** En la conexión inicial (2026-05-26) el campo quedó como `npm build` (sin `run`), que no es comando válido; el primer build falló con `Unknown command: "build"`. Solución: _Settings → Builds & deployments → Build configurations → Edit_, fijar **`pnpm build`** exacto, y _Retry deployment_ sobre el deploy fallido. No hace falta otro push ni tocar el repo. Documentado por si vuelve a ocurrir con un futuro proyecto.
- **Cloudflare Pages empuja al flujo "Workers + Static Assets" en la UI nueva.** Si en _Create application_ aparece "Create a Worker" pidiendo `npx wrangler deploy` + API token + `wrangler.jsonc`, estás en el flujo equivocado para un sitio estático. Volver atrás y elegir explícitamente la pestaña **Pages** en el selector Workers / Pages. Para nuestro caso (sitio estático puro sin Functions), Pages clásico es más simple: detecta framework, no requiere `wrangler.jsonc` ni token.
- **Web Analytics: usar el toggle del proyecto Pages, no el Web Analytics de zona DNS.** Si se llega a `Web Analytics → Add site` y se configura con hostname `presuntamente.org`, esa config queda inerte hasta que el dominio apex esté apuntado a Pages y bajo proxy CF. El toggle del proyecto Pages (_Settings → Web Analytics → Add Web Analytics_) inyecta el beacon directamente en cada respuesta servida por el proyecto y funciona desde el primer deploy en `*.pages.dev`. Cuando se active DNS apex, el mismo toggle cubre el dominio nuevo sin tocar nada.

## Ideas futuras

### v1.x — comprometido

- Tras activar Pages, sustituir el toggle de Web Analytics por un objetivo concreto: medir cuántos visitantes únicos por semana en las primeras 4 semanas post-launch y mantener una tabla de eventos clave (visitas a `/cifras`, `/buscar`, fichas de caso) en `docs/web/`.

### Sin compromiso

- **Deploy hooks** para forzar rebuild sin push (útil si el contenido depende de fuentes externas que cambien sin alterar `main`; hoy no aplica).
- **Functions** de Cloudflare Pages para endpoints dinámicos (formularios de aporte/rectificación que escriban a la API de Cloudflare R2 o a un issue de GitHub). Hoy ambos cauces funcionan vía email (`aportar@`, `rectificacion@`) y no urge.
- **Branch deploys protegidos**: cuando se reactive el modelo de ramas + PR, evaluar si las URLs `*.pages.dev` de previews deben estar bajo Cloudflare Access (login) para que no se compartan inadvertidamente.

## Pendientes operativos

- [x] **Maintainer**: "Connect to Git" en el panel de Cloudflare con los valores de la tabla de "Configuración de Pages". Comprobar que el primer deploy termina verde. _Hecho 2026-05-26 tras un primer build fallido por `npm build` y un Retry con `pnpm build`._
- [x] **Maintainer**: activar "Web Analytics" en el toggle del proyecto Pages (sin tocar `CF_ANALYTICS_TOKEN` ni env vars). _Hecho 2026-05-26. Empieza a recoger datos a partir del primer deploy posterior a la activación._
- [x] **Maintainer**: probar que `https://<proyecto>.pages.dev` responde y verificar con curl que la cabecera `X-Robots-Tag: noindex, nofollow` está presente. _Verificado 2026-05-26 desde el agente: HTTP 200, 23 KB, cabecera presente, `cf-ray: …-MAD`._
- [x] **Verificar Node 24 desde `.nvmrc`**. Logs del primer build confirman `Detected the following tools from environment: nodejs@24.13.1, pnpm@11.1.3`. No fue necesario fijar `NODE_VERSION` como env var.
- [ ] **Maintainer**: tras la activación de Web Analytics, lanzar manualmente _Retry deployment_ del último deploy verde para que el beacon empiece a inyectarse antes del próximo push natural.
- [ ] **Agente, sesión posterior**: cuando se active DNS apex de `presuntamente.org`, retirar `public/_headers` (o vaciarlo) en un commit dedicado, validar que la cabecera desaparece y registrar la fecha de switch en esta ficha.
