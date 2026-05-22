# assets/

Activos visuales del sistema.

| Fichero | Uso |
|---|---|
| `wordmark.svg` | Wordmark sobre fondo claro (papel oficial). |
| `wordmark-inverso.svg` | Wordmark sobre fondo oscuro (dark mode). |

## Iconos

Los iconos se cargan desde **Lucide** (outline, stroke 1.5px) por CDN en preview:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

Cuando el repo upstream genere su propio set en SVG, sustituir Lucide local en
`assets/icons/` con los mismos nombres canónicos:

- `gavel` — hito jurisdiccional
- `landmark` — hito político
- `newspaper` — hito mediático
- `file-text` — documento
- `link` — enlace canónico
- `archive` — enlace de archivo (mirror archive.org)
- `hash` — número de procedimiento
- `calendar` — fecha
- `building-2` — organización
- `user` — persona / actor
- `chevron-right` — navegación
