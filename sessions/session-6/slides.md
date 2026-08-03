---
marp: true
theme: default
paginate: true
title: Sesión 6 — Modelos Open Source y CCAD
---

<!--
🔴 TO REVIEW — generado por Claude, todavía SIN revisar por Diego.
Tratar todo el contenido como propuesta, no como decisión.

Skeleton de la presentación de la Sesión 6.
Cada slide tiene un título + una nota de oradora/orador (HTML comment).
El contenido del cuerpo de cada slide está pendiente.

OJO: varios datos concretos del CCAD (clusters con GPU, scheduler, política de
trabajos interactivos) están PENDIENTES de confirmar con Ale Silva.
Ver INSTRUCTOR.md → "Pending from Ale".
-->

# Sesión 6
## Modelos Open Source y cómo correrlos en el CCAD

**De Vibe Coding a Agentic Engineering** — FaMAF
Diego Piloni · con Ale Silva (CCAD)

<!-- Slide de portada. Última sesión. Presentar a Ale y anticipar que arranca él. -->

---

## ¿Dónde quedamos?

<!-- Recap corto de Sesión 5 (contenido TBD, lo define Agus). Show-and-tell, 10-15 min. Ajustar cuando esté cerrada la Sesión 5. -->

---

## Hoy

<!-- Objetivo en una frase: salir sabiendo que el modelo es un componente reemplazable, habiéndolo reemplazado por uno corriendo en hardware de la UNC. Aviso: es la sesión con más terminal de las seis. -->

---

# Parte 1 — El CCAD

<!-- Sección. Le pasamos la palabra a Ale. -->

---

## Invitado: Ale Silva — Centro de Computación de Alto Desempeño (UNC)

<!-- 20-25 min de Ale. Alcance a coordinar con él (ver INSTRUCTOR.md): qué es el CCAD, qué hardware hay, quién puede pedir cuenta, para qué se usa normalmente HPC en la UNC. Que la sala pregunte. -->

---

## Lo que quiero que se lleven de esto

<!-- Cierre corto después de Ale: la UNC opera un centro de cómputo de alto desempeño y ustedes pueden pedir una cuenta. Es probablemente el dato más útil del curso, independientemente de la AI. -->

---

# Parte 2 — Pesos abiertos vs. API hosteada

<!-- Sección. Espectro de control, no tribalismo. Arrancar por la distinción que casi nadie hace bien. -->

---

## Open source ≠ open weights

<!-- La distinción que ordena todo el bloque. "Open weights": podés bajar los pesos y correrlos. "Open source" en el sentido fuerte: además tenés el código de entrenamiento y la información sobre los datos, o sea podrías reproducir el modelo. Casi todo lo que se anuncia como "open source AI" es open weights: te dan el binario, no la receta. Analogía: es un ejecutable gratis, no el código fuente. Aclarar que nosotros vamos a usar "pesos abiertos" cuando corresponda. -->

---

## Las licencias importan

<!-- Bajar la distinción a algo con consecuencias prácticas. Tres familias: 1) licencias de software estándar (Apache 2.0, MIT) — uso comercial libre, derivados, redistribución. 2) licencias propias con restricciones (la community license de Llama, los terms de Gemma): límites de uso, cláusulas de escala, obligaciones de naming o de política de uso aceptable. 3) restricciones sobre el output (algunas prohíben usarlo para entrenar otros modelos). Preguntas que hay que saber contestar antes de meter un modelo en un proyecto: ¿puedo usarlo comercialmente? ¿puedo redistribuir un fine-tune? ¿de quién es lo que genera? VERIFICAR la licencia de cada modelo que nombremos la semana de la clase — cambian entre versiones del mismo modelo. -->

---

## Un espectro de control

<!-- Tabla (ver INSTRUCTOR.md): API hosteada / pesos abiertos en GPU de otro / pesos abiertos en tu GPU. Ejes: capacidad, dónde vive tu data, forma del costo (por token vs. por hora), carga de operación, si funciona offline. -->

---

## Seamos honestos con la brecha

<!-- Los mejores modelos de pesos abiertos son genuinamente útiles y genuinamente están atrás en lo que a este curso le importa: trabajo agéntico largo y tool calling confiable. No sobrevender, no despreciar. VERIFICAR nombres de modelos y claims la semana de la clase. -->

---

# Parte 3 — Qué hace falta para correr uno

<!-- Sección. Mecánica práctica: si esto se hand-wavea, el hands-on falla. -->

---

## La cuenta de la VRAM

<!-- Hacer la aritmética en vivo para un modelo: cantidad de parámetros × bytes por parámetro ≈ piso de VRAM, antes del contexto. Desmitifica todo y explica de una por qué necesitan un nodo con GPU. -->

---

## Cuantización

<!-- Cambiás precisión por VRAM. Mencionar que cuantizar fuerte degrada la salida estructurada — que es exactamente el tool calling. -->

---

## Dos familias de runtime

<!-- Local / un usuario (llama.cpp, Ollama) vs. serving (vLLM, SGLang: batching, throughput, un servidor HTTP). El ejercicio de hoy necesita la segunda. -->

---

## El endpoint compatible con OpenAI

<!-- Acá está todo el puente con la Sesión 5: casi todos los runtimes exponen una API compatible, así que un harness apunta a otro modelo cambiando la base URL. Nada más. -->

---

## Demo: una GPU que entra en una mochila (Agus)

<!-- Agus trae su GPU portátil y sirve un modelo chico en vivo, ahí mismo. Hace concreta la tercera columna del espectro ("pesos abiertos, tu GPU"): sin cola, sin túnel, sin cuenta, y con la data sin salir de la sala. Mostrar el consumo de VRAM real contra la cuenta que hicimos dos slides atrás, y la velocidad de tokens por segundo. Sirve además como endpoint de respaldo del hands-on si el scheduler del CCAD se pone imposible. CONFIRMAR con Agus que la trae y probarla antes. -->

---

# Parte 4 — Un cluster no es tu notebook

<!-- Sección. Mecánica de HPC. TODO: verificar cada comando contra el setup real del CCAD. -->

---

## Nodo de login vs. nodo de cómputo

<!-- No corras el modelo en el nodo de login. Decirlo dos veces. Alguien lo va a hacer igual. -->

---

## El scheduler: pedís y esperás

<!-- El cambio mental más grande de la sesión. Describís el trabajo (cuántas GPUs, cuánto tiempo) y esperás tu turno. Trabajo interactivo = pedir una asignación interactiva. -->

---

## Llegar a un servicio que corre en un nodo

<!-- El modelo sirve HTTP en un nodo sin dirección pública. El túnel SSH es el puente desde tu notebook hasta el endpoint. Es el paso que más tiempo se come: ir despacio acá. -->

---

## Etiqueta de recurso compartido

<!-- Tu trabajo bloquea la corrida de la tesis de alguien. Pedí lo que necesitás y liberalo cuando terminás. -->

---

# Parte 5 — Sidebar de seguridad

<!-- Sección breve. Cierra el hilo transversal de seguridad del curso. -->

---

## Cadena de suministro

<!-- Estás bajando decenas de gigabytes de pesos binarios de un hub. ¿Qué estás confiando y quién los publicó? Según el formato, los archivos de modelo fueron históricamente un vector de ejecución de código. -->

---

## La privacidad corta para los dos lados

<!-- Self-hostear saca a un tercero y te agrega a vos como operador: logs, disco, un filesystem compartido que quizás no pensaste. Y el prompt injection no le importa qué modelo corras — un modelo más débil puede ser más fácil de secuestrar. -->

---

# Hands-on (60-75 min)

<!-- Transición al bloque práctico. -->

---

## Los pasos

<!-- Ver exercise/README.md: entrar al cluster → pedir GPU → servir un modelo chico con endpoint compatible → forwardear el puerto → cambiar la base URL del agente de la Sesión 5 → comparar. -->

---

## Si el scheduler te gana, no perdiste la clase

<!-- Anunciar el endpoint de respaldo desde el arranque. Lo que importa es la comparación final, no ganarle a la cola. Y usen un modelo CHICO: el objetivo es un request que funcione, no benchmarks. -->

---

# Parte 6 — ¿Cuándo conviene?

<!-- Sección. Va DESPUÉS del hands-on a propósito: la discusión de criterio es mejor cuando ya sintieron la carga de operación. -->

---

## ¿Está a la altura de ser el motor de un proyecto serio?

<!-- LA pregunta de la sesión, y la que ellos van a querer hacer. Contestarla con lo que acaban de medir en el hands-on, no con opiniones. Los ejes concretos: ¿llama las tools respetando el schema, siempre? ¿aguanta una tarea de 20 pasos sin perderse? ¿le alcanza la ventana de contexto para un repo real? ¿la latencia hace tolerable el loop? Nuestra respuesta honesta hoy (VERIFICAR la semana de la clase, esto cambia rápido): para tareas acotadas, revisiones, tareas repetitivas de alto volumen y trabajo con data sensible, sí. Como motor principal de un coding agent en un proyecto serio y de largo plazo, todavía no del todo — y el cuello de botella suele ser el tool calling confiable, no el "saber programar". Abrir a discusión: que la sala argumente con lo que midió. -->

---

## Cuándo sí

<!-- Data sensible o regulada; volumen alto y repetitivo donde el costo domina; investigación que necesita reproducibilidad y un modelo pinneado; trabajo offline o aislado; y estudiar la cosa en sí — no podés inspeccionar logits que no tenés. -->

---

## Cuándo no

<!-- Querés el mejor agente de código de hoy; no tenés capacidad de operación; el volumen es bajo (la API hosteada sale más barata que tu tiempo). -->

---

# Cierre del curso

<!-- Sección final de la sesión y del curso. -->

---

## El modelo es un componente

<!-- El pago real de las seis sesiones: planificar, revisar, testear, contexto, tools, harness — todo eso transfiere entre modelos. Por eso enseñamos estructura y no un producto. -->

---

## Volvamos al espectro

<!-- Traer de vuelta la slide de los 5 niveles de la Sesión 1. ¿Dónde se ubican ahora? ¿Cuándo es apropiado cada nivel? -->

---

## Retrospectiva: seis semanas de un mismo proyecto

<!-- Que abran el repo y miren el primer commit. Comparar con lo que hay hoy. Discusión abierta, 15-20 min. -->

---

## Cuándo NO usar AI

<!-- Reconocer límites, sobredependencia, atrofia de habilidades. La AI amplifica expertise: si no tenés los fundamentos, amplifica confusión. -->

---

## Gracias

<!-- Cierre. Agradecer a Ale y al CCAD. Dejar los links de resources/ y el de pedido de cuenta. -->
