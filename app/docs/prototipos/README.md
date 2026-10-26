---
title: "Prototipos"
summary: "Índice de los prototipos HTML de las pantallas de kurasu, del estudiante y del profe, y de las notas que los enlazan."
created: "2026-10-18"
---

# Prototipos

Esta carpeta guarda los prototipos HTML de las pantallas, que las notas de [arquitectura](../architecture/README.md) enlazan donde describen cada pantalla. Los del estudiante son responsive, para celular y escritorio; los del profe son de escritorio.

## 🖼️ Qué prototipos hay

| Prototipo | Pantalla | Lo enlaza |
|---|---|---|
| [inicio-responsive.html](inicio-responsive.html) | Inicio del estudiante, con la sesión destacada y las demás habilitadas | [Estados de encuestas y sesiones](../architecture/estados-de-encuestas-y-sesiones.md) |
| [aula-responsive.html](aula-responsive.html) | Aula del estudiante, con la slide actual y el panel | [Tiempo real del aula](../architecture/tiempo-real-del-aula.md), [API de las slides](../architecture/api-de-las-slides.md) |
| [registro-responsive.html](registro-responsive.html) | Registro con el código de registro y sus mensajes | [Login y acceso](../architecture/login-y-acceso.md) |
| [admin-sesiones.html](admin-sesiones.html) | Lista de sesiones del profe | [Estados de encuestas y sesiones](../architecture/estados-de-encuestas-y-sesiones.md) |
| [admin-sesion.html](admin-sesion.html) | Admin de una sesión, con sus pestañas Contenido, Encuestas y Aula, y en Contenido las novedades pendientes y el modal del anuncio | [Estados de encuestas y sesiones](../architecture/estados-de-encuestas-y-sesiones.md), [Tiempo real del aula](../architecture/tiempo-real-del-aula.md), [API de las slides](../architecture/api-de-las-slides.md), [Novedades por mail](../architecture/novedades-por-mail.md) |
| [admin-usuarios.html](admin-usuarios.html) | Usuarios del profe, con el QR y el código de registro | [Login y acceso](../architecture/login-y-acceso.md) |
| [marca-cuervo.html](marca-cuervo.html) | Marca del cuervo: favicon, título de la pestaña, card de login y registro y header, en celular y escritorio | [Componentes](../architecture/componentes.md) |
| [piezas.html](piezas.html) | Piezas compartidas: botón en espera, toast de error y de éxito, y pantalla de error, en celular y escritorio | [Carga y acciones de la web](../architecture/carga-y-acciones-de-la-web.md) |
| [revision-slides.html](revision-slides.html) | Revisión de las slides, en el modal de subida y en la lista del material, de escritorio | [API de las slides](../architecture/api-de-las-slides.md) |
| [mail-anuncio.html](mail-anuncio.html) | Mail del anuncio de novedades que recibe el estudiante, en su parte HTML y su parte de texto plano | [Novedades por mail](../architecture/novedades-por-mail.md) |
| [aviso-email.html](aviso-email.html) | Error de un campo con un email inválido, en la pantalla del email, en la hoja "Agregar por email" del profe y en un formulario de ejemplo con dos campos | [Login y acceso](../architecture/login-y-acceso.md), [Carga y acciones de la web](../architecture/carga-y-acciones-de-la-web.md) |
| [feedback-sesion.html](feedback-sesion.html) | Tarjeta del feedback de una sesión, con sus seis estados: sin responder, enviando, respondido, editando, error al enviar y cerrada, en celular y escritorio | [Feedback de una sesión](../architecture/feedback-de-sesion.md) |
| [admin-feedback.html](admin-feedback.html) | Tarjeta del feedback en la pestaña Encuestas del profe, con el reparto en barras, y el modal que lista las respuestas | [Feedback de una sesión](../architecture/feedback-de-sesion.md) |
