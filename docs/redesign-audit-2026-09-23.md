# Auditoría de JRMGraphy — 23 septiembre 2026

## Alcance y evidencia

Inspección visual de producción, navegación y contenido de staging, revisión de código, build, comprobación de tipos y dependencias. No se ha enviado un formulario real, medido conversión histórica ni ejecutado Lighthouse; no se atribuyen puntuaciones de rendimiento o cumplimiento WCAG completo.

Producción: https://jrmgraphy.com/es/

Staging: https://staging--jrmgraphy.netlify.app/es/

Base de trabajo: `origin/staging` en `2f1d9da`. Rama nueva: `codex/editorial-redesign`. El árbol de trabajo estaba limpio al comenzar. Producción/main: `5173927`.

Staging contiene dos commits exclusivos: `1b7debf` elimina mensajes de escasez y `2f1d9da` corrige posición del hero. Se conservan ambos al partir de staging. El CSS publicado en staging coincide byte por byte con `public/styles/styles.css` de esta rama (SHA256 `e57df619782c711b67b76f354e506b8800c67e2f2267927a5f722fb905099c13`). El contenido observado de staging también confirma la eliminación del mensaje de escasez presente en producción. Esto verifica los cambios conocidos; no equivale a inspeccionar todas las configuraciones privadas de Netlify.

## Hallazgos prioritarios

1. **P1 — Prueba visual incorrecta para producto/gastronomía.** `src/lib/photos.ts` asigna naturaleza y ciudad al archivo de autor, pero `src/i18n/ui.ts` traduce ese grupo como gastronomía y producto. Se observa en ambos sitios. Un cliente de producto ve imágenes ajenas a lo que desea contratar. Separar producto, retrato y eventos; conservar el archivo de autor con su nombre real.
2. **P1 — Fotografía y lectura compiten en el primer viewport.** `Hero.astro` superpone texto extenso, overlays y humo a una fotografía aleatoria. La captura de producción muestra que se pierde el sujeto y baja la claridad del texto. Rediseñar la composición y curar la primera imagen de forma deliberada.
3. **P1 — Navegación móvil sin contención del foco.** El drawer de `BaseLayout.astro` mueve el foco al abrir, pero no lo contiene ni inhabilita el contenido de fondo. Hay una implementación de focus trap para el lightbox que no cubre el menú. Usar una solución modal accesible o un menú que no bloquee el fondo.
4. **P2 — Clasificación comercial inconsistente.** Servicios separa gastronomía, mientras el portafolio agrupa producto con retrato bajo branding. Alinear navegación, selección fotográfica, copy y formulario con las tres verticales solicitadas.
5. **P2 — Formulario con errores mediante alertas.** `contact.astro` usa `alert()` y la confirmación carece de región viva. Añadir feedback contextual, conservación de los datos cuando falla, estados de envío anunciados y contexto preseleccionado desde cada vertical.
6. **P2 — Carga del hero no determinista.** El navegador recibe una imagen inicial y JavaScript cambia el `src` aleatoriamente. Puede disparar descargas adicionales y variar la composición/legibilidad. Seleccionar imágenes estáticas, responsive y con prioridades explícitas.
7. **P2 — Sistema visual fragmentado.** CSS público, estilos globales, estilos de componentes y utilidades con colores hardcoded conviven. Consolidar tokens y responsabilidades al rediseñar para evitar parches contradictorios.
8. **P2 — Comprobación de tipos incompleta y fallida.** `npx astro check` falla en `scripts/generateDiff.ts:14` por importación de `path`. `tsconfig.json` incluye solo scripts, por lo que el resultado tampoco valida las páginas Astro. Ampliar comprobaciones durante implementación.
9. **P2 — Dependencias con avisos de seguridad.** `npm audit` reporta 15: 3 bajas, 1 moderada, 10 altas, 1 crítica. Incluye Astro y Sharp. El sitio se genera estáticamente, por lo que los avisos de servidor no prueban exposición de producción. Actualizar con revisión de compatibilidad y comprobar el build; no ejecutar `audit fix --force` ciegamente.

## Evaluación orientativa del código

| Dimensión | Evaluación /4 | Evidencia y límites |
| --- | --- | --- |
| Accesibilidad | 2 | Labels y lightbox con teclado; drawer y feedback de formulario incompletos. Contrastes no medidos exhaustivamente. |
| Rendimiento | 2 | WebP y dimensiones disponibles; hero aleatorio, humo eager y seis imágenes destacadas eager. Sin métricas de campo verificadas. |
| Responsive | 2 | Breakpoints existentes y sin overflow del documento en 390 px; primer viewport denso. Falta evaluación de todas las rutas. |
| Sistema de estilos | 2 | Tokens existentes mezclados con valores repetidos y varias hojas. |
| Integridad | 1 | Taxonomía comercial incorrecta y comprobación de tipos limitada. |
| Total provisional | 9/20 | Priorizar arquitectura comercial y legibilidad antes de añadir efectos. |

Detector de patrones ejecutado sobre hero, header y contacto: sin hallazgos automáticos. Las observaciones anteriores provienen de revisión contextual; el detector no evalúa pertinencia comercial.

## Activos y funciones a conservar

- 361 fotografías locales: 58 producto, 110 retratos, 96 conciertos, 58 naturaleza, 39 ciudad.
- Idiomas ES/EN, URLs existentes y páginas SEO.
- Netlify Forms, correo público, protección honeypot y eventos de leads existentes.
- Imágenes WebP, dimensiones, lightbox y estructura estática Astro.
- La eliminación de mensajes de escasez realizada en staging.

## Estado de validación

`npm ci`: completado. `npm run build`: correcto, 24 páginas. Dev server: http://localhost:4321/es/.

Pendientes para el rediseño: selección visual aprobada, implementación, validación de rutas/formulario/teclado/móvil, despliegue exclusivo a staging y verificación del resultado desplegado. Ningún cambio publicado todavía.
