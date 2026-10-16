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

<!-- 2 · Agenda como recorrido: ¿cómo les fue? → vibe coding → planificar + demo → revisar → tests → verificar → práctica → cierre. -->

---

## ¿Cómo les fue?

<!-- 3 · (4 clicks) Cuatro notas que caen de a una: ¿cómo les fue?, ¿leyeron el código?, ¿encontraron problemas?, ¿entienden qué pasa por abajo? Discusión corta; lo que sale va al pizarrón. No cerrar con conclusión. -->

---

## Vibe coding

<!-- 4 · (3 clicks) 1: la barra se llena con checkboxes de "anda". 2: se traba cerca del 78%, se sacude para atrás y para adelante, se rompe y la llenan signos de pregunta. 3: "Faltan decisiones y detalles. No sabés dónde ni cuántos." Las decisiones que no tomaste las tomó el agente en silencio. Callback: deuda de comprensión. -->

---

## Explorar · Diseñar · Documentar · Código

<!-- 5 · (4 clicks) Cuatro cartas; el personaje salta a cada una cuando se da vuelta. EXPLORAR: entender lo que existe antes de decidir. DISEÑAR: las decisiones las tomás vos, el agente pregunta de a una. DOCUMENTAR: un archivo para leer, anotar y pasarle al agente. CÓDIGO 🏁: recién acá, el agente implementa el documento (voltereta y confeti). -->

---

## Más diseño, mejores resultados

<!-- 6 · Slider manual de "nada de diseño" a "todo diseñado": cada punto pasa una decisión de la fila del agente (?) a la tuya (✓). Abajo, dos gráficos siguen al slider, con el tiempo diseñando en el eje x: las chances de retrabajo caen fuerte con las primeras decisiones y después se aplanan; cuánto entendés lo que salió sube rápido y se satura. Más diseño cuesta tiempo antes de empezar y devuelve menos retrabajo y más comprensión. Moverlo en vivo. Las flechas mueven el slider mientras tiene foco; Esc devuelve la navegación. -->

---

## Cómo se le pide

<!-- 7 · (4 clicks) Una conversación con Pi para agregar recordatorios a una app de tareas. Cada click prende su parada del recorrido, tipea el prompt y hace aparecer las respuestas; la terminal scrollea y lo de pasos anteriores queda atenuado. EXPLORAR: "Contame cómo funcionan las tareas hoy. No escribas nada." → db.json, las rutas de server.js, nada corre solo en el tiempo. DISEÑAR: "Quiero agregar recordatorios. Preguntame las decisiones, de a una." → cuatro preguntas y cuatro respuestas (fecha y hora; avisa el navegador; con la pestaña cerrada no avisa y se marca vencido; si está hecha no avisa). DOCUMENTAR: "Armame un borrador del diseño. Todavía no lo guardes." → el borrador aparece con un árbol de qué pasa cuando llega la hora; dos correcciones (vencido no se guarda, se calcula; faltan dos casos) y recién ahí "Guardalo en docs/recordatorios.md" → 4 decisiones, 5 casos. CÓDIGO: "Implementá docs/recordatorios.md" → lee el doc, va mostrando los diffs de server.js y public/app.js con esperas entre archivo y archivo, y termina corriendo los tests: 5 pasan. Ejemplos, no receta. -->

---

## Una ayudita: Plannotator

<!-- 8 · (3 clicks) `pi install npm:@plannotator/pi-extension`. 1: /plannotator-annotate abre el documento en el navegador. 2: se pegan dos anotaciones. 3: "Enviar anotaciones", el sobre vuelve a la terminal, el agente las recibe y el documento suma líneas en verde. `/plannotator-review` y plan mode (`pi --plan`) se dicen en voz alta, no están en la slide. Es una ayudita, no el método. -->

---

## Demo

<!-- 9 · EN VIVO. Arriba, el personaje recorre las paradas solo, como en la slide de los pasos. Una demo continua: explorar → diseñar contestando en voz alta → documento → anotarlo → implementar. Decir dónde irías más a fondo con el diseño. Tener un documento flojo de respaldo. -->

---

## Revisar código es cada vez más difícil

<!-- 10 · (9 clicks) 1: "lo que alcanzás a leer" (plana) contra "lo que se escribe" (se dispara). 2: robots sobre la curva: cada vez más lo escribe un agente, no hay a quién preguntarle por qué. 3: se sombrea "sin revisar" + "¿Cómo revisamos esto? Todavía no sabemos". 4-8: los intentos aparecen de a uno: adversarial reviews, cambios más chicos, no revisar nada, mover la revisión para adelante, verificar que funciona. 9: se destacan los dos últimos: son los que usamos hoy. El primero ya lo vimos con el diseño. -->

---

## Revisión: antes y después

<!-- 11 · (2 clicks, cada uno arma una fila bloque por bloque) 1: antes, con un colega: diseño (una charla) → código → verificar (tests + a mano) → revisión (a mano) → ship. Verificar y revisar pueden encontrar problemas, así que de cada uno sale una flecha de vuelta al código; las flechas son hondas: "los dos encuentran problemas: vuelta al código, varias veces". 2: ahora, con un agente: diseño (escrito y anotado) → código → verificar (tests + el agente) → revisión liviana (agente + humano) → ship. Las mismas flechas de vuelta al código, más cortas: "las mismas vueltas, más cortas". El ciclo es el mismo; cambia dónde está el peso. -->

---

## Tests

<!-- 12 · (1 click) A la izquierda, para qué sirven: código que prueba tu código; dejan escrito qué tiene que hacer, se corren solos cada vez que cambiás algo, y si algo se rompe te enterás vos antes que quien lo usa. 1: a la derecha se arma la pirámide de abajo hacia arriba, en una sola animación: unitarios (una función sola; muchos y rápidos), integración (varias piezas juntas: la ruta, la validación, la base), e2e (la app entera, como una persona; pocos y lentos). Para pasar a la slide siguiente, decir que todo esto lo puede escribir el agente. -->

---

## El agente escribe muchos tests.

<!-- 13 · (2 clicks) 1: llueven checkmarks y "142 passed 🎉". 2: pasa una lupa y unos dos tercios de los ✓ se vuelven signos de pregunta; el personaje pasa de contento a confundido. "No sabés si testean lo correcto." -->

---

## Los casos se deciden antes del código

<!-- 14 · (7 clicks) Classification Tree Method (Grochtmann y Grimm, 1993), simplificado. El árbol crece: raíz, qué varía, qué valores importan. Después cada fila de la tabla ilumina las hojas que combina. La última columna dice cómo se verifica cada caso: test, agente, o los dos. El agente propone la tabla, vos confirmás, recortás o agregás. El runner que lo instale el agente; los casos los decidís vos. -->

---

## Verificar: usar lo que se construyó

<!-- 15 · (3 clicks) Verificar se suma como quinto paso después del código; se dice en voz alta. "Que compile y pasen los tests no alcanza: alguien tiene que usarlo. Ese alguien puede ser el agente." 1: la API, levantar el server y pegarle con curl. 2: los datos, mirar qué quedó guardado. 3: la pantalla, abrir el navegador, hacer click, sacar una captura. El mismo orden que las tres slides que siguen. -->

---

## Verificar la API

<!-- 16 · (3 clicks) Sigue el ejemplo de los recordatorios. A la izquierda la terminal; a la derecha un diagrama de secuencia entre el agente y el server que se dibuja a medida que pasan las cosas. 1: "Verificá la API de recordatorios con curl, contra los casos de docs/recordatorios.md"; levanta el server, que se prende en el diagrama ("escuchando en :3000"). 2: tres curl, uno por caso del doc, y en el diagrama cada pedido y su respuesta: recordatorio futuro → 200, recordatorio pasado → 400, sin recordatorio → 200. 3: "3 de 3 casos se comportan como dice el doc". -->

---

## Verificar los datos

<!-- 17 · (3 clicks) Sigue después de los curl. A la izquierda la terminal; a la derecha la tabla de tareas de db.json. 1: "Fijate en db.json que lo guardado coincida con el doc"; jq sobre la tarea 7, que se ilumina: el 400 no escribió nada y el último PATCH dejó null. 2: jq pregunta si alguna tarea tiene "vencido": false, y en la tabla aparece "vencido ✗ no está guardado", porque el doc dice que se calcula al cargar. 3: "los datos coinciden con docs/recordatorios.md". -->

---

## Verificar la pantalla

<!-- 18 · (4 clicks) `npm install -g agent-browser`, una CLI para que el agente maneje un navegador. Presentarla y seguir: las herramientas son de la Sesión 3. 1: "Abrí la app y probá ponerle un recordatorio a una tarea"; open, y aparece la app. 2: snapshot -i: el agente ve la página como una lista de elementos con referencias (@e1, @e2…), que usa en los comandos siguientes. 3: click en el ⏰ de "comprar pan", fill con la fecha, click en guardar; el puntero se mueve solo y la tarea muestra el recordatorio. 4: screenshot, y los dos chequeos: el recordatorio aparece, "pagar la luz" se ve vencida. -->

---

## Las reglas de hoy

<!-- 19 · (5 clicks) Las reglas de hoy, una por click, en el orden de lo que vimos: 1) diseñá antes de escribir código, 2) discutí los casos de test con el agente, 3) escribí el documento de diseño, 4) implementá, 5) verificá. -->

---

## Los pasos

<!-- 20 · El personaje recorre las etapas solo (elegir, explorar, diseñar, documentar, implementar, verificar, revisar + commit; los casos de test son parte de diseñar), a veces se frustra y vuelve una atrás, llega a la meta y arranca de nuevo. Reloj en la esquina, click para reiniciarlo. Se puede dejar proyectada durante la práctica. Insistir con el scope. -->

---

## ¿Valió la pena diseñar primero?

<!-- 21 · (1 click) Balanza entre tiempo y entender que no se decide. "Depende de cuánto te importe poder explicar el código después." Dejar que digan que para algo chico sobró. -->

---

## ¿Qué aprendimos?

<!-- 22 · (1 click) Collage que cae carta por carta con todo lo que vimos: la barra con ??%, el recorrido con sus cinco paradas, más diseño, anotar el diseño, la pirámide (el agente escribe los tests, vos decidís los casos), verificar la API, verificar la pantalla, y la balanza entre tiempo y entender. La tarea se dice en voz alta: seguí con el flujo, y anotá qué le explicaste al agente más de una vez → Herramientas y Skills. -->
