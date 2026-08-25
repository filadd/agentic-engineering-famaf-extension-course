# Sesión 6 — Modelos open source y CCAD (Notas para el instructor)

> 🔴 **TO REVIEW** — este archivo lo generó Claude y **Diego todavía no lo revisó**.
> Tratar cada afirmación, cada timing y cada decisión pedagógica como una propuesta, no como algo cerrado.
>
> **Excepciones, y estas sí son decisiones tomadas:**
> 1. **Al CCAD se llega por un gateway LiteLLM**, y Pi se apunta ahí con un provider propio en `~/.pi/agent/models.json`. Decisión de Diego. **Y los internals de ese servidor —scheduler, SSH, cómo se orquesta la inferencia para muchos usuarios— quedan fuera del curso**: son internals de un servicio de IA multiusuario. Ale los puede tocar como parte de qué es el CCAD, con poco detalle.
> 2. **La práctica tiene dos vías**: el gateway para todos (Vía A) y `llama.cpp` local opcional (Vía B). Todo lo que sigue baja de esas dos cosas.
> 3. **Hay dos modelos en juego y el material tiene que funcionar con cualquiera de los dos.** **Gemma 4 26B** es lo que el gateway sirve hoy. El segundo es un **Qwen**, y no es un pedido a ciegas: Ale nos dio acceso al CCAD y **probamos Qwen3.6 ahí, andando** — hoy está bajado. Lo que le vamos a pedir para el curso es que **vuelva a levantarlo**, ahora en **Qwen3.8-27B**, que es la versión que existe hoy. Escribir todo contra "el modelo de hoy" y tener los dos números a mano. Si están los dos, mejor — abajo se explica por qué la comparación entre ellos es contenido y no lujo.
> 4. **El slot de Ale Silva son seis puntos**: qué es el CCAD, qué hardware tiene, cómo accede un estudiante de la UNC para correr un LLM ahí, cómo se corre un LLM ahí, **LiteLLM** (el gateway desde adentro) y **vLLM** (qué corre atrás). Decisión de Diego.

> A cargo: Diego. Estado: en armado. Este archivo es **todo lo que hay** de la sesión: las slides y el ejercicio se borraron porque estaban escritos contra el diseño viejo (SSH + cola de GPU + túnel), y hay que escribirlos de nuevo desde acá. Material en español.
>
> Invitado: **Ale Silva (CCAD)** — abre la sesión con seis puntos: qué es el CCAD, qué hardware tiene, cómo accede un estudiante de la UNC para correr un LLM ahí, cómo se corre un LLM ahí, y la infraestructura de inferencia por dentro: **LiteLLM** adelante y **vLLM** atrás. El alcance está definido; falta confirmar con él fecha, duración y formato.

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

**Y la lección se fortalece, no se debilita.** Apuntar un loop de 200 líneas escrito a mano a otro modelo prueba que el loop es agnóstico del modelo. Apuntar **Pi** a otro modelo prueba algo que al curso le importa mucho más: **el `AGENTS.md`, los skills, el plan mode, el flujo de review — todo lo de las Sesiones 2 y 3 — sigue funcionando cuando le cambiás el modelo abajo.** Esa es la tesis de cierre del curso, hecha carne, en la herramienta que ya conocen.

## La decisión de herramientas

Sigue **Pi**, sin instalar nada nuevo. Lo único que se agrega es un archivo de configuración.

| Vía | Quién la hace | Qué necesita | Qué enseña |
|---|---|---|---|
| **A — el gateway** | todos | un archivo de config y una API key | el modelo es un componente: el swap es una línea |
| **B — avanzada: servirlo vos** | opcional, quien tenga GPU (o de a dos) | `llama.cpp` local y un modelo chico cuantizado | VRAM, cuantización, flags y latencia, de primera mano |

> 🟡 **La Vía B es la vía avanzada y está TBD: hay que verla con Agus.** Lo que sigue es la forma que tiene hoy, no una decisión cerrada. Definir con él alcance, si va en clase o como apéndice, qué modelo se sirve y **con qué runtime**.
>
> **La referencia para el setup es [el post de Sebastian Raschka](https://magazine.sebastianraschka.com/p/using-local-coding-agents)**, y usa **Ollama**, no `llama-server` crudo. Para 25 personas con Mac, Linux y Windows en la misma aula, eso es probablemente la decisión correcta: se instala igual en los tres y expone el mismo endpoint compatible con OpenAI en `http://127.0.0.1:11434/v1`. El costo es que esconde los flags —`-ngl`, `-c`, `--jinja`— que son justamente el contenido de esta vía. **Es el tradeoff a resolver con Agus**: `llama.cpp` enseña más y se rompe más; Ollama arranca en todas las máquinas.

**Por qué las dos y no una.** La Vía A es la que carga la tesis y es la que **todos van a terminar**: no hay cola, no hay red del aula, no hay nada que se pueda romper más allá de un typo en un JSON. La Vía B es la que hace que la columna "tu propio hardware" de la tabla del espectro deje de ser abstracta. Si dejamos solo B, media sala se va sin haber hecho el swap.

**El resultado de la sesión depende únicamente de la Vía A.** Decirlo explícitamente cuando se sueltan a la práctica: nadie se va con la sensación de no haber terminado por no haber hecho la B.

**Por qué `llama.cpp` y no vLLM en la Vía B**, y esta vez el contraste tiene un referente real en la sala: **el CCAD corre vLLM** detrás del gateway (el prefijo `vllm/` en el nombre del modelo lo delata) porque tiene muchos usuarios y necesita batching. El estudiante en su notebook tiene un usuario. `llama.cpp` resuelve ese problema; vLLM resuelve un problema que nadie en el aula tiene. Es la misma distinción de siempre entre runtimes, pero hoy se puede señalar con el dedo en vez de explicarla en abstracto.

## Audiencia y supuestos

- **La Vía A pide muy poca terminal**: editar un JSON y correr `/model`. La Vía B es más técnica, y es opcional a propósito.
- **Pi es el vehículo** — el mismo harness de todas las sesiones, ahora apuntado a otro modelo. Nada de la Sesión 5 es requisito. Lo que sí hace falta es que Pi siga andando en su máquina, que después de cinco sesiones es una apuesta segura.
- **Llegan con su repo, su `AGENTS.md` y sus skills de la Sesión 3.** Ese es el insumo de la práctica y no lo podemos generar nosotros. Avisarlo la semana anterior.
- **La cuenta del CCAD no es requisito bloqueante**: la práctica entra con una API key. **Igual hay que seguir recomendándola con semanas de anticipación**, por dos razones: es un aprendizaje que les sobrevive al curso, y es la puerta a correr algo en hardware real después. **La opción que hay que validar con Ale: que Diego emita una key por estudiante desde su propia cuenta**, y si a él le parece bien esa decisión (ver Pendiente de Ale). **Y ahora hay una tercera razón para insistir con la cuenta**: los puntos 3 y 4 del slot de Ale son cómo pedirla y qué hacer con ella, así que el que llegue con la cuenta aprobada escucha instrucciones y no anécdotas.
- **Nadie tuvo exposición previa a HPC.** El bloque de mecánica de cluster ahora es cultura general y no instrucciones de uso, lo que lo hace más corto y más fácil de dar.
- **No asumir que entienden qué es una API key** ni qué implica pegarla en un archivo. Es la primera vez en el curso que manejan una credencial propia y hay que decir en voz alta que no se commitea.

## Plan tema por tema

### Recap y compartir de la Sesión 5 (~10 min)

Discusión, no slides. Qué hicieron, qué se les rompió, qué les sorprendió del loop por dentro.

**Coordinar con Agus antes de la clase**: la Sesión 5 está en `TBD`, así que este bloque se escribe recién cuando su sesión exista. Preguntar con qué quedaron en la mano y si alguien terminó con un cliente propio andando — eso define si la extensión del final tiene público.

Este es el bloque elástico: **si el día se estira, se recorta de acá** (mismo criterio que las Sesiones 2 y 3).

### Invitado: Ale Silva — el CCAD y cómo correr un LLM ahí (~45 min)

Entregar la sala. **El alcance está definido y son seis puntos**, y el slot es de **~45 minutos** (confirmar con Ale que le cierra):

1. **Qué es el CCAD** — qué es el centro y a quién le sirve (facultades de la UNC, el Observatorio, organismos externos; creado por Ordenanza HCS 18/2010).
2. **Qué hardware tiene** — los clusters de verdad, cuáles tienen GPU y de qué tipo. La cuenta de VRAM de un bloque posterior se apoya en esto: conviene que los números de él y los nuestros no se contradigan.
3. **Cómo accede un estudiante de la UNC** para correr un LLM ahí — el trámite real: quién puede pedir cuenta, qué hay que presentar, cuánto tarda, y qué te habilita cuando la tenés.
4. **Cómo se corre un LLM ahí** — **a grandes rasgos y sin entrar en detalle**: qué hacés una vez que tenés la cuenta, sin convertirlo en un tutorial de scheduler. Es el punto que le da un camino de vuelta al que quiera seguir después del curso; los internals del servidor quedan afuera.
5. **LiteLLM: el gateway visto desde adentro** — por qué el CCAD decidió poner un proxy adelante del cluster, qué le resuelve (un endpoint estable, auth por key, routing a varios modelos, límites por usuario), y qué se ve desde el lado del operador. Es literalmente la URL a la que la sala le va a pegar veinte minutos después.
6. **vLLM: qué corre atrás** — por qué vLLM y no llama.cpp ni otra cosa, qué es el batching y por qué un servidor con muchos usuarios lo necesita, y qué pasa cuando 25 personas le pegan al mismo tiempo. Que es exactamente lo que va a pasar durante la práctica.

**Los puntos 3 y 4 son el camino de vuelta.** La práctica entra por el gateway, así que nada de esto hace falta para la clase de hoy — pero el que quiera correr algo en hardware real después del curso necesita saber cómo se pide la cuenta y qué se hace con ella. Dicho por el que opera la máquina, vale más que cualquier link que les pasemos. **El punto 4 va con poco detalle**: la mecánica fina del cluster es internals de un servicio multiusuario y queda fuera del curso.

**Los puntos 5 y 6 son el mismo movimiento al revés, y cierran el círculo.** `https://litellm.ccad.unc.edu.ar` y el prefijo `vllm/` del nombre del modelo dejan de ser strings que copian de una slide: son dos cosas que les explicó el que las eligió, media hora antes de tipearlas. Es la mejor versión posible del bloque de `models.json` y no la podemos comprar de otra manera. **Pedirle explícitamente que nombre los dos con nombre y apellido** — "LiteLLM", "vLLM" — porque después esas dos palabras aparecen en la config, en la teoría y en la comparación con la Vía B.

**Consecuencias directas en el plan, y hay que respetarlas o se dice todo dos veces:**

- El bloque *"Un cluster no es tu notebook"* **se eliminó**: era mecánica de cluster, que ahora está fuera del curso. La etiqueta de recurso compartido se dice al soltar la práctica.
- En *"Qué hace falta para correr uno"*, el bullet de **familias de runtime** deja de ser una explicación y pasa a ser un callback de una línea: *"local vs. serving — el serving lo acaban de ver, es lo que Ale llamó vLLM"*. El contraste con `llama.cpp` de la Vía B sigue siendo nuestro.
- En *`models.json`*, el prefijo `vllm/` y la `baseUrl` se leen como reconocimiento, no como novedad. Apoyarse en eso: cuesta menos tiempo y se entiende mejor.

**Lo que se cayó del alcance, y no es olvido**: para qué se usa normalmente el HPC en la UNC, y los clusters de Latam. Si él quiere meterlos, bienvenido, pero no los pedimos: seis puntos en media hora ya es un slot lleno.

**Y porque son seis, hay que darle una prioridad y no dejársela a él.** Si se va de tiempo, lo que se recorta es el punto 1 (podemos abrirlo nosotros en dos minutos) y el 2 se puede hacer con una sola slide de equipamiento. **Lo que no se recorta es 3, 5 y 6** — son los que nadie más en la sala puede dar. **El 4 va liviano por decisión**, no por falta de tiempo: la mecánica fina del cluster está fuera del curso. Decírselo así, con esas palabras, cuando le confirmemos el slot.

Más allá de eso, no sobre-especificar la charla de un invitado. Confirmar si quiere slides, un tour en vivo del dashboard, una sesión real en el cluster proyectada, o solo hablar.

### Open source vs. pesos abiertos, y licencias (~8 min)

La distinción que casi nadie hace bien, y tiene que ir antes de la tabla del espectro o el resto del bloque queda impreciso.

- **Pesos abiertos**: podés descargar los pesos y correrlos. Eso es todo.
- **Open source** en sentido fuerte: además tenés el código de entrenamiento y suficiente información sobre los datos para reproducir el modelo.
- Casi todo lo que se vende como "IA open source" es **pesos abiertos** — te dan el binario, no la receta. La analogía honesta es un ejecutable gratis, no código fuente. Usar "pesos abiertos" en clase donde corresponde; la sloppiness está en el marketing de la industria, no en los estudiantes.

**Y después las licencias**, porque es donde la distinción tiene consecuencias:

- **Licencias de software estándar** (Apache 2.0, MIT): uso comercial libre, derivados, redistribución.
- **Licencias propias con restricciones** (la community licence de Llama, los términos de **Gemma 2 y 3**): límites de uso, cláusulas de escala, obligaciones de naming, políticas de uso aceptable pegadas.
- **Restricciones sobre la salida** — algunas licencias prohíben usar las generaciones para entrenar otros modelos.

Las tres preguntas que un estudiante tiene que poder contestar antes de meter un modelo en un proyecto: ¿lo puedo usar comercialmente? ¿puedo redistribuir un fine-tune? ¿de quién es lo que genera?

> ⚠️ **La trampa de este bloque, y hay que tenerla clara antes de darlo.** Si uno tiene en la cabeza que "Gemma es licencia propia de Google", eso vale para **Gemma 2 y 3** y **es falso para Gemma 4**: Google la publicó bajo **Apache 2.0** y lo dice explícitamente en el anuncio ("*a commercially permissive Apache 2.0 license*"). Verificado el 2026-08-24 contra el blog de Google. Es fácil de decir mal en el aula, y decirlo mal justo acá sería vergonzoso dos veces.

**El gancho, y es mejor que el que teníamos.** Los dos candidatos —Gemma 4 26B y Qwen3.8-27B— son **Apache 2.0**. O sea que las tres preguntas, sobre el modelo al que están por apuntar su repo, se contestan *sí, sí y vos*: sin cláusula de escala, sin obligación de naming, sin política de uso aceptable pegada, y las generaciones son suyas.

**Y el gancho de verdad es que Gemma cambió de licencia entre versiones.** Gemma 2 y 3 salieron con términos propios de Google; Gemma 4 salió Apache 2.0. **Misma familia, mismo nombre, mismo botón de descarga, derechos distintos.** Eso convierte la advertencia genérica del final de este bloque —*"las licencias cambian entre versiones"*— en algo que pueden ver en pantalla en treinta segundos, sobre el modelo que están usando. Es el mejor ejemplo posible y nos lo regaló Google.

**La secuencia en pantalla, tres cards, medio minuto cada una**: el campo `license` de Gemma 4 (Apache 2.0), los términos de Gemma 3 (propios), y la community licence de Llama (propia, con cláusula de escala). Tres modelos que la sala llamaría "open source" sin pestañear, con tres regímenes de derechos distintos.

La frase del bloque: *"«pesos abiertos» no te dice nada sobre lo que podés hacer con ellos. Eso lo dice la licencia, y la licencia cambia entre versiones del mismo modelo."*

**Verificar la licencia de las versiones exactas la semana de la clase** — es justamente el error que este bloque enseña a no cometer, así que cometerlo en el material sería vergonzoso dos veces. Chequear también **si el repo está gateado en Hugging Face**: Qwen3.8-27B hoy no lo está, los de Google históricamente sí incluso siendo Apache, y de eso depende la fricción de la Vía B.

### Pesos abiertos vs. API hosteada (~8 min)

Plantearlo como **espectro de control**, no como tribalismo abierto-vs-cerrado:

| | API hosteada | Pesos abiertos, GPU de otro | Pesos abiertos, tu GPU |
|---|---|---|---|
| Capacidad | La más alta | Varía | Varía |
| Tus datos salen de tu control | Sí | En parte | No |
| Forma del costo | Por token | Por hora | Capex + electricidad |
| Carga operativa | Ninguna | Alguna | Toda |
| Funciona offline / air-gapped | No | No | Sí |

**La columna del medio es la de hoy, y conviene decirlo apenas aparece la tabla.** El gateway del CCAD es exactamente "pesos abiertos, GPU de otro": pesos abiertos, hardware de la UNC, cero carga operativa para ellos y sus datos pasando por un tercero que no es una empresa de IA. Es la columna que en la versión anterior de esta sesión nadie tocaba, y ahora es el default de la práctica.

Honestidad sobre la brecha: los mejores modelos de pesos abiertos son genuinamente útiles y genuinamente están atrás de la frontera en lo que a este curso le importa — trabajo agéntico de horizonte largo y tool calling confiable. No sobrevender, no despreciar.

**Verificar nombres de modelos y afirmaciones de capacidad la semana de la clase.** Este tema se mueve más rápido que cualquier otro del curso.

### Qué hace falta para correr uno (~10 min)

Mecánica práctica. Es el bloque que le da sentido a la Vía B y que explica por qué el CCAD existe.

- **Los pesos son grandes.** Cantidad de parámetros × bytes por parámetro ≈ piso de VRAM, antes del contexto. **Hacer la cuenta en vivo con el modelo que esté servido ese día**, y los dos números son casi el mismo: Gemma 4 26B → 26 mil millones × 2 bytes ≈ **52 GB**; Qwen3.8-27B → 27 mil millones × 2 bytes ≈ **54 GB**. Sin contar el contexto. Ese número explica solo por qué el modelo está en el CCAD y no en su notebook, y por qué la Vía B usa algo mucho más chico. Es el mejor minuto del bloque.
- **Y los 2 bytes no son un supuesto nuestro: están escritos en el modelo.** Abrir el `config.json` del model card y mostrar `dtype: bfloat16` — dos bytes por parámetro, dicho por el modelo. Es medio minuto y convierte la cuenta de una regla que hay que creernos en algo que pueden verificar solos con cualquier modelo que se encuentren después. **Ese es el mejor uso de esos treinta segundos en toda la sesión.**
- **Denso vs. MoE, y acá los dos modelos se vuelven contenido en vez de una alternativa administrativa.** Los dos candidatos piden prácticamente la misma VRAM y no corren para nada igual:

  | | Total | Activos por token | Piso de VRAM |
  |---|---|---|---|
  | **Gemma 4 26B** (MoE) | 26 mil millones | **~3,8 mil millones** | ~52 GB |
  | **Qwen3.8-27B** (denso) | 27 mil millones | **27 mil millones** | ~54 GB |

  **La VRAM la paga el total; la latencia la paga lo activo.** En un MoE tenés que tener los 26B residentes igual —por eso sigue sin entrar en su notebook— pero cada token solo pasa por una fracción, así que responde como un modelo mucho más chico. Es el bullet que rompe la intuición de que "más parámetros" significa a la vez más memoria y más lento: son dos cosas distintas y las paga distinta gente. **Si el gateway termina sirviendo los dos, esto se mide en la práctica en lugar de explicarse**, y es la mejor cosa que puede pasarle a este bloque.
- **Nota al pie honesta**: los dos son multimodales (imagen + texto), así que arriba de los parámetros de texto hay una torre de visión. **En el curso no la usamos** — se nombra solo para que nadie se desoriente si abre el model card y ve `image-text-to-text`.
- **La cuantización** cambia precisión por VRAM. Mencionar que los modelos muy cuantizados se degradan en salida estructurada — que es exactamente tool calling. Esto vuelve en la discusión del final.
- **Dos familias de runtime**: local/mono-usuario (**llama.cpp**, **Ollama**) vs. serving (**vLLM**, SGLang — batching, throughput, muchos usuarios concurrentes). **Este bullet lo dio Ale en el punto 6 de su slot, así que acá es un callback de una línea y no una explicación**: el serving ya lo vieron con nombre propio, lo que agregamos es la otra mitad — ustedes en la Vía B corren llama.cpp, y la razón es cuántos usuarios tiene cada uno. Un usuario no necesita batching.
- **El endpoint compatible con OpenAI es toda la historia de interoperabilidad.** Casi cualquier runtime expone uno, y por eso cualquier harness se le puede apuntar. Es el principio general — y es la razón de que el bloque siguiente sean cinco líneas de JSON y no una tarde de trabajo.

### `models.json`: el modelo como config (~8 min)

**El bloque nuevo, y el corazón de la sesión.** Es el setup de la Vía A, así que se camina una vez en pantalla y queda proyectado cuando arranca la práctica.

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
- **`models` es una lista, y por eso hay dos.** El `id` es lo que se manda a la API y es lo que van a ver en el picker de `/model`. **`vllm/gemma4-26b` es el que está servido; `vllm/qwen3.8-27b` es el que le pedimos a Ale que vuelva a levantar y puede no llegar a tiempo.** Dejar los dos en la slide y decirlo en voz alta: *"si el segundo no aparece en el picker, es porque el CCAD no lo levantó — no es un typo suyo"*. Y los strings exactos los decide el CCAD al registrar los modelos en LiteLLM, así que **los dos hay que confirmarlos antes de proyectarlos** (ver Pendiente de Ale).
- **Y el archivo con dos entradas enseña algo que una sola no**: el catálogo de modelos y el modelo activo son cosas distintas. Declarás lo que hay; elegís con `/model`. Es la misma separación que tienen los providers hosteados, ahora visible en cinco líneas propias. El prefijo `vllm/` es routing de LiteLLM y de paso les cuenta qué hay atrás. **Acá se cobra el slot de Ale**: LiteLLM y vLLM ya tienen cara, así que el bullet se da como reconocimiento y no como dato nuevo — *"eso que les contó Ale hace media hora, acá está, en un string"*. Y lo mismo con la `baseUrl`.
- **Lo que *no* está en el JSON, y es la mejor parte.** `contextWindow` tiene default **128000** y `maxTokens` default **16384**. O sea: la ventana de contexto es un número que alguien eligió. Después de cinco sesiones tratándola como una propiedad del producto que compraron, resulta ser un parámetro de arranque.

  **Y con este modelo el punto se da solo, porque hay tres números distintos para la misma cosa**, y conviene escribirlos en el pizarrón uno debajo del otro:

  | Quién lo decide | Número |
  |---|---|
  | El modelo, nativo (los dos candidatos rondan los 256K) | **~262.144** |
  | Pi, si no le decís nada | **128.000** |
  | El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

  El modelo puede 256K, Pi asume 128K, y lo que realmente tienen es lo que el servidor arrancó. **Que los dos candidatos coincidan en ~256K es una suerte para la slide**: la tabla no cambia según qué modelo esté levantado. **Si el server arrancó con menos que el default de Pi, los requests van a fallar** — fijar `contextWindow` explícitamente con el valor que confirme Ale. Y usar esas tres filas como la demostración de que el número es una decisión de alguien y no una ley de la naturaleza. Es el mismo `-c` de la Vía B, visto desde el otro lado.

Y el detalle operativo que hace fácil la práctica: **el archivo se relee cada vez que abrís `/model`**, sin reiniciar nada. Cambiar de modelo cuesta dos segundos.

### Demo: la GPU portátil de Agus (~6 min)

> 🟡 **TBD — lo prepara Agus.** Lo que sigue es la forma que tenía en el borrador, para que él tenga de dónde partir; el contenido y la duración los define él.

Agus trae su GPU portátil y sirve un modelo chico en el aula. **Dejó de ser el endpoint de respaldo** — el gateway del CCAD es más confiable que una notebook — así que ahora su trabajo es puramente pedagógico: es la tercera columna de la tabla del espectro, hecha física. Sin cola, sin túnel, sin cuenta, y los datos no salen del aula.

Mostrar la VRAM real contra la cuenta que hicimos dos bloques antes, y los tokens por segundo, para que la latencia se sienta en vez de describirse.

Es también la cara visible de la Vía B, así que conviene mostrar el comando entero:

```
llama-server \
  --models-dir ~/models \
  --no-models-autoload \
  --jinja \
  --host 127.0.0.1 --port 8080 \
  -ngl 999 \
  -c 32768
```

Tres flags que valen la pena:

- **`-ngl 999`** manda todas las capas posibles a la GPU. Es el otro lado de la cuenta de VRAM: es la perilla que decide si el modelo corre en la GPU o se arrastra en el CPU.
- **`-c 32768`** es la ventana de contexto — **acá la eligen ellos**. Es el mismo número que en la Vía A eligió el CCAD del lado del servidor. Ver el mismo parámetro desde los dos lados en la misma clase es la mejor manera de que la ventana de contexto deje de ser magia.
- **`--jinja`** habilita los chat templates y por lo tanto **el tool calling**. Sin eso el agente no puede llamar tools, o sea que Pi no puede hacer nada. Es un flag entre "un coding agent que funciona" y "un chatbot".

Y del lado de Pi: `/login llama.cpp` (o `LLAMA_BASE_URL`, que por default ya es `http://127.0.0.1:8080`), `/llama` para cargar el modelo, `/model` para seleccionarlo.

**Confirmar con Agus que la trae, y probarlo antes.**

> **El bloque de mecánica de cluster se eliminó.** Nodo de login vs. nodo de cómputo, el scheduler, módulos y entornos son internals de un servicio de inferencia multiusuario y **quedan fuera del curso**. Lo poco que valga la pena lo dice Ale en su slot, con poco detalle.
>
> Lo único que sobrevive es **la etiqueta de recurso compartido**, y se dice en una frase al soltar la práctica: hay gente corriendo su tesis en esas máquinas y hoy comparten un modelo servido — respetar los rate limits y no dejar tareas absurdas corriendo por curiosidad.

### Sidebar de seguridad y confianza (~5 min)

Cierra el hilo transversal de seguridad del curso, y el gateway le regaló el mejor punto:

- **Un gateway también es un tercero.** "Corre en hardware de la UNC" no es lo mismo que "nadie ve mis prompts". Entre su terminal y el modelo hay un proxy que puede loguear, y eso es una pregunta legítima que hay que hacerle al operador. **Y hoy el operador está en el aula**, así que la pregunta deja de ser retórica: con LiteLLM ya explicado en el punto 5, *"Ale, ¿esto loguea los prompts?"* es una pregunta que se puede hacer en voz alta y que tiene respuesta. **Preguntársela igual antes por mail** (ver Pendiente de Ale) para no dejarlo pagando frente a la sala, y después hacerla en clase de todos modos: modelar la pregunta es la mitad de la lección, y ahora la otra mitad también está disponible. Y de paso desarma el reflejo fácil de "self-hosted = privado".
- **Cadena de suministro**: cuando bajás pesos de un hub estás bajando gigabytes de binario. ¿A quién le estás confiando eso? Según el formato, los archivos de modelo históricamente fueron vector de ejecución de código.
- **El argumento de privacidad corta para los dos lados**: self-hostear saca a un tercero pero te agrega como operador, con logs, disco y un filesystem compartido que capaz no pensaste.
- **A prompt injection no le importa qué modelo corras.** Un modelo más débil puede ser *más fácil* de secuestrar. Callback directo a la Sesión 4.

### ¿Está a la altura de un proyecto serio? (~10 min)

**La pregunta que la sala realmente quiere contestada**, y este es el lugar: después de la práctica, con sus propias mediciones en la mano. Discusión, no veredicto — que argumenten desde lo que acabaron de medir.

Los ejes que lo deciden, todos cosas que midieron en el último paso de la práctica:

- ¿Llama las tools respetando el schema — *siempre*, no casi siempre?
- ¿Sobrevive una tarea de veinte pasos sin perder el hilo?
- ¿Alcanza la ventana de contexto para un repo real?
- ¿La latencia es tolerable dentro de un loop, donde cada paso es otro round trip?

Nuestra respuesta honesta hoy — **re-verificar la semana de la clase, esto se mueve rápido**: para tareas acotadas, reviews, trabajo repetitivo de alto volumen y cualquier cosa con datos sensibles, sí. Como motor principal de un coding agent en un proyecto serio y de vida larga, todavía no del todo — y el cuello de botella suele ser **el tool calling confiable, no la capacidad de escribir código**. Decirlo así, plano: les sirve más que el entusiasmo o el desprecio.

**Y hay un dato externo que conviene tener a mano, porque alguien lo va a preguntar**: Sebastian Raschka corrió [esta misma pregunta con agentes locales](https://magazine.sebastianraschka.com/p/using-local-coding-agents) y midió 4-5 sobre 5 en tareas de razonamiento agéntico con un Qwen3.6 MoE, concluyendo que los MoE nuevos alcanzan para mucho trabajo real. **Es más optimista que nuestra respuesta de arriba y vale decirlo así**, con la diferencia que lo explica: él mide tareas acotadas, y nosotros hablamos de sostener un proyecto largo. No es una contradicción, son dos preguntas distintas — y distinguirlas es exactamente el criterio que este bloque quiere dejar.

Y el matiz que la Vía B habilita, si alguien la hizo: parte de lo que van a haber medido no es el modelo, es **la cuantización**. El mismo modelo a 4 bits y a 16 bits no falla igual en salida estructurada. Que la sala distinga "el modelo abierto es peor" de "esta versión cuantizada de este modelo es peor" es un salto de madurez técnica y sale gratis acá.

Este bloque desemboca en el siguiente: la respuesta no es sí o no, es "para qué trabajo".

### Cuándo conviene open source (~8 min)

Cerrar la sesión (y el curso) en criterio y no en herramientas:

- **Encaja bien**: datos sensibles o regulados, tareas repetitivas de alto volumen donde el costo domina, investigación que necesita reproducibilidad y un modelo pineado, trabajo offline o air-gapped, y *estudiar la cosa en sí* — no podés inspeccionar logits que no tenés.
- **Encaja mal**: querés el mejor coding agent disponible hoy; no tenés capacidad operativa; el volumen es bajo (una API hosteada va a salir más barata que tu tiempo).
- Y ensanchar al cierre real del curso: **el modelo es un componente.** Todo lo de las Sesiones 2 a 5 — planificación, review, tests, contexto, tools, harness — se transfiere entre modelos. Ese es el pago de haber enseñado estructura en vez de un producto.

## Práctica (~50-55 min)

Dos vías. **La A la hacen todos; la B es opcional y hay que decirlo en voz alta al soltarlos.**

### Vía A — el gateway (todos, ~25-30 min)

El flujo entero: pegar `models.json` → exportar la key → abrir `/model` → elegir **el modelo abierto que esté en el picker** (`vllm/gemma4-26b`, o `vllm/qwen3.8-27b` si el CCAD lo levantó) → darle una tarea **en su propio repo** → repetir la misma tarea con el modelo hosteado → anotar.

**Lo que hay que vigilar caminando la sala:**

- **La tarea va en su repo, con su `AGENTS.md` y sus skills de la Sesión 3. No en un directorio de prueba.** Es el paso que hace aterrizar la sesión y no cuesta nada: todo el punto es que el andamiaje sobrevive al cambio de modelo. El que lo hace en `/tmp` hizo un ejercicio de configuración, no la clase.
- **La tarea tiene que ser multi-paso y con al menos dos llamadas a tools.** Si le piden algo de un solo turno, los dos modelos van a parecer iguales y la comparación no dice nada. El ejemplo que funciona: *"leé estos dos archivos y arreglá la inconsistencia entre ellos"*.
- **Dos sesiones limpias, no una sesión con `/model` en el medio.** Para que la comparación sea justa los dos modelos tienen que arrancar del mismo contexto. Es más prolijo y además les enseña algo sobre metodología.
- **Que anoten mientras pasa, no después.** Cuatro cosas: ¿respetó el schema de las tools?, ¿cuántos turnos necesitó?, ¿inventó nombres de archivos o funciones?, ¿cómo se sintió la latencia? Esos apuntes son el insumo de la discusión posterior; sin ellos la discusión se contesta con opiniones.
- **Si el gateway terminó sirviendo los dos modelos abiertos, ofrecer la tercera corrida como extra** — mismo prompt, mismo repo, MoE contra denso. **No como paso obligatorio**: el que llega, mide la tabla de denso vs. MoE con su propio cronómetro, y esa medición es el mejor insumo posible para la discusión de "¿está a la altura?". El que no llega no se perdió nada de la tesis.
- **El error más probable no es conceptual, es un typo en el JSON o la key sin exportar.** Tener el snippet en una slide, listo para copiar, y la key en pantalla o en un papel. Cero descubrimiento en este paso: el descubrimiento es lo que viene después.

### Vía B — servirlo vos (opcional, ~20-25 min)

Para quien tenga GPU local, o de a dos con alguien que tenga. `llama-server` con un modelo **chico y cuantizado** (no los 27B: la cuenta de VRAM ya explicó por qué), después `/login llama.cpp` → `/llama` → `/model`, y la misma tarea otra vez.

**Elegir el modelo de la Vía B dentro de la misma familia que el del gateway** — mismo tokenizer, misma plantilla de chat — así la comparación aísla el tamaño y la cuantización en vez de mezclar todo. Gemma 4 tiene E2B y E4B, que es exactamente para lo que existen; Qwen tiene hermanos chicos de sobra.

**Y chequear el gate antes de la clase, porque no es lo mismo según la familia**: Apache 2.0 no implica descarga libre. El repo de Qwen3.8-27B hoy no está gateado; los de Google históricamente piden aceptar términos en Hugging Face incluso siendo Apache. Un gate significa **un click de aceptación por persona con su propia cuenta de HF**, y con 25 personas en la red del aula eso es exactamente el tipo de fricción que hunde una vía opcional. Si el modelo elegido está gateado, **decirlo en el pre-work** con el link, o directamente elegir uno que no lo esté.

- **En CPU también anda, y va lento. Eso también es el dato** — decirlo, así el que no tiene GPU igual lo intenta.
- El entregable no es un modelo mejor: es la comparación a tres puntas.
- **Nadie tiene que terminar esto.** Repetirlo al soltarlos y otra vez a los quince minutos.

### Extensión — para quien haya terminado la Sesión 5

Apuntar su propio loop a la misma base URL de LiteLLM. Mismo endpoint, dos clientes. Es una oferta genuina y no un premio consuelo: con el gateway es una línea de config, no una tarde.

## Timing de la sesión (~2 h 50 — **no entra en 2 h**, ver la variante de abajo)

| Bloque | Tiempo |
|---|---|
| Recap y compartir de la Sesión 5 | 10 min |
| **Invitado: Ale Silva — el CCAD, LiteLLM y vLLM** | **45 min** |
| Open source vs. pesos abiertos, y licencias | 8 min |
| Pesos abiertos vs. API hosteada (el espectro) | 8 min |
| Qué hace falta para correr uno (VRAM, cuantización, runtimes) | 8 min |
| **`models.json`: el modelo como config** | **8 min** |
| Demo: la GPU portátil de Agus | 6 min |
| Sidebar de seguridad y confianza | 5 min |
| Pausa | 5 min |
| **Práctica: Vía A (todos) + Vía B (opcional)** | **50-55 min** |
| ¿Está a la altura de un proyecto serio? | 10 min |
| Cuándo conviene open source | 8 min |
| Cierre del curso y retrospectiva | 15 min |

Da entre **3 h 06 y 3 h 11**. El resto de las sesiones son de 2 horas, así que **este plan no entra** y hay que decidir antes de la clase, no en el momento.

Notar el orden: "¿está a la altura?" y "cuándo conviene" van *después* de la práctica a propósito. Las discusiones de criterio salen mejor cuando ya midieron algo propio.

### La variante de 2 horas

> 🔴 **Con el slot de Ale en 45 minutos, la variante de 2 horas ya no cierra sola.** Hay que tomar una decisión antes de la clase; abajo está la cuenta para tomarla con números y no de memoria.

Ésta es la versión más apretada que se puede armar respetando la lista de protegidos:

| Bloque | Tiempo |
|---|---|
| Recap | 3 min |
| **Invitado: Ale Silva** | **45 min** |
| Open source vs. pesos abiertos + licencias | 4 min |
| El espectro + qué hace falta para correr uno (fusionados) | 5 min |
| **`models.json`: el modelo como config** | **6 min** |
| Sidebar de seguridad | 3 min |
| **Práctica: solo Vía A** | **35 min** |
| ¿Está a la altura? + cuándo conviene (fusionados) | 8 min |
| Cierre del curso y retrospectiva | 12 min |

**Da 121 minutos, sin pausa y con toda la teoría al hueso.** O sea que entra raspando y sin margen: cualquier cosa que se estire sale de la práctica o del cierre, que son justamente los dos que no queremos tocar.

**La aritmética, para que la decisión sea informada.** El invitado se lleva **45 de 120 minutos**, y la práctica y el cierre —protegidos— se llevan otros 47. Quedan **28 minutos para toda la teoría de la sesión**, que en la tabla de arriba ya están repartidos al límite. No hay de dónde sacar más sin romper algo de la lista de protegidos.

**Las tres salidas, y la decisión es de Diego:**

1. **La sesión dura más de 2 horas.** Es la salida limpia y hay precedente: la Sesión 1 dura 3. Está como pregunta abierta en `COURSE_PROGRAM.md` y conviene resolverla ya, porque de esto depende.
2. **El slot vuelve a ~30-35 min.** Entonces sirve la variante de antes, con la teoría respirando. Cuesta profundidad en los puntos 5 y 6, que son los que le dan cara a LiteLLM y vLLM antes de que aparezcan en la config.
3. **La práctica baja de 35 min.** **Ésta es la peor**: abajo de 35 no entra la comparación modelo abierto vs. hosteado, que es literalmente lo que la sesión existe para hacer. Si se toma este camino, mejor asumirlo en voz alta y no descubrirlo en el aula.

Los otros dos movimientos de la variante corta siguen valiendo: **la Vía B pasa a ser un apéndice escrito en el ejercicio** para hacer en casa, y **la demo de Agus sucede durante la práctica** en vez de tener slot propio — el que la quiere ver, se acerca. Se pierde el momento en que toda la sala ve la VRAM y los tokens por segundo a la vez, y eso es una pérdida real; es el precio.

**Proteger, en este orden: el slot del invitado, la Vía A completa con la comparación, y la retrospectiva de cierre.** Si algo de esos tres se recorta, la sesión pierde lo que la justifica — y con 45 minutos de invitado, los tres juntos ya no entran en 120. Ésa es exactamente la decisión.

## Cierre del curso (~15 min)

No es el cierre de la sesión, es el cierre de las seis. Merece que no lo agarre el reloj.

Vale tener presente la estructura, porque cambia qué hay que decir acá: las sesiones 1 a 4 son el **curso base** y **la Sesión 4 ya cerró ese arco** (costo, límites, carrera, atrofia). Las 5 y 6 son el **arco avanzado**, y los estudiantes lo saben desde la Sesión 1. Así que este cierre no tiene que volver a cerrar los fundamentos: cierra el arco avanzado y, con él, el curso.

- **Abrir el repo y mirar el primer commit.** Lo que escribieron en la Sesión 1 contra lo que tienen hoy.
- **Volver a la slide del espectro de la Sesión 1**, la misma, sin retocarla. Pedirle el archivo a Diego y no rehacerla: parte del efecto es que reconozcan la slide.
- **El takeaway**: todo lo de las Sesiones 2 a 5 —planificación, review, tests, contexto, tools, harness— se transfiere entre modelos. Es exactamente lo que acabaron de comprobar a mano hace media hora. Por eso el curso enseñó estructura y no un producto.
- **Cerrar donde empezó**: la Sesión 1 les dio tres palabras, LLM + tool + harness. Hoy cambiaron la primera y todo lo demás siguió en pie.

**Lo que NO va acá, y es una decisión, no un olvido**: costo y límites, atrofia de habilidades, cuándo NO usar IA, y las implicancias para su carrera. Todo eso **cierra la Sesión 4**, que es el final del primer arco del curso (*"¿cómo trabajo bien con esta cosa?"*). Los dos cierres se reparten **por tipo y no por jerarquía**: la Sesión 4 se queda con el material de criterio humano, y esta sesión con el material de artefacto — el repo, el espectro y la tesis de la transferencia. Es lo que hace que este cierre entre en 15 minutos, y evita gastar el final del curso dos sesiones antes. Si Agus recorta su cierre, avisar: son cuatro temas que si no los da él, no los da nadie.

## Pendiente de Ale (hilo de mail)

**Estas notas se escribieron sin el hilo de mail.** Tratar todo como no verificado hasta chequearlo, con **una sola excepción, que ya está firme**: Ale nos dio acceso al CCAD y ahí probamos **Qwen3.6 andando**; hoy está bajado. Ese precedente es lo que reescribe el punto 4 de abajo; todo el resto sigue sin verificar.

Lo que hay que preguntar ahora, en orden de prioridad:

1. **Concurrencia y rate limits** con 25-30 estudiantes pegándole al gateway a la vez durante una hora. **Este es el nuevo riesgo más grande de la sesión** y ocupa el lugar que tenía la cola de GPU. Si hay límite por key, saberlo antes cambia el diseño de la práctica. **Lo necesitamos por mail igual**, aunque el punto 6 de su slot toque el tema: la respuesta define cómo se escribe la práctica, y eso hay que hacerlo antes de la clase, no durante.
2. **Las keys, y hay una propuesta concreta para ponerle enfrente**: que **Diego cree una key por estudiante desde su propia cuenta**. Preguntarle si eso es posible y **si le parece bien como decisión** —es su servicio y su política, no solo una capacidad técnica—. Si no le cierra, la alternativa es una key del curso compartida. Y en cualquiera de los dos casos: con cuánta anticipación se emiten, y si siguen andando después del curso. (Que sigan andando sería un cierre lindísimo; que no, hay que avisarlo.)
3. **¿El gateway loguea prompts?** Necesario para que el sidebar de seguridad sea honesto. Es la pregunta que vamos a hacer en voz alta en clase — y con él explicando LiteLLM en el punto 5, se la vamos a hacer *a él*. **Preguntarla por mail primero**: la idea es que la conteste, no que lo agarre desprevenido frente a la sala.
4. **El pedido: ¿pueden volver a levantar el Qwen, ahora Qwen3.8-27B?** **No es un pedido en frío**: con el acceso que nos dio Ale, **Qwen3.6 corrió en el CCAD y anduvo**, y después se bajó. O sea que servir un Qwen ahí ya está demostrado y lo que estamos pidiendo es reponerlo, con la versión que existe hoy. Lo queremos **además** de Gemma 4 26B, no en lugar de. Sigue siendo **un pedido y no un supuesto** —el material está escrito para funcionar sin él— pero el precedente cambia la conversación. **Lo que el precedente no cubre, y hay que decirlo al pedirlo**: lo que probamos fue 3.6, no 3.8. Los números de 3.8 que están en este archivo salen de la model card, no de haberlo visto correr en ese hardware; si el salto de versión les cambia el encaje en la GPU, que nos avisen. Por qué lo pedimos, y vale decírselo porque es un argumento pedagógico y no un capricho: Gemma 4 26B es MoE (~3,8B activos) y Qwen3.8-27B es denso, así que con los dos en el mismo endpoint la sala puede **medir** la diferencia entre denso y MoE en vez de escucharla. Si no se puede, la sesión sale igual con uno solo — pero avisar con tiempo para bajar la tabla comparativa de las slides.
5. **Los `id` exactos de los modelos en LiteLLM.** `vllm/gemma4-26b` y `vllm/qwen3.8-27b` son las cadenas que tenemos escritas y **las dos hay que confirmarlas**: van textuales en una slide que 30 personas copian. Un typo acá cuesta diez minutos de práctica.
6. **Con qué `--max-model-len` levantaron vLLM**, por modelo. Los dos candidatos hacen ~262.144 nativos y Pi asume 128.000: el número que manda es el del servidor, y lo necesitamos para pinear `contextWindow` en la slide de config. Es además la tercera fila de la tabla que vamos a mostrar en clase.
7. **¿La `baseUrl` es correcta sin `/v1`?** LiteLLM sirve las dos formas y Pi construye el path; hay que probar el string exacto. Es un detalle de dos minutos que puede voltear la práctica entera.
8. **¿Sigue haciendo falta una cuenta del CCAD para esto?** Si la key alcanza, la cuenta deja de ser requisito bloqueante — seguimos recomendándola por su propio valor, pero cambia lo que les pedimos como pre-work.
9. **El slot de Ale**: el alcance ya está definido (los seis puntos), así que lo que falta es **confirmar que le cierra y que le entra en 30 minutos**. Mandarle los seis por escrito, con la prioridad explícita: **3, 4, 5 y 6 son los que nadie más en la sala puede dar**; 1 y 2 los abrimos nosotros si se va de tiempo. Y pedirle que nombre **LiteLLM** y **vLLM** con nombre propio, porque esas dos palabras vuelven después en la config y en la teoría. Además: presencial o remoto, si quiere slides o proyectar una sesión real en el cluster, y si el CCAD quiere algún reconocimiento o tiene materiales/branding que prefiera que usemos.
10. **Para el punto 4, ¿necesita algo del aula?** Si va a mostrar una sesión real en el cluster, hace falta red que le sirva y saber si va a pedir GPU en vivo (y si eso puede quedar esperando en la cola frente a la sala). Un fallback grabado o un screenshot lo cubre.
11. **¿El trámite que va a describir es el mismo que les mandamos en el pre-work?** Le pasamos el link de abrir cuenta semanas antes y él explica el trámite en la última sesión: si lo que cuenta no coincide con lo que les dijimos, queda raro. Vale mandarle nuestro texto de pre-work para que lo corrija.

Cuando el hilo esté leído, bajar las respuestas a este archivo y recién entonces escribir el ejercicio contra los valores reales.

## Puentes entre sesiones

- **Sesión 3** → el pago que nadie espera. Su `AGENTS.md`, sus skills y su config siguen funcionando contra un modelo que corre en un cluster de la UNC. Todo lo que construyeron en la Sesión 3 nunca fue sobre el modelo. Y un detalle concreto: `models.json` vive en `~/.pi/agent/`, al lado del `AGENTS.md` global que escribieron esa semana.
- **Sesión 4** → la ventana de contexto vuelve como un parámetro de arranque del servidor, no como una propiedad del producto. Y el otro modelo de costo: por hora y por GPU, no por token — el por-token lo cerró Agus en su sesión. **Los dos cierres se reparten**: él cierra el primer arco con costo, límites, carrera y atrofia; nosotros cerramos el curso. Coordinarlo con él, porque todavía no escribió esa sesión.
- **Sesión 1** → LLM + tool + harness: hoy cambiamos la L. Es la simetría del cierre del curso.
- **Sesión 5** → **ya no es dependencia.** La práctica corre sobre el gateway, así que sobrevive a cualquier forma que tome la sesión de Agus. Sigue valiendo coordinar: si su práctica produce un cliente, la extensión del final tiene público, y él puede armar el pase en su cierre. Agus está en el aula igual con su GPU portátil.
- **Hilo transversal de seguridad** → cierra acá, con tres puntas: cadena de suministro de modelos, self-hosting como responsabilidad de operador, y **el gateway como tercero**, que es la punta nueva y la más útil.

## Herramientas y recursos referenciados

- **El gateway del CCAD** — `https://litellm.ccad.unc.edu.ar`, API compatible con OpenAI. Es el vehículo de la práctica. La key se entrega en clase y **no se commitea**. Los `id` de los modelos van textuales en una slide y **hay que confirmarlos con Ale**.
- [**Gemma 4 26B**](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) — **el modelo que el gateway sirve hoy**, y el default del material. **MoE: 26B totales, ~3,8B activos por token**, **Apache 2.0** (cambio respecto de Gemma 2 y 3, que tenían términos propios), contexto de hasta 256K, multimodal. Familia de cuatro tamaños: E2B, E4B, 26B MoE y 31B denso — los dos chicos son los candidatos naturales para la Vía B. Anunciada el 2026-04-02. Los repos de Google en Hugging Face suelen estar **gateados**: chequearlo antes de apoyar la Vía B en ellos.
- [**Qwen3.8-27B**](https://huggingface.co/Qwen/Qwen3.8-27B) — **el modelo que le pedimos a Ale, todavía no disponible.** 27B **densos**, **Apache 2.0**, `bfloat16`, contexto nativo de **262.144**, multimodal (no usamos esa parte), plantilla de chat con soporte de tools, repo **sin gate**. Verificado el 2026-08-24 contra el model card; el repo se actualizó el 2026-08-14. **Denso contra el MoE de Gemma es el motivo del pedido**: con los dos servidos, la tabla de VRAM se mide en vez de explicarse.
- **Los dos son el dato más perecedero del archivo** — re-verificar tamaños, licencias y gates la semana de la clase.
- [Pi — modelos y providers custom](https://pi.dev/docs/latest/models) — la doc en la que se apoya el bloque de `models.json`. Config en `~/.pi/agent/models.json`, se relee al abrir `/model`. `api` acepta `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`. `apiKey` acepta `$VAR` / `${VAR}` e `!comando`. Defaults: `contextWindow` 128000, `maxTokens` 16384.
- [Pi + llama.cpp](https://pi.dev/docs/latest/llama-cpp) — la Vía B. `llama-server --models-dir ~/models --no-models-autoload --jinja --host 127.0.0.1 --port 8080 -ngl 999 -c 32768`, después `/login llama.cpp` (o `LLAMA_BASE_URL`, default `http://127.0.0.1:8080`), `/llama` para cargar o buscar en Hugging Face, `/model` para seleccionar.
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — el runtime de la Vía B tal como está escrita hoy.
- [**Sebastian Raschka — "Using Local Coding Agents"**](https://magazine.sebastianraschka.com/p/using-local-coding-agents) — **la referencia para el setup de la Vía B**, y el walkthrough más completo que hay de la vía local de punta a punta. Sirve tres veces: (1) **el setup con Ollama**, que se instala igual en Mac, Linux y Windows y expone el endpoint compatible con OpenAI en `http://127.0.0.1:11434/v1`; (2) **apunta harnesses open source a ese endpoint** —Qwen-Code, Codex, Claude Code— que es el mismo movimiento que hace nuestro `models.json`, hecho por otro y contra otro runtime: la tesis de interoperabilidad verificada por un tercero; (3) **mide** — 4-5/5 en tareas de razonamiento agéntico con Qwen3.6 MoE, 40 tok/s en una Mac Mini, y hasta 30 GB de RAM con contextos de 50k. Esos números son insumo directo del bloque *"¿está a la altura?"*. Detalle lindo: el modelo que mide es de la familia **Qwen3.6**, la misma que probamos en el CCAD.
- [LiteLLM](https://github.com/BerriAI/litellm) — lo que el CCAD tiene adelante. Vale nombrarlo: es el patrón de gateway/proxy para inferencia, y explica el prefijo `vllm/` en el nombre del modelo.
- vLLM / SGLang — **lo que corre el CCAD atrás**, y la otra familia de runtime en la teoría. Ya no es un ejemplo hipotético.
- [CCAD — Centro de Computación de Alto Desempeño, UNC](https://supercomputo.unc.edu.ar/ccad/) · [wiki](https://wiki.ccad.unc.edu.ar/) · [abrir cuenta](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) · [equipamiento](https://supercomputo.unc.edu.ar/equipamiento/)
- [Pedido de cuentas](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/) · [uso intensivo](https://supercomputo.unc.edu.ar/servicios/pedido-de-uso-intensivo-ventanilla-permanente/) · [soporte a usuarios](https://supercomputo.unc.edu.ar/servicios/soporte-usuarios/)
- [Estado del servicio](https://stats.uptimerobot.com/eLhTV5CMni) · [dashboard](https://stats.ccad.unc.edu.ar/) — chequear antes de la clase.
- **La GPU portátil de Agus** — demo de la columna "tu propio hardware" y cara visible de la Vía B.
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
- **Definir cómo se entregan las keys** y no improvisarlo en el aula. Si es una key compartida, tenerla en una slide; si es una por estudiante, repartirlas antes. Y **no dejar la key en un archivo commiteado del repo del curso** — en el material va `$CCAD_API_KEY`.
- **Fijar `contextWindow`** con el valor real del servidor, apenas Ale lo confirme.
- **Verificar las licencias de las revisiones exactas** de lo que esté servido, y el estado de gate de cada repo, la semana de la clase. Tener las tres cards del contraste abiertas en pestañas antes de entrar al aula: Gemma 4, Gemma 3, Llama.
- **Pedirle a Ale el Qwen con tiempo** (item 4 de la lista), y **decidir una fecha de corte**: pasada esa fecha, las slides se cierran con un solo modelo y la tabla de denso vs. MoE se da como teoría en vez de como medición. No dejar esa decisión para la semana de la clase.
- **Confirmar que Agus trae la GPU portátil**, qué modelo va a servir, y probarlo. Ya no es el respaldo de la sesión, así que si no llega no se cae nada — pero es el mejor momento visual del día.
- **Confirmar la participación de Ale, fecha y formato.** El plan B ya no es equivalente y hay que saberlo: los puntos 1 y 2 los podemos dar nosotros en 10 minutos con la wiki y la página de equipamiento, y de LiteLLM y vLLM podemos explicar *qué son* — pero **cómo se pide la cuenta, cómo se corre un LLM en el cluster y por qué el CCAD eligió esta arquitectura no lo podemos dar con autoridad**. Sin él, los puntos 3 a 6 se degradan a "acá están los links". Si su participación queda en duda, pedirle igual algo grabado o un walkthrough escrito de esos cuatro puntos.
- **Decidir la duración real de la sesión** y, si son 2 horas, adoptar la variante de arriba de entrada en vez de improvisar recortes.
- ~~Decidir quién cierra el curso~~ → **decidido: se reparte por tipo.** La Sesión 4 cierra el primer arco (costo, límites, carrera, atrofia); esta sesión cierra el curso (el repo, el espectro, la tesis de la transferencia). La duplicación era un resto de cuando el curso tenía 4 sesiones y la 4 era el final. **Avisarle a Agus**, porque le cambia el cierre de una sesión que todavía no escribió.
- **Coordinar con Agus el recap de la Sesión 5**, que todavía está en `TBD`.

### Las slides y el ejercicio hay que escribirlos de nuevo

**`slides.md` y `exercise/README.md` se borraron**, no se parchearon. Estaban escritos contra el diseño anterior —entrar por SSH, ganarle a la cola, servir el modelo, forwardear el puerto, cambiar la base URL del agente de la Sesión 5— y no quedaba casi nada rescatable: el ejercicio era literalmente ese flujo paso por paso. Están en el historial de git si hace falta mirarlos: `git log --diff-filter=D -- sessions/session-6/slides.md` te da el commit que los borró, y `git show <commit>^:sessions/session-6/slides.md` el contenido.

Lo que hay que tener presente al escribirlos:

- **Las slides** necesitan una que no existía y que ahora es el centro de la sesión: el `models.json` completo, para copiar textual. Igual que en la Sesión 3, la mayoría de las slides son título + nota de orador, pero las que la sala tiene que copiar o leer llevan cuerpo: el JSON del provider, la tabla del espectro, el comando de `llama-server`, y la cuenta de VRAM. Lo que se puede reusar del esqueleto viejo son los bloques de teoría que no cambiaron (licencias, espectro, cuantización, seguridad, cierre del curso).
- **El ejercicio** se estructura como Vía A + Vía B, no como pasos numerados de uno a seis. La Vía A tiene que poder resolverse sin descubrir nada: el JSON listo para copiar, la key a mano, y todo el esfuerzo del estudiante puesto en la tarea que le da al agente y en anotar la comparación. La Vía B va como apéndice, con la advertencia de que no terminarla no es no haber hecho el ejercicio.
- **No escribir el ejercicio antes de leer el hilo con Ale.** La `baseUrl` exacta, el `contextWindow` y la forma de las keys son datos que van textuales en el material y que hoy no tenemos.

El resto de las dependencias ya está arreglado: `COURSE_PROGRAM.md` (Tier 6, sección de la Sesión 6, preguntas abiertas y recursos), `sessions/session-5/INSTRUCTOR.md` y el `README.md` de la raíz.
