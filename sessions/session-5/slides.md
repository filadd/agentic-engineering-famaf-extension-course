---
marp: true
theme: default
paginate: true
title: Sesión 5 — Coding Harness (internals)
---

<!--
Esqueleto de la presentación de la Sesión 5, con las notas de orador.
El deck final es deck/index.html: HTML animado, se abre en el navegador y se navega con las flechas.
Cada slide de acá corresponde a una del deck, en el mismo orden. Los clicks entre paréntesis son los pasos de animación.

Es la hora del harness de la última clase, que junta la Sesión 5 con el bloque de modelos open-weight de la Sesión 6 (ese bloque usa el deck de la Sesión 6).
La base es la charla de BeerJS "Pi: el agente que se construye solo"; la segunda parte presenta pi-durable como otra respuesta a las mismas decisiones de diseño.
-->

# Pi
## el agente que se construye solo

<!-- 1 · Portada. arrancamos con el nombre: Pi es un coding agent open source con un núcleo mínimo. "Se construye solo" porque le pedís una capacidad nueva y lee su propio código para escribirse la extensión. La hora no es para vender Pi: es para entender qué es un harness, y Pi nos sirve de espécimen porque es chico y se puede abrir entero. -->

---

## Harnesses

<!-- 2 · (4 clicks) un LLM solo predice tokens: recibe texto y devuelve texto, no puede leer un archivo ni correr un comando. El harness (arnés) es lo que lo conecta al mundo: le da tools, memoria, contexto, un loop que repite pensar, actuar y observar, y una interfaz. Construir de abajo hacia arriba. Todos los productos de IA son un modelo más un harness, y la diferencia entre productos está en el harness, no en el modelo. -->

---

## Ejemplos de harnesses

<!-- 3 · (3 clicks) tres harnesses distintos que pueden tener el mismo modelo abajo. ChatGPT: chat web con pocas tools. Lovable: arma apps con una vista previa, sin que toques código. Un coding agent en terminal: lee y edita tus archivos y corre comandos en tu máquina. El harness que elegís define qué podés hacer. -->

---

## Agentes de código

<!-- 4 · (3 clicks) preguntar quiénes usaron alguno. Los dos grandes primero, después la carpeta de otros. No profundizar: es solo el mapa para ubicar a Pi en la próxima slide. -->

---

## ¿Qué es Pi?

<!-- 5 · (5 clicks) cuatro tools (read, write, edit, bash) y un system prompt de menos de mil tokens. Habla con cualquier proveedor. No tiene sistema de permisos: corre con los permisos de tu usuario, y si necesitás límites, lo metés en un contenedor. Las sesiones son un árbol: podés volver a cualquier mensaje, abrir una rama y explorar sin perder la historia. Mario Zechner está metido en el open source hace mucho y da muy buenas charlas. No profundizar en cada punto: solo plantarlos. -->

---

## La misma filosofía

<!-- 6 · (2 clicks) VS Code trae todo de fábrica; Vim trae lo mínimo y vos armás lo que necesitás. Claude Code es el VS Code de los agentes y Pi es el Vim. La diferencia con Vim: en Pi el agente puede leer su propio código y escribirse la extensión que le falta. -->

---

## La diferencia en números

<!-- 7 · (9 clicks) ir fila por fila. Herramientas y prompt muestran el tamaño. Skills, MCP y code mode están en los dos: no todo es ✗. Los ✗* generan la pregunta; la nota la responde: no es que Pi no lo tenga, es que no te lo impone. Cada feature de fábrica es una opinión de otro, algo que cambia entre versiones. -->

---

## Arquitectura

<!-- 8 · (4 clicks) la misma estructura de capas que el harness, con un paquete por capa, de la base hacia la superficie. pi-ai habla con cualquier proveedor. pi-agent-core es el loop genérico: sirve para cualquier agente, no solo de código, por eso va abajo de pi-coding-agent. pi-coding-agent es el producto: CLI, sesiones, extensiones y las cuatro tools. pi-tui es lo que se ve. Podés usar solo las capas que necesitás: la demo 3 usa solo las dos de abajo. -->

---

## Extensiones: la vida de una sesión

<!-- 9 · (5 clicks) primero la vista de lejos. Una extensión es un archivo TypeScript que escucha eventos. La sesión arranca, las extensiones aportan recursos, después el agent loop corre una vez por cada mensaje, y al final se cierra. Los hooks session_before_* llegan antes de cambiar de sesión, forkear, compactar o moverse en el árbol: por ejemplo, una extensión puede escribir su propio resumen al compactar. Todo sin tocar el código de Pi. -->

---

## Extensiones: el agent loop

<!-- 10 · (8 clicks) ahora abrimos el loop, un momento por paso. Llega el input; before_agent_start deja inyectar o cambiar el system prompt. Después el loop: context deja modificar los mensajes antes de cada llamada al modelo; el modelo pide una tool; en tool_call la extensión puede bloquearla o cambiarle los argumentos (así se hacen los permisos, y un plan mode es devolver { block: true } a las tools que escriben); tool_result deja cambiar lo que vuelve al modelo. El loop sigue hasta que el modelo responde sin pedir tools, y ahí agent_end. Todos los eventos se escuchan igual, con pi.on, y ctx.ui deja mostrar UI propia. -->

---

## Extensiones: API programática

<!-- 11 · (4 clicks) no son solo hooks que miran: una extensión controla el agente. Runtime: cambiar modelo, tools activas y nivel de razonamiento sin reiniciar. Registrar: un archivo TypeScript suma tools, comandos, atajos, flags, proveedores y renderers; así se arma un subagente. Mensajes: inyectarlos con tres modos de entrega, steer mientras el modelo está respondiendo, followUp cuando termina, nextTurn encolado para el próximo turno. Guardar estos tres modos: vuelven en la última slide. Sesiones: crear, forkear, navegar el árbol y compactar. -->

---

## Demo

<!-- 12 · tres demos, de la más chica a la más grande. 1: una extensión que registra /mascot; extender es barato y se lee. 2: un subagente en tres commits ya hechos, sin tipear en vivo: primero una tool delegate que abre una sesión headless y devuelve el resultado; después corre en background y el resultado vuelve como followUp; después un pipeline research, implement, review. 3: las dos capas de abajo corriendo en el navegador, con un filesystem en memoria y la página armándose en vivo, sin backend. -->

---

## ¿Y si queremos más que un coding agent?

<!-- 13 · (4 clicks) un agente como el coding agent está pensado para una persona en una terminal, y la sesión vive lo que vive el proceso. Cuatro preguntas que se salen de eso, de la más simple a la más interesante. Cada una es una slide de acá en adelante, con pi-durable como ejemplo de cómo se resuelven. -->

---

## Arquitectura de pi-durable

<!-- 14 · (5 clicks) misma estructura de capas. Abajo, pi-ai, el mismo que usa el coding agent. Arriba, el harness es todo el marco, no una caja más. Adentro, lo que ya conocen: conversaciones (la sesión), tools y extensiones. Lo nuevo: tareas con checkpoints, un entorno de ejecución separado, y un storage enchufable abajo de todo. Los clientes quedan afuera, y a diferencia del coding agent, que trae pi-tui, pi-durable no trae ninguno: el cliente lo armás vos (se engancha con watch() y submit()). Earendil dice que pi-durable no reemplaza al coding agent: es un framework para armar aplicaciones de agentes, coding agents incluidos. No usa pi-agent-core: tiene su propio Harness. -->

---

## La sesión se guarda donde quieras

<!-- 15 · (2 clicks) el harness commitea siempre lo mismo, entradas y tareas, y el backend decide dónde queda. En el navegador va IndexedDB, en un servidor SQLite, en Cloudflare un Durable Object. Un proceso es dueño del storage; otros se pueden enganchar solo para leer. JSONL guarda todo en memoria, por eso el README recomienda SQLite para corridas largas. -->

---

## Entornos de ejecución

<!-- 16 · (6 clicks) en el coding agent las tools actúan en la misma máquina que corre el agente. En pi-durable el harness está separado de donde actúan las tools: una función env() arma el entorno en cada llamada a una tool, y ese entorno puede ser un directorio local, un contenedor o una VM o sandbox remoto. Como la función corre en cada llamada, cambiar de entorno en medio de una conversación sale por construcción. La documentación describe un contenedor por conversación. Tres usos: aislar la ejecución en un sandbox sin que el agente toque tu máquina; un agente remoto que actúa sobre varios sistemas desde un solo harness; una sesión que arranca en un entorno y sigue en otro. -->

---

## Durabilidad

<!-- 17 · (6 clicks) el coding agent agrega una línea al JSONL por entrada; si el proceso muere a mitad de un turno, no hay nada que lo retome: abrís la sesión, mirás y le decís que siga. pi-durable envuelve cada efecto entre dos commits: la intención y el resultado. Al reabrir, sabe qué quedó a medias. Las fases reales: pi.tool pasa por call, execute y resultado, y queda "parked" mientras espera; pi.generation pasa por prepare, request y tools o finish, más retry y poll. Si se cae a mitad de una respuesta del modelo, el parcial queda como entrada abortada y se reintenta según la política. Las tareas se anidan: una tarea puede ser dueña de tareas hijas con política failFast (falla una, se cancelan las demás), allSettled (espera a todas) o any (alcanza con una); tareas y conversaciones forman un solo árbol de pertenencia, y un abort corre de abajo hacia arriba, de las hojas a la raíz. Ejemplo: la llamada al modelo espera las tareas de tools de su ronda con allSettled. Fuente: spec de pi-durable §5 y README. -->

---

## Multiplayer

<!-- 18 · (4 clicks) una sola conversación y varios clientes. A manda un steer: entra mientras el agente está trabajando. B manda un follow-up: queda para cuando termine. Alguien que se engancha tarde llama a watch(): recibe la vista actual y después cada commit; no se le re-reproduce la historia. Son los mismos modos de entrega que vimos en la API programática del coding agent (steer, followUp, nextTurn), ahora entre personas distintas. -->

---

## Coding agent vs pi-durable

<!-- 19 · (4 clicks) el cierre del bloque, aspecto por aspecto en el mismo orden de las slides: storage, entorno de ejecución, durabilidad, multiplayer. No es que uno sea mejor que el otro: pi-durable no reemplaza al coding agent. Son respuestas distintas a las mismas decisiones de diseño: dónde se guarda la sesión, dónde actúan las tools, qué pasa si el proceso se cae y quién puede seguir y dirigir la conversación. El coding agent elige lo simple para una persona en una terminal; pi-durable paga más complejidad para sostener lo demás. -->
