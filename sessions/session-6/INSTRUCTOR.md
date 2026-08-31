# Sesión 6 — Modelos open source y CCAD (Notas para el instructor)

> 🔴 **TO REVIEW** — este archivo lo generó Claude y **Diego todavía no lo revisó**.
> Tratar cada afirmación, cada timing y cada decisión pedagógica como una propuesta, no como algo cerrado.
>
> **Excepciones, y estas sí son decisiones tomadas:**
> 1. **Al CCAD se llega por un gateway LiteLLM**, y Pi se apunta ahí con un provider propio en `~/.pi/agent/models.json`. Decisión de Diego. **Los internals de ese servidor —scheduler, SSH, cómo se orquesta la inferencia para muchos usuarios— los cuenta Ale**, como parte de qué es el CCAD, pero sin entrar en mucho detalle.
> 2. **La práctica tiene dos vías, y las dos son conectarse a un endpoint**: el gateway del CCAD para todos (Vía A) y **la GPU de Agus, servida en el aula**, como pista avanzada opcional (Vía B). Nadie instala un runtime: las dos vías son una entrada más en `models.json`. Decisión de Diego.
> 3. **Hay dos modelos en juego y el material tiene que funcionar con cualquiera de los dos.** **Gemma 4 26B** es lo que el gateway sirve hoy. El segundo es un **Qwen**, y no es un pedido a ciegas: Ale nos dio acceso al CCAD y **probamos Qwen3.6 ahí, andando** — hoy está bajado. Lo que le vamos a pedir para el curso es que **vuelva a levantarlo**, ahora en **Qwen3.8-27B**, que es la versión que existe hoy. Escribir todo contra "el modelo de hoy" y tener los dos números a mano. Si están los dos, mejor — abajo se explica por qué la comparación entre ellos es contenido y no lujo.
> 4. **El slot de Ale Silva son siete puntos**: qué es el CCAD, qué hardware tiene, cómo accede un estudiante de la UNC para correr un LLM ahí, cómo se corre un LLM ahí, **LiteLLM** (el gateway desde adentro), **vLLM** (qué corre atrás) y para qué se usa el HPC en la UNC. Decisión de Diego.

> 🟢 **La forma de la sesión está decidida y son 2 h 30** (las otras son de 2 h; la Sesión 1 es de 3, así que hay precedente). Tres bloques grandes:
>
> | | |
> |---|---|
> | **Ale Silva — el CCAD** | **30 min** |
> | **Modelos de pesos abiertos — Diego** | **30 min** |
> | **Práctica — conectarse al CCAD + pista avanzada** | **60 min** |
>
> Los 30 minutos restantes son recap, pausa, puesta en común y el cierre del curso. La tabla completa está más abajo.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo que **el modelo es un componente reemplazable** — habiéndolo reemplazado ellos, en su propio repo, con su propio `AGENTS.md`, contra un modelo de pesos abiertos corriendo en hardware de la UNC.

La frase de la sesión:

> *"Cambiás el modelo editando cinco líneas de JSON, y nada de lo que construiste en cinco sesiones se cae."*

## Por qué esta sesión existe, y por qué va al final

Las sesiones 1 a 5 usan un modelo hosteado detrás de una API. Es un default sensato y también un supuesto que nadie examinó. Esta sesión lo rompe:

- **Los pesos abiertos son una opción real**, con tradeoffs reales: privacidad, estructura de costos, uso offline, reproducibilidad para investigación — contra capacidad, confiabilidad en tool calling y carga operativa.
- **El CCAD existe y estos estudiantes lo pueden usar.** La mayoría de la sala no sabe que la UNC opera un centro de cómputo de alto desempeño al que se puede pedir cuenta.

Va al final porque aterriza mejor después de la Sesión 5 — pero **no depende de ella**.

> ✅ **La logística se resuelve con un gateway, y es lo que hace posible dar esta clase en dos horas.** El CCAD se expone como un gateway **LiteLLM** con endpoint compatible con OpenAI. Pi habla con eso nativamente: se agrega un provider en `~/.pi/agent/models.json`, se abre `/model`, se elige el modelo. Eso es todo el setup de la práctica.

**Y la lección se fortalece, no se debilita.** Apuntar un harness escrito a mano a otro modelo prueba que el harness es agnóstico del modelo. Apuntar **Pi** a otro modelo prueba algo que al curso le importa mucho más: **el `AGENTS.md`, los skills, el plan mode, el flujo de review — todo lo de las Sesiones 2 y 3 — sigue funcionando cuando le cambiás el modelo abajo.** Esa es la tesis de cierre del curso, hecha carne, en la herramienta que ya conocen.

## La decisión de herramientas

Sigue **Pi**, sin instalar nada nuevo. Lo único que se agrega es un archivo de configuración.

| Vía | Quién la hace | Qué necesita | Qué enseña |
|---|---|---|---|
| **A — el gateway del CCAD** | todos | una entrada en `models.json` y una API key | el modelo es un componente: el swap es una línea |
| **B — la GPU de Agus, en el aula** | opcional | otra entrada en `models.json`, apuntada a la IP de Agus | qué cambia cuando el hardware es menos potente y lo gestiona uno mismo |

**Nadie instala un runtime.** **Agus sirve un modelo en su GPU y la sala se conecta**, que es exactamente el mismo movimiento de la Vía A contra otro endpoint: cero instalaciones, cero descargas de pesos por la red del aula, cero peleas con drivers. El que quiera montarlo en su máquina tiene el apéndice y [la guía de Raschka](https://magazine.sebastianraschka.com/p/using-local-coding-agents) para hacerlo en casa.

**Y las dos vías juntas enseñan algo que ninguna sola:** el archivo de config termina con **tres providers** —el hosteado que vienen usando hace cinco sesiones, el CCAD y la notebook de Agus— y el modelo activo se elige con `/model`. La tesis de la sesión deja de ser una afirmación y pasa a ser una lista de tres entradas en un JSON.

> 💡 **La concurrencia de la Vía B no es un problema: es lo que queremos que pase.** Una GPU sirviendo a 25 personas a la vez se encola, y que se encole **en vivo y delante de todos** muestra los límites de una sola GPU chica contra las que corre el CCAD — que es exactamente lo que Ale explicó media hora antes al contar por qué el CCAD usa vLLM y no otra cosa. Avisarle a Agus para que lo esperemos y lo usemos como demostración, en vez de tratarlo como una falla.

**El resultado de la sesión depende únicamente de la Vía A.** Decirlo explícitamente cuando se sueltan a la práctica: nadie se va con la sensación de no haber terminado por no haber hecho la B.

**Por qué Ollama y no vLLM en la Vía B**, y esta vez el contraste tiene un referente real en la sala: **el CCAD corre vLLM** detrás del gateway (el prefijo `vllm/` en el nombre del modelo lo delata) porque sirve a muchos usuarios y necesita batching de verdad. La notebook de Agus atiende a un aula durante veinte minutos. Ollama resuelve ese problema y arranca en cualquier sistema operativo; vLLM resuelve un problema de otra escala. Es la misma distinción de siempre entre runtimes.

## Audiencia y supuestos

- **La Vía A pide muy poca terminal**: editar un JSON y correr `/model`. La Vía B es más técnica, y es opcional a propósito.
- **Pi es el vehículo** — el mismo harness de todas las sesiones, ahora apuntado a otro modelo. Nada de la Sesión 5 es requisito. Lo que sí hace falta es que Pi siga andando en su máquina, que después de cinco sesiones es una apuesta segura.
- **Llegan con su repo, su `AGENTS.md` y sus skills de la Sesión 3.** Ese es el insumo de la práctica y no lo podemos generar nosotros. Avisarlo la semana anterior.
- **La cuenta del CCAD no es requisito bloqueante**: la práctica entra con una API key. **Igual hay que seguir recomendándola con semanas de anticipación**, por dos razones: es un aprendizaje que les sobrevive al curso, y es la puerta a correr algo en hardware real después. **Decidido: una key por estudiante, emitida por Diego desde su propia cuenta**, repartidas antes de la clase — falta el visto bueno de Ale sobre esa forma de repartirlas. Una key por cabeza y no una compartida tiene dos consecuencias que se dicen en voz alta en el Paso 0: el rate limit es de cada uno, y si a alguien no le anda, el problema es su `export` y no el servidor. **Y ahora hay una tercera razón para insistir con la cuenta**: los puntos 3 y 4 del slot de Ale son cómo pedirla y qué hacer con ella, así que el que llegue con la cuenta aprobada escucha instrucciones y no anécdotas.
- **Nadie tuvo exposición previa a HPC.** El bloque de mecánica de cluster ahora es cultura general y no instrucciones de uso, lo que lo hace más corto y más fácil de dar.
- **No asumir que entienden qué es una API key** ni qué implica pegarla en un archivo. Es la primera vez en el curso que manejan una credencial propia y hay que decir en voz alta que no se commitea.

## Plan tema por tema

### Recap y compartir de la Sesión 5 (~5 min)

Discusión, no slides. Qué hicieron, qué se les rompió, qué les sorprendió del loop por dentro.

**Coordinar con Agus antes de la clase**: su sesión **ya está escrita** (`sessions/session-5/INSTRUCTOR.md`), y de ahí **no sale un cliente propio: sale una extensión de Pi**. Su tarea les pide mantenerla viva durante la semana y traerla a esta clase, así que el recap se arma sobre eso: qué extensión escribieron, qué le tuvieron que arreglar, si la volvieron a usar. Falta hablar con él cómo cerró la sala.

Este es el bloque elástico: **si el día se estira, se recorta de acá** (mismo criterio que las Sesiones 2 y 3).

### Invitado: Ale Silva — el CCAD y cómo correr un LLM ahí (~30 min)

Entregar la sala. **El alcance está definido y son siete puntos**, y el slot es de **30 minutos** (confirmar con Ale que le cierra; son siete puntos y no es poco):

1. **Qué es el CCAD** — qué es el centro y a quién le sirve (facultades de la UNC, el Observatorio, organismos externos; creado por Ordenanza HCS 18/2010).
2. **Qué hardware tiene** — los clusters de verdad, cuáles tienen GPU y de qué tipo. La cuenta de VRAM de un bloque posterior se apoya en esto: conviene que los números de él y los nuestros no se contradigan.
3. **Cómo accede un estudiante de la UNC** para correr un LLM ahí — el trámite real: quién puede pedir cuenta, qué hay que presentar, cuánto tarda, y qué te habilita cuando la tenés.
4. **Cómo se corre un LLM ahí** — **a grandes rasgos y sin entrar en detalle**: qué hacés una vez que tenés la cuenta, sin convertirlo en un tutorial de scheduler. Es el punto que le da un camino de vuelta al que quiera seguir después del curso; los internals del servidor quedan afuera.
5. **LiteLLM: el gateway visto desde adentro** — por qué el CCAD decidió poner un proxy adelante del cluster, qué le resuelve (un endpoint estable, auth por key, routing a varios modelos, límites por usuario), y qué se ve desde el lado del operador. Es literalmente la URL a la que la sala le va a pegar veinte minutos después.
6. **vLLM: qué corre atrás** — por qué vLLM y no Ollama ni otra cosa, qué es el batching y por qué un servidor con muchos usuarios lo necesita, y qué pasa cuando 25 personas le pegan al mismo tiempo. Que es exactamente lo que va a pasar durante la práctica.
7. **Para qué se usa el HPC en la UNC** — qué trabajo real corre en esas máquinas más allá de los LLMs (simulación, astronomía, química computacional, lo que sea que él vea pasar), y dónde se para el CCAD entre los clusters de Latinoamérica. Es parte de contar qué es el CCAD y le da escala a todo lo demás.

**Los puntos 3 y 4 son el camino de vuelta.** La práctica entra por el gateway, así que nada de esto hace falta para la clase de hoy — pero el que quiera correr algo en hardware real después del curso necesita saber cómo se pide la cuenta y qué se hace con ella. Dicho por el que opera la máquina, vale más que cualquier link que les pasemos. **El punto 4 va con poco detalle**: la mecánica fina del cluster la cuenta él, sin convertirla en un tutorial.

**Los puntos 5 y 6 son el mismo movimiento al revés, y cierran el círculo.** `https://litellm.ccad.unc.edu.ar` y el prefijo `vllm/` del nombre del modelo dejan de ser strings que copian de una slide: son dos cosas que les explicó el que las eligió, media hora antes de tipearlas. Es la mejor versión posible del bloque de `models.json` y no la podemos comprar de otra manera. **Pedirle explícitamente que nombre los dos con nombre y apellido** — "LiteLLM", "vLLM" — porque después esas dos palabras aparecen en la config, en la teoría y en la comparación con la Vía B.

### Modelos de pesos abiertos — el bloque de Diego (30 min)

> 📖 **Este bloque es [*A Deep Dive into Open-Weight AI Models*, de Flavio Copes](https://flaviocopes.com/open-weight-models/), dado en español.** No es una referencia de apoyo: es el contenido. Lo que compramos al adoptar su orden es que **cada pieza habilita la siguiente** y que el bloque termina en un criterio para elegir un modelo, en vez de terminar en una lista de datos sueltos.
>
> **Lo único que hay que cambiarle**: el post trabaja sus ejemplos sobre un modelo suyo. Nosotros los hacemos **sobre el modelo que el gateway esté sirviendo ese día**, que es al que van a apuntar su repo veinte minutos después. Los números en vivo sobre el modelo propio valen más que los del post.

| # | Sub-bloque | Min |
|---|---|---|
| 1 | Qué es un modelo: arquitectura + pesos | 3 |
| 2 | Qué significa "pesos abiertos", y por qué no es open source | 5 |
| 3 | Licencias: qué te dejan hacer | 6 |
| 4 | Qué pasa cuando te bajás un modelo | 5 |
| 5 | Cuantización | 4 |
| 6 | Por qué importan, y qué no garantizan | 5 |
| 7 | Cómo elegir uno | 2 |

**`models.json` no vive acá**: se camina al arrancar la práctica, con la sala tipeando al mismo tiempo. Es setup, y se da cuando se usa.

#### 1. Qué es un modelo: arquitectura + pesos (~3 min)

**La analogía de la mesa de mezcla, que es la del post y funciona.** Un modelo es una consola de audio gigante con miles de millones de perillas chiquitas. Antes de entrenar, las perillas tienen valores al azar y el modelo no sirve para nada. Entrenar es: pasarle datos, que prediga, medir cuánto se equivocó, mover las perillas, y repetir millones de veces. **Los pesos son los valores que quedaron en las perillas.**

Adentro no hay perillas: hay miles de millones de números en **tensores**, que son arreglos multidimensionales. Cuando leen `8B` o `30B` en el nombre de un modelo, esa B son miles de millones de parámetros, y casi todos son pesos.

**La frase que ordena todo el bloque**: *"los pesos no son el código que entrena el modelo — son el resultado de entrenarlo"*. Son su estado aprendido.

**Y de ahí sale la distinción con la arquitectura**, que es lo que la sala nunca separó: la arquitectura define las capas, las conexiones, el mecanismo de atención, el camino que siguen los datos — y suele estar publicada en un paper. Los pesos son **los números aprendidos puestos adentro de esa arquitectura**, y son lo que costó millones. Dos modelos con arquitecturas parecidas se comportan distinto porque aprendieron de datos distintos o con objetivos distintos.

**Cerrar enumerando lo que hace falta para correr uno**: arquitectura y configuración, pesos, tokenizer, un runtime de inferencia (Ollama, llama.cpp, MLX, Transformers) y memoria suficiente. Contra eso, la frase del post: *"una API esconde todo esto detrás de un request HTTP"*. **Ese contraste es la sesión entera en una línea**, y conviene decirlo acá porque en una hora lo van a estar viviendo.

#### 2. Pesos abiertos, y por qué no es open source (~5 min)

**Un modelo de pesos abiertos es uno cuyos pesos aprendidos se pueden descargar.** Nada más que eso. **Qué podés hacer con ellos lo dice la licencia**, no el hecho de que estén disponibles.

Lo que la licencia *puede* habilitar —y el post insiste en que **no hay que asumir que están todos**—: correrlo local, quedarte con una versión fija, hacerle fine-tune, cuantizarlo o convertirlo de formato, inspeccionar cómo se comporta, redistribuir los pesos, y usarlo comercialmente.

**Y acá la distinción que casi nadie hace bien.** En software normal, el código fuente es la forma preferida para estudiar y modificar un programa. Con los pesos pasa algo parecido y peor: podés correrlos y modificarlos, pero **los pesos solos no te dicen qué datos los produjeron, cómo se filtraron esos datos, ni con qué proceso se entrenó**. La [definición de Open Source AI de la OSI](https://opensource.org/ai) pide más que pesos descargables: pide el código y la información de datos necesarios para estudiar y modificar el sistema, además de los parámetros.

**La formulación del post, para decir casi textual**: *"«pesos abiertos» te dice que podés obtener los parámetros aprendidos. La IA open source debería además darte los materiales y las libertades para estudiar, modificar y compartir el sistema entero."*

El límite todavía se discute, pero **"pesos abiertos" es el término correcto** cuando una empresa publica los parámetros entrenados sin el material completo con el que se hicieron. Casi todo lo que se vende como "IA open source" es eso. Usar el término bien en clase; la sloppiness está en el marketing de la industria, no en los estudiantes.

#### 3. Licencias: qué te dejan hacer (~6 min)

Es donde la distinción de arriba tiene consecuencias, y es lo que hay que mirar **antes** de meter un modelo en un proyecto. Hay licencias que restringen el uso comercial, la **cantidad de usuarios** de tu producto, industrias enteras, o cómo podés compartir las versiones que modificaste.

Las tres preguntas que un estudiante tiene que poder contestar:

1. ¿Lo puedo usar comercialmente?
2. ¿Puedo redistribuir un fine-tune?
3. ¿De quién es lo que genera?

**Las licencias de los dos modelos que van a usar hoy**, en bullets y sobre el model card real:

- **Gemma 4 26B — Apache 2.0.** Uso comercial: sí. Redistribuir un fine-tune: sí. Lo que genera: de ustedes. Sin cláusula de escala, sin obligación de naming, sin política de uso aceptable pegada.
- **Qwen3.8-27B — Apache 2.0.** Mismas tres respuestas: sí, sí, de ustedes.
- **El gancho: Gemma cambió de licencia entre versiones.** Gemma 2 y 3 salieron con términos propios de Google; Gemma 4 salió Apache 2.0. Misma familia, mismo nombre, mismo botón de descarga, derechos distintos.
- **El contraejemplo, para que el contraste exista**: la community licence de Llama, con cláusula de escala por cantidad de usuarios.

> ⚠️ **La trampa, y hay que tenerla clara antes de dar el bloque.** Si uno tiene en la cabeza que "Gemma es licencia propia de Google", eso vale para **Gemma 2 y 3** y **es falso para Gemma 4**. Verificado el 2026-08-24 contra el blog de Google. Decirlo mal justo en este bloque sería vergonzoso dos veces.

**La secuencia en pantalla, tres cards, medio minuto cada una**: el campo `license` de Gemma 4 (Apache 2.0), los términos de Gemma 3 (propios), y la community licence de Llama (propia, con cláusula de escala). Tres modelos que la sala llamaría "open source" sin pestañear, con tres regímenes de derechos distintos.

La frase del sub-bloque: *"«pesos abiertos» no te dice nada sobre lo que podés hacer con ellos. Eso lo dice la licencia — y la licencia cambia entre versiones del mismo modelo."*

**Verificar las licencias de las versiones exactas la semana de la clase.** Es justamente el error que este bloque enseña a no cometer.

#### 4. Qué pasa cuando te bajás un modelo (~5 min)

El sub-bloque que convierte "bajarse un modelo" de una idea vaga en algo concreto.

**Dos formatos, y vale nombrarlos porque los van a ver:**

- **safetensors** — guarda tensores **sin contenido ejecutable**, así que carga más rápido y es más seguro que los formatos viejos basados en pickle de Python. Que "más seguro" tenga una razón técnica y no sea un adjetivo es medio minuto bien gastado.
- **GGUF** — tensores más metadata en un solo archivo, que leen llama.cpp, Ollama y LM Studio. Mostrar un nombre real, `model-Q4_K_M.gguf`, y que vean que **el `Q4` es la cuantización**, que es el sub-bloque siguiente.

**Y después qué pasa cuando lo corrés**, que es el loop entero en cuatro pasos: el runtime lee la configuración, reserva memoria, carga los pesos y espera. Vos escribís algo, el tokenizer lo convierte en ids de tokens, el modelo pasa esos tokens por sus capas y usa los pesos para calcular probabilidades del siguiente token, elige uno, lo agrega a la secuencia y vuelve a empezar.

**La frase para cerrar**: *"nada tiene que llamar a una API en la nube. Las cuentas pasan en tu hardware."*

**Y de ahí el puente al resto de la sesión, que es nuestro y son sesenta segundos**: casi cualquiera de esos runtimes expone un **endpoint compatible con la API de OpenAI**. Por eso cualquier harness se le puede apuntar sin que nadie se haya puesto de acuerdo con nadie. **Es la razón de que cambiar de modelo sean cinco líneas de JSON y no una tarde de trabajo** — y en veinte minutos van a escribir esas cinco líneas.

#### 5. Cuantización (~4 min)

**La cuenta, en el pizarrón**, y es la del post:

```
30 mil millones de parámetros × 16 bits ÷ 8 = 60 GB
30 mil millones de parámetros ×  4 bits ÷ 8 = 15 GB
```

Cuantizar es guardar los pesos con menos bits. **Es la diferencia entre "esto no entra en ninguna máquina de esta sala" y "entra en varias"** — y explica solo por qué el modelo grande vive en el CCAD y por qué lo que sirva Agus en su GPU va a ser mucho más chico.

**El tradeoff, dicho como lo dice el post y sin exagerar para ningún lado**: un archivo más chico usa menos memoria y a veces corre más rápido, pero bajar la precisión **puede** cambiar la calidad. Los métodos buenos de cuantización conservan bastante más de lo que sugiere la cuenta de bits pelada — **y aun así hay que probar ese modelo y esa cuantización en tu tarea**. No se deduce, se mide.

Y lo que hay que nombrar acá porque vuelve en la puesta en común: **lo primero que se degrada suele ser la salida estructurada**, que es exactamente el tool calling. O sea: lo que un coding agent necesita para funcionar.

#### 6. Por qué importan, y qué no garantizan (~5 min)

**Las cinco razones**, que es lo que contesta el "¿y para qué?" que la sala va a preguntar:

1. **La versión no se te mueve abajo de los pies.** El proveedor puede actualizar o retirar un modelo detrás del mismo nombre de API; el que te bajaste se queda quieto. *"Tu aplicación no cambia porque un proveedor reemplazó silenciosamente el modelo."*
2. **Los datos privados pueden quedarse en tu máquina.**
3. **Lo podés cambiar**: fine-tune, merge, cuantizar, estudiarlo. Y una comunidad lo adapta a hardware que el que lo publicó nunca probó, y le encuentra problemas que al creador se le pasaron.
4. **No quedás atado a un servicio.** El mismo modelo corre en varios runtimes y en varios proveedores: *"es portable de una manera en que una API cerrada no lo es"*.
5. **Los modelos chicos sirven como componentes**, no como el sistema entero. *"No necesitan ganar todos los benchmarks. Necesitan hacer una tarea útil de manera lo bastante confiable."*

**Y la lista de lo que NO garantiza, con el mismo peso y sin apurarla** — pesos abiertos no te asegura: buena calidad de salida, respuestas correctas, datos de entrenamiento sin sesgo, uso seguro de tools, hardware barato, generación rápida en tu máquina, permiso para usarlo como quieras, ni información para reproducir el entrenamiento.

**Lo que sí garantiza es que el operador pasás a ser vos**: elegir el runtime, asegurar la máquina, instalar las actualizaciones y medir la calidad. Nadie lo hace por vos.

> **Y acá el matiz que desarma el reflejo más común de la sala**, que el post pone justo al lado del beneficio de privacidad: **"local no significa privado automáticamente"**. Un agente corriendo contra un modelo local sigue llamando APIs, sigue leyendo cosas de afuera y sigue pudiendo subir archivos a otro lado. El modelo dejó de ser el tercero; el resto del sistema sigue estando ahí. **No hay una configuración que te haga privado: hay decisiones que tomás sobre cada pieza.**

#### 7. Cómo elegir uno (~2 min)

El checklist del post, que es lo más accionable que se llevan del bloque. Antes de bajar nada:

1. **Licencia** — qué te deja hacer.
2. **Cantidad de parámetros** — que alcance para la tarea y entre en tu hardware.
3. **Cuantizaciones disponibles** — y cuánta memoria pide cada una.
4. **Runtimes que lo soportan** — Ollama, llama.cpp, MLX, Transformers, tu servidor.
5. **Longitud de contexto** — y lo que esa longitud cuesta en memoria.
6. **El model card** — para qué lo diseñaron, qué evaluaciones reportan, y qué límites reconoce el que lo hizo.
7. **Tu propio set de pruebas**, con ejemplos reales de tu aplicación.

Y cerrar con las dos frases del post, que son el mejor final posible para el bloque:

> *"No elijas un modelo solo por un leaderboard. **El mejor modelo es el más chico que hace tu tarea suficientemente bien, en hardware que puedas operar.**"*

**Es la rampa perfecta a la práctica**, y conviene decirlo así: el punto 7 de ese checklist es lo que van a hacer en veinte minutos, sobre su propio repo.

### Puesta en común: ¿está a la altura de un proyecto serio? (~5 min)

**Resumir lo que midió Sebastian Raschka** en [*Using Local Coding Agents*](https://magazine.sebastianraschka.com/p/using-local-coding-agents), que corrió esta misma pregunta de punta a punta:

- **Setup**: Ollama sirviendo el modelo local, y harnesses open source (Qwen-Code, Codex, Claude Code) apuntados a ese endpoint compatible con OpenAI. Es exactamente el movimiento que la sala acaba de hacer con `models.json`, hecho por un tercero contra otro runtime.
- **Calidad agéntica**: 4-5 sobre 5 en tareas de razonamiento agéntico con un **Qwen3.6 MoE** — la misma familia que probamos en el CCAD. Su conclusión: los MoE nuevos ya alcanzan para mucho trabajo real.
- **Velocidad**: ~40 tokens/s en una Mac Mini. Alcanza para trabajar, no para no notarlo.
- **Memoria**: hasta ~30 GB de RAM con contextos de 50k. La ventana de contexto se paga en hardware, y acá está el número.
- **El matiz que hay que decir junto con los números**: él mide **tareas acotadas**. Sostener un proyecto largo es otra pregunta, y el cuello de botella ahí suele ser el tool calling confiable, no la capacidad de escribir código. No es una contradicción: son dos preguntas distintas, y distinguirlas es el criterio que este bloque quiere dejar.

**Re-verificar la semana de la clase**: esto se mueve rápido.

### Cuándo conviene open source — **se pliega al final de la puesta en común**

> Ya no es un bloque propio: con la sesión repartida en tres bloques grandes no hay lugar. **Se da en dos minutos, cerrando la puesta en común**, y de ahí se sale al debate final. Lo que sigue es el material.

- **Encaja bien**: datos sensibles o regulados, tareas repetitivas de alto volumen donde el costo domina, investigación que necesita reproducibilidad y un modelo pineado, trabajo offline o air-gapped, y *estudiar la cosa en sí* — no podés inspeccionar logits que no tenés.
- **Encaja mal**: querés el mejor coding agent disponible hoy; no tenés capacidad operativa; el volumen es bajo (una API hosteada va a salir más barata que tu tiempo).
- Y el remate: **el modelo es un componente.** Todo lo de las Sesiones 2 a 5 — planificación, review, tests, contexto, tools, harness — se transfiere entre modelos. Ese es el pago de haber enseñado estructura en vez de un producto.

## Práctica (60 min)

**El bloque más largo de la sesión y el que no se recorta.** Dos vías, y las dos son la misma operación contra endpoints distintos: agregar un provider y elegir el modelo con `/model`. **Nadie instala un runtime.**

| | Quién | Tiempo |
|---|---|---|
| Paso 0 — `models.json` | todos, juntos y en voz alta | 8 min |
| Vía A — conectarse al CCAD y comparar | todos | 32 min |
| Vía B — conectarse a la GPU de Agus | opcional | 20 min |

**Decir en voz alta al soltarlos**: el resultado de la sesión depende solo de la Vía A. Y la etiqueta de recurso compartido, que es lo único que sobrevive del bloque de cluster: hay gente corriendo su tesis en esas máquinas, así que respetar los rate limits y no dejar tareas absurdas corriendo por curiosidad.

### Paso 0 — `models.json`, todos juntos (~8 min)

**El corazón de la sesión, y se da acá y no en la teoría**: es setup, así que se camina en pantalla **con la sala tipeando al mismo tiempo**, y queda proyectado el resto de la hora. Frenar la práctica hasta que el archivo le funcione a todo el mundo — el que arranca tarde acá pierde la comparación, que es lo único que no se puede recuperar en casa.

El archivo va en **`~/.pi/agent/models.json`** — y vale frenar un segundo acá, porque es el mismo directorio donde vive el **`AGENTS.md` global que escribieron en la Sesión 3**. La configuración global del agente y el catálogo de modelos son vecinos. Buen momento para el callback.

```json
{
  "providers": {
    "ccad": {
      "baseUrl": "https://litellm.ccad.unc.edu.ar",
      "api": "openai-completions",
      "apiKey": "$CCAD_API_KEY",
      "models": [
        { "id": "vllm/gemma4-26b" },
        { "id": "vllm/qwen3.8-27b" }
      ]
    }
  }
}
```

Cuatro cosas para frenar, y cada una es un concepto que ya tienen:

- **`api: "openai-completions"`** es la historia de interoperabilidad del bloque anterior convertida en un string que tipean. Los valores posibles son `openai-completions`, `openai-responses`, `anthropic-messages` y `google-generative-ai`: cuatro formas de API para todo el ecosistema. El CCAD no expone una API "del CCAD": expone la misma que expondría Ollama en su notebook, o LM Studio, o vLLM crudo. **Por eso el swap cuesta cinco líneas.**
- **`apiKey: "$CCAD_API_KEY"`** — el campo acepta interpolación de variables de entorno (`$VAR`, `${VAR}`) y también ejecutar un comando si arranca con `!`. **Usar la variable, no la key literal**, y decir en voz alta por qué: la key literal en un archivo es la key literal en un backup, en un screenshot del proyector y —el día que a alguien se le ocurra versionar su dotfiles— en un repo público. Es la primera credencial propia del curso y es el momento de enseñar el reflejo.
- **`models` es una lista, y por eso hay dos.** El `id` es lo que se manda a la API y es lo que van a ver en el picker de `/model`. **`vllm/gemma4-26b` es el que está servido; `vllm/qwen3.8-27b` es el que le pedimos a Ale que vuelva a levantar y puede no llegar a tiempo.** Dejar los dos en la slide y decirlo en voz alta: *"si el segundo no aparece en el picker, es porque el CCAD no lo levantó — no es un typo suyo"*. Y los strings exactos los decide el CCAD al registrar los modelos en LiteLLM, así que **los dos hay que confirmarlos antes de proyectarlos**.
- **Y el archivo con dos entradas enseña algo que una sola no**: el catálogo de modelos y el modelo activo son cosas distintas. Declarás lo que hay; elegís con `/model`. Es la misma separación que tienen los providers hosteados, ahora visible en cinco líneas propias. El prefijo `vllm/` es routing de LiteLLM y de paso les cuenta qué hay atrás. **Acá se cobra el slot de Ale**: LiteLLM y vLLM ya tienen cara, así que el bullet se da como reconocimiento y no como dato nuevo — *"eso que les contó Ale hace media hora, acá está, en un string"*. Y lo mismo con la `baseUrl`.
- **Lo que *no* está en el JSON, y es la mejor parte.** `contextWindow` tiene default **128000** y `maxTokens` default **16384**. O sea: la ventana de contexto es un número que alguien eligió. Después de cinco sesiones tratándola como una propiedad del producto que compraron, resulta ser un parámetro de arranque.

  **Y con este modelo el punto se da solo, porque hay tres números distintos para la misma cosa**, y conviene escribirlos en el pizarrón uno debajo del otro:

  | Quién lo decide | Número |
  |---|---|
  | El modelo, nativo (los dos candidatos rondan los 256K) | **~262.144** |
  | Pi, si no le decís nada | **128.000** |
  | El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

  El modelo puede 256K, Pi asume 128K, y lo que realmente tienen es lo que el servidor arrancó. **Que los dos candidatos coincidan en ~256K es una suerte para la slide**: la tabla no cambia según qué modelo esté levantado. **Si el server arrancó con menos que el default de Pi, los requests van a fallar** — fijar `contextWindow` explícitamente con el valor que confirme Ale. Y usar esas tres filas como la demostración de que el número es una decisión de alguien y no una ley de la naturaleza. Es la misma perilla que Agus fija de su lado en la Vía B, vista desde la otra punta.

Y el detalle operativo que hace fácil la práctica: **el archivo se relee cada vez que abrís `/model`**, sin reiniciar nada. Cambiar de modelo cuesta dos segundos.

### Vía A — el gateway del CCAD (todos, ~32 min)

El flujo entero: exportar la key → abrir `/model` → elegir **el modelo abierto que esté en el picker** (`vllm/gemma4-26b`, o `vllm/qwen3.8-27b` si el CCAD lo levantó) → darle una tarea **en su propio repo** → repetir la misma tarea con el modelo hosteado → anotar.

**Lo que hay que vigilar caminando la sala:**

- **La tarea va en su repo, con su `AGENTS.md` y sus skills de la Sesión 3. No en un directorio de prueba.** Es el paso que hace aterrizar la sesión y no cuesta nada: todo el punto es que el andamiaje sobrevive al cambio de modelo. El que lo hace en `/tmp` hizo un ejercicio de configuración, no la clase.
- **La tarea tiene que ser multi-paso y con al menos dos llamadas a tools.** Si le piden algo de un solo turno, los dos modelos van a parecer iguales y la comparación no dice nada. El ejemplo que funciona: *"leé estos dos archivos y arreglá la inconsistencia entre ellos"*.
- **Dos sesiones limpias, no una sesión con `/model` en el medio.** Para que la comparación sea justa los dos modelos tienen que arrancar del mismo contexto. Es más prolijo y además les enseña algo sobre metodología.
- **Que anoten mientras pasa, no después.** Cuatro cosas: ¿respetó el schema de las tools?, ¿cuántos turnos necesitó?, ¿inventó nombres de archivos o funciones?, ¿cómo se sintió la latencia? Esos apuntes son el insumo de la puesta en común, que dura cinco minutos: sin ellos no hay nada que poner en común.
- **Si el gateway terminó sirviendo los dos modelos abiertos, ofrecer la tercera corrida como extra** — mismo prompt, mismo repo, el segundo modelo abierto. **No como paso obligatorio**: es un punto más de comparación, no parte de la tesis. El que no llega no se perdió nada.
- **El error más probable no es conceptual, es un typo en el JSON o la key sin exportar.** Por eso el paso 0 se hace en conjunto.

### Vía B — la GPU de Agus, en el aula (opcional, ~20 min)

**Agus sirve un modelo chico en su GPU y la sala se conecta.** Del lado del estudiante es *otra entrada más* en el mismo `models.json` —`baseUrl` apuntando a la IP de Agus en la red del aula— y otra vez `/model`. Cero instalación, cero descarga de pesos, cero pelea con drivers.

**Qué enseña, y no es lo mismo que enseñaba servirlo uno mismo:**

- **La tercera corrida de la comparación.** Modelo grande en hardware de la UNC, modelo hosteado, y ahora modelo chico a tres metros. Es el punto donde se separa *"los modelos abiertos son peores"* de *"este modelo chico y cuantizado es peor"*, que es un salto de madurez técnica y sale casi gratis.
- **El modelo corriendo a tres metros, y los datos sin salir del aula.** Sin cuenta, sin key, sin nadie en el medio — la contracara exacta de las cinco sesiones anteriores. Mostrar la VRAM real contra la cuenta de cuantización que hicimos en la teoría, y los tokens por segundo, para que la latencia se sienta en vez de describirse.
- **El swap por segunda vez en veinte minutos.** Que el archivo termine con tres providers y que cambiar entre ellos cueste `/model` es la tesis de la sesión, demostrada dos veces en la misma hora.

> 💡 **La concurrencia es contenido, no un riesgo.** Una GPU atendiendo a la sala entera se encola — que es exactamente lo que Ale explicó media hora antes al contar por qué el CCAD corre vLLM. Que pase delante de todos muestra dónde está el techo de una sola GPU chica. **Avisarle a Agus** para que lo esperemos y lo narremos en vivo.

**Nadie tiene que terminar esto.** Repetirlo al soltarlos y otra vez a los quince minutos. El que quiera además servirlo en su propia máquina tiene el apéndice del ejercicio y [la guía de Raschka](https://magazine.sebastianraschka.com/p/using-local-coding-agents) para hacerlo en casa.

#### El setup de Agus, para referencia

> 🟡 **Lo prepara Agus.** Lo que sigue es lo que había en el borrador cuando la demo era un bloque aparte; le sirve de punto de partida, pero **el setup lo define él** — sobre todo el runtime, que ahora tiene que aguantar a varias personas a la vez.

Agus trae su GPU portátil y sirve un modelo chico en el aula, **con Ollama**. Sin cola, sin túnel, sin cuenta, y los datos no salen del aula.

Mostrar la VRAM real contra la cuenta de cuantización que hicimos dos bloques antes, y los tokens por segundo, para que la latencia se sienta en vez de describirse.

**Por qué Ollama**: se instala igual en Mac, Linux y Windows, resuelve solo cuántas capas manda a la GPU, y **expone un endpoint compatible con la API de OpenAI en `/v1`** — que es exactamente lo que la Vía B necesita, porque así la sala le entra con *otra entrada más* en `models.json`, igual que al CCAD. Un solo mecanismo para los dos endpoints, y nada específico del runtime del lado del estudiante.

Del lado de Agus, dos comandos:

```
ollama pull <modelo>
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

- **`OLLAMA_HOST=0.0.0.0`** es lo único que no es obvio, y **sin eso la Vía B no existe**: por default Ollama escucha solo en `127.0.0.1` y nadie del aula le llega. Hace falta además su IP en la red del aula, que es la que va en la slide.
- **La ventana de contexto la elige él** (`OLLAMA_CONTEXT_LENGTH`, o `num_ctx` según cómo lo levante), y **ese número hay que decirlo en voz alta**: es el mismo parámetro que del lado del CCAD eligió Ale. Ver la misma perilla desde las dos puntas en la misma clase es lo que hace que la ventana de contexto deje de ser magia.
- **El modelo tiene que soportar tool calling.** Uno sin plantilla de tools deja al agente sin poder hacer nada: no es que ande peor, es que no anda. **Probarlo con Pi antes de la clase**, sin confiar en lo que diga la tarjeta del modelo.

**Lo que Ollama esconde, y conviene saberlo aunque no se enseñe**: reparte solo las capas entre GPU y CPU, así que la perilla que en otros runtimes es explícita acá no se ve. Es el precio de que arranque en las tres plataformas — y con la Vía B siendo *conectarse a un endpoint* y no *servirlo vos*, **ese precio ya no se paga con contenido**: esa perilla no era de esta clase.

> ⚠️ **La concurrencia se configura, no se reza.** 25 personas contra una GPU se encolan, y en Ollama el parámetro que decide cuántos pedidos atiende en paralelo es **`OLLAMA_NUM_PARALLEL`**. **Verificar el default y fijarlo explícitamente antes de la clase**, y aun así medirlo con varias máquinas a la vez, porque el techo real lo pone la VRAM. Es la misma decisión que Ale explica media hora antes al contar por qué el CCAD corre vLLM: batching, pero en chiquito.

**Confirmar con Agus que la trae, y probar el flujo entero antes**: `ollama serve` alcanzable desde otra máquina del aula, un provider en `models.json` apuntándole, y un tool call que funcione.

> **El bloque de mecánica de cluster se eliminó.** Nodo de login vs. nodo de cómputo, el scheduler, módulos y entornos son internals de un servicio de inferencia multiusuario y **quedan fuera del curso**. Lo poco que valga la pena lo dice Ale en su slot, con poco detalle.
>
> Lo único que sobrevive es **la etiqueta de recurso compartido**, y se dice en una frase al soltar la práctica: hay gente corriendo su tesis en esas máquinas y hoy comparten un modelo servido — respetar los rate limits y no dejar tareas absurdas corriendo por curiosidad.

### Extensión — para quien haya terminado la Sesión 5

Apuntar su propio loop a la misma base URL de LiteLLM. Mismo endpoint, dos clientes. Es una oferta genuina y no un premio consuelo: con el gateway es una línea de config, no una tarde.

> ⚠️ **Este bloque quedó escrito contra el diseño viejo y hay que rehacerlo.** Asumía que de la Sesión 5 salía un cliente propio; de la sesión que Agus efectivamente escribió sale **una extensión de Pi**, y los estudiantes la traen a esta clase. El reemplazo natural es correr esa extensión contra el modelo abierto —es exactamente la tesis con la que cierra el curso, y las notas de la Sesión 5 ya lo anticipan así (`sessions/session-5/INSTRUCTOR.md:361`: *"todo lo que construyeron sobrevive al cambio de modelo. La extensión incluida"*)—, pero **la decisión es de Diego** y hay que bajarla también a la slide (`sessions/session-6/slides.md:392`).

## Timing de la sesión (2 h 30)

**La sesión dura 2 h 30**, decidido. Las otras cinco son de 2 h y la Sesión 1 es de 3, así que no es un caso raro: es la sesión que cierra el curso y tiene un invitado. **Confirmar el aula por esos 30 minutos extra.**

| Bloque | Tiempo |
|---|---|
| Recap y compartir de la Sesión 5 | 5 min |
| **Invitado: Ale Silva — el CCAD, LiteLLM y vLLM** | **30 min** |
| **Modelos de pesos abiertos (Diego)** | **30 min** |
| Pausa | 5 min |
| **Práctica: CCAD (todos) + GPU de Agus (opcional)** | **60 min** |
| Puesta en común: ¿está a la altura? | 5 min |
| Cierre del curso y retrospectiva | 15 min |

Da **150 minutos exactos**, o sea que **no hay colchón**. Dos consecuencias prácticas:

- **El bloque elástico es el recap**, con 5 minutos ya al mínimo. Si algo se estira, lo que se sacrifica primero es la pausa; después, la puesta en común. **La práctica y el cierre no se tocan.**
- **Los dos bloques de 30 hay que ensayarlos con reloj.** Un invitado que se va a 40 y un bloque propio que se va a 38 se comen la puesta en común y la mitad del cierre del curso. A Ale hay que decirle **30** con ese número, y con la prioridad: si algo se cae, que sean sus puntos 1 y 2.

Notar el orden: la puesta en común va *después* de la práctica a propósito, y "cuándo conviene open source" se da al final de ella. Las discusiones de criterio salen mejor cuando ya midieron algo propio.

**Proteger, en este orden: la Vía A completa con la comparación, la retrospectiva de cierre, y el slot del invitado.**

## Cierre del curso (~15 min)

Debate abierto de qué les pareció, si creen que les sirvió, y qué mejorarían.

## Puentes entre sesiones

- **Sesión 3** → el pago que nadie espera. Su `AGENTS.md`, sus skills y su config siguen funcionando contra un modelo que corre en un cluster de la UNC. Todo lo que construyeron en la Sesión 3 nunca fue sobre el modelo. Y un detalle concreto: `models.json` vive en `~/.pi/agent/`, al lado del `AGENTS.md` global que escribieron esa semana.
- **Sesión 4** → la ventana de contexto vuelve como un parámetro de arranque del servidor, no como una propiedad del producto. Y el otro modelo de costo: por hora y por GPU, no por token — el por-token lo cerró Agus en su sesión. **Los dos cierres se reparten**: él cierra el primer arco con costo, límites, carrera y atrofia; nosotros cerramos el curso. ⚠️ **Su sesión ya está escrita y el cierre que quedó no incluye ni el costo ni la carrera** (`sessions/session-4/INSTRUCTOR.md:139`): sobreviven los límites y la atrofia, adentro del bullet de "cuándo no usar IA". Hablarlo antes de dar el reparto por hecho, porque esta sesión saca ese material apoyándose en que él lo da.
- **Sesión 1** → LLM + tool + harness: hoy cambiamos la L. Es la simetría del cierre del curso.
- **Sesión 5** → **ya no es dependencia.** La práctica corre sobre el gateway, así que sobrevive a cualquier forma que tome la sesión de Agus. Lo que sí quedó definido es **qué traen**: una extensión de Pi, no un cliente propio (`sessions/session-5/INSTRUCTOR.md:303` se los pide como tarea). ⚠️ Eso deja desalineado el bloque opcional del final, que todavía ofrece apuntar *un loop propio* al endpoint — ver la nota ahí. Agus está en el aula igual con su GPU portátil.
- **Hilo transversal de seguridad** → cierra acá, y **cierra más angosto de lo que prometía**: quedan las dos puntas que trae el bloque de modelos abiertos —**pasás a ser vos el operador** y **"local no significa privado automáticamente"**— dichas adentro de ese bloque y no en uno propio. La cadena de suministro de pesos, el gateway como tercero y el callback de prompt injection **se sacaron** al adoptar el arco del post. Si alguien quiere recuperarlos, el lugar natural es el cierre del curso, no la teoría.

## Herramientas y recursos referenciados

- **El gateway del CCAD** — `https://litellm.ccad.unc.edu.ar`, API compatible con OpenAI. Es el vehículo de la práctica. La key se entrega en clase y **no se commitea**. Los `id` de los modelos van textuales en una slide y **hay que confirmarlos con Ale**.
- [**Gemma 4 26B**](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) — **el modelo que el gateway sirve hoy**, y el default del material. **MoE: 26B totales, ~3,8B activos por token**, **Apache 2.0** (cambio respecto de Gemma 2 y 3, que tenían términos propios), contexto de hasta 256K, multimodal. Familia de cuatro tamaños: E2B, E4B, 26B MoE y 31B denso — los dos chicos son los candidatos naturales para la Vía B. Anunciada el 2026-04-02. Los repos de Google en Hugging Face suelen estar **gateados**: chequearlo antes de apoyar la Vía B en ellos.
- [**Qwen3.8-27B**](https://huggingface.co/Qwen/Qwen3.8-27B) — **el modelo que le pedimos a Ale, todavía no disponible.** 27B **densos**, **Apache 2.0**, `bfloat16`, contexto nativo de **262.144**, multimodal (no usamos esa parte), plantilla de chat con soporte de tools, repo **sin gate**. Verificado el 2026-08-24 contra el model card; el repo se actualizó el 2026-08-14. **Denso contra el MoE de Gemma es el motivo del pedido**: con los dos servidos, la tabla de VRAM se mide en vez de explicarse.
- **Los dos son el dato más perecedero del archivo** — re-verificar tamaños, licencias y gates la semana de la clase.
- [Pi — modelos y providers custom](https://pi.dev/docs/latest/models) — la doc en la que se apoya el bloque de `models.json`. Config en `~/.pi/agent/models.json`, se relee al abrir `/model`. `api` acepta `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`. `apiKey` acepta `$VAR` / `${VAR}` e `!comando`. Defaults: `contextWindow` 128000, `maxTokens` 16384.
- [**Ollama**](https://ollama.com/) — **el runtime con el que Agus sirve la Vía B.** `ollama pull <modelo>` y `OLLAMA_HOST=0.0.0.0:11434 ollama serve`. Expone endpoint compatible con OpenAI en `/v1`, así que la sala le entra con una entrada de provider en `models.json` igual que al CCAD — no hace falta `/login` ni nada específico del runtime. Las tres variables que importan: `OLLAMA_HOST` (para que se le pueda llegar), `OLLAMA_CONTEXT_LENGTH` (la ventana) y `OLLAMA_NUM_PARALLEL` (cuántos pedidos atiende a la vez). **Verificar los defaults antes de la clase.**
- [**Flavio Copes — *A Deep Dive into Open-Weight AI Models***](https://flaviocopes.com/open-weight-models/) — **la base del bloque de 30 minutos de Diego.** Recorre en orden: pesos, arquitectura vs. pesos, qué es open weight, la diferencia con open source, cómo se baja un modelo, cuantización, beneficios, límites y criterios de elección. Las dos frases que valen la clase: la definición de open source como *"los materiales y las libertades para estudiar, modificar y compartir el sistema entero"*, y **"local no significa privado automáticamente"**, que es la que desarma el reflejo más común de la sala. Números útiles: de 16 a 4 bits lleva un modelo de ~60 GB a ~15 GB. Sus ejemplos van sobre un modelo propio — nosotros los hacemos sobre el que sirva el gateway ese día.
- [**Sebastian Raschka — "The Big LLM Architecture Comparison"**](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison) — **el recorrido por las familias de modelos de pesos abiertos**: qué arquitectura tiene cada una y en qué se diferencian. Es el puntero para el que pregunte "¿y qué otros modelos hay?", que es la pregunta que el bloque de teoría deliberadamente no contesta con una lista.
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — lo que corre Ollama por abajo. No se usa directo en ningún lado de la sesión; queda como puntero para el que quiera bajar un nivel.
- [**Sebastian Raschka — "Using Local Coding Agents"**](https://magazine.sebastianraschka.com/p/using-local-coding-agents) — **la referencia para el setup de la Vía B**, y el walkthrough más completo que hay de la vía local de punta a punta. Sirve tres veces: (1) **el setup con Ollama**, que se instala igual en Mac, Linux y Windows y expone el endpoint compatible con OpenAI en `http://127.0.0.1:11434/v1`; (2) **apunta harnesses open source a ese endpoint** —Qwen-Code, Codex, Claude Code— que es el mismo movimiento que hace nuestro `models.json`, hecho por otro y contra otro runtime: la tesis de interoperabilidad verificada por un tercero; (3) **mide** — 4-5/5 en tareas de razonamiento agéntico con Qwen3.6 MoE, 40 tok/s en una Mac Mini, y hasta 30 GB de RAM con contextos de 50k. Esos números son insumo directo del bloque *"¿está a la altura?"*. Detalle lindo: el modelo que mide es de la familia **Qwen3.6**, la misma que probamos en el CCAD.
- [LiteLLM](https://github.com/BerriAI/litellm) — lo que el CCAD tiene adelante. Vale nombrarlo: es el patrón de gateway/proxy para inferencia, y explica el prefijo `vllm/` en el nombre del modelo.
- vLLM / SGLang — **lo que corre el CCAD atrás**, y la otra familia de runtime en la teoría. Ya no es un ejemplo hipotético.
- [CCAD — Centro de Computación de Alto Desempeño, UNC](https://supercomputo.unc.edu.ar/ccad/) · [wiki](https://wiki.ccad.unc.edu.ar/) · [abrir cuenta](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) · [equipamiento](https://supercomputo.unc.edu.ar/equipamiento/)
- [Pedido de cuentas](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/) · [uso intensivo](https://supercomputo.unc.edu.ar/servicios/pedido-de-uso-intensivo-ventanilla-permanente/) · [soporte a usuarios](https://supercomputo.unc.edu.ar/servicios/soporte-usuarios/)
- [Estado del servicio](https://stats.uptimerobot.com/eLhTV5CMni) · [dashboard](https://stats.ccad.unc.edu.ar/) — chequear antes de la clase.
- **La GPU portátil de Agus** — el endpoint de la Vía B, servido en el aula.
- Licencias: los model cards de Hugging Face (el campo de licencia y el LICENSE del repo). Leer el texto real de lo que nombremos, no un resumen. Para hoy hacen falta **tres cards** y el contraste es el contenido: **Gemma 4** (Apache 2.0, la del modelo que van a usar), **Gemma 3** (términos propios de Google, misma familia) y **Llama** (community licence con cláusula de escala).

## Lo que dejamos afuera a propósito

- **La mecánica del cluster** (pedir GPU, `sbatch`, túnel SSH, nodos, módulos): son internals de un servicio de inferencia multiusuario y **quedan fuera del curso**. Ale los toca con poco detalle en su slot. Si alguien pregunta, una frase y un puntero a la wiki.
- **Fine-tuning / LoRA**: es un curso aparte y no entra en una sesión.
- **Multi-GPU e inferencia distribuida**: interesante y no lo necesita nadie hoy.
- **Benchmarking riguroso de abierto vs. hosteado**: un side-by-side cualitativo sobre su propia tarea enseña el punto; una eval de verdad no entra.
- **Entrenar cualquier cosa**: explícitamente afuera. Decirlo temprano o alguien va a pedir el resto de la sesión.
- **Un tour por cada familia de modelos de pesos abiertos**: se mueve rápido y como lista vale poco. Un modelo que funciona, bien usado.
- **Cómo funciona LiteLLM por dentro**: se nombra como patrón y se sigue. Es infraestructura del CCAD, no contenido del curso.

## Pendientes (para próximas iteraciones)

- **Correr la Vía A de punta a punta antes de la clase, en una máquina limpia**: `models.json` → key → `/model` → una tarea real en un repo real con su `AGENTS.md`. Es el único ensayo que importa y ahora es corto, así que no hay excusa para no hacerlo.
- **Verificar que el modelo abierto emita tool calls válidos a través de LiteLLM** —`vllm/gemma4-26b` seguro, y `vllm/qwen3.8-27b` si Ale lo levanta— contra un `AGENTS.md` de verdad y con varias tools cargadas. **Es el único punto que puede voltear las dos vías**: un modelo que escribe bien pero no puede producir un tool call válido hace que la práctica no tenga nada que mostrar. Probar el modelo concreto, no la familia — y ojo, **que la plantilla de chat soporte tools (lo verificamos, los soporta) no es lo mismo que que el modelo los emita bien a través del proxy**. Lo que hay que probar es la cadena entera.
- **Probar la `baseUrl` exacta**, con y sin `/v1`, y dejar en la slide la que funcione.
- **Probar concurrencia**: 25-30 requests simultáneos contra el gateway. Si hay rate limit, definir si se practica de a dos o en dos oleadas.
- ~~Definir cómo se entregan las keys~~ → **decidido: una por estudiante, emitida por Diego desde su cuenta y repartida antes de la clase.** Queda por hacer: **validar con Ale que le parece bien** emitirlas así, y **repartirlas efectivamente** antes de entrar al aula. En el material va `$CCAD_API_KEY` y la key no se commitea.
- **Fijar `contextWindow`** con el valor real del servidor, apenas Ale lo confirme.
- **Verificar las licencias de las revisiones exactas** de lo que esté servido, y el estado de gate de cada repo, la semana de la clase. Tener las tres cards del contraste abiertas en pestañas antes de entrar al aula: Gemma 4, Gemma 3, Llama.
- **Pedirle a Ale el Qwen con tiempo** (item 4 de la lista), y **decidir una fecha de corte**: pasada esa fecha, las slides se cierran con un solo modelo y la tercera corrida sale del ejercicio. No dejar esa decisión para la semana de la clase.
- **Confirmar que Agus trae la GPU portátil**, qué modelo va a servir, y probar el flujo entero: `ollama serve` con `OLLAMA_HOST=0.0.0.0` alcanzable desde otra máquina del aula, un provider en `models.json` apuntándole, un tool call que funcione, y **varias máquinas pegándole a la vez** para ver cómo se comporta `OLLAMA_NUM_PARALLEL`. Ya no es el respaldo de la sesión, así que si no llega no se cae nada — pero es el mejor momento visual del día.
- ~~Confirmar la participación de Ale~~ → **confirmada.** No se escribe plan B, y eso tiene una consecuencia de diseño que conviene tener presente: **el material se apoya en su slot y no lo puede reemplazar**. Los puntos 3 a 6 no los podemos dar con autoridad —cómo se pide la cuenta, cómo se corre un LLM en el cluster, por qué el CCAD eligió esta arquitectura— así que sin él se degradarían a "acá están los links". Lo que sí queda por cerrar es **el formato y el reloj**: decirle **30 minutos** con ese número, pasarle los siete puntos por escrito, y pedirle explícitamente que **nombre LiteLLM y vLLM con nombre y apellido**, porque el bloque de `models.json` se cobra media hora después.
- **Decidir la duración real de la sesión** y, si son 2 horas, adoptar la variante de arriba de entrada en vez de improvisar recortes.
- ~~Decidir quién cierra el curso~~ → **decidido: se reparte por tipo.** La Sesión 4 cierra el primer arco (costo, límites, carrera, atrofia); esta sesión cierra el curso (el repo, el espectro, la tesis de la transferencia). La duplicación era un resto de cuando el curso tenía 4 sesiones y la 4 era el final. ⚠️ **Sigue abierto con Agus**: su sesión ya está escrita y el cierre que quedó (`sessions/session-4/INSTRUCTOR.md:139`) no tiene ni costo ni carrera, sólo límites y atrofia. El reparto está decidido en el papel y a medio cumplir en el material.
- **Coordinar con Agus el recap de la Sesión 5.** Su sesión ya está escrita y de ahí sale **una extensión de Pi**, no un cliente; los estudiantes la traen, porque es su tarea. Falta hablar cómo cerró la sala.

### Estado del material

**`slides.md` y `exercise/README.md` están escritos.** Los originales —los del diseño anterior: entrar por SSH, ganarle a la cola, servir el modelo, forwardear el puerto— se borraron en vez de parchearse, y los actuales se escribieron de cero a partir de estas notas. Si hace falta mirar los viejos: `git log --diff-filter=D -- sessions/session-6/slides.md` da el commit que los borró, y `git show <commit>^:sessions/session-6/slides.md` el contenido.

Lo que sigue abierto de ellos son los datos que dependen del hilo con Ale, y están marcados con ⚠️ adentro del propio material además de estar en la lista de pendientes de arriba:

- **La slide del Paso 0 y el `models.json` del ejercicio**: la `baseUrl` exacta (con o sin `/v1`) y los dos `id` textuales, que los decide el CCAD al registrar los modelos en LiteLLM.
- **El `contextWindow` real** con el que arrancó vLLM, para fijarlo explícitamente si es menor que el default de Pi.
- **La Vía B**: la IP y el modelo de la GPU de Agus, y probar el flujo entero desde otra máquina del aula.

El resto de las dependencias del rediseño ya está arreglado: `COURSE_PROGRAM.md` (Tier 6, sección de la Sesión 6, preguntas abiertas y recursos), `sessions/session-5/INSTRUCTOR.md` y el `README.md` de la raíz.
