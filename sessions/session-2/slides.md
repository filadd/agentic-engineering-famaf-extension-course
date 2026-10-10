---
marp: true
theme: default
paginate: true
title: Sesión 2 — Planificar y Revisar
---

<!--
Esqueleto de la presentación de la Sesión 2, con las notas de orador.
El deck final es deck/index.html: HTML animado, se abre en el navegador y se navega con las flechas.
Cada slide de acá corresponde a una del deck, en el mismo orden. Los clicks entre paréntesis son los pasos de animación.

Sesión de 1 h 30. Los tiempos por bloque se fijan ensayando.
-->

# Sesión 2
## Planificar y Revisar

<!-- 1 · Portada. El título se escribe solo y el personaje cae desde arriba saludando. Anclar: mismo proyecto, hoy es 1 h 30. -->

---

## Hoy

<!-- 2 · Agenda como recorrido: ¿cómo les fue? → vibe coding → planificar + demo → tests → revisar → práctica → cierre. -->

---

## ¿Cómo les fue?

<!-- 3 · (4 clicks) Cuatro notas que caen de a una: ¿cómo les fue?, ¿leyeron el código?, ¿encontraron problemas?, ¿entienden qué pasa por abajo? Discusión corta; lo que sale va al pizarrón. No cerrar con conclusión. -->

---

## Vibe coding

<!-- 4 · (3 clicks) 1: la barra se llena con checkboxes de "anda". 2: se traba cerca del 78%, se sacude para atrás y para adelante, se rompe y la llenan signos de pregunta. 3: "Faltan decisiones y detalles. No sabés dónde ni cuántos." Las decisiones que no tomaste las tomó el agente en silencio. Callback: deuda de comprensión. -->

---

## Hoy no vamos a escribir menos código

<!-- 5 · (3 clicks) 1: "menos código" se tacha a mano. 2: "Vamos a saber qué código escribimos." 3: entra un caracol desde la izquierda dejando rastro, frena y dice "hoy va a parecer más lento…"; cae el sello "¡A PROPÓSITO!". -->

---

## Explorar · Diseñar · Documentar · Código

<!-- 6 · (4 clicks) Cuatro cartas; el personaje salta a cada una cuando se da vuelta. EXPLORAR: entender lo que existe antes de decidir. DISEÑAR: las decisiones las tomás vos, el agente pregunta de a una. DOCUMENTAR: un archivo para leer, anotar y pasarle al agente. CÓDIGO 🏁: recién acá, el agente implementa el documento (voltereta y confeti). -->

---

## Más diseño, mejores resultados

<!-- 7 · Slider manual de "liviano" a "profundo": cada punto pasa una decisión de la fila del agente (?) a la tuya (✓). Moverlo en vivo. Las flechas mueven el slider mientras tiene foco; Esc devuelve la navegación. -->

---

## Cómo se le pide

<!-- 8 · (4 clicks) Terminal: cada prompt se tipea y prende su parada del recorrido. "Contame cómo funciona X. No escribas nada." / "Quiero agregar Y. Preguntame las decisiones, de a una." / "Escribí el diseño en docs/y.md" / "Implementá docs/y.md". Ejemplos, no receta. -->

---

## Una ayudita: Plannotator

<!-- 9 · (4 clicks) `pi install npm:@plannotator/pi-extension`. 1: /plannotator-annotate abre el documento en el navegador. 2: se pegan dos anotaciones. 3: "Enviar anotaciones", el sobre vuelve a la terminal, el agente las recibe y el documento suma líneas en verde. 4: "con el diff es igual: /plannotator-review" + psst de plan mode (pi --plan): existe, lo pueden probar, no es el flujo de hoy. Es una ayudita, no el método. -->

---

## Demo

<!-- 10 · EN VIVO. Una demo continua: explorar → diseñar contestando en voz alta → documento → anotarlo → implementar. Decir dónde irías más a fondo con el diseño. Tener un documento flojo de respaldo. -->

---

## El agente escribe muchos tests.

<!-- 11 · (2 clicks) 1: llueven checkmarks y "142 passed 🎉". 2: pasa una lupa y unos dos tercios de los ✓ se vuelven signos de pregunta; el personaje pasa de contento a confundido. "No sabés si testean lo correcto." -->

---

## Los casos se deciden antes del código

<!-- 12 · (7 clicks) Classification Tree Method (Grochtmann y Grimm, 1993), simplificado. El árbol crece: raíz, qué varía, qué valores importan. Después cada fila de la tabla ilumina las hojas que combina. El agente propone la tabla, vos confirmás, recortás o agregás. El runner que lo instale el agente; los casos los decidís vos. -->

---

## Revisar código es cada vez más difícil

<!-- 13 · (4 clicks) 1: "lo que alcanzás a leer" (plana) contra "lo que se escribe" (se dispara). 2: robots sobre la curva: cada vez más lo escribe un agente, no hay a quién preguntarle por qué. 3: se sombrea "sin revisar" + "¿Cómo revisamos esto? Todavía no sabemos": agentes que revisan, diffs más chicos, tests que prueban lo que importa. 4: se destaca "mover la revisión para adelante". -->

---

## La revisión se corrió para adelante

<!-- 14 · (5 clicks, un bloque por click) Antes: código → revisar ("mil líneas de diff"). Ahora: diseño → revisar ("una página de diseño") → código. Leer el código después sirve para entender qué se hizo y preguntar: ¿coincide con el diseño? -->

---

## Lo que corregís, capturalo

<!-- 15 · (7 clicks, un bloque por click) Sin capturar: corregís → chat nuevo → "uso fetch acá" 🔁, el mismo error. Capturando: corregís → lo anotás → chat nuevo → "uso el cliente de api/" ✓, lo leyó del archivo. Al final, el adelanto: una skill puede juntarlo sola (Herramientas y Skills). -->

---

## Las reglas de hoy

<!-- 16 · (1 click) Las reglas de la clase de vibe coding se dan vuelta como cartas: 1) nada se implementa sin diseño escrito, 2) anotá el diseño antes de aprobarlo (se queda moviendo: es la que da ganas de saltear), 3) los casos de test antes del código, 4) leé el diff; si se rompe, leelo vos. -->

---

## Los pasos

<!-- 17 · El personaje recorre las etapas solo (elegir, explorar, diseñar, casos, documentar, implementar, revisar + commit), a veces se frustra y vuelve una atrás, llega a la meta y arranca de nuevo. Reloj en la esquina, click para reiniciarlo. Se puede dejar proyectada durante la práctica. Insistir con el scope. -->

---

## ¿Valió la pena diseñar primero?

<!-- 18 · (1 click) Balanza entre tiempo y entender que no se decide. "Depende de cuánto te importe poder explicar el código después." Dejar que digan que para algo chico sobró. -->

---

## ¿Qué aprendimos?

<!-- 19 · (2 clicks) 1: collage que cae carta por carta con todo lo que vimos: la barra con ??%, el recorrido, más diseño, anotar el diseño, los casos antes del código, la revisión para adelante, capturar lo que corregís, el caracol. 2: la tarea abajo: seguí con el flujo, y anotá qué le explicaste al agente más de una vez → Herramientas y Skills. -->
