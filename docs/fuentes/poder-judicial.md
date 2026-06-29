# Poder Judicial (`poderjudicial.es`)

Portal del Consejo General del Poder Judicial. Titular: CGPJ, órgano constitucional de gobierno del poder judicial español. Ámbito: TS, AN, TSJ, AP, Juzgados; órganos del CGPJ; CENDOJ (Centro de Documentación Judicial).

## Qué hay aquí

Tres familias de documentos que el inventario consume:

1. **Sentencias y autos jurisdiccionales** — vía **CENDOJ**, buscador de jurisprudencia.
   - TS: sentencias y autos de todas las Salas.
   - AN: sentencias y autos de Sala Penal, Sala Apelación, Salas Cont-Admon y Social, Juzgados Centrales.
   - TSJ y AP: sentencias y autos, **con cobertura recortada** (ver "Cuándo NO usar").
   - Tipos del schema: `sentencia`, `auto_judicial`.

2. **Acuerdos de los órganos colegiados del CGPJ** — Comisión Permanente, Pleno, Comisión Disciplinaria, Comisión de Igualdad, Comisión de Asuntos Económicos, Comisión de Calificación.
   - Tipo del schema: actualmente `otro` (el enum del schema no contempla `acuerdo_cgpj`; documentar en `nivel_fuente_justificacion`).

3. **Notas de prensa institucionales** — Oficina de Comunicación del CGPJ, del TS y de la AN.
   - Tipo del schema: `nota_prensa_institucional`.

Las tres son N1 (`nivel_fuente: 1`) por dominio en lista blanca `DominiosOficiales`.

## Patrones de URL estables

### Sentencias y autos (CENDOJ)

Cada resolución tiene un identificador interno y una URL canónica con sufijo de fecha:

```
https://www.poderjudicial.es/search/<DB>/openDocument/<hash-32hex>/<YYYYMMDD>
```

donde `<DB>` es `TS` para Tribunal Supremo y `AN` para todo lo demás (sí, los autos de la AP también viven bajo `/search/AN/openDocument/`; ver "Trampas"). Esta URL es la `url_canonica` correcta del `Documento`.

El **ROJ** (Referencia Oficial de Jurisprudencia) es el identificador humano:

- `STS 1000/2025` = Sentencia TS.
- `ATS 11816/2025` = Auto TS.
- `SAP M 4252/2026` = Sentencia AP Madrid.
- `AAP M 12345/2025` = Auto AP Madrid.
- `SAN 100/2025` / `AAN 200/2025` = Sentencia/Auto AN.
- Sufijos provinciales típicos de AP: `M` Madrid, `B` Barcelona, `NA` Navarra, `S` Cantabria, `IB` Baleares, `C` Coruña, `PO` Pontevedra, `LE` León, `LU` Lugo, `BI` Bizkaia, `AV` Ávila.

### Acuerdos del CGPJ (Comisión Permanente)

URL de la página HTML del acuerdo de un día concreto:

```
https://www.poderjudicial.es/cgpj/es/Servicios/Acuerdos-del-CGPJ/Historico-Acuerdos-de-la-Comision-Permanente/Acuerdos-de-la-Comision-Permanente-del-CGPJ-de-<DD>-de-<mes>-de-<YYYY>
```

con `<mes>` en castellano minúsculas (`enero`, `febrero`, …, `diciembre`). Sesiones extraordinarias añaden el sufijo `--Sesion-extraordinaria-` al final de la URL.

PDF íntegro del boletín de acuerdos de la sesión:

```
https://www.poderjudicial.es/stfls/CGPJ/SECRETARÍA%20GENERAL/ACUERDOS%20DE%20LA%20COMISIÓN%20PERMANENTE/FICHERO/<YYYYMMDD>%20BoletinesAcuerdosCP.pdf
```

Espacios, eñes y tildes URL-encoded (`%20`, `%C3%8D`, etc.). El PDF contiene los acuerdos numerados de la sesión completa (`1.1-X`, `2-X-Y`, etc.); para localizar uno concreto: `pdftotext -layout <pdf> - | grep -inE "<palabra clave>"`.

### Notas de prensa institucionales

URL canónica directa por slug del titular, sin parámetros opacos:

```
https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunal-Supremo/Oficina-de-Comunicacion/Archivo-de-notas-de-prensa/<Slug-del-titular>
https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Audiencia-Nacional/Oficina-de-Comunicacion/Notas-de-prensa/<Slug-del-titular>
https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunal-Supremo/Noticias-Judiciales/<Slug-del-titular>
```

El slug es el título legible de la nota con guiones (no codificado).

## Endpoints de búsqueda

### CENDOJ — `search.action` (AJAX)

**Método**: `POST https://www.poderjudicial.es/search/search.action`.

**Headers obligatorios**:
- `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`.
- `X-Requested-With: XMLHttpRequest`.
- `Origin: https://www.poderjudicial.es`.
- `Referer: https://www.poderjudicial.es/search/` (o `indexAN.jsp`).
- Cookie `JSESSIONID` válida (sin ella, **403**). El navegador la obtiene al cargar `/search/` por primera vez; reproducible con un GET previo a `https://www.poderjudicial.es/search/` y guardar la cookie del response.

**Body** (URL-encoded):

| Parámetro | Valores / formato | Notas |
|---|---|---|
| `action` | `query` | siempre |
| `databasematch` | `TS` o `AN` | **`AN` contiene también AP, TSJ y juzgados**, no sólo la Audiencia Nacional. `AP`, `TSJ` o `jurisprudencia` devuelven 403 |
| `TIPOORGANOPUB` | código numérico, multivalor con `\|` | filtro real por órgano. Ver tabla abajo |
| `JURISDICCION` | `CIVIL`, `PENAL`, `CONTENCIOSO`, `SOCIAL`, `MILITAR`, `ESPECIAL` | multivalor |
| `TEXT` | texto libre URL-encoded UTF-8 | comillas dobles para frase exacta; sin stemming agresivo |
| `FECHARESOLUCIONDESDE` | `DD%2FMM%2FYYYY` | barra URL-encoded |
| `FECHARESOLUCIONHASTA` | `DD%2FMM%2FYYYY` | idem |
| `ROJ` | `STS 1000/2025`, `AAP M 12345/2025`… | búsqueda directa cuando la cobertura periodística menciona el ROJ |
| `SECCION` | número de sección (texto) | filtro por sección del órgano |
| `SUBTIPORESOLUCION` | id interno | filtro por tipo de resolución |
| `sort` | `IN_FECHARESOLUCION%3Adecreasing` | orden por fecha desc |
| `recordsPerPage` | entero pequeño (10) | subir mucho devuelve 403 |
| `start` | entero ≥1 | paginación 1-indexada |

**Códigos `TIPOORGANOPUB`** descubiertos:

| Código | Órgano |
|---|---|
| `11` | Tribunal Supremo — Sala de lo Civil |
| `12` | Tribunal Supremo — Sala de lo Penal |
| `13` | Tribunal Supremo — Sala de lo Contencioso |
| `14` | Tribunal Supremo — Sala de lo Social |
| `15` | Tribunal Supremo — Sala de lo Militar |
| `16` | Tribunal Supremo — Sala de lo Especial |
| `22` | Audiencia Nacional — Sala de lo Penal |
| `2264` | Sala de Apelación de la Audiencia Nacional |
| `23` | AN — Sala de lo Contencioso |
| `24` | AN — Sala de lo Social |
| `25` | AN — Juzgado Central de Vigilancia Penitenciaria |
| `26` | AN — Juzgado Central de Menores |
| `27` | AN — Juzgados Centrales de Instrucción / Tribunal Central Instancia Sec. Instr. |
| `28` | AN — Juzgados Centrales de lo Penal |
| `29` | AN — Juzgados Centrales de lo Contencioso |
| `31` | TSJ — Sala de lo Civil y Penal |
| `36` | Audiencia Territorial |
| `37` | **Audiencia Provincial** |
| `38` | Audiencia Provincial — Tribunal Jurado |

**Respuesta**: HTML parcial con los resultados. Atributos relevantes por hit:
- `data-roj="STS 6092/2025"` — ROJ del documento.
- `data-fechares="20251230"` — fecha de la resolución, `YYYYMMDD`.
- `data-reference="11591318"` — id interno CENDOJ.
- `data-databasematch="TS"` — base origen.
- `<a href="https://www.poderjudicial.es/search/<DB>/openDocument/<hash>/<YYYYMMDD>">` — URL canónica del documento (la que va a `url_canonica`).
- `data-totalhits="167"` en el filtro `<li class="navfiltro">` — total de hits de la query.

**Ejemplo mínimo** — buscar autos de la AP Madrid jurisdicción penal en 2026 con el texto "Begoña Gómez":

```bash
# 1) Obtener JSESSIONID
curl -s -c /tmp/cendoj-cookies.txt 'https://www.poderjudicial.es/search/' \
  -H 'User-Agent: Mozilla/5.0' -o /dev/null

# 2) Búsqueda
curl -s 'https://www.poderjudicial.es/search/search.action' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Origin: https://www.poderjudicial.es' \
  -H 'Referer: https://www.poderjudicial.es/search/indexAN.jsp' \
  -H 'User-Agent: Mozilla/5.0' \
  -b /tmp/cendoj-cookies.txt \
  --data-raw 'action=query&sort=IN_FECHARESOLUCION%3Adecreasing&recordsPerPage=10&databasematch=AN&TIPOORGANOPUB=37&JURISDICCION=PENAL&start=1&TEXT=Bego%C3%B1a+G%C3%B3mez&FECHARESOLUCIONDESDE=01%2F01%2F2026&FECHARESOLUCIONHASTA=31%2F12%2F2026'
```

Parsear los `data-roj` y `<a href>` del HTML resultante con `grep -oE`.

### CENDOJ — PDF oficial de una resolución

La URL `openDocument` devuelve HTML de visor. Dentro aparece un `<object>` con el PDF oficial:

```text
/search/contenidos.action?action=accessToPDF&publicinterface=true&tab=<DB>&reference=<hash>&encode=true&optimize=<YYYYMMDD>&databasematch=<DB>
```

Ese endpoint devuelve `Content-Type: application/pdf`. Para descargarlo de forma reproducible:

```bash
curl -sSL 'https://www.poderjudicial.es/search/contenidos.action?action=accessToPDF&publicinterface=true&tab=TS&reference=<hash>&encode=true&optimize=<YYYYMMDD>&databasematch=TS' \
  -H 'User-Agent: Mozilla/5.0' \
  -H 'Referer: https://www.poderjudicial.es/search/TS/openDocument/<hash>/<YYYYMMDD>' \
  -o resolucion-cendoj.pdf
```

El PDF puede no ser byte a byte idéntico a copias oficiales obtenidas por sede judicial o a mirrors periodísticos: CENDOJ regenera una versión propia, con metadatos `Author: CENDOJ` y productor habitual `Apache FOP`. Para el inventario, si el texto corresponde a la misma resolución y el dominio es oficial, esta copia es preferente como `ruta_local` N1; conservar hashes históricos de mirrors anteriores en `NOTES.md`.

### Buscador interno del CGPJ — Acuerdos de la Comisión Permanente

**Método**: `POST https://www.poderjudicial.es/cgpj/es/Servicios/Acuerdos-del-CGPJ/Acuerdos-de-la-Comision-Permanente/`.

**Body** (URL-encoded): `ASUNTO`, `ASUNTOMAY`, `ACUERDO`, `ACUERDOMAY`, `FECHA=DD%2FMM%2FYYYY`, `FECHAFIN=DD%2FMM%2FYYYY`, `TEXTO`, `TEXTOMAY`, `ANEXO`, `NUMACUERDO`, `SERVICIOORIGEN`.

**Respuesta**: HTML completo del listado con tabla `<table id="miTabla">`. Cada hit tiene `data-tipo="none"` y un `onclick="openDetalle('/cgpj/es/Servicios/Acuerdos-del-CGPJ/ch.Acuerdos-de-la-Comision-Permanente.formato1/?id=<num>')"`. Si no hay resultados: `<td colspan="4"><center>No hay datos</center></td>`.

⚠ **Trampa crítica**: este buscador **sólo indexa acuerdos desde 2024**. Cualquier año anterior devuelve "No hay datos" — verificado año a año 2017→2025 el 2026-05-27 al cerrar el pendiente_primario CGPJ del caso Lezo. Para acuerdos previos a 2024, **no usar este endpoint**; ir directamente a las URLs del histórico estático (ver "Patrones de URL estables").

## Cobertura temporal real

| Recurso | Cobertura declarada | Cobertura real verificada |
|---|---|---|
| CENDOJ — Tribunal Supremo | "Desde mediados 90" | Cubre desde finales 90 sin lagunas relevantes; ROJ accesible por API completa |
| CENDOJ — Audiencia Nacional | "Histórico completo" | Cubre Sala Penal, Sala Apelación, Salas Cont-Admon/Social; los Juzgados Centrales son irregulares, especialmente en autos de instrucción vivos |
| CENDOJ — TSJ y AP | "Por convenio" | **Cobertura recortada y aleatoria** entre Comunidades; muchas resoluciones recientes no se publican. Los autos de instrucción de procedimientos vivos **no se publican** aunque sean de AP (verificado con dos autos del caso Begoña Gómez del 23-feb-2026 y 13-may-2025, ambos públicos por prensa, 0 hits en CENDOJ el 2026-05-27) |
| Buscador interno acuerdos CP CGPJ | "Histórico" | **Sólo desde 2024**. Anteriores en el histórico estático URL-by-date |
| Notas de prensa CGPJ/TS/AN | "Archivo completo" | Histórico aparentemente completo, no se ha encontrado laguna |

## Filtros y trampas

- **`databasematch` no es lo que parece**: `TS` y `AN` no son códigos de órgano, son particiones del corpus. `AN` agrupa todo lo que **no** es TS — AN sí, pero también AP, TSJ y juzgados ordinarios. Para filtrar de verdad por órgano, usar `TIPOORGANOPUB`. `databasematch=AP`, `=TSJ`, `=jurisprudencia` devuelven 403 (probado el 2026-05-27).

- **`VALUESCOMUNIDAD` y `ccaa` están en el form pero no filtran**: aparecen como `<input type="hidden">` en `indexAN.jsp` pero al pasarlos al POST no recortan resultados (siguen apareciendo resoluciones de otras CCAA). Filtrar a posteriori por prefijo de ROJ: `AAP M`/`SAP M` Madrid, `AAP B`/`SAP B` Barcelona, `AAP NA`/`SAP NA` Navarra, etc.

- **Anonimización en sentencias civiles**: CENDOJ sustituye nombres por iniciales o `[DEMANDANTE]`/`[ACUSADO]` en orden civil. En orden penal la anonimización es menos agresiva pero existe. Buscar por nombre puede no encontrar la resolución aunque exista.

- **Sin stemming**: `Begoña` y `Begona` devuelven resultados distintos (el primero usa ñ literal). Probar variantes con y sin diacríticos si la primera búsqueda da 0 hits.

- **Comillas dobles para frase exacta**: `TEXT=%22Cristina+%C3%81lvarez%22` busca la frase literal. Sin comillas, busca documentos que contengan ambos términos en cualquier posición.

- **Operadores Y/O/NO** soportados en el campo `TEXT` con sintaxis castellana (`Y`, `O`, `NO`).

- **Vignette CMS antiguo del CGPJ**: páginas con URLs `?vgnextoid=...` a veces devuelven HTML con un `<a href="/stfls/CGPJ/...pdf">` enterrado; `WebFetch` no siempre extrae el PDF directamente. Salida: hacer GET con `curl` al HTML, parsear el href del PDF con `grep -oE 'href="[^"]*\.pdf[^"]*"'`, descargar el PDF aparte.

## Cómo verificar que funciona

**Test 1 (CENDOJ — sentencia TS firme conocida)**: la Sentencia 1000/2025 de la Sala 2ª del TS contra el FGE. Búsqueda con `databasematch=TS&TIPOORGANOPUB=12&TEXT=García+Ortiz` en fechas nov-dic 2025 debe devolverla. Si no aparece, el portal cambió.

**Test 2 (CGPJ acuerdo CP histórico)**: GET a `https://www.poderjudicial.es/cgpj/es/Servicios/Acuerdos-del-CGPJ/Historico-Acuerdos-de-la-Comision-Permanente/Acuerdos-de-la-Comision-Permanente-del-CGPJ-de-22-de-junio-de-2017` debe devolver 200 y contener el `href` al PDF en `/stfls/CGPJ/.../FICHERO/20170622%20BoletinesAcuerdosCP.pdf`. El PDF debe contener el acuerdo 1.1-2 sobre el reingreso de García-Castellón al JCI nº 6 (caso `lezo`).

**Test 3 (Nota CGPJ)**: GET a `https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunal-Supremo/Oficina-de-Comunicacion/Archivo-de-notas-de-prensa/El-Tribunal-Supremo-notifica-la-sentencia-que-condena-por-revelacion-de-datos-reservados-al-fiscal-general-del-Estado-` debe devolver 200 y mencionar el fallo del 9-dic-2025 (caso `fiscal-general-del-estado`).

Si los tres pasan, el catálogo está vivo.

## Cuándo NO usar este portal

- **Para autos de instrucción de procedimientos vivos**, aunque sean de Juzgado Central o de la AP. CENDOJ no los publica mientras la causa esté en marcha — probado con dos autos del caso Begoña Gómez ya públicos por prensa (anulación jurado popular 23-feb-2026 + desimputación Goyache 13-may-2025): 0 hits en CENDOJ el 2026-05-27. Reconfirmado el 29-jun-2026 con búsquedas `TIPOORGANOPUB=27` para JCI nº 4 Plus Ultra (Calama, filtraciones 25-jun) y JCI nº 5 Leire/SEPI/Gualda (29-jun): 0 hits. Modelar el hito con nota CGPJ N1 si existe o cobertura N4 cruzada (V-13) si no, y anotar `pendiente_primario` en `NOTES.md` del caso.

- **Para escritos de parte** (querella, recurso de la defensa, escrito de Fiscalía). CENDOJ publica resoluciones de órgano judicial, no escritos de las partes. Si el hito depende de un escrito, modelar como N3 `filtrado_verificado` con mirror periodístico identificable o N4 cruzado.

- **Para autos del CGPJ que no sean acuerdos colegiados**. Acuerdos de Comisión Permanente, Pleno, Comisiones Disciplinaria/Igualdad/Asuntos Económicos/Calificación → al histórico estático. Resoluciones administrativas internas del Servicio de Inspección → no son públicas.

## Histórico de descubrimientos

- **2026-05-27 (noche, 3)** — Caso `lezo`, pendiente_primario García-Castellón → JCI 6. Maintainer aportó el curl del formulario de búsqueda del CGPJ. Descubrimientos: (a) buscador interno del CGPJ sólo indexa desde 2024; (b) acuerdos previos en histórico estático con URL directa por fecha; (c) PDFs íntegros en endpoint estable `stfls/.../FICHERO/<YYYYMMDD>...pdf`; (d) la fecha del acuerdo de reingreso de García-Castellón es 22-jun-2017, no 6-jun como suponía la cobertura periodística.

- **2026-05-27 (noche, 3, continuación)** — Caso `begona-gomez`, pendiente_primario auto Cristina Álvarez. Maintainer aportó el curl del buscador AJAX CENDOJ. Descubrimientos: (a) endpoint `/search/search.action`, parámetros, tabla de `TIPOORGANOPUB`; (b) `databasematch=AN` es contenedor genérico de AP/TSJ/JI, no sólo Audiencia Nacional; (c) `VALUESCOMUNIDAD`/`ccaa` no filtran de verdad; (d) CENDOJ no publica autos de procedimientos en instrucción aunque sean de AP, verificado con dos autos del caso BG ya públicos por prensa (0 hits).

- **2026-06-29** — Caso `koldo`, Sentencia TS 418/2026. Búsqueda CENDOJ `databasematch=TS&TIPOORGANOPUB=12&TEXT=Sentencia+418%2F2026` devuelve `ROJ: STS 2553/2026`, `ECLI:ES:TS:2026:2553`, referencia interna `11767153` y URL `openDocument`. El PDF oficial no está en el `href` principal sino en el `<object>` `accessToPDF`; descarga validada con `Content-Type: application/pdf`, 84 páginas y hash local.

- **2026-06-29 (continuación)** — Casos `plus-ultra` y `leire-diez`: CENDOJ devuelve 0 hits para autos recientes de Juzgados Centrales de Instrucción vivos, incluso cuando el CGPJ sí publica nota institucional del auto de Calama sobre filtraciones en Plus Ultra. Aprendizaje operativo: antes de resignarse a N4, buscar también en notas CGPJ/AN por slug de titular; CENDOJ y notas institucionales no cubren lo mismo.
