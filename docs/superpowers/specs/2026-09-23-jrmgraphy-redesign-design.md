# JRMGraphy — Mesa de edición

Estado: aprobado por Javier el 23 septiembre 2026, incluyendo animaciones como parte central de la dirección de arte. Implementación y despliegue exclusivo a staging autorizados.

## Objetivo

Convertir visitantes en solicitudes de fotografía por formulario/correo. Tres recorridos comerciales de igual importancia: producto/gastro, retrato, eventos/música. La fotografía de Javier, su forma de mirar y su dirección deben ser la experiencia principal.

## Dirección propuesta

Una mesa de selección fotográfica traducida a una interfaz editorial. Fondo marfil cálido, tinta casi negra, un acento bermellón muy contenido para interacción. Letras de gran escala, composición asimétrica y fotografía a color con bordes limpios. Las imágenes tienen espacio y pie de foto; el texto mantiene su propia superficie legible.

La primera pantalla combina una declaración breve —«Hay imágenes que se quedan.»— con una composición de tres fotografías reales, una por especialidad. Un índice visible permite entrar a Producto / Gastro, Retrato y Eventos / Música. Firma de Javier Rangel, ubicación CDMX y acceso directo a «Cuéntame tu proyecto» identifican autor, servicio y siguiente paso.

Al seleccionar una especialidad, su fotografía ocupa el plano principal y se actualizan título, selección y enlace de consulta. La transición mantiene continuidad espacial mediante transformaciones y fundidos breves. No depende de arrastrar, hover, cursor personalizado o scroll secuestrado. Teclado y touch tienen controles equivalentes; movimiento reducido cambia de estado sin desplazamiento.

El riesgo: convertir la mesa en una metáfora decorativa o un collage caótico. Se controla con una retícula estricta, tres elecciones claras, imágenes curadas y un CTA persistente. La experiencia debe seguir siendo comprensible sin JavaScript.

## Recorrido de inicio

1. Presentación visual y tres entradas comerciales.
2. Edición destacada por especialidad, con títulos factuales y selección corta; cada fotografía puede ampliarse.
3. Tres bloques de servicio con necesidad del cliente, usos de las imágenes y CTA contextual. Los bloques varían de composición dentro del mismo sistema.
4. Javier y su forma de trabajar, usando el retrato existente y texto basado en información del sitio.
5. Proceso en tres momentos: brief, sesión, selección y entrega. No inventar tiempos, volúmenes o condiciones.
6. Formulario/cierre para iniciar una consulta, con correo alternativo visible.

## Páginas y contenido

- Inicio ES/EN con el nuevo sistema completo.
- Servicios: tres verticales, ejemplos pertinentes y consulta contextual.
- Portafolio: filtros Producto/Gastro, Retrato, Eventos/Música y Archivo personal claramente separado. Preservar las URLs antiguas mediante páginas compatibles o redirecciones deliberadas.
- Sobre mí: autor, mirada y proceso, basado en el contenido disponible.
- Contacto: formulario con especialidad, nombre, email y descripción; fecha y ubicación opcionales si facilitan el brief. No es una reserva confirmada.
- Páginas SEO: conservar contenido útil, URLs, metadatos e idiomas; aplicar navegación y sistema visual coherentes.

Los nombres comerciales visibles en fotos no se convierten automáticamente en testimonios, logos de clientes o afirmaciones de contratación. No se usarán imágenes generadas como pruebas de trabajo de Javier.

## Arquitectura

Mantener Astro estático y Netlify. Catálogo editorial separado de los registros originales de fotos, con selecciones explícitas para evitar que el orden del filesystem defina la dirección de arte. Componentes para shell/navegación, selección inicial, sección de especialidad, imagen/lightbox y formulario. Tokens compartidos para color, escala tipográfica, espacios y estados; evitar depender de parches del hero anterior.

Conservar parámetros existentes `type` y `package` cuando sea pertinente y normalizarlos hacia las tres verticales. El formulario continúa usando Netlify Forms y honeypot. Validación nativa más mensajes inline; conservar datos en errores; anunciar envío y resultado con una región viva. Desactivar envíos duplicados mientras la solicitud está pendiente.

La selección de vertical y los CTAs se miden por categorías coherentes. `generate_lead` se emite solo después de una respuesta satisfactoria. Staging no debe contaminar datos de producción; la configuración se verificará antes del despliegue.

## Rendimiento y accesibilidad

Imagen inicial determinista con dimensiones, tamaño responsive y prioridad alta; imágenes posteriores lazy. Animaciones limitadas a transform y opacity, sin WebGL permanente ni precargas masivas. Contenido visible antes de animar. Navegación semántica, enlace para saltar al contenido, foco visible, menú y lightbox manejables con teclado, textos alternativos pertinentes y targets táctiles cómodos.

## Alternativas consideradas

- **Cine oscuro:** fotografía a pantalla completa y transiciones por capítulos. Mayor dramatismo para conciertos, pero puede diluir producto y volver a esconder imágenes bajo texto.
- **Revista editorial:** estructura más serena de portada y reportajes, lectura muy clara. Menor diferenciación interactiva frente a otros portafolios.
- **Mesa de edición:** conecta la elección de trabajo con la elección del servicio y conserva protagonismo fotográfico. Es la propuesta a validar.

## Validación y entrega

Build y comprobación de tipos; rutas e imágenes; ES/EN; menú, selector, lightbox y errores de formulario; móvil y desktop; movimiento reducido; enlaces SEO. Verificar Netlify Forms en staging sin contactar a terceros ni enviar mensajes comerciales. Documentar cualquier prueba de envío que requiera un registro de prueba.

Conservar los commits de staging `1b7debf` y `2f1d9da`. Publicar exclusivamente en staging y verificar URL, versión desplegada y rutas clave. Producción queda fuera del despliegue solicitado. La entrega incluirá auditoría, cambios, pruebas, URL de staging y limitaciones verificadas.
