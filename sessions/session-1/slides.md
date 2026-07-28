---
marp: true
theme: default
paginate: true
title: Sesión 1 — La Experiencia Vibe Coding
---

<!--
🔴 TO REVIEW — generado por Claude, todavía SIN revisar por Diego.
Tratar todo el contenido como propuesta, no como decisión.

Skeleton de la presentación de la Sesión 1.
Cada slide tiene un título + una nota de oradora/orador (HTML comment).
El contenido del cuerpo de cada slide está pendiente.
-->

# Sesión 1
## La Experiencia Vibe Coding

**De Vibe Coding a Agentic Engineering** — FaMAF
Diego Piloni

<!-- Slide de portada. Presentarme, presentar el curso: 4 sesiones, un mismo proyecto que va a evolucionar con ustedes. Anclar: hoy arrancamos por el extremo menos estructurado, a propósito. -->

---

## De qué va el curso

<!-- El arco en una frase: vamos a recorrer el espectro completo de programar con AI, de "prompt y aceptar" hasta ingeniería agéntica. Cada sesión agrega una capa de estructura. Y van a sentir *por qué* cada capa importa porque antes van a vivir el problema que resuelve. -->

---

## El modelo mental del curso: manejar a un pasante brillante

<!-- El framing que vuelve en las 4 sesiones. La AI es rápida, entusiasta, produce muchísimo — y no tiene contexto ni criterio propio. Vos no aceptarías el código de un pasante sin leerlo. No lo dejarías decidir la arquitectura. Sesión 1 = el jefe ausente. A propósito. Decirlo explícito: hoy vamos a hacer todo mal. -->

---

## Hoy

<!-- Agenda: ~30 min de teoría, ~90-120 min de manos a la obra, ~30 min de "reality check". Aviso importante: la parte más valiosa del día son los últimos 30 minutos, no se vayan antes. -->

---

# Parte 1 — El espectro

<!-- Sección. El mapa del curso: dónde estamos hoy y a dónde vamos. -->

---

## Los 5 niveles

<!-- Vibe coding → AI-assisted → asistencia dirigida → agentic coding → agentic engineering. Una slide, sin profundidad: es un mapa, no un temario. Ubicar cada sesión en el espectro. Volvemos a esta slide en la Sesión 4. -->

---

## Vibe coding no es un insulto

<!-- Karpathy acuñó el término para proyectos de fin de semana, no para producción. Es una on-ramp real: rápida, divertida, habilitante. Para prototipos y código desechable funciona. Presentarlo bien antes de criticarlo — si armamos un espantapájaros, la crítica de la tarde no vale nada. -->

---

## Entonces, ¿cuál es el problema?

<!-- Adelanto de una línea, sin resolver: el software profesional exige accountability — seguridad, mantenibilidad, correctitud. Ahí el vibe coding se cae. Pero no lo voy a explicar: lo van a ver en su propio código a las 3 horas. -->

---

# Parte 2 — Cómo funciona esto por abajo

<!-- Sección. Lo mínimo indispensable de LLMs para entender los modos de falla que vamos a ver hoy. -->

---

## Tokens

<!-- El modelo no ve caracteres, ve tokens (pedazos de texto). Por eso se equivoca contando letras. Ejemplo en vivo si hay tiempo. -->

---

## Predice el siguiente token

<!-- Lo central: el modelo produce la continuación *plausible*, no la *verdadera*. Las alucinaciones no son un bug, son el mecanismo. Cuando no sabe, no se calla: completa. -->

---

## Context window

<!-- Memoria de trabajo finita. Todo lo que el agente "sabe" de tu proyecto está ahí adentro, o no está. Nada persiste entre conversaciones: cada sesión arranca en blanco. Esta idea es la semilla de la Sesión 4. -->

---

## Lo que NO vamos a ver hoy

<!-- Arquitectura, attention, entrenamiento, embeddings. Si alguien pregunta: lo dejamos para el break, hay referencias en resources/. -->

---

# Parte 3 — Anatomía de un agente de código

<!-- Sección. Plantar el vocabulario que usamos las 4 sesiones. -->

---

## Tres palabras: LLM, tool, harness

<!-- LLM: el modelo, predice tokens, solo no hace nada. Tool: una función que el modelo puede invocar (leer archivo, correr comando, editar código) — es lo que convierte sugerencias en acciones. Harness: el programa que envuelve al modelo (arma el contexto, ejecuta tools, pide permisos). Claude Code es un harness. -->

---

## Demo: el loop en vivo

<!-- Abrir Claude Code, un prompt simple, y narrar el loop en voz alta mientras pasa: "acá llamó a Read, eso es una tool; el harness me pidió permiso; ahora el resultado volvió al contexto del modelo". Una pasada concreta vale más que un diagrama. ~3 min. -->

---

## Volvemos a esto en la Sesión 3

<!-- Promesa explícita, no teaser: las tres piezas se abren en profundidad en la Sesión 3. Hoy solo necesitamos los nombres. -->

---

# Parte 4 — Las reglas del juego

<!-- Sección. Setup y las reglas del ejercicio. -->

---

## Setup

<!-- Checklist: Claude Code corriendo, acceso al modelo funcionando, directorio del proyecto creado. Levantar la mano quien esté trabado. Los que ya están, ayuden al de al lado. -->

---

## Elegí tu proyecto

<!-- Proyecto propio o uno de los briefs por defecto (ver exercise/README.md). Requisito: prototipo alcanzable en ~90 minutos, y con suficiente sustancia para que aguante 4 sesiones. Mismo proyecto todo el curso. -->

---

## Las 4 reglas de hoy

<!-- Leerlas en voz alta, están en el ejercicio: 1) hablale al agente, describí lo que querés. 2) NO abras los archivos, no leas los diffs, no espíes en el IDE. 3) Si algo se rompe, describí el síntoma, no diagnostiques. 4) Juzgá solo por el output: ¿se ve bien? ¿corre? -->

---

## Sí, es raro a propósito

<!-- Esperar resistencia de los más experimentados — es buena señal. Pedirles que jueguen el juego 90 minutos. El pago es el reality check del final. Sin la experiencia vivida, la lección de las próximas 3 sesiones es una opinión mía. -->

---

# Hands-on (90-120 min)

<!-- Transición al bloque práctico. Objetivo: llegar a un prototipo que "funcione". Recorro la sala con los TAs. -->

---

## Lo que vas a sentir

<!-- Aviso honesto de la curva: euforia los primeros 30-40 min, después fricción, y alrededor de los 60-90 min el agente empieza a romper cosas que ya había arreglado. Esa curva es el contenido de la sesión. -->

---

# Parte 5 — Reality check

<!-- Sección. El pago de la sesión. Sin este bloque, el hands-on enseña lo contrario de lo que queremos. -->

---

## Ahora sí: abrí los archivos

<!-- 5-10 minutos en silencio para leer lo que shippearon. No comentar nada, dejar que pase la reacción. -->

---

## ¿Qué encontraron?

<!-- Recolectar de la sala, no dar clase. Anotar en el pizarrón lo que van diciendo. Lo esperable: cero tests, secrets hardcodeados, input sin validar, código muerto, lógica duplicada, patrones inconsistentes, archivos que nadie entiende. ~10 min. -->

---

## Deuda de comprensión

<!-- Shippeaste código que no podés explicar. El interés se acumula: cada cambio futuro cuesta más, porque para cambiarlo primero hay que entenderlo, y nunca lo entendiste. -->

---

## La ilusión de productividad

<!-- METR: devs experimentados 19% MÁS LENTOS con AI, sintiéndose 20% más rápidos. CodeRabbit: 1.7x más issues graves en código co-escrito con AI. Recién ahora estos números pegan — arriba de la sesión habrían sonado a FUD anti-AI. -->

---

## El problema del 80%

<!-- El primer 80% llegó en minutos. El 20% que queda es donde vive el esfuerzo real — y es justo la parte donde hace falta entender el código. -->

---

## Modos de falla del agente

<!-- Cascading errors: una suposición mala se propaga en silencio. False success reporting: "los tests pasan" — después de que el agente editó los asserts. Scope creep: resolvió tres problemas que nadie pidió. Pedir ejemplos de la sala de cada uno. -->

---

## Sidebar de seguridad

<!-- Mostrar UN agujero real de UN proyecto de la sala (pedir permiso antes, no en el momento) o del proyecto de demo: un secret en el repo, input sin validar, falta de auth. El punto no es OWASP: es "el agente escribió esto y ninguno de los dos lo vio". 2-3 min. -->

---

## ¿Lo subirías a producción? ¿Lo mantendrías un año?

<!-- La pregunta de cierre. NO resolverla. La Sesión 2 abre exactamente acá. -->

---

# Cierre

<!-- Sección final. -->

---

## Lo que hicimos hoy

<!-- Construyeron algo real sin leer una línea. Y vieron en su propio código por qué eso no escala. Eso es todo el objetivo de la sesión. -->

---

## Próxima sesión: Planificar y Revisar (Agus)

<!-- Foreshadow: la primera capa de estructura. Plan antes de ejecutar, review antes de aceptar, tests como guardrails, git como red de seguridad. Traigan el mismo proyecto. -->

---

## Gracias

<!-- Cierre. Dejar referencias (resources/) y quedarse para dudas de setup. -->
