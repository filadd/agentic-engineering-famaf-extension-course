---
title: "Architecture"
summary: "Index of the notes about the shape of the system and how each part works"
---

# Architecture

This folder holds the shape of the system and how each part works. Each note explains one part of it; the reasoning behind a choice sits in a callout next to the mechanism it justifies. See [the docs charter](../README.md) for how a note is written.

## What notes exist

One row per note, kept by hand: adding a note here is part of writing it.

| Note | Explains |
|---|---|
| [Modelo de datos](modelo-de-datos.md) | Las entidades que kurasu guarda en D1: usuarios, sesiones con su material, encuestas, preguntas, manos levantadas y novedades pendientes, y los códigos de registro y de los links del mail. |
| [Componentes](componentes.md) | Las piezas de kurasu y cómo se hablan: la web en el navegador, la API y el aula en Cloudflare, D1, R2, Email Sending y el estado que guarda el navegador. |
| [Login y acceso](login-y-acceso.md) | Cómo un usuario se registra y entra con un magic link, cómo la API revisa el acceso en cada pedido y cómo el profe administra los usuarios y el código de registro. |
| [Tiempo real del aula](tiempo-real-del-aula.md) | Cómo el aula de cada sesión avisa al instante sus cambios, quién cuenta como presente, qué pasa cuando se corta la conexión y cómo se comporta la pantalla del aula. |
| [API de las slides](api-de-las-slides.md) | Cómo la web le dice al HTML de las slides a qué slide y paso ir, cómo viaja la posición del profe hasta los estudiantes y cómo se revisa que un HTML respete la API al marcarlo como slides, desde el modal de subida o desde la lista del material. |
| [Estados de encuestas y sesiones, y sus pantallas](estados-de-encuestas-y-sesiones.md) | Los ciclos de vida de las encuestas, las sesiones y las preguntas, qué ve el estudiante en su inicio, cómo maneja el profe las sesiones desde el admin y qué acciones piden confirmación. |
| [Carga y acciones de la web](carga-y-acciones-de-la-web.md) | Cómo la web dibuja una pantalla mientras cargan sus datos, qué muestra cuando la carga falla y cómo responde a cada acción del usuario, al instante o en espera. |
| [Novedades por mail](novedades-por-mail.md) | Cómo kurasu registra lo nuevo de cada sesión como novedades pendientes, cómo el profe elige cuáles anunciar desde el admin de la sesión y cómo la API manda el anuncio por mail a los usuarios con acceso. |

## What has no note yet

Honest gaps, so nobody assumes coverage that is not there. Name the part, and say where its behaviour is currently documented instead: in code comments, in a commit message, or nowhere.
