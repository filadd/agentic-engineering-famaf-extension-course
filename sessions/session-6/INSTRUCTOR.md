# Sesión 6 — Modelos open source y CCAD (Notas para el instructor)

> 🔴 **TO REVIEW** — este archivo lo generó Claude y **Diego todavía no lo revisó**.
> Tratar cada afirmación, cada timing y cada decisión pedagógica como una propuesta, no como algo cerrado.
>
> **Excepciones, y estas sí son decisiones tomadas:**
> 1. **Al CCAD se llega por un gateway LiteLLM**, y Pi se apunta ahí con un provider propio en `~/.pi/agent/models.json`. No hay SSH, no hay scheduler, no hay túnel. Decisión de Diego.
> 2. **La práctica tiene dos vías**: el gateway para todos (Vía A) y `llama.cpp` local opcional (Vía B). Todo lo que sigue baja de esas dos cosas.

> A cargo: Diego. Estado: en armado. Este archivo es **todo lo que hay** de la sesión: las slides y el ejercicio se borraron porque estaban escritos contra el diseño viejo (SSH + cola de GPU + túnel), y hay que escribirlos de nuevo desde acá. Material en español.
>
> Invitado: **Ale Silva (CCAD)** — invitado a abrir la sesión con una intro al centro. Confirmar alcance, fecha y duración.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo que **el modelo es un componente reemplazable** — habiéndolo reemplazado ellos, en su propio repo, con su propio `AGENTS.md`, contra un modelo de pesos abiertos corriendo en hardware de la UNC.

La frase de la sesión:

> *"Cambiás el modelo editando cinco líneas de JSON, y nada de lo que construiste en cinco sesiones se cae."*

## Por qué esta sesión existe, y por qué va al final

Las sesiones 1 a 5 usan un modelo hosteado detrás de una API. Es un default sensato y también un supuesto que nadie examinó. Esta sesión lo rompe:

- **Los pesos abiertos son una opción real**, con tradeoffs reales: privacidad, estructura de costos, uso offline, reproducibilidad para investigación — contra capacidad, confiabilidad en tool calling y carga operativa.
- **El CCAD existe y estos estudiantes lo pueden usar.** La mayoría de la sala no sabe que la UNC opera un centro de cómputo de alto desempeño al que se puede pedir cuenta. Es, discutiblemente, el aprendizaje práctico de mayor valor de todo el curso, independiente de la IA.

Va al final porque aterriza mejor después de la Sesión 5 — pero **no depende de ella**.

> ✅ **La logística se resolvió, y se resolvió de la manera más aburrida posible.** El CCAD se expone como un gateway **LiteLLM** con endpoint compatible con OpenAI. Pi habla con eso nativamente: se agrega un provider en `~/.pi/agent/models.json`, se abre `/model`, se elige el modelo. Se terminaron el scheduler, la cola de GPU, el túnel SSH y la pelea con la red del aula. La versión anterior de este archivo tenía la cola de GPU marcada como "el riesgo más grande de la sesión". Ya no existe ese riesgo.

**Y la lección se fortalece, no se debilita.** Apuntar un loop de 200 líneas escrito a mano a otro modelo prueba que el loop es agnóstico del modelo. Apuntar **Pi** a otro modelo prueba algo que al curso le importa mucho más: **el `AGENTS.md`, los skills, el plan mode, el flujo de review — todo lo de las Sesiones 2 y 3 — sigue funcionando cuando le cambiás el modelo abajo.** Esa es la tesis de cierre del curso, hecha carne, en la herramienta que ya conocen.

**Pero hay un precio, y hay que pagarlo de frente.** Un gateway que anda bien esconde exactamente lo que la sesión quería que sintieran: lo que cuesta operar tu propia inferencia. Por eso existe la **Vía B** y por eso la demo de Agus dejó de ser un plan de contingencia y pasó a ser contenido. La frase para decir en voz alta cuando el gateway les contesta en dos segundos: *"la carga operativa no desapareció, simplemente hoy no fue tuya"*.

La Sesión 5 sigue importando pedagógicamente: el que escribió su propio loop ya cree que el modelo es intercambiable. Pero si la Sesión 5 va para otro lado, esta sesión no se entera. **Extensión para quien haya terminado la Sesión 5**: apuntar *su* agente a la misma base URL. Ahora es más fácil que en el diseño original, no más difícil — una URL, sin túnel.

## La decisión de herramientas

Sigue **Pi**, sin instalar nada nuevo. Lo único que se agrega es un archivo de configuración.

| Vía | Quién la hace | Qué necesita | Qué enseña |
|---|---|---|---|
| **A — el gateway** | todos | un archivo de config y una API key | el modelo es un componente: el swap es una línea |
| **B — servirlo vos** | opcional, quien tenga GPU (o de a dos) | `llama.cpp` local y un modelo chico cuantizado | lo que el gateway te tapó: VRAM, cuantización, flags, latencia |

**Por qué las dos y no una.** La Vía A es la que carga la tesis y es la que **todos van a terminar**: no hay cola, no hay red del aula, no hay nada que se pueda romper más allá de un typo en un JSON. La Vía B es la que hace que la columna "tu propio hardware" de la tabla del espectro deje de ser abstracta. Si dejamos solo A, la sesión enseña que la inferencia es gratis y fácil, que es falso. Si dejamos solo B, media sala se va sin haber hecho el swap.

**El resultado de la sesión depende únicamente de la Vía A.** Decirlo explícitamente cuando se sueltan a la práctica: nadie se va con la sensación de no haber terminado por no haber hecho la B.

**Por qué `llama.cpp` y no vLLM en la Vía B**, y esta vez el contraste tiene un referente real en la sala: **el CCAD corre vLLM** detrás del gateway (el prefijo `vllm/` en el nombre del modelo lo delata) porque tiene muchos usuarios y necesita batching. El estudiante en su notebook tiene un usuario. `llama.cpp` resuelve ese problema; vLLM resuelve un problema que nadie en el aula tiene. Es la misma distinción de siempre entre runtimes, pero hoy se puede señalar con el dedo en vez de explicarla en abstracto.

## Audiencia y supuestos

- **Esta sesión ya no es la más terminal-heavy de las seis.** La versión anterior de este archivo avisaba de SSH, claves, scheduler y port forwarding. Para la Vía A, todo eso desapareció: editar un JSON y correr `/model`. La Vía B es más técnica, y es opcional a propósito.
- **Pi es el vehículo** — el mismo harness de todas las sesiones, ahora apuntado a otro modelo. Nada de la Sesión 5 es requisito. Lo que sí hace falta es que Pi siga andando en su máquina, que después de cinco sesiones es una apuesta segura.
- **Llegan con su repo, su `AGENTS.md` y sus skills de la Sesión 3.** Ese es el insumo de la práctica y no lo podemos generar nosotros. Avisarlo la semana anterior.
- **La cuenta del CCAD dejó de ser requisito bloqueante.** Si la API key alcanza, la práctica no depende de que la cuenta esté aprobada. **Igual hay que seguir recomendándola con semanas de anticipación**, por dos razones: es un aprendizaje que les sobrevive al curso, y es la puerta a correr algo en hardware real después. Pero ya no puede voltear la clase. **Confirmar con Ale si la key es independiente de la cuenta** (ver Pendiente de Ale).
- **Nadie tuvo exposición previa a HPC.** El bloque de mecánica de cluster ahora es cultura general y no instrucciones de uso, lo que lo hace más corto y más fácil de dar.
- **No asumir que entienden qué es una API key** ni qué implica pegarla en un archivo. Es la primera vez en el curso que manejan una credencial propia y hay que decir en voz alta que no se commitea.

## Plan tema por tema

### Recap y compartir de la Sesión 5 (~10 min)

Discusión, no slides. Qué hicieron, qué se les rompió, qué les sorprendió del loop por dentro.

**Coordinar con Agus antes de la clase**: la Sesión 5 está en `TBD`, así que este bloque se escribe recién cuando su sesión exista. Preguntar con qué quedaron en la mano y si alguien terminó con un cliente propio andando — eso define si la extensión del final tiene público.

Este es el bloque elástico: **si el día se estira, se recorta de acá** (mismo criterio que las Sesiones 2 y 3).

### Invitado: Ale Silva — intro al CCAD (~20-25 min)

Entregar la sala. Alcance sugerido para proponerle (confirmar contra el hilo de mail):

- Qué es el CCAD y a quién le sirve (facultades de la UNC, el Observatorio, organismos externos; creado por Ordenanza HCS 18/2010).
- Cómo es el hardware de verdad, y qué clusters tienen GPU.
- Quién puede pedir cuenta y cómo funciona el trámite en la práctica.
- Para qué se usa normalmente el HPC en la UNC — el punto es que la inferencia de LLMs es una recién llegada a máquinas construidas para simulación, y ese contraste le interesa genuinamente a estudiantes de computación.
- **Si quiere, el gateway visto desde adentro**: por qué el CCAD decidió poner un LiteLLM adelante, qué hay atrás, y qué problemas les resuelve. Es un regalo pedagógico si él tiene ganas de contarlo, porque es exactamente lo que los estudiantes van a usar veinte minutos después.
- Clusters Latam (Argentina / Chile / Colombia / Uruguay) si quiere ir más ancho.

Preguntarle qué prefiere cubrir; no sobre-especificar la charla de un invitado. Confirmar si quiere slides, un tour en vivo del dashboard, o solo hablar.

### Open source vs. pesos abiertos, y licencias (~8 min)

La distinción que casi nadie hace bien, y tiene que ir antes de la tabla del espectro o el resto del bloque queda impreciso.

- **Pesos abiertos**: podés descargar los pesos y correrlos. Eso es todo.
- **Open source** en sentido fuerte: además tenés el código de entrenamiento y suficiente información sobre los datos para reproducir el modelo.
- Casi todo lo que se vende como "IA open source" es **pesos abiertos** — te dan el binario, no la receta. La analogía honesta es un ejecutable gratis, no código fuente. Usar "pesos abiertos" en clase donde corresponde; la sloppiness está en el marketing de la industria, no en los estudiantes.

**Y después las licencias**, porque es donde la distinción tiene consecuencias:

- **Licencias de software estándar** (Apache 2.0, MIT): uso comercial libre, derivados, redistribución.
- **Licencias propias con restricciones** (la community licence de Llama, los términos de Gemma): límites de uso, cláusulas de escala, obligaciones de naming, políticas de uso aceptable pegadas.
- **Restricciones sobre la salida** — algunas licencias prohíben usar las generaciones para entrenar otros modelos.

Las tres preguntas que un estudiante tiene que poder contestar antes de meter un modelo en un proyecto: ¿lo puedo usar comercialmente? ¿puedo redistribuir un fine-tune? ¿de quién es lo que genera?

**El gancho que este bloque ahora tiene y antes no**: el modelo que van a usar hoy es de la familia **Gemma**, o sea **licencia propia de Google, no Apache**. Deja de ser un ejemplo hipotético: es la licencia del modelo al que están por apuntar su repo. Abrir los términos en pantalla treinta segundos y que la lean.

**Verificar la licencia de la versión exacta la semana de la clase** — las licencias cambian entre versiones de la misma familia, y es el tipo de error que da vergüenza cometer frente a una sala.

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

- **Los pesos son grandes.** Cantidad de parámetros × bytes por parámetro ≈ piso de VRAM, antes del contexto. **Hacer la cuenta en vivo con el modelo de hoy**: 26 mil millones de parámetros × 2 bytes ≈ **52 GB**, sin contar el contexto. Ese número explica solo por qué el modelo está en el CCAD y no en su notebook, y por qué la Vía B usa algo mucho más chico. Es el mejor minuto del bloque.
- **La cuantización** cambia precisión por VRAM. Mencionar que los modelos muy cuantizados se degradan en salida estructurada — que es exactamente tool calling. Esto vuelve en la discusión del final.
- **Dos familias de runtime**: local/mono-usuario (**llama.cpp**, Ollama) vs. serving (**vLLM**, SGLang — batching, throughput, muchos usuarios concurrentes). Y ahora la distinción tiene un referente: **el CCAD corre vLLM**, ustedes en la Vía B corren llama.cpp, y la razón es cuántos usuarios tiene cada uno.
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
        { "id": "vllm/gemma4-26b" }
      ]
    }
  }
}
```

Cuatro cosas para frenar, y cada una es un concepto que ya tienen:

- **`api: "openai-completions"`** es la historia de interoperabilidad del bloque anterior convertida en un string que tipean. Los valores posibles son `openai-completions`, `openai-responses`, `anthropic-messages` y `google-generative-ai`: cuatro formas de API para todo el ecosistema. El CCAD no expone una API "del CCAD": expone la misma que expondría Ollama en su notebook, o LM Studio, o vLLM crudo. **Por eso el swap cuesta cinco líneas.**
- **`apiKey: "$CCAD_API_KEY"`** — el campo acepta interpolación de variables de entorno (`$VAR`, `${VAR}`) y también ejecutar un comando si arranca con `!`. **Usar la variable, no la key literal**, y decir en voz alta por qué: la key literal en un archivo es la key literal en un backup, en un screenshot del proyector y —el día que a alguien se le ocurra versionar su dotfiles— en un repo público. Es la primera credencial propia del curso y es el momento de enseñar el reflejo.
- **`{ "id": "vllm/gemma4-26b" }`** — el `id` es lo que se manda a la API y es lo que van a ver en el picker de `/model`. El prefijo `vllm/` es routing de LiteLLM y de paso les cuenta qué hay atrás.
- **Lo que *no* está en el JSON, y es la mejor parte.** `contextWindow` tiene default **128000** y `maxTokens` default **16384**. O sea: la ventana de contexto es un número que alguien eligió, y hoy lo eligió el CCAD del lado del servidor. Después de cinco sesiones tratando la ventana de contexto como una propiedad del producto que compraron, resulta ser un parámetro de arranque. **Si el default no coincide con lo que el servidor tiene configurado, los requests van a fallar** — fijar `contextWindow` explícitamente con el valor que confirme Ale, y usar esa corrección como la demostración de que el número es una decisión y no una ley.

Y el detalle operativo que hace fácil la práctica: **el archivo se relee cada vez que abrís `/model`**, sin reiniciar nada. Cambiar de modelo cuesta dos segundos.

### Demo: la GPU portátil de Agus (~6 min)

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

### Un cluster no es tu notebook — qué hay detrás de esa URL (~8 min)

El bloque cambió de función: ya no son instrucciones de uso, es **explicar qué hizo el CCAD para que ellos no tengan que hacerlo**. Se da más rápido y se entiende mejor.

- **Nodo de login vs. nodo de cómputo.** El modelo no corre donde te conectás.
- **El scheduler.** Describís un trabajo (cuántas GPU, cuánto tiempo) y esperás tu turno. Es el salto mental más grande respecto de una notebook: en un cluster, "correr algo" es pedir permiso y hacer fila.
- **Módulos y entornos** para el software.
- **Por qué existe un gateway de inferencia.** Si cada usuario tuviera que pedir una GPU, cargar los pesos y armar un túnel para hacer una pregunta, nadie usaría el cluster para esto. Un servidor de inferencia levantado una vez, compartido, con batching y detrás de una URL con auth, convierte una hora de trabajo en un request. **Eso es lo que le compraron a ustedes hoy.**
- **Etiqueta de recurso compartido**: hay gente corriendo su tesis en esas máquinas. Hoy no piden GPU, pero comparten un modelo servido: rate limits y no dejar corriendo tareas absurdas por curiosidad.

La frase para cerrar el bloque, y es la que conecta con la Vía B: *"nada de esto se volvió gratis. Alguien lo paga. Hoy no fueron ustedes — y en la Vía B, por un rato, sí."*

**Verificar contra el setup real del CCAD** antes de ponerlo en una slide.

### Sidebar de seguridad y confianza (~5 min)

Cierra el hilo transversal de seguridad del curso, y el gateway le regaló el mejor punto:

- **Un gateway también es un tercero.** "Corre en hardware de la UNC" no es lo mismo que "nadie ve mis prompts". Entre su terminal y el modelo hay un proxy que puede loguear, y eso es una pregunta legítima que hay que hacerle al operador. **Hacerla en clase, incluso sin la respuesta**: modelar la pregunta vale más que contestarla. Y de paso desarma el reflejo fácil de "self-hosted = privado".
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

El flujo entero: pegar `models.json` → exportar la key → abrir `/model` → elegir `vllm/gemma4-26b` → darle una tarea **en su propio repo** → repetir la misma tarea con el modelo hosteado → anotar.

**Lo que hay que vigilar caminando la sala:**

- **La tarea va en su repo, con su `AGENTS.md` y sus skills de la Sesión 3. No en un directorio de prueba.** Es el paso que hace aterrizar la sesión y no cuesta nada: todo el punto es que el andamiaje sobrevive al cambio de modelo. El que lo hace en `/tmp` hizo un ejercicio de configuración, no la clase.
- **La tarea tiene que ser multi-paso y con al menos dos llamadas a tools.** Si le piden algo de un solo turno, los dos modelos van a parecer iguales y la comparación no dice nada. El ejemplo que funciona: *"leé estos dos archivos y arreglá la inconsistencia entre ellos"*.
- **Dos sesiones limpias, no una sesión con `/model` en el medio.** Para que la comparación sea justa los dos modelos tienen que arrancar del mismo contexto. Es más prolijo y además les enseña algo sobre metodología.
- **Que anoten mientras pasa, no después.** Cuatro cosas: ¿respetó el schema de las tools?, ¿cuántos turnos necesitó?, ¿inventó nombres de archivos o funciones?, ¿cómo se sintió la latencia? Esos apuntes son el insumo de la discusión posterior; sin ellos la discusión se contesta con opiniones.
- **El error más probable no es conceptual, es un typo en el JSON o la key sin exportar.** Tener el snippet en una slide, listo para copiar, y la key en pantalla o en un papel. Cero descubrimiento en este paso: el descubrimiento es lo que viene después.

### Vía B — servirlo vos (opcional, ~20-25 min)

Para quien tenga GPU local, o de a dos con alguien que tenga. `llama-server` con un modelo **chico y cuantizado** (no 26B: la cuenta de VRAM ya explicó por qué), después `/login llama.cpp` → `/llama` → `/model`, y la misma tarea otra vez.

- **En CPU también anda, y va lento. Eso también es el dato** — decirlo, así el que no tiene GPU igual lo intenta.
- El entregable no es un modelo mejor: es la comparación a tres puntas y haber sentido lo que el gateway les tapó.
- **Nadie tiene que terminar esto.** Repetirlo al soltarlos y otra vez a los quince minutos.

### Extensión — para quien haya terminado la Sesión 5

Apuntar su propio loop a la misma base URL de LiteLLM. Mismo endpoint, dos clientes. Es una oferta genuina y no un premio consuelo: con el gateway es una línea de config, no una tarde.

## Timing de la sesión (~2 h 50 — **no entra en 2 h**, ver la variante de abajo)

| Bloque | Tiempo |
|---|---|
| Recap y compartir de la Sesión 5 | 10 min |
| **Invitado: Ale Silva — intro al CCAD** | **20-25 min** |
| Open source vs. pesos abiertos, y licencias | 8 min |
| Pesos abiertos vs. API hosteada (el espectro) | 8 min |
| Qué hace falta para correr uno (VRAM, cuantización, runtimes) | 10 min |
| **`models.json`: el modelo como config** | **8 min** |
| Demo: la GPU portátil de Agus | 6 min |
| Un cluster no es tu notebook | 8 min |
| Sidebar de seguridad y confianza | 5 min |
| Pausa | 5 min |
| **Práctica: Vía A (todos) + Vía B (opcional)** | **50-55 min** |
| ¿Está a la altura de un proyecto serio? | 10 min |
| Cuándo conviene open source | 8 min |
| Cierre del curso y retrospectiva | 15 min |

Da entre **2 h 51 y 3 h 01**. El resto de las sesiones son de 2 horas, así que **este plan no entra** y hay que decidir antes de la clase, no en el momento.

Notar el orden: "¿está a la altura?" y "cuándo conviene" van *después* de la práctica a propósito. Las discusiones de criterio salen mejor cuando ya midieron algo propio.

### La variante de 2 horas

Si la sesión es de 2 horas —el caso más probable— este es el recorte, ya resuelto:

| Bloque | Tiempo |
|---|---|
| Recap | 8 min |
| **Invitado: Ale Silva** | **20 min** |
| Open source vs. pesos abiertos + licencias | 6 min |
| El espectro + qué hace falta para correr uno (fusionados) | 10 min |
| **`models.json`: el modelo como config** | **6 min** |
| Un cluster no es tu notebook | 6 min |
| Sidebar de seguridad | 4 min |
| **Práctica: solo Vía A** | **35 min** |
| ¿Está a la altura? + cuándo conviene (fusionados) | 10 min |
| Cierre del curso y retrospectiva | 12 min |

Da 117 minutos. Los movimientos: **la Vía B pasa a ser un apéndice escrito en el ejercicio** para hacer en casa, y **la demo de Agus pasa a suceder durante la práctica** en vez de tener slot propio — el que la quiere ver, se acerca. Se pierde el momento en que toda la sala ve la VRAM y los tokens por segundo a la vez, y eso es una pérdida real; es el precio.

**Proteger, en este orden: el slot del invitado, la Vía A completa con la comparación, y la retrospectiva de cierre.** Si algo de esos tres se recorta, la sesión pierde lo que la justifica.

## Cierre del curso (~15 min)

No es el cierre de la sesión, es el cierre de las seis. Merece que no lo agarre el reloj.

Vale tener presente la estructura, porque cambia qué hay que decir acá: las sesiones 1 a 4 son el **curso base** y **la Sesión 4 ya cerró ese arco** (costo, límites, carrera, atrofia). Las 5 y 6 son el **arco avanzado**, y los estudiantes lo saben desde la Sesión 1. Así que este cierre no tiene que volver a cerrar los fundamentos: cierra el arco avanzado y, con él, el curso.

- **Abrir el repo y mirar el primer commit.** Lo que escribieron en la Sesión 1 contra lo que tienen hoy.
- **Volver a la slide del espectro de la Sesión 1**, la misma, sin retocarla. Pedirle el archivo a Diego y no rehacerla: parte del efecto es que reconozcan la slide.
- **El takeaway**: todo lo de las Sesiones 2 a 5 —planificación, review, tests, contexto, tools, harness— se transfiere entre modelos. Es exactamente lo que acabaron de comprobar a mano hace media hora. Por eso el curso enseñó estructura y no un producto.
- **Cerrar donde empezó**: la Sesión 1 les dio tres palabras, LLM + tool + harness. Hoy cambiaron la primera y todo lo demás siguió en pie.

**Lo que NO va acá, y es una decisión, no un olvido**: costo y límites, atrofia de habilidades, cuándo NO usar IA, y las implicancias para su carrera. Todo eso **cierra la Sesión 4**, que es el final del primer arco del curso (*"¿cómo trabajo bien con esta cosa?"*). Los dos cierres se reparten **por tipo y no por jerarquía**: la Sesión 4 se queda con el material de criterio humano, y esta sesión con el material de artefacto — el repo, el espectro y la tesis de la transferencia. Es lo que hace que este cierre entre en 15 minutos, y evita gastar el final del curso dos sesiones antes. Si Agus recorta su cierre, avisar: son cuatro temas que si no los da él, no los da nadie.

## Pendiente de Ale (hilo de mail)

**Estas notas se escribieron sin el hilo de mail.** Tratar todo como no verificado hasta chequearlo. La lista cambió por completo respecto de la versión anterior de este archivo: se cayeron los pedidos sobre pre-staging de GGUF, `llama.cpp` como módulo, internet de salida en los nodos de cómputo, política de trabajos interactivos, port forwarding y reserva de GPU para la ventana de la clase. **Toda esa categoría de riesgo desapareció con el gateway.**

Lo que hay que preguntar ahora, en orden de prioridad:

1. **Concurrencia y rate limits** con 25-30 estudiantes pegándole al gateway a la vez durante una hora. **Este es el nuevo riesgo más grande de la sesión** y ocupa el lugar que tenía la cola de GPU. Si hay límite por key, saberlo antes cambia el diseño de la práctica.
2. **Las keys**: ¿una key del curso compartida o una por estudiante? ¿Quién las emite, con cuánta anticipación, y siguen andando después del curso? (Que sigan andando sería un cierre lindísimo del curso; que no, hay que avisarlo.)
3. **¿El gateway loguea prompts?** Necesario para que el sidebar de seguridad sea honesto. Es la pregunta que vamos a hacer en voz alta en clase.
4. **Qué modelos hay en el gateway** además de `vllm/gemma4-26b`, y **con qué ventana de contexto está configurado el servidor**, para pinear `contextWindow` con el número correcto en vez del default de 128k.
5. **¿La `baseUrl` es correcta sin `/v1`?** LiteLLM sirve las dos formas y Pi construye el path; hay que probar el string exacto. Es un detalle de dos minutos que puede voltear la práctica entera.
6. **¿Sigue haciendo falta una cuenta del CCAD para esto?** Si la key alcanza, la cuenta deja de ser requisito bloqueante — seguimos recomendándola por su propio valor, pero cambia lo que les pedimos como pre-work.
7. **El slot de Ale**: alcance, duración, presencial o remoto, si quiere slides. Y si el CCAD quiere algún reconocimiento o tiene materiales/branding que prefiera que usemos.

Cuando el hilo esté leído, bajar las respuestas a este archivo y recién entonces escribir el ejercicio contra los valores reales.

## Puentes entre sesiones

- **Sesión 3** → el pago que nadie espera. Su `AGENTS.md`, sus skills y su config siguen funcionando contra un modelo que corre en un cluster de la UNC. Todo lo que construyeron en la Sesión 3 nunca fue sobre el modelo. Y un detalle concreto: `models.json` vive en `~/.pi/agent/`, al lado del `AGENTS.md` global que escribieron esa semana.
- **Sesión 4** → la ventana de contexto vuelve como un parámetro de arranque del servidor, no como una propiedad del producto. Y el otro modelo de costo: por hora y por GPU, no por token — el por-token lo cerró Agus en su sesión. **Los dos cierres se reparten**: él cierra el primer arco con costo, límites, carrera y atrofia; nosotros cerramos el curso. Coordinarlo con él, porque todavía no escribió esa sesión.
- **Sesión 1** → LLM + tool + harness: hoy cambiamos la L. Es la simetría del cierre del curso.
- **Sesión 5** → **ya no es dependencia.** La práctica corre sobre el gateway, así que sobrevive a cualquier forma que tome la sesión de Agus. Sigue valiendo coordinar: si su práctica produce un cliente, la extensión del final tiene público, y él puede armar el pase en su cierre. Agus está en el aula igual con su GPU portátil.
- **Hilo transversal de seguridad** → cierra acá, con tres puntas: cadena de suministro de modelos, self-hosting como responsabilidad de operador, y **el gateway como tercero**, que es la punta nueva y la más útil.

## Herramientas y recursos referenciados

- **El gateway del CCAD** — `https://litellm.ccad.unc.edu.ar`, API compatible con OpenAI, modelo `vllm/gemma4-26b`. Es el vehículo de la práctica. La key se entrega en clase y **no se commitea**.
- [Pi — modelos y providers custom](https://pi.dev/docs/latest/models) — la doc en la que se apoya el bloque de `models.json`. Config en `~/.pi/agent/models.json`, se relee al abrir `/model`. `api` acepta `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`. `apiKey` acepta `$VAR` / `${VAR}` e `!comando`. Defaults: `contextWindow` 128000, `maxTokens` 16384.
- [Pi + llama.cpp](https://pi.dev/docs/latest/llama-cpp) — la Vía B. `llama-server --models-dir ~/models --no-models-autoload --jinja --host 127.0.0.1 --port 8080 -ngl 999 -c 32768`, después `/login llama.cpp` (o `LLAMA_BASE_URL`, default `http://127.0.0.1:8080`), `/llama` para cargar o buscar en Hugging Face, `/model` para seleccionar.
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — el runtime de la Vía B.
- [LiteLLM](https://github.com/BerriAI/litellm) — lo que el CCAD tiene adelante. Vale nombrarlo: es el patrón de gateway/proxy para inferencia, y explica el prefijo `vllm/` en el nombre del modelo.
- vLLM / SGLang — **lo que corre el CCAD atrás**, y la otra familia de runtime en la teoría. Ya no es un ejemplo hipotético.
- [CCAD — Centro de Computación de Alto Desempeño, UNC](https://supercomputo.unc.edu.ar/ccad/) · [wiki](https://wiki.ccad.unc.edu.ar/) · [abrir cuenta](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) · [equipamiento](https://supercomputo.unc.edu.ar/equipamiento/)
- [Pedido de cuentas](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/) · [uso intensivo](https://supercomputo.unc.edu.ar/servicios/pedido-de-uso-intensivo-ventanilla-permanente/) · [soporte a usuarios](https://supercomputo.unc.edu.ar/servicios/soporte-usuarios/)
- [Estado del servicio](https://stats.uptimerobot.com/eLhTV5CMni) · [dashboard](https://stats.ccad.unc.edu.ar/) — chequear antes de la clase.
- **La GPU portátil de Agus** — demo de la columna "tu propio hardware" y cara visible de la Vía B.
- Licencias: los model cards de Hugging Face (el campo de licencia y el LICENSE del repo). Leer el texto real de lo que nombremos, no un resumen. Para hoy, en particular, **los términos de Gemma**.

## Lo que dejamos afuera a propósito

- **Servir el modelo en el cluster nosotros mismos** (pedir GPU, `sbatch`, túnel SSH): era el diseño anterior de esta sesión y el gateway lo volvió innecesario. Queda como teoría en "un cluster no es tu notebook" y como Vía B en versión local. Si alguien pregunta cómo se hace de verdad en el cluster, hay una respuesta de dos minutos y un puntero a la wiki.
- **Fine-tuning / LoRA**: es un curso aparte y no entra en una sesión.
- **Multi-GPU e inferencia distribuida**: interesante y no lo necesita nadie hoy.
- **Benchmarking riguroso de abierto vs. hosteado**: un side-by-side cualitativo sobre su propia tarea enseña el punto; una eval de verdad no entra.
- **Entrenar cualquier cosa**: explícitamente afuera. Decirlo temprano o alguien va a pedir el resto de la sesión.
- **Un tour por cada familia de modelos de pesos abiertos**: se mueve rápido y como lista vale poco. Un modelo que funciona, bien usado.
- **Cómo funciona LiteLLM por dentro**: se nombra como patrón y se sigue. Es infraestructura del CCAD, no contenido del curso.

## Pendientes (para próximas iteraciones)

- **Correr la Vía A de punta a punta antes de la clase, en una máquina limpia**: `models.json` → key → `/model` → una tarea real en un repo real con su `AGENTS.md`. Es el único ensayo que importa y ahora es corto, así que no hay excusa para no hacerlo.
- **Verificar que `vllm/gemma4-26b` emita tool calls válidos a través de LiteLLM**, contra un `AGENTS.md` de verdad y con varias tools cargadas. **Es el único punto que puede voltear las dos vías**: un modelo que escribe bien pero no puede producir un tool call válido hace que la práctica no tenga nada que mostrar. Probar el modelo concreto, no la familia.
- **Probar la `baseUrl` exacta**, con y sin `/v1`, y dejar en la slide la que funcione.
- **Probar concurrencia**: 25-30 requests simultáneos contra el gateway. Si hay rate limit, definir si se practica de a dos o en dos oleadas.
- **Definir cómo se entregan las keys** y no improvisarlo en el aula. Si es una key compartida, tenerla en una slide; si es una por estudiante, repartirlas antes. Y **no dejar la key en un archivo commiteado del repo del curso** — en el material va `$CCAD_API_KEY`.
- **Fijar `contextWindow`** con el valor real del servidor, apenas Ale lo confirme.
- **Verificar la licencia de Gemma para la versión exacta**, la semana de la clase.
- **Confirmar que Agus trae la GPU portátil**, qué modelo va a servir, y probarlo. Ya no es el respaldo de la sesión, así que si no llega no se cae nada — pero es el mejor momento visual del día.
- **Confirmar la participación de Ale, fecha y formato**, y tener plan B: su intro pasa a ser una versión de 10 minutos dada por nosotros más el link a la wiki.
- **Decidir la duración real de la sesión** y, si son 2 horas, adoptar la variante de arriba de entrada en vez de improvisar recortes.
- ~~Decidir quién cierra el curso~~ → **decidido: se reparte por tipo.** La Sesión 4 cierra el primer arco (costo, límites, carrera, atrofia); esta sesión cierra el curso (el repo, el espectro, la tesis de la transferencia). La duplicación era un resto de cuando el curso tenía 4 sesiones y la 4 era el final. **Avisarle a Agus**, porque le cambia el cierre de una sesión que todavía no escribió.
- **Coordinar con Agus el recap de la Sesión 5**, que todavía está en `TBD`.

### Las slides y el ejercicio hay que escribirlos de nuevo

**`slides.md` y `exercise/README.md` se borraron**, no se parchearon. Estaban escritos contra el diseño anterior —entrar por SSH, ganarle a la cola, servir el modelo, forwardear el puerto, cambiar la base URL del agente de la Sesión 5— y no quedaba casi nada rescatable: el ejercicio era literalmente ese flujo paso por paso. Están en el historial de git si hace falta mirarlos: `git log --diff-filter=D -- sessions/session-6/slides.md` te da el commit que los borró, y `git show <commit>^:sessions/session-6/slides.md` el contenido.

Lo que hay que tener presente al escribirlos:

- **Las slides** necesitan una que no existía y que ahora es el centro de la sesión: el `models.json` completo, para copiar textual. Igual que en la Sesión 3, la mayoría de las slides son título + nota de orador, pero las que la sala tiene que copiar o leer llevan cuerpo: el JSON del provider, la tabla del espectro, el comando de `llama-server`, y la cuenta de VRAM. Lo que se puede reusar del esqueleto viejo son los bloques de teoría que no cambiaron (licencias, espectro, cuantización, seguridad, cierre del curso).
- **El ejercicio** se estructura como Vía A + Vía B, no como pasos numerados de uno a seis. La Vía A tiene que poder resolverse sin descubrir nada: el JSON listo para copiar, la key a mano, y todo el esfuerzo del estudiante puesto en la tarea que le da al agente y en anotar la comparación. La Vía B va como apéndice, con la advertencia de que no terminarla no es no haber hecho el ejercicio.
- **No escribir el ejercicio antes de leer el hilo con Ale.** La `baseUrl` exacta, el `contextWindow` y la forma de las keys son datos que van textuales en el material y que hoy no tenemos.

El resto de las dependencias ya está arreglado: `COURSE_PROGRAM.md` (Tier 6, sección de la Sesión 6, preguntas abiertas y recursos), `sessions/session-5/INSTRUCTOR.md`, `open_source_models.md` y el `README.md` de la raíz.
