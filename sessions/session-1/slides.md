---
marp: true
theme: default
paginate: true
title: Sesión 1 — La Experiencia Vibe Coding
---

<!--
Skeleton de la presentación de la Sesión 1.
Cada slide tiene un título + una nota de oradora/orador (HTML comment).
El contenido del cuerpo de cada slide está pendiente.

Sesión de 3 horas (las demás son de 2): ~2 h de intro + teoría, ~1 h de práctica.
Reparto: Diego dicta Partes 1-3 y 5; Agus dicta la intro a Pi y la demo de la Parte 4.
-->

# Sesión 1
## La Experiencia Vibe Coding

**De Vibe Coding a Agentic Engineering** — FaMAF
Diego Piloni · con Agustín Carrasco

<!-- Slide de portada. Saludar. Anclar de entrada: 6 sesiones, un mismo proyecto que va a evolucionar con ustedes, y hoy la sesión es más larga (3 h) porque arranca todo. -->

---

## Hoy

<!-- Agenda en una slide: ~2 h de presentaciones + teoría, ~1 h de práctica (instalar el agente y arrancar a vibecodear). Avisar las 3 pausas. Avisar también que la última media hora de la práctica incluye abrir el código que escribieron — no se vayan antes. -->

---

# Parte 1 — Quiénes somos

<!-- Sección. ~10 min entre los dos. Objetivo: que sepan de dónde venimos y por qué el curso está armado como está. -->

---

## Diego

<!-- Background académico y en la industria. En qué trabajo hoy en Filadd. Cómo uso IA en el día a día — concreto, no genérico: qué le delego, qué no, cuánto de mi trabajo pasa por un coding agent. -->

---

## Agus

<!-- Idem: background académico e industria, en qué trabaja hoy, cómo usa IA en Filadd. Agus dicta las Sesiones 2, 4 y 5. -->

---

## Los profes de práctico

<!-- Presentar a la gente de Filadd que acompaña los prácticos, si hay. Que digan nombre y en qué pueden ayudar durante la hora de práctica. -->

---

# Parte 2 — De qué va el curso

<!-- Sección. ~10 min. Objetivo: fijar la expectativa correcta antes de empezar. -->

---

## Este curso es sobre experiencia, no sobre teoría

<!-- Decirlo explícito y sin vueltas: este curso está basado en nuestra experiencia propia usando coding agents todos los días, no en teoría. Para teoría hay cursos online muy buenos — muchos hechos por las mismas empresas que venden los servicios de IA. Consecuencia práctica para ellos: PREGUNTEN MUCHO. El valor de estar acá es poder preguntarle a alguien que ya se comió los problemas. -->

---

## Para teoría, estos cursos

<!-- Recomendaciones, sin detenerse mucho: DeepLearning.AI de Andrew Ng (deeplearning.ai/courses), Andrej Karpathy (su canal de YouTube), Simon Willison (simonwillison.net), "Claude Code in Action" de Anthropic. Agus agrega las suyas acá. VERIFICAR las URLs antes de clase. -->

---

## ¿Y ustedes qué recomiendan?

<!-- Preguntarle a la sala qué cursos de IA hicieron y qué recomiendan. Anotar en el pizarrón: sirve para armar resources/ del curso. 2-3 min, no más. -->

---

## Las 6 sesiones

<!-- Recorrer el arco: 1) vibe coding y fundamentos, 2) planificar y revisar (Agus), 3) tooling y skills, 4) context engineering (Agus), 5) internals del harness (Agus), 6) modelos open source y CCAD. Cada sesión agrega una capa de estructura. Y van a sentir *por qué* cada capa importa porque antes van a vivir el problema que resuelve. -->

---

## La responsabilidad es tuya, no de la IA

<!-- La idea que más nos importa que se lleven, de las dos. La responsabilidad como punto de partida sigue siendo de las personas: si algo sale mal, si el código no anda, si se filtró una clave — el responsable sos vos, no la IA. No existe "lo escribió el agente" como excusa. Todo el resto del curso es cómo estar a la altura de esa responsabilidad. -->

---

## El modelo mental: manejar a un pasante brillante

<!-- El framing que vuelve las 6 sesiones. La IA es rápida, entusiasta, produce muchísimo — y no tiene contexto ni criterio propio. Vos no aceptarías el código de un pasante sin leerlo, ni lo dejarías decidir la arquitectura. La Sesión 1 es, a propósito, el jefe ausente. Decirlo explícito: hoy vamos a hacer todo mal. -->

---

## Los 5 niveles

<!-- Vibe coding → AI-assisted → asistencia dirigida → agentic coding → agentic engineering. Una slide, sin profundidad: es un mapa, no un temario. Ubicar dónde cae cada sesión. Volvemos a esta slide en el cierre de la Sesión 4. -->

---

# Parte 3 — Quiénes son ustedes

<!-- Sección. ~30 min. Objetivo real: calibrar el nivel de la sala antes del bloque de fundamentals. -->

---

## Preséntense

<!-- Vuelta rápida: nombre, año de la carrera, si trabajan. Con 20-30 personas hay que ser breve — 15-20 segundos cada uno, cortar con simpatía si se estira. -->

---

## ¿Usan IA? ¿En qué la usan?

<!-- Lo importante de la vuelta. Levantar manos: quién usa IA para estudiar, para programar, quién usó un coding agent en terminal, quién nunca. Anotar mentalmente la distribución: define cuánto comprimir o estirar la Parte 4. Si la sala es muy avanzada, fundamentals se comprime; si es mayoría de primer año, ir más despacio con tokens y contexto. -->

---

## Pausa

<!-- Pausa corta. Preguntas y dudas de lo que vino hasta acá antes de meternos en teoría. -->

---

# Parte 4 — Fundamentals

<!-- Sección. ~35 min. Alinear el contenido con el deck del bootcamp de Filadd (Diego lo trae). Todo lo que se pueda mostrar en vivo, mostrarlo en vivo: las páginas de modelos son más convincentes que un bullet. -->

---

## IA generativa

<!-- Qué es y qué la distingue: modelos que generan contenido nuevo (texto, imagen, audio, código) en vez de clasificar o predecir un número. Ubicar los LLMs adentro de eso. Nivel de profundidad: el mínimo para que el resto del bloque tenga sentido. -->

---

## Predice el siguiente token

<!-- El mecanismo, en una idea: el modelo produce la continuación *plausible*, no la *verdadera*. Las alucinaciones no son un bug, son el mecanismo funcionando. Cuando no sabe, no se calla: completa. Esto explica la mitad de lo que van a ver hoy en la práctica. -->

---

## Los modelos

<!-- Panorama del mercado, sin ranking: Anthropic (Claude), OpenAI (GPT), Z.ai (GLM), Moonshot AI (Kimi). Que registren que hay más de dos jugadores y que los open-weights (GLM, Kimi) son parte de la conversación — la Sesión 6 vive ahí. -->

---

## En vivo: las páginas de modelos

<!-- Abrir las páginas de modelos de Anthropic y OpenAI en el navegador y leerlas juntos: qué modalidades soporta cada modelo (texto, imagen, audio), cuánta ventana de contexto, cuánto cuesta. La página de comparación de modelos de OpenAI sirve para explicar los conceptos de base todos de una. VERIFICAR las URLs el día anterior — cambian seguido. -->

---

## Tokens

<!-- El modelo no ve caracteres, ve tokens (pedazos de texto). Por eso se equivoca contando letras. Ejemplo en vivo con un tokenizer si hay tiempo. Los tokens son la unidad de todo: de lo que entra, de lo que sale y de lo que se paga. -->

---

## No solo texto: imágenes y audio

<!-- Multimodalidad: las imágenes y el audio también se convierten en tokens. Por eso una captura de pantalla "cuesta" y por eso podés pegarle una imagen a un agente y que la entienda. Volver a la página de modelos: la columna de modalidades ahora significa algo. -->

---

## Cuánto cuesta: por token vs suscripción

<!-- Los dos modelos de precio y cuándo conviene cada uno. Por token (API): pagás input + output, el output es más caro, escala con el uso. Suscripción: pagás fijo por mes con límites de uso. Para lo que vamos a hacer en el curso, la suscripción suele ser más previsible. Mostrar la página de pricing. -->

---

## Ventana de contexto

<!-- El concepto más importante del bloque, y hay que tenerlo presente TODO el curso. Es la memoria de trabajo del modelo: todo lo que el agente "sabe" de tu proyecto está ahí adentro, o no está. Nada persiste entre conversaciones — cada sesión arranca en blanco. Esta idea es la semilla de la Sesión 4. -->

---

## Context rot: la calidad se degrada antes de lo que pensás

<!-- No es un límite duro: a medida que se llena la ventana de contexto la calidad se degrada, bastante antes de que el harness te avise o de que se acabe el espacio. Consecuencia práctica: sesiones cortas, contexto limpio, empezar de nuevo cuando la conversación se ensució. Hoy en la práctica van a poder ver cuánto contexto tienen cargado. -->

---

## Chat vs agente

<!-- La diferencia que ordena todo el curso. Un chat te devuelve texto y vos ejecutás. Un agente ejecuta: lee archivos, corre comandos, edita código, mira el resultado y vuelve a intentar. Es un loop, no una respuesta. -->

---

## Una línea de tiempo corta

<!-- Cómo llegamos hasta acá: autocompletado (tab completion) con Copilot → chat al costado del editor → Cursor y el editor con IA adentro → coding agents en terminal (Claude Code, Codex, Pi). En pocos años, de "completame la línea" a "resolvé esta tarea". Sirve para que ubiquen lo que ya usaban. -->

---

## Entonces: ¿qué es un coding agent?

<!-- Cerrar el bloque con la definición: un LLM que toma acciones sobre un repo a través de tools, no que sugiere texto. El loop: recibe una tarea, decide qué tool usar, la ejecuta, ve el resultado, sigue. -->

---

## Tres palabras: LLM, tool, harness

<!-- Vocabulario que reusamos todo el curso. LLM: el modelo, predice tokens, solo no hace nada. Tool: una función que el modelo puede invocar (leer archivo, correr comando, editar código) — es lo que convierte sugerencias en acciones. Harness: el programa que envuelve al modelo (arma el contexto, ejecuta tools, pide permisos). Pi es un harness. Decir explícito: las tres se abren en profundidad en la Sesión 3, hoy solo necesitamos los nombres. -->

---

## Hay muchos, y en muchos lugares

<!-- Catálogo por entorno, para que sepan que esto es un ecosistema y no un producto: web (Lovable, v0, Bolt, Claude Code web), desktop (Claude Code desktop), terminal (Claude Code, Codex, Pi, opencode). En el curso vamos a usar Pi: minimalista, corre en la terminal, y lo que aprendan se traslada al resto. -->

---

## Pi

<!-- Agus. Intro breve: qué es Pi, por qué lo elegimos para el curso, cómo se instala y cómo se arranca (mandarlos a la quickstart oficial: pi.dev/docs/latest/quickstart). -->

---

## Demo: el loop en vivo

<!-- Agus. Abrir Pi, un prompt simple, y narrar el loop en voz alta mientras pasa: "acá llamó a read, eso es una tool; ahora corrió un comando; el resultado volvió al contexto del modelo". Una pasada concreta vale más que cualquier diagrama. ~5 min. -->

---

## Pausa

<!-- Pausa. Preguntas del bloque de fundamentals. Acá suelen aparecer las preguntas de teoría profunda (attention, entrenamiento, embeddings): contestarlas en la pausa, no en la slide. -->

---

# Parte 5 — Vibecoding

<!-- Sección. ~35 min, teoría + demo. Ojo con el tono: presentar bien el vibecoding ANTES de criticarlo. Si armamos un espantapájaros, la crítica no vale nada. -->

---

## Vibecoding: programar sin pensar que el código existe

<!-- La definición que usamos. No es "programar mal": es programar en una capa de abstracción donde el código, literalmente, no es algo que mirás. Describís lo que querés, mirás si funciona, iterás. El código está ahí, pero no es tu material de trabajo. -->

---

## Cuatro miradas

<!-- Las 4 referencias del programa, cortas: 1) Karpathy acuñando el término (lo acuñó para proyectos de fin de semana, no para producción). 2) Naval: vibecoding como videojuego — el loop es adictivo y eso es parte de por qué funciona. 3) Chicos vibecodeando con Lovable: como puerta de entrada a aprender a programar. 4) Vibe coding in prod: qué pasa cuando lo llevás a producción. URLs en COURSE_PROGRAM.md. -->

---

## Vibe coding no es un insulto

<!-- Es una on-ramp real: rápida, divertida, habilitante. Para prototipos, scripts de una vez y código desechable, funciona y está bien. Nosotros lo usamos. Decirlo con honestidad antes de la crítica. -->

---

## Demo: vibecodeando en vivo

<!-- Demo propia: arrancar algo de cero hablándole al agente, sin abrir un archivo, y que la sala vea la velocidad. Que se vea lo bueno (aparece algo que funciona en minutos) y, si sale solo, lo malo (una decisión que el agente tomó y nadie pidió). ~8 min. -->

---

## Entonces, ¿cuál es el problema?

<!-- El giro. El software profesional exige accountability: seguridad, mantenibilidad, correctitud. Ahí el vibecoding se cae, y no por culpa del modelo. Las próximas 3 slides son las formas concretas en que se cae — y en la práctica de hoy las van a ver en su propio código. -->

---

## Deuda de comprensión

<!-- Shippeaste código que no podés explicar. El interés se acumula: cada cambio futuro cuesta más, porque para cambiarlo primero hay que entenderlo, y nunca lo entendiste. Se vuelve a nombrar en la Sesión 2 como el cuello de botella de verificación. -->

---

## La ilusión de productividad

<!-- METR: devs experimentados 19% MÁS LENTOS con IA, sintiéndose 20% más rápidos. CodeRabbit: 1.7x más issues graves en código co-escrito con IA. Presentarlos como dato, no como sermón — y avisar que en la práctica de hoy van a poder chequear el número contra su propia sensación. -->

---

## El problema del 80%

<!-- El primer 80% llega en minutos. El 20% que queda es donde vive el esfuerzo real — y es justo la parte donde hace falta entender el código. Enlazar con la responsabilidad: ese 20% es tuyo. -->

---

## Pausa

<!-- Última pausa antes de la práctica. Dudas. Aprovechar para pedir que abran una terminal y se sienten cerca de alguien que ya tenga Pi funcionando. -->

---

# Práctica (1 hora)

<!-- Transición al bloque práctico. Objetivo: Pi instalado y funcionando, y arrancar a vibecodear. Recorremos la sala con los profes de práctico. -->

---

## Elegí tu proyecto

<!-- Proyecto propio o uno de los briefs por defecto (ver exercise/README.md). Requisito: que corra en el navegador, que sea alcanzable como prototipo y con suficiente sustancia para aguantar las 6 sesiones. Es el MISMO proyecto todo el curso — elegir algo que les dé ganas de seguir. -->

---

## Las 4 reglas de hoy

<!-- Leerlas en voz alta, están en el ejercicio: 1) hablale al agente, describí lo que querés. 2) NO abras los archivos, no leas los diffs, no espíes en el IDE. 3) Si algo se rompe, describí el síntoma, no diagnostiques. 4) Juzgá solo por el output: ¿se ve bien? ¿corre? -->

---

## Sí, es raro a propósito

<!-- Esperar resistencia de los más experimentados — es buena señal. Pedirles que jueguen el juego los 45 minutos de construcción. El pago es el reality check del final: sin la experiencia vivida, la lección de las próximas sesiones es una opinión nuestra. -->

---

## Los pasos

<!-- Ver exercise/README.md. No leerlos desde la slide: dejarlos leer el ejercicio y arrancar. Los primeros dos pasos son setup (instalar Pi, crear el repo); recién el paso 3 es vibecodear. -->

---

## Lo que vas a sentir

<!-- Aviso honesto de la curva, ajustado a que hoy son 15 minutos de construcción y no dos horas: euforia primero, fricción después. La frustración grande aparece a la hora y media — o sea, esta semana en casa. Avisarles que eso también es parte del ejercicio y que lo traigan a la Sesión 2. -->

---

## Ahora sí: abrí los archivos

<!-- Últimos 10-15 min de la práctica. Unos minutos en silencio para leer lo que shippearon, con la checklist del ejercicio. No comentar nada mientras leen: dejar que pase la reacción. -->

---

## ¿Qué encontraron?

<!-- Recolectar de la sala, no dar clase. Anotar en el pizarrón. Lo esperable: cero tests, secrets hardcodeados, input sin validar, código muerto, lógica duplicada, archivos que no sabían que existían. Si aparece UN agujero de seguridad concreto, mostrarlo (pedir permiso ANTES, no en el momento): el punto no es OWASP, es "el agente escribió esto y ninguno de los dos lo vio". -->

---

# Cierre

<!-- Sección final. ~5 min. -->

---

## Lo que hicimos hoy

<!-- Cerramos el arco del día: entendieron cómo funciona la herramienta por abajo, la instalaron, y construyeron algo sin leer una línea. Eso último es el punto de partida del curso, no el destino. -->

---

## ¿Lo subirías a producción? ¿Lo mantendrías un año?

<!-- La pregunta de cierre. NO resolverla. La Sesión 2 abre exactamente acá. -->

---

## Para la próxima

<!-- Tarea: seguir vibecodeando el proyecto durante la semana, sin cambiar las reglas. Anotar los momentos en que sintieron que perdieron el control — Agus abre la Sesión 2 con eso. -->

---

## Próxima sesión: Planificar y Revisar (Agus)

<!-- Foreshadow: la primera capa de estructura. Plan antes de ejecutar, review antes de aceptar, tests como guardrails, git como red de seguridad. Traigan el mismo proyecto. -->

---

## Gracias

<!-- Cierre. Dejar las referencias y quedarse para dudas de setup — siempre queda gente trabada con la instalación. -->
