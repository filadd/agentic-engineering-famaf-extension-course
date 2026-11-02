---
marp: true
theme: default
paginate: true
title: Sesión 4 — Context Engineering
---

<!--
Esqueleto de la presentación de la Sesión 4, con las notas de orador.
El deck final es deck/index.html: HTML animado, se abre en el navegador y se navega con las flechas.
Cada slide de acá corresponde a una del deck, en el mismo orden. Los clicks entre paréntesis son los pasos de animación.

El deck lleva solo conceptos. La sesión alterna entre estas slides y el trabajo en vivo sobre kurasu; dónde entra cada parte en vivo está en INSTRUCTOR.md, no acá.
-->

# Sesión 4
## Context Engineering

<!-- 1 · Portada. El título se escribe solo y el personaje cae desde arriba saludando. Anclar: sesión 4 de 6, la última del tramo base. Hoy no se instala nada. -->

---

## Hoy

<!-- 2 · Agenda como recorrido: ¿cómo les fue? → el proyecto → el problema → la solución → documentar → subagentes → cierre. Las cinco paradas del medio son la barra chica que aparece arriba en las slides de conceptos. -->

---

## ¿Cómo les fue?

<!-- 3 · (3 clicks) Tres notas que caen de a una: ¿creaste o encontraste un skill nuevo?, ¿qué le tuviste que explicar igual?, ¿qué dudas quedaron de la Sesión 3? La segunda es la tarea de la Sesión 3: lo que tuvieron que explicar a pesar del AGENTS.md es lo que hoy va a los docs. Discusión corta, sin conclusión. -->

---

## Deuda y rendición cognitiva

<!-- 4 · (3 clicks) 1: DEUDA COGNITIVA, el costo de delegar una y otra vez el razonamiento, la memoria y la resolución de problemas; cada decisión que no tomaste es una que no entendés. 2: RENDICIÓN COGNITIVA, aceptar lo que produce el agente sin leerlo y adoptar sus decisiones como propias; si no entendés el problema, su respuesta se vuelve tu opinión. 3: la frase de la sesión, "Documentar es pensar antes de construir". Los dos conceptos vuelven en el cierre. -->

---

## 📚 AGENTS.md como índice

<!-- 5 · (3 clicks) El tema que la Sesión 3 dejó anunciado ("Agus lo cuenta en la próxima clase"). 1: un AGENTS.md gigante de 900 líneas, y la barra de contexto que ocupa en cada turno. 2: un AGENTS.md de 30 líneas que linkea a docs/README.md, a las notas de arquitectura, a los prototipos y al índice de la wiki; su barra casi no se mueve. 3: lo de cada turno en el AGENTS.md, el resto a un link de distancia. La línea punteada de la barra es la regla del 50% de la Sesión 1. -->

---

## 📚 Qué va en cada lugar

<!-- 6 · (3 clicks) Tres cartas. AGENTS.md: lo que el agente necesita en cada turno (comandos, convenciones, dónde está el resto); lo lee siempre. docs/: cómo funciona cada parte del sistema, con el porqué al lado; lo leen personas y agentes. WIKI: cómo se trabaja en este código, reglas de arquitectura y gotchas de cada herramienta; la lee el agente cuando toca esa parte. La diferencia entre docs y wiki: los docs explican el sistema, la wiki explica cómo trabajar en él. -->

---

## 🎯 Problema y solución

<!-- 7 · (4 clicks) 1: EL PROBLEMA, qué necesita quien lo va a usar, la parte de la realidad que el sistema tiene que atender; se describe sin nombrar el sistema. 2: tres flechas a tres soluciones: una sólida (el sistema que atiende esa necesidad) y dos punteadas (otras posibles). 3: si arrancás por la solución, la elige el agente, y por defecto devuelve la respuesta promedio de todo lo que ya vio. 4: es la separación de siempre entre requerimientos y diseño; importa con o sin IA. Sin ejemplo en la slide: el ejemplo es lo que se hace en vivo. -->

---

## 🎯 Definir el problema: mapear la realidad

<!-- 8 · (5 clicks) Lo que buscamos entender antes de pensar en el sistema. ACTORES: quién está involucrado y qué rol cumple. ENTIDADES: qué cosas existen en ese mundo y cómo se relacionan. PROCESOS: qué hace cada actor, en qué orden y qué dispara cada paso. REGLAS: lo que siempre tiene que cumplirse, y sus excepciones. 5: muchas veces esto lo hace un equipo de producto, y llega como requerimiento. En su proyecto no hay equipo de producto: lo hacen ellos, con el agente preguntándoles. -->

---

## 🧩 Definir la solución

<!-- 9 · (6 clicks) Lo que buscamos decidir antes de escribir código, cada decisión con su porqué. Seis cartas, cada una con un ejemplo mínimo en mono. MODELO: las entidades, sus campos, sus relaciones y dónde vive cada dato. FLUJOS: los pasos de cada interacción, quién le pide qué a quién y en qué orden. ESTADOS: en qué estados puede estar cada cosa y qué la hace pasar de uno a otro. COMPONENTES: las piezas del sistema, qué hace cada una y cómo se hablan. PANTALLAS: qué se ve, qué se puede hacer, y qué pasa mientras carga o cuando falla. PROTOTIPOS: un HTML que se puede tocar decide más rápido que una descripción. -->

---

## 📄 Documentos vivos

<!-- 10 · (4 clicks) 1: doc → código → review → reconciliar (el doc vuelve a decir lo que hace el código). 2: ¿hizo lo que acordamos? Chequeamos contra la documentación de lo que decidimos, para validar que lo que se hizo es lo que pedimos. 3: ¿hubo cambios durante la implementación? Implementar a veces destapa problemas que no estaban claros en el diseño; hay que cubrirlos y llevarlos al doc, que es lo que hace el paso de reconciliar. 4: la flecha vuelve al doc: en el próximo cambio, el doc se lee al explorar. Un doc que no se reconcilia miente, y el agente le cree. -->

---

## 🤖 Un contexto por trabajo

<!-- 11 · (4 clicks) A la izquierda el agente principal con su barra de contexto en 14%. Cada click suma un subagente con su propia barra, que se llena, y un resumen que vuelve; recién ahí la barra principal sube 2%. 1: SCOUT, "¿cómo avisa el aula sus cambios?" → 3 líneas + archivo:línea. 2: UNO POR REPO, implementa las tareas de su repo → commits + reporte. 3: UNO POR FACETA, reviewers de reuso, simplicidad, eficiencia y convenciones → hallazgos. 4: el subagente se lleva el trabajo entero; vuelve solo la conclusión. La Sesión 3 presentó la primitiva; acá está el uso. -->

---

## Todo tiene un costo

<!-- 12 · (3 clicks) Arranca el cierre. PLATA: cada subagente es otra conversación entera, los tokens se multiplican. CONTEXTO: lo que le cargás al agente se paga en cada turno, y lo que sobra lo distrae. TU ATENCIÓN: lo que no revisás no lo entendés, y lo que no entendés no lo podés mantener. -->

---

## Cuándo no usar IA

<!-- 13 · (3 clicks) La IA amplifica lo que ya sabés. 1: fundamentos × agente = cohetes. 2: confusión × agente = más confusión (los signos tiemblan). 3: si estás aprendiendo algo, escribilo vos primero. "Don't use AI as a crutch", MIT Missing Semester, ya citado en la Sesión 1. Nombrar la atrofia: lo que dejás de hacer, lo dejás de saber hacer. -->

---

## Ser dueño

<!-- 14 · (5 clicks) Entender, decidir, discutir, mantener, de a una. 5: si no podés explicar tu sistema sin abrir el código, no sos dueño del sistema. Volver a deuda y rendición: la diferencia entre delegar la escritura y delegar el pensamiento. -->

---

## ¿Qué aprendimos?

<!-- 15 · (1 click) Ocho cartas: AGENTS.md como índice, cada cosa en su lugar, el problema antes que la solución, definir el problema, definir la solución, documentos vivos, un contexto por trabajo, ser dueño. Después, de palabra: las demos de la Sesión 5 y la transición al tramo avanzado (están en INSTRUCTOR.md, no en el deck). -->
