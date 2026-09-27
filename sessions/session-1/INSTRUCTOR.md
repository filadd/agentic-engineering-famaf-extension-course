# Sesión 1 — Vibe coding (notas para el instructor)

> Responsable: Diego, con Agus en la intro y la demo de Pi. Los materiales que ve el aula viven al lado de este archivo (slides.md, exercise/README.md) y están en español. Estas notas son para el instructor.

> **Slides finales:** [Sesión 1 — Ingeniería Agéntica en Claude Design](https://claude.ai/design/p/22345472-cddd-4d9a-8f2a-2917312d19b6?file=Sesion+1+-+Ingenieria+Agentica.dc.html&via=share). `slides.md` es el esqueleto con las notas de oradora/orador.

## Objetivo de la sesión

Que los estudiantes se vayan fundamentos sobre LLMS, qué es el Vibecoding y con Pi andando sobre un proyecto propio**, y habiendo construido algo sin leer una sola línea.

La sesión termina a propósito sin entender el código que se escribió, sin una solución. En las siguientes sesiones vamos a aprender prácticas que mejoran esta situación.

## Audiencia y supuestos

- **Esta sesión dura 3 horas; todas las demás duran 2.** La hora extra es por las presentaciones y porque vamos a setupear el entorno de trabajo. **Confirmar que la reserva del aula lo permita.**
- **Reparto: ~2 h de intro + teoría, ~1 h de práctica.**
- **Es la primera sesión**: no hay recap ni vocabulario compartido todavía. Todo lo que las sesiones siguientes dan por sentado (tool, harness, agente, contexto, tokens) se planta acá.
- **Proyecto**: cada estudiante trae su propia idea o toma un brief por defecto (ver exercise/README.md). Cualquiera de las dos sirve; el ejercicio está escrito de forma genérica. **Tiene que correr en el navegador**: eso mantiene el reality check y hace que las sesiones siguientes se puedan demostrar sin setup extra.

## El encuadre que sostiene todo el curso

**"Gestionar a un pasante inteligente."** Presentarlo acá y nombrarlo explícitamente, porque cada sesión posterior es otra capa de habilidad de gestión.


**La idea complementaria, y la que Diego más quiere que se lleven: la responsabilidad es de la persona.** Si se rompe, si se filtra una key, si el código es imposible de mantener, el responsable sos vos, no la IA. "Lo escribió el agente" no es una excusa válida. Cada sesión posterior es una forma de estar a la altura de eso.

## Plan tema por tema

### Parte 1 — Quiénes somos (~10 min) — abre la sesión

Diego y Agus: formación académica, experiencia en la industria, qué hacemos ahora, **y concretamente cómo usamos IA en Filadd**. Lo concreto le gana a lo genérico: qué delegamos, qué no, cuánto del día pasa por un agente de código. Presentar a los ayudantes de Filadd si hay alguno en el aula, y decir con qué pueden ayudar durante la hora de práctica.

### Parte 2 — Qué es este curso (~10 min)

El bloque de expectativas. Cinco movidas:

1. **Este curso está armado sobre nuestra propia experiencia, no sobre teoría.** Para teoría hay cursos online, muchos hechos por las mismas empresas que venden los servicios de IA. La idea es que *pregunten mucho*: el valor de estar en el aula es el acceso a gente que ya está usando Agentes y los problemas que esto les ha traido.
2. **Recomendar esos cursos** DeepLearning.AI (Andrew Ng), Karpathy, Simon Willison, "Claude Code in Action" (Anthropic), más las elecciones de Agus.
3. **Las seis sesiones en una slide, como dos bloques, y decirlo.** Cuatro sesiones base (*¿cómo trabajo bien con esta cosa?*, que cierra la Sesión 4) más dos avanzadas (*¿de qué está hecha esta cosa, y qué pasa si le cambio las partes?*, que cierra la Sesión 6).
4. **Anunciar la hora de demos de la Sesión 5**, en la slide inmediatamente posterior: el proyecto que arrancan hoy se muestra al aula en la anteúltima clase. Decir lo que no es: no hay entregable, no hay nota, es voluntario, 5-7 minutos cada uno, y lo que importa es *cómo* lo construyeron. Anunciarlo ahora es el punto: cambia cómo trabajan durante seis semanas.
5. **Las dos ideas que sostienen el curso**: **la responsabilidad es tuya** y **gestionar a un pasante inteligente**. Cerrar el bloque con el espectro de cinco niveles como mapa (vibe coding → AI-assisted → directed → agentic coding → agentic engineering).

### Parte 3 — Quiénes son ellos (~30 min)

Ronda rápida (1 min por persona): Nombre, edad, si trabajan, donde y que hacen. Si estudian en que año estan y que proyecto les gustaría construir; Usan IA? Para qué? Cortar con amabilidad si vemos que se excede el tiempo.

Lo que importa: **¿usan IA, y para qué?** A mano alzada: para estudiar, para programar, si alguna vez usaron un agente de código en la terminal, si nunca usaron ninguno.

Después, un break corto.

### Parte 4 — Fundamentos (~35 min)

Todo lo que se pueda mostrar en vivo, mostrarlo en vivo: las páginas de modelos convencen más que los bullets.

#### 4.a — De dónde viene esto (~5 min)

El arranque histórico, y con esta audiencia se gana sus cinco minutos porque reencuadra el hype como la llegada de algo viejo.

- **Turing, 1950.** El test de Turing tiene 75 años: https://en.wikipedia.org/wiki/Turing_test.
- **Lo que cambió es que la teoría se volvió aplicable**: el cómputo necesario para entrenar grandes modelos de lenguaje hoy existe, y en 2017 el [paper de Transformers](https://arxiv.org/abs/1706.03762) mostró una arquitectura que genera texto a partir de la secuencia previa.
- **GPT = Generative Pre-trained Transformer.** Decir qué significan las tres letras; [El video de 3Blue1Brown](https://www.youtube.com/watch?v=wjZofJX0v4M) es el material para quien quiera la versión visual.
- **Y el ejemplo que hace aterrizar la predicción del próximo token**: `Messi ...` → el modelo completa `es un excelente jugador de fútbol`. Pero un periodista deportivo en una mala década completa *"no canta el himno"*, y [Casciari](https://hernancasciari.com/blog/messi_es_un_perro/) completa *"es un perro"*. **Mismo prefijo, tres continuaciones posibles distintas, ninguna es "la verdad".**

#### 4.b — Cómo funciona (~25 min)

- **IA generativa**: modelos que generan contenido. Ubicar a los LLM adentro de eso.
- **Predicción del próximo token**: produce la continuación *más probable*.
- Las *alucinaciones* de IA son resultados incorrectos o engañosos que generan los modelos de IA. Estos errores pueden deberse a diversos factores, como datos de entrenamiento insuficientes, suposiciones incorrectas realizadas por el modelo o sesgos en los datos usados para entrenar el modelo.  https://cloud.google.com/discover/what-are-ai-hallucinations?hl=es-419
- **Los modelos**: Anthropic (Claude), OpenAI (GPT), Z.ai (GLM), Moonshot AI (Kimi). Sin ranking: el punto es que hay más de dos jugadores y que los modelos open-weights son parte de la conversación (la Sesión 6 vive ahí).
- **En vivo: las páginas de modelos.** Abrir las de Anthropic y OpenAI y leerlas juntos: modalidades, ventana de contexto, precio. La página de comparación de modelos de OpenAI es la forma más eficiente de explicar todos los conceptos base de una sola pasada. **Verificar las URLs el día anterior**; se mueven.
- **Tokens**: el modelo ve tokens, no caracteres; de ahí las fallas contando letras. El token es la unidad de todo: entrada, salida y precio.
- **Multimodalidad**: las imágenes y el audio también se vuelven tokens. Por eso una captura de pantalla cuesta, y por eso podés pegarle una imagen a un agente.
- **Precios: por token vs suscripción.** Por token (API): entrada + salida, la salida cuesta más, escala con el uso. Suscripción: fijo, con límites de uso. Para este curso la suscripción es más previsible. Mostrar la página de precios.
- **Ventana de contexto**: el concepto más importante del bloque, y queda presente todo el curso. Memoria de trabajo finita: todo lo que el agente "sabe" de tu proyecto está ahí adentro, o no está. Nada persiste entre conversaciones. Es la semilla de la Sesión 4.
- **Context rot**: la calidad se degrada a medida que la ventana se llena, bastante antes de que el harness avise o de que la conversación llegue al límite. Consecuencia práctica: sesiones cortas, contexto limpio, empezar de nuevo cuando la conversación está sucia.
- **Chat vs agente**: un chat devuelve texto y vos ejecutás; un agente ejecuta: lee archivos, corre comandos, edita código, mira el resultado, vuelve a intentar. Es un loop, no una respuesta.
- **Una timeline corta**: autocompletado (Copilot) → chat al lado del editor → Cursor → agentes de código en la terminal (Claude Code, Codex, Pi). Les permite ubicar lo que ya venían usando.
- **Entonces: ¿qué es un agente de código?** Un LLM que toma acciones sobre un repo a través de herramientas.
- **Tres palabras: LLM, tool, harness.** El vocabulario que reusamos todo el curso. **Pi es un harness.** Decir explícitamente: las tres se abren en la Sesión 3, hoy solo necesitamos los nombres.
- **El catálogo por entorno**: web (Lovable, v0, Bolt, Claude Code web), escritorio (Claude Code desktop), terminal (Claude Code, Codex, Pi, opencode). Y después: en este curso usamos Pi.
- **"No tercericen el aprendizaje."** [La frase de Addy Osmani](https://x.com/addyosmani/status/2056078124346228860), y la que queda colgada sobre todo el curso: hace juego exacto con *la responsabilidad es tuya*, que es la idea de la Parte 2. Decir la versión práctica: explorar, apretar todos los botones, aprender por prueba y error, leer, y dejar tiempo para el tipo de descanso en el que uno realmente piensa. **Plantar la frase y parar ahí**: la atrofia de habilidades es material de cierre de la Sesión 4, y gastarlo hoy sería gastar el final del arco base en la primera hora.
- **Intro a Pi + demo en vivo — Agus.** Qué es Pi, por qué lo elegimos, cómo se instala (apuntar al quickstart oficial, no dictar comandos). Después un prompt, narrando el loop en voz alta mientras pasa: "eso fue una tool call; el resultado volvió al contexto del modelo". Una pasada concreta le gana a un diagrama. ~5 min.

**Después, break.**

### Parte 5 — Vibecoding (~35 min, teoría + demo)

- **La definición que usa Diego: "programar sin pensar que el código existe."** No es "programar mal": es programar en una capa donde el código no es el material con el que trabajás.
- **Cuatro miradas** (las URLs están en `COURSE_PROGRAM.md`): Karpathy acuñando el término (para proyectos de fin de semana, no para producción); Naval sobre el vibecoding como videojuego (el loop es adictivo, y eso es parte de por qué funciona); chicos vibecodeando con Lovable (como puerta de entrada a aprender a programar); vibe coding en producción (qué pasa cuando lo llevás a producción).
- **Vibe coding no es "algo malo".** Es una rampa de entrada real: rápida, divertida, habilitante. Para prototipos y código descartable funciona, y lo usamos.
- **Demo en vivo, ~5 min**: construir algo desde cero hablándole al agente, sin abrir un solo archivo. Que el aula vea la velocidad — y, si sale naturalmente, alguna decisión que el agente tomó sin que nadie se la pidiera.
- **Mostrar juegos vibecodeados en eventos de PostHog**: https://filadd.github.io/posthog-cordoba/event-0/
- **Y después el giro**: el software profesional exige responsabilidad. Las tres formas concretas en que el vibecoding se queda corto, y van a ver las tres en su propio código dentro de una hora:
  - **Deuda de comprensión**: shippeaste código que no podés explicar. El interés se acumula. Se vuelve a nombrar en la Sesión 2 como el cuello de botella de verificación.


### Práctica (~30 min)

Tres pasos en `exercise/README.md`. Los dos primeros son setup, y ese es el punto del bloque: **nadie debería irse del aula sin Pi funcionando.**

1. Instalar Pi (~8): el ejercicio linkea al quickstart oficial en vez de hardcodear un comando.
2. Crear el proyecto + `git init` + repo en GitHub (~4).
3. Vibe codear, con las cuatro reglas (~15).

El instructor y los ayudantes caminan el aula. Tu trabajo acá **no** es ayudarlos a escribir buen código; es:

- Desbloquear instalaciones rápido. Esto es fricción real, no pedagogía.
- **Hacer cumplir la regla de no leer**, con suavidad, del paso 3 en adelante. Los estudiantes se van al editor por costumbre.
- **Decir los comandos de higiene de contexto en voz alta mientras caminás**: una mención, no un bloque, y es donde se cobra la slide de *context rot* de la Parte 4 — ahí les prometimos que hoy iban a ver su propio contexto. Cuatro comandos de Pi, los cuatro están en el ejercicio: `/session` (tokens y costo hasta ahora), `/new` (contexto limpio para una tarea no relacionada), `/compact` (resumir la parte vieja de una tarea larga: automático cuando Pi se queda sin lugar, manual antes de eso, y acepta instrucciones), `/tree` (volver a un punto anterior y seguir desde ahí). **El que hay que empujar es `/tree`**: el tercer intento fallido de arreglo es el momento de rebobinar, no de seguir cavando — cada intento fallido sigue en el contexto empeorando el siguiente. Es el primer antídoto a los errores en cascada que ofrece el curso y cuesta un comando. La profundidad es de la Sesión 5; hoy solo necesitan los cuatro nombres. Vale decir explícitamente que nada de esto rompe la regla 2: son comandos del agente, no el código.
- **Tomar notas para el reality check.** Caminar con una lista: quién no tiene tests, quién tiene un secreto hardcodeado, quién tiene tres copias de la misma función. Los ejemplos con nombre y apellido del propio aula le ganan a las slides genéricas — **pedir permiso antes de mostrar el código de alguien.**

**Las cuatro reglas** (leerlas en voz alta, están en una slide y en el ejercicio):

1. Hablale al agente. Describí lo que querés.
2. **No abras los archivos.** Ni en el IDE, ni con `cat`, ni con `git diff`.
3. Si algo se rompe, describí el síntoma, no lo diagnostiques.
4. Juzgá solo por la salida: ¿se ve bien? ¿corre?

Esperar resistencia de los estudiantes más experimentados: es buena señal.

### Reality check (~12 min, cierra la práctica)

1. **"Ahora abran los archivos."** Unos minutos en silencio con el checklist del paso 4 del ejercicio. Nada de comentarios mientras leen: que la reacción pase.
2. **Juntar del aula**, no dar clase. Anotarlo en el pizarrón: sin tests, secretos hardcodeados, input sin validar, código muerto, lógica duplicada, archivos que no sabían que existían.
3. **Si aparece un agujero de seguridad concreto, mostrarlo** (con el permiso pedido *de antemano*). El punto no es OWASP: es *"esto lo produjo el agente y ninguno de los dos se dio cuenta."* Tener un fallback del proyecto de demo propio por si los proyectos del aula salen sorprendentemente limpios.
4. **Cerrar con la pregunta, no con una respuesta**: *"¿Lo subirías a producción? ¿Lo mantendrías por un año?"* No resolverlo. La Sesión 2 abre ahí.

Ojo que este bloque es mucho más corto que el diseño original de 30 minutos. Es una primera pasada, no el debrief: 15 minutos de construir no producen el mismo desastre que dos horas. La tarea ("seguí vibe codeando con las mismas reglas hasta que se te vaya de las manos") es lo que genera el material que Agus necesita.

## Timing de la sesión (~3 h)

| Bloque | Tiempo |
|---|---|
| Parte 1: quiénes somos | 10 min |
| Parte 2: qué es este curso | 10 min |
| Parte 3: quiénes son ellos + calibración | 30 min |
| Parte 4: fundamentos (páginas en vivo + demo de Pi por Agus) | 35 min |
| Parte 5: vibecoding (teoría + demo + la crítica) | 35 min |
| **Práctica: instalar Pi → vibe codear** | **~27 min** |
| Reality check: abrir los archivos + juntar | 12 min |
| Cierre: ¿lo subirías? + qué viene | 5 min |
| 3 breaks cortos | ~15 min |

Suma ~3 h, así que está justo pero debería entrar. **Si el aula se estira, cortar de la Parte 4 (comprimir si el aula es avanzada). Proteger la hora de práctica y el reality check**: si los estudiantes se van sin Pi instalado, la Sesión 2 arranca rota.

## Puentes entre sesiones

- **Tool / harness / LLM** → Sesión 3 (Diego). El vocabulario se planta hoy y se abre allá. La redacción que quede en clase tiene que ser idéntica en las slides de la Sesión 3.
- **Ventana de contexto + context rot** → Sesión 4 (Agus). Hoy es una restricción a respetar; allá pasa a ser algo que se diseña.
- **Higiene de contexto (`/session`, `/new`, `/compact`, `/tree`)** → Sesión 5 (Agus). Hoy se nombran en la práctica como cuatro comandos para usar; la sesión de harness explica qué le hace realmente la compactación al transcript. Hoy es operación, no mecanismo.
- **El debrief del reality check** → el recap de la Sesión 2 (Agus). `sessions/session-2/slides.md` ya abre con *"¿Qué pasó con su código durante la semana? ¿Alguien lo abrió?"*: ahí es donde ocurre el debrief real ahora, así que **coordinar con Agus antes de la clase**: contarle en qué estado quedaron realmente los estudiantes, y que el reality check en clase de hoy fueron solo ~12 minutos.
- **Deuda de comprensión** → el cuello de botella de verificación de la Sesión 2. El mismo problema, nombrado dos veces.
- **El espectro** → ⚠️ **ya no lo retoma nada.** Antes volvía en el cierre de la Sesión 6, y ese cierre ahora son quince minutos de retrospectiva abierta sin contenido dictado. La slide se sigue ganando su lugar acá como mapa; simplemente no tiene callback. **Merece una decisión**: dejarlo como mapa de una sola vez, o darle una casa en otro lado. (La Sesión 4 también lo retomaba; eso era un resto de cuando el curso tenía 4 sesiones y la Sesión 4 era el final.)
- **Modelos open-weights (GLM, Kimi) nombrados en fundamentos** → Sesión 6. Solo plantar los nombres.
- **✅ Desajuste de herramientas resuelto**: la Sesión 2 ahora corre sobre Pi. Le suma `@plannotator/pi-extension` (modo plan basado en archivos + `/plannotator-review`): una extensión, sin un segundo harness. No hay nada que advertirles a los estudiantes; **Pi es la herramienta para las seis sesiones, punto.**
- **El harness restringe el toolset** → la Sesión 2 lo muestra concretamente (el modo planning solo permite leer y buscar) y se lo pasa a la Sesión 3 como permisos y puntos de extensión. Vale tenerlo presente cuando se planta "harness" como vocabulario en la Parte 4.

## Herramientas/recursos referenciados

- [Pi](https://pi.dev/docs/latest/quickstart) — el agente de código de todo el curso. El quickstart cubre la instalación y `/login`; [código fuente](https://github.com/earendil-works/pi).
- [Pi — sessions](https://pi.dev/docs/latest/sessions) y [compaction](https://pi.dev/docs/latest/compaction) — la referencia detrás de los cuatro comandos de higiene. La autocompactación se dispara cuando `contextTokens > contextWindow - reserveTokens` (16384 por defecto) y conserva los ~20k tokens más recientes; `/tree` es navegación de ramas, y Pi ofrece resumir la rama que dejás.
- Páginas de modelos/precios de Anthropic, OpenAI, Z.ai y Moonshot AI — se abren en vivo en la Parte 4. **Verificar antes de la clase.**
- La página de comparación de modelos de OpenAI — se usa para explicar los conceptos base de una sola pasada.
- Las cuatro referencias de vibecoding — ver `COURSE_PROGRAM.md` "The Spectrum": Karpathy (origen), Naval (como videojuego), chicos vibecodeando con Lovable, vibe coding en producción.
- [**Sebastian Raschka: *The Components of a Coding Agent***](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) — **la referencia detrás del "qué es un agente de código" y las tres palabras de la Parte 4.** Traza exactamente las líneas que esta sesión planta: LLM (predicción del próximo token) vs. modelo de razonamiento vs. *agente* (un loop de control que decide qué inspeccionar, qué herramientas llamar y cuándo parar) vs. *harness* (el andamiaje que administra contexto, herramientas y ejecución). Y enuncia la tesis de esta sesión más fuerte de lo que la enunciamos nosotros: el harness suele ser lo que hace que un modelo funcione mejor que otro, porque *"gran parte de la aparente calidad del modelo es en realidad calidad del contexto"*. **Preparación del instructor, no contenido de clase**: son 2.500-3.000 palabras y sus seis componentes van bastante más allá del vocabulario de hoy — contexto del repo, forma del prompt/caché, herramientas, reducción de contexto, memoria de sesión, subagentes. Sirve doblemente como mapa de lo que viene: los componentes 4-5 son los comandos de higiene y la compactación de la Sesión 5, y el 6 es el de la Sesión 4. Buena lectura opcional para pasarle a los estudiantes avanzados que pidan más después de la Parte 4.
- Cursos recomendados: [DeepLearning.AI](https://www.deeplearning.ai/courses/), el canal de YouTube de Karpathy, [Simon Willison](https://simonwillison.net/), "Claude Code in Action" de Anthropic.
- Briefs de proyecto por defecto — ver exercise/README.md.

## Pendientes (para futuras iteraciones)

- **Probar la instalación de Pi en una máquina limpia antes de la clase, siguiendo el quickstart oficial.** Hay dos nombres de paquete circulando en npm (`@earendil-works/…` y `@mariozechner/…`), y por eso el ejercicio apunta a la documentación en vez de a un comando hardcodeado. Confirmar qué necesita de node/npm, y cómo resuelve `/login` con 20-30 personas a la vez.
- **Verificar las URLs en vivo** (páginas de modelos + precios de Anthropic/OpenAI/Z.ai/Moonshot, la página de comparación de OpenAI, "Claude Code in Action") el día anterior. Se mueven.
- **Cada estudiante usa su propia cuenta para `/login`.**
- **Confirmar el slot de 3 horas** para esta sesión en particular, ya que el resto son de 2 h.