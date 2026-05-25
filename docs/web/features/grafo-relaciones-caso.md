# Grafo de relaciones por caso

> Archivos clave: pendiente de implementar · Depende de [`vinculos-institucionales.md`](vinculos-institucionales.md)

## Qué hace

Renderiza una visualizacion por caso con nodos y aristas que expliquen relaciones entre caso, personas, organizaciones, documentos clave y vinculos institucionales.

## Para qué sirve

Ayuda a entender casos complejos sin leer toda la ficha de arriba abajo. Es una feature de alto impacto para visitantes nuevos y para compartir, siempre que mantenga equivalencia textual y no simplifique en exceso la responsabilidad juridica.

## Cómo funciona

La version pre-launch deberia ser acotada:

- Grafo por caso, no grafo global del inventario.
- Generado en build o con JS minimo.
- Nodos: caso, personas con rol formal, organizaciones relevantes y documentos clave.
- Aristas tipadas: `investigado_en`, `procesado_en`, `juez_de`, `acusacion_popular_en`, `produjo_documento`, `cargo_en`, `vinculo_institucional`, etc.
- Sin colores de partido.
- Equivalente textual obligatorio debajo o al lado.

La fuente de verdad debe ser el modelo de datos, no un dibujo manual. Si una arista no puede derivarse o documentarse, no debe aparecer.

## Estado actual

No implementada. El doc 02 ya contempla conexiones entre casos y mini-grafo opcional, pero la feature no existe todavia en la UI.

## Decisiones editoriales y aprendizajes

- **Espectacular no debe significar opinativo.** El grafo puede ser visualmente fuerte, pero cada arista tiene que tener tipo y fuente.
- **No empezar por el grafo global.** Un grafo de todo el inventario sera mas llamativo, pero tambien mucho mas dificil de leer y de defender.
- **La leyenda es parte del producto.** El lector debe saber si una linea significa rol procesal, cargo institucional, fuente documental o relacion familiar publica.
- **Fallback textual obligatorio.** Regla P-06 del doc 02: toda visualizacion grafica tiene equivalente textual.
- **No usar fisicas inestables de entrada.** Para pre-launch conviene layout estable y cacheable; la interactividad puede venir despues.

## Ideas futuras

### v1 pre-launch

- Prototipo en una ficha de caso con datos suficientemente ricos.
- Componente reusable `CasoGraph` o equivalente.
- Leyenda y tabla textual de aristas.
- Integracion con el checklist de [`estado-ficha-caso.md`](estado-ficha-caso.md).

### v1.x

- Filtros por tipo de arista.
- Expandir documentos clave.
- Grafo global del inventario.
- Grafo por persona y por organizacion.

### Sin compromiso

- Export SVG/PNG para prensa.
- Modo "camino entre dos nodos" cuando el inventario crezca.

## Pendientes operativos

- [ ] Decidir libreria o SVG propio generado en build.
- [ ] Definir formato interno de nodos/aristas.
- [ ] Probar legibilidad en mobile.
- [ ] Verificar con Playwright que el grafo no sale vacio ni solapa texto.
- [ ] Asegurar que `prefers-reduced-motion` no queda comprometido si hay interaccion.
