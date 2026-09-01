# Sesión 6 — Modelos open source y CCAD (Notas para el instructor)

> 🔴 **TO REVIEW** — este archivo lo generó Claude y **Diego todavía no lo revisó**.
> Tratar cada afirmación, cada timing y cada decisión pedagógica como una propuesta, no como algo cerrado.

> 🟢 **La forma de la sesión está decidida y son 2 h 30** (las otras son de 2 h; la Sesión 1 es de 3, así que hay precedente). **Cinco bloques, 150 minutos exactos:**
>
> | Bloque | Quién | Tiempo |
> |---|---|---|
> | **Modelos de pesos abiertos** | Diego | **30 min** |
> | **Correr un modelo en una GPU portátil** | Agus | **15 min** |
> | **El CCAD** | Ale Silva | **60 min** |
> | **Práctica — probar el CCAD** | todos | **30 min** |
> | **Retrospectiva del curso** | todos | **15 min** |
>
> **No hay recap de la Sesión 5, no hay pausa formal y no hay puesta en común.** Decidido así explícitamente: los cinco bloques dan 150 y no queda colchón para nada más.

## Decisiones tomadas

1. **Al CCAD se llega por un gateway LiteLLM**, y Pi se apunta ahí con un provider propio en `~/.pi/agent/models.json`. Los internals del servidor los cuenta Ale como parte de su slot.
2. **La práctica es una sola vía**: el gateway del CCAD, para todos. Nadie instala un runtime ni baja pesos — el swap es un archivo de configuración y `/model`.
3. **La GPU de Agus es una demo, no un endpoint.** Él muestra, la sala mira. No se sirve al aula y no hay una entrada suya en `models.json`.
4. **En la práctica cada uno elige qué prueba hacer** con el tiempo que tiene. No hay prueba obligatoria: las cuatro del ejercicio son un menú.
5. **Las keys las provee Diego**, emitidas desde su cuenta y repartidas antes de clase. Lo que Ale cuenta sobre pedir cuenta es el **camino de vuelta para después del curso**, por cuenta de cada uno — no es el acceso de hoy.
6. **El slot de Ale son 60 minutos y su programa es suyo** (los cuatro puntos están más abajo, textuales). **Va a nombrar LiteLLM y vLLM**, así que el Paso 0 los cobra como reconocimiento y no como dato nuevo.
7. **El corte entre el punto 4 de Ale y nuestro Paso 0 está acordado**: él llega hasta el endpoint, nosotros lo traducimos a Pi.
8. **Los 15 minutos finales son retrospectiva abierta**, entera.

### Datos del CCAD — confirmados

Van textuales al material. Ya no son incógnitas:

| | |
|---|---|
| `baseUrl` | `https://litellm.ccad.unc.edu.ar` (**sin** `/v1`) |
| modelo 1 | `vllm/gemma4-26b` |
| modelo 2 | `vllm/qwen3.8:30b` |

**Los dos están servidos.** El picker de `/model` va a mostrar los dos, así que el material lo puede afirmar sin cobertura condicional.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo que **el modelo es un componente reemplazable** — habiéndolo reemplazado ellos, en su propio repo, con su propio `AGENTS.md`, contra un modelo de pesos abiertos corriendo en hardware de la UNC.

La frase de la sesión:

> *"Cambiás el modelo editando cinco líneas de JSON, y nada de lo que construiste en cinco sesiones se cae."*

## Por qué esta sesión existe, y por qué va al final

Las sesiones 1 a 5 usan un modelo hosteado detrás de una API. Es un default sensato y también un supuesto que nadie examinó. Esta sesión lo rompe:

- **Los pesos abiertos son una opción real**, con tradeoffs reales: privacidad, estructura de costos, uso offline, reproducibilidad para investigación — contra capacidad, confiabilidad en tool calling y carga operativa.
- **El CCAD existe y estos estudiantes lo pueden usar.** La mayoría de la sala no sabe que la UNC opera un centro de cómputo de alto desempeño al que se puede pedir cuenta.

Va al final porque aterriza mejor después de la Sesión 5 — pero **no depende de ella**.

> ✅ **La logística se resuelve con un gateway**, y es lo que hace posible dar esta clase. El CCAD se expone como un gateway **LiteLLM** con endpoint compatible con OpenAI. Pi habla con eso nativamente: se agrega un provider en `~/.pi/agent/models.json`, se abre `/model`, se elige el modelo. Eso es **todo** el setup de la práctica.

**Y la lección se fortalece, no se debilita.** Apuntar un harness escrito a mano a otro modelo probaría que el harness es agnóstico del modelo. Apuntar **Pi** a otro modelo prueba algo que al curso le importa mucho más: **el `AGENTS.md`, los skills, el plan mode, el flujo de review — todo lo de las Sesiones 2 y 3 — sigue funcionando cuando le cambiás el modelo abajo.**

## El orden de los bloques, que es la mejor parte del diseño

Los tres bloques expositivos escalan, y las notas de orador lo tienen que decir en voz alta al hacer cada transición:

**Abstracto** (qué es un modelo, qué son los pesos, qué es cuantizar)
→ **una GPU en un escritorio** (16 GB reales, a tres metros, ahora mismo)
→ **un centro de cómputo nacional** (clusters, métricas, un servicio para muchos usuarios)
→ **la sala le pega a ese centro**.

Dos cobros concretos que este orden habilita y que hay que aprovechar:

- **La cuenta de cuantización deja de ser una slide y pasa a ser una medición.** La teoría hace la cuenta en el pizarrón; quince minutos después Agus tiene la VRAM real en pantalla. Ver abajo, en su bloque, por qué ese contraste es incluso mejor de lo que parece.
- **El punto 4 de Ale desemboca en el Paso 0.** Él termina contando cómo se hace la primera llamada a sus modelos; nosotros arrancamos traduciendo eso a `models.json`. El callback a LiteLLM y vLLM no es "hace media hora": es "recién".

## Audiencia y supuestos

- **La práctica pide muy poca terminal**: editar un JSON, exportar una variable y correr `/model`.
- **Pi es el vehículo** — el mismo harness de todas las sesiones, ahora apuntado a otro modelo. Nada de la Sesión 5 es requisito. Lo que sí hace falta es que Pi siga andando en su máquina, que después de cinco sesiones es una apuesta segura.
- **Llegan con su repo, su `AGENTS.md` y sus skills de la Sesión 3.** Ese es el insumo de la práctica y no lo podemos generar nosotros. **Avisarlo la semana anterior.**
- **La cuenta del CCAD no es requisito**: la práctica entra con una API key que emite Diego. Igual conviene recomendarla con semanas de anticipación, porque el punto 4 de Ale es exactamente cómo se pide y qué habilita, y el que llegue con la cuenta aprobada escucha instrucciones y no anécdotas.
- **Nadie tuvo exposición previa a HPC.** El punto 1 de Ale existe justamente por eso.
- **No asumir que entienden qué es una API key** ni qué implica pegarla en un archivo. Es la primera vez en el curso que manejan una credencial propia y hay que decir en voz alta que no se commitea.

## Plan tema por tema

### Modelos de pesos abiertos — el bloque de Diego (30 min)

> 📖 **Este bloque es [*A Deep Dive into Open-Weight AI Models*, de Flavio Copes](https://flaviocopes.com/open-weight-models/), dado en español.** No es una referencia de apoyo: es el contenido. Lo que compramos al adoptar su orden es que **cada pieza habilita la siguiente** y que el bloque termina en un criterio para elegir un modelo, en vez de terminar en una lista de datos sueltos.
>
> **Lo único que hay que cambiarle**: el post trabaja sus ejemplos sobre un modelo suyo. Nosotros los hacemos **sobre los dos modelos que sirve el gateway**, que son a los que van a apuntar su repo al final de la clase.

| # | Sub-bloque | Min |
|---|---|---|
| 1 | Qué es un modelo: arquitectura + pesos | 3 |
| 2 | Qué significa "pesos abiertos", y por qué no es open source | 5 |
| 3 | Licencias: qué te dejan hacer | 6 |
| 4 | Qué pasa cuando te bajás un modelo | 5 |
| 5 | Cuantización | 4 |
| 6 | Por qué importan, y qué no garantizan | 5 |
| 7 | Cómo elegir uno | 2 |

> ⚠️ **Este bloque abre la sesión, así que todo lo que diga sobre el CCAD es anticipación y no callback.** La sala todavía no escuchó a Ale ni vio la GPU de Agus. Decir "el modelo al que le van a pegar al final de la clase" y no "el que les explicó Ale": ese callback recién existe en el Paso 0.

**`models.json` no vive acá**: se camina al arrancar la práctica, con la sala tipeando al mismo tiempo. Es setup, y se da cuando se usa.

#### 1. Qué es un modelo: arquitectura + pesos (~3 min)

**La analogía de la mesa de mezcla, que es la del post y funciona.** Un modelo es una consola de audio gigante con miles de millones de perillas chiquitas. Antes de entrenar, las perillas tienen valores al azar y el modelo no sirve para nada. Entrenar es: pasarle datos, que prediga, medir cuánto se equivocó, mover las perillas, y repetir millones de veces. **Los pesos son los valores que quedaron en las perillas.**

Adentro no hay perillas: hay miles de millones de números en **tensores**, que son arreglos multidimensionales. Cuando leen `8B` o `30B` en el nombre de un modelo, esa B son miles de millones de parámetros, y casi todos son pesos.

**La frase que ordena todo el bloque**: *"los pesos no son el código que entrena el modelo — son el resultado de entrenarlo"*. Son su estado aprendido.

**Y de ahí sale la distinción con la arquitectura**, que es lo que la sala nunca separó: la arquitectura define las capas, las conexiones, el mecanismo de atención, el camino que siguen los datos — y suele estar publicada en un paper. Los pesos son **los números aprendidos puestos adentro de esa arquitectura**, y son lo que costó millones. Dos modelos con arquitecturas parecidas se comportan distinto porque aprendieron de datos distintos o con objetivos distintos.

**Cerrar enumerando lo que hace falta para correr uno**: arquitectura y configuración, pesos, tokenizer, un runtime de inferencia (Ollama, llama.cpp, MLX, Transformers) y memoria suficiente. Contra eso, la frase del post: *"una API esconde todo esto detrás de un request HTTP"*. **Ese contraste es la sesión entera en una línea**, y conviene decirlo acá porque en quince minutos Agus va a mostrar exactamente esa lista, en su máquina, con todas las piezas a la vista.

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
- **Qwen3.8 30B — Apache 2.0.** Mismas tres respuestas: sí, sí, de ustedes.
- **El gancho: Gemma cambió de licencia entre versiones.** Gemma 2 y 3 salieron con términos propios de Google; Gemma 4 salió Apache 2.0. Misma familia, mismo nombre, mismo botón de descarga, derechos distintos.
- **El contraejemplo, para que el contraste exista**: la community licence de Llama, con cláusula de escala por cantidad de usuarios.

> ⚠️ **La trampa, y hay que tenerla clara antes de dar el bloque.** Si uno tiene en la cabeza que "Gemma es licencia propia de Google", eso vale para **Gemma 2 y 3** y **es falso para Gemma 4**. Verificado el 2026-08-24 contra el blog de Google. Decirlo mal justo en este bloque sería vergonzoso dos veces.

**La secuencia en pantalla, tres cards, medio minuto cada una**: el campo `license` de Gemma 4 (Apache 2.0), los términos de Gemma 3 (propios), y la community licence de Llama (propia, con cláusula de escala). Tres modelos que la sala llamaría "open source" sin pestañear, con tres regímenes de derechos distintos.

La frase del sub-bloque: *"«pesos abiertos» no te dice nada sobre lo que podés hacer con ellos. Eso lo dice la licencia — y la licencia cambia entre versiones del mismo modelo."*

#### 4. Qué pasa cuando te bajás un modelo (~5 min)

El sub-bloque que convierte "bajarse un modelo" de una idea vaga en algo concreto.

**Dos formatos, y vale nombrarlos porque los van a ver:**

- **safetensors** — guarda tensores **sin contenido ejecutable**, así que carga más rápido y es más seguro que los formatos viejos basados en pickle de Python. Que "más seguro" tenga una razón técnica y no sea un adjetivo es medio minuto bien gastado.
- **GGUF** — tensores más metadata en un solo archivo, que leen llama.cpp, Ollama y LM Studio. Mostrar un nombre real, `model-Q4_K_M.gguf`, y que vean que **el `Q4` es la cuantización**, que es el sub-bloque siguiente.

**Y después qué pasa cuando lo corrés**, que es el loop entero en cuatro pasos: el runtime lee la configuración, reserva memoria, carga los pesos y espera. Vos escribís algo, el tokenizer lo convierte en ids de tokens, el modelo pasa esos tokens por sus capas y usa los pesos para calcular probabilidades del siguiente token, elige uno, lo agrega a la secuencia y vuelve a empezar.

**La frase para cerrar**: *"nada tiene que llamar a una API en la nube. Las cuentas pasan en tu hardware."* Y avisar que en quince minutos eso deja de ser una afirmación: Agus lo va a hacer adelante de ellos.

**Y de ahí el puente al resto de la sesión, que es nuestro y son sesenta segundos**: casi cualquiera de esos runtimes expone un **endpoint compatible con la API de OpenAI**. Por eso cualquier harness se le puede apuntar sin que nadie se haya puesto de acuerdo con nadie. **Es la razón de que cambiar de modelo sean cinco líneas de JSON y no una tarde de trabajo** — y al final de la clase van a escribir esas cinco líneas.

#### 5. Cuantización (~4 min)

**La cuenta, en el pizarrón**, y es la del post:

```
30 mil millones de parámetros × 16 bits ÷ 8 = 60 GB
30 mil millones de parámetros ×  4 bits ÷ 8 = 15 GB
```

Cuantizar es guardar los pesos con menos bits. **Es la diferencia entre "esto no entra en ninguna máquina de esta sala" y "entra en varias"**.

**El tradeoff, dicho como lo dice el post y sin exagerar para ningún lado**: un archivo más chico usa menos memoria y a veces corre más rápido, pero bajar la precisión **puede** cambiar la calidad. Los métodos buenos de cuantización conservan bastante más de lo que sugiere la cuenta de bits pelada — **y aun así hay que probar ese modelo y esa cuantización en tu tarea**. No se deduce, se mide.

Y lo que hay que nombrar acá porque vuelve en la práctica: **lo primero que se degrada suele ser la salida estructurada**, que es exactamente el tool calling. O sea: lo que un coding agent necesita para funcionar.

> 💡 **Dejar la cuenta escrita en el pizarrón y no borrarla.** Agus la va a usar quince minutos después contra la VRAM real de su GPU, y ahí es donde la cuenta muestra lo que le falta. Ver su bloque.

#### 6. Por qué importan, y qué no garantizan (~5 min)

**Las cinco razones**, que es lo que contesta el "¿y para qué?" que la sala va a preguntar:

1. **La versión no se te mueve abajo de los pies.** El proveedor puede actualizar o retirar un modelo detrás del mismo nombre de API; el que te bajaste se queda quieto. *"Tu aplicación no cambia porque un proveedor reemplazó silenciosamente el modelo."*
2. **Los datos privados pueden quedarse en tu máquina.**
3. **Lo podés cambiar**: fine-tune, merge, cuantizar, estudiarlo. Y una comunidad lo adapta a hardware que el que lo publicó nunca probó, y le encuentra problemas que al creador se le pasaron.
4. **No quedás atado a un servicio.** El mismo modelo corre en varios runtimes y en varios proveedores: *"es portable de una manera en que una API cerrada no lo es"*.
5. **Los modelos chicos sirven como componentes**, no como el sistema entero. *"No necesitan ganar todos los benchmarks. Necesitan hacer una tarea útil de manera lo bastante confiable."*

**Y la lista de lo que NO garantiza, con el mismo peso y sin apurarla** — pesos abiertos no te asegura: buena calidad de salida, respuestas correctas, datos de entrenamiento sin sesgo, uso seguro de tools, hardware barato, generación rápida en tu máquina, permiso para usarlo como quieras, ni información para reproducir el entrenamiento.

**Lo que sí garantiza es que el operador pasás a ser vos**: elegir el runtime, asegurar la máquina, instalar las actualizaciones y medir la calidad. Nadie lo hace por vos. Y agregar el puente: *"en quince minutos van a ver a un operador; en cuarenta y cinco, a otro, con un cluster atrás"*.

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

Y cerrar con las dos frases del post:

> *"No elijas un modelo solo por un leaderboard. **El mejor modelo es el más chico que hace tu tarea suficientemente bien, en hardware que puedas operar.**"*

**Es la rampa a la demo de Agus, y conviene decirlo con esas palabras**: los puntos 2, 3 y 5 de este checklist —que entre en tu hardware, qué cuantización elegís, y lo que el contexto cuesta en memoria— son literalmente lo que él va a resolver en vivo, en los próximos quince minutos, con 16 GB.

### Demo: Agus y su GPU portátil (~15 min)

> 🟡 **El slot es de Agus y el contenido lo define él.** Lo que sigue es la propuesta y, sobre todo, **lo que el curso necesita de ese slot** — que es una cosa sola y está en el recuadro de abajo.

**El hardware**: una **MSI GeForce RTX 5070 Ti 16 GB GDDR7 Ventus 3X OC**, conectada por **Thunderbolt** (o sea, una eGPU externa, no una placa adentro de la máquina), con **Ollama** sobre **CUDA**.

Qué puede mostrar, en orden de cuánto le paga a la clase:

1. **La VRAM real contra la cuenta del pizarrón** — es el punto, ver el recuadro.
2. **`ollama pull` y `ollama run`**: la lista del sub-bloque 1 de la teoría (pesos, tokenizer, config, runtime, memoria) dejando de ser una enumeración y pasando a ser archivos que se descargan y un proceso que arranca. **Nada llama a una API en la nube**, que es la frase que quedó dicha quince minutos antes.
3. **Tokens por segundo**, para que la latencia se sienta en vez de describirse.
4. **La eGPU por Thunderbolt como tema propio**, si le interesa: una vez que los pesos están en la VRAM, el bus no es el cuello de botella de la generación — se paga sobre todo al cargar el modelo. Es un dato lindo y **es suyo para medir**, no nuestro para afirmar.
5. **CUDA**, en una frase: por qué en la práctica el ecosistema de inferencia asume NVIDIA, y qué implica eso si tu placa es de otra marca.

> 💡 **Lo que el curso necesita de este slot, y si sólo entra una cosa que sea ésta.**
>
> La teoría acaba de escribir en el pizarrón que un 30B a 4 bits son ~15 GB. La placa tiene **16 GB**. La lectura ingenua es *"entra justo"* — **y no entra**, porque los pesos no son lo único que vive en la VRAM: **la ventana de contexto también se paga ahí** (el KV cache), y crece con cada token de la conversación.
>
> Ese es el mejor momento de todo el bloque de teoría y hace falta una GPU real para tenerlo. Convierte el punto 5 del checklist —*"longitud de contexto, y lo que esa longitud cuesta en memoria"*— de un bullet en una restricción que la sala ve. Y prepara el terreno para lo que Ale cuenta después: **por eso el modelo grande vive en un cluster y no en una notebook.**
>
> Le da además la pregunta con la que cerrar su slot: *"con esto, ¿qué tamaño de modelo puedo correr de verdad?"* — y ahí encaja el número de Raschka, que midió hasta **~30 GB de RAM con contextos de 50k** ([*Using Local Coding Agents*](https://magazine.sebastianraschka.com/p/using-local-coding-agents)).

**Coordinar antes de la clase**: que traiga la GPU, que el modelo esté bajado (no bajarlo en vivo por la red del aula), que la salida de `nvidia-smi` o equivalente sea legible desde el proyector, y que el modelo que elija tenga plantilla de tools si quiere mostrar un tool call.

### Invitado: Ale Silva — el CCAD (~60 min)

**Entregar la sala.** El programa es de él y son estos cuatro puntos, textuales:

1. **Una breve introducción a HPC**: qué es, qué problema resuelve y por qué hacen falta clusters.
2. **UNC Supercómputo**: breve repaso de su historia, sus clusters y algunas métricas. Comparación con el resto de la región y el mundo.
3. **Nuevos servicios**: la experiencia de desplegar modelos con hardware limitado y convertir una prueba que funciona en un servicio razonablemente estable y usable por múltiples usuarios.
4. **Cómo usar los recursos del CCAD**: cómo pedir una cuenta, qué acceso obtienen los estudiantes y cómo realizar su primera llamada a nuestros modelos.

**Por qué este programa le cae perfecto a la sesión**, y conviene tenerlo claro para hacer bien las transiciones:

- **Su punto 1 es el escalón que falta.** Nadie en la sala tuvo exposición previa a HPC. Y viene justo después de ver una sola GPU en un escritorio, así que "por qué hacen falta clusters" tiene un referente concreto de quince minutos antes.
- **Su punto 3 es el corazón del slot para nosotros.** "Desplegar modelos con hardware limitado" y "convertir una prueba que funciona en un servicio usable por múltiples usuarios" es exactamente la historia de LiteLLM, vLLM y el batching, contada por el que la vivió en vez de explicada por nosotros. **Va a nombrar las dos herramientas**, y eso es lo que hace que quince minutos después `litellm.ccad.unc.edu.ar` y el prefijo `vllm/` no sean dos strings copiados de una slide.
- **Su punto 4 desemboca directo en el Paso 0.** El corte está acordado: **él llega hasta el endpoint y la primera llamada; nosotros lo traducimos a `models.json` de Pi.** No repetir lo suyo.
- **Y el punto 4 tiene dos mitades que hay que separar en voz alta al presentarlo**: cómo se pide una cuenta es **el camino de vuelta después del curso**, no el acceso de hoy. Hoy entran con la key que reparte Diego. Decirlo antes de entregarle la sala evita que media clase piense que necesita un trámite para la práctica.

**Decirle 60 con ese número.** Es el bloque más largo del día y el que más lo puede desbordar. Con 150 minutos exactos y sin colchón, si se estira lo único que hay para recortar es la práctica — que es lo único que la sala hace con las manos. Si hay que priorizar dentro de su programa, sus puntos 3 y 4 son los que nadie más puede dar.

**Dejar proyectada la slide de los cuatro puntos durante todo su slot**: le sirve de reloj a él y de mapa a la sala.

### Práctica — probar el CCAD (30 min)

**Media hora, una sola vía, y nadie instala un runtime.** El swap es un archivo de configuración y `/model`.

| | Quién | Tiempo |
|---|---|---|
| Paso 0 — `models.json` | todos, juntos y en voz alta | 8 min |
| Una prueba **a elección** | cada uno | 22 min |

**Decir la etiqueta de recurso compartido al soltarlos, en una frase**: hay gente corriendo su tesis en esas máquinas, así que respetar los rate limits y no dejar tareas absurdas corriendo por curiosidad.

#### Paso 0 — `models.json`, todos juntos (~8 min)

**El corazón de la sesión, y se da acá y no en la teoría**: es setup, así que se camina en pantalla **con la sala tipeando al mismo tiempo**, y queda proyectado el resto de la media hora. **Frenar hasta que el archivo le funcione a todo el mundo** — con 22 minutos de práctica, el que arranca tarde acá se queda sin prueba.

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
        { "id": "vllm/qwen3.8:30b" }
      ]
    }
  }
}
```

Cuatro cosas para frenar, y cada una es un concepto que ya tienen:

- **`api: "openai-completions"`** es la historia de interoperabilidad de la teoría convertida en un string que tipean. Los valores posibles son `openai-completions`, `openai-responses`, `anthropic-messages` y `google-generative-ai`: cuatro formas de API para todo el ecosistema. El CCAD no expone una API "del CCAD": expone la misma que expondría el Ollama de Agus, o LM Studio, o vLLM crudo. **Por eso el swap cuesta cinco líneas.**
- **`apiKey: "$CCAD_API_KEY"`** — el campo acepta interpolación de variables de entorno (`$VAR`, `${VAR}`) y también ejecutar un comando si arranca con `!`. **Usar la variable, no la key literal**, y decir en voz alta por qué: la key literal en un archivo es la key literal en un backup, en un screenshot del proyector y —el día que a alguien se le ocurra versionar sus dotfiles— en un repo público. Es la primera credencial propia del curso y es el momento de enseñar el reflejo. **Cada uno tiene su propia key**: el rate limit es de cada uno, y si a alguien no le anda, el problema es su `export` y no el servidor.
- **`models` es una lista, y por eso hay dos.** El catálogo de modelos y el modelo activo son cosas distintas: declarás lo que hay, elegís con `/model`. El `id` es lo que se manda a la API y es lo que van a ver en el picker.
- **El prefijo `vllm/` es routing de LiteLLM**, y de paso les cuenta qué hay atrás. **Acá se cobra el slot de Ale, que terminó recién**: LiteLLM y vLLM ya tienen cara, así que el bullet se da **como reconocimiento y no como dato nuevo** — *"eso que les acaba de contar Ale, acá está, en un string"*. Lo mismo con la `baseUrl`.

**Lo que *no* está en el JSON, y es la mejor parte.** `contextWindow` tiene default **128000** y `maxTokens` default **16384**. O sea: la ventana de contexto es un número que alguien eligió. Después de cinco sesiones tratándola como una propiedad del producto que compraron, resulta ser un parámetro de arranque. Y hay **tres números distintos para la misma cosa**, que conviene escribir en el pizarrón uno debajo del otro:

| Quién lo decide | Número |
|---|---|
| El modelo, nativo | **~262.144** |
| Pi, si no le decís nada | **128.000** |
| El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

El modelo puede 256K, Pi asume 128K, y lo que realmente tienen es lo que el servidor arrancó. **Es la misma perilla que Agus tuvo que elegir de su lado hace media hora, vista desde la otra punta** — y la que explica por qué su GPU de 16 GB no podía con todo.

Y el detalle operativo que hace fácil la práctica: **el archivo se relee cada vez que abrís `/model`**, sin reiniciar nada. Cambiar de modelo cuesta dos segundos.

#### Una prueba a elección (~22 min)

**El ejercicio tiene cuatro pruebas, una por cada una de las primeras cuatro sesiones, y cada uno elige.** No hay prueba obligatoria y no hay que hacer las cuatro: con 22 minutos se entra cómodo en una y apretado en dos. Las que no hagan quedan escritas para terminar en casa. Ver `exercise/README.md`.

| | La sesión | La pregunta |
|---|---|---|
| 1 | **Vibecodear** | ¿funciona igual de bien? |
| 2 | **Planificar** | ¿los planes mantienen la misma calidad? |
| 3 | **Skills y MCP** | ¿los sigue como debe? |
| 4 | **Documentar** | ¿qué tan buenos son los docs que genera? |

**La recomendación honesta, y hay que darla en voz alta al soltarlos**: si no saben cuál elegir, la **3** — skills y MCP. Es la que más información da y donde más probable es que algo se rompa, porque es la que depende del tool calling. La **1** es la que menos diferencia va a mostrar: en tareas de una sola pasada casi todos los modelos se parecen.

**La línea de base no es otra corrida: es lo que ya saben** de las primeras cuatro clases, así que la comparación arranca gratis. Decirlo así: *"no estamos midiendo el modelo, estamos midiendo SU andamiaje contra otro motor"*.

**Lo que hay que vigilar caminando la sala:**

- **Todo en su repo**, con su `AGENTS.md`, sus skills y su `.mcp.json`. El que lo hace en `/tmp` hizo un ejercicio de configuración, no la clase.
- **Sesión nueva y limpia**, y repo limpio. Si arrastran una conversación previa no saben qué están midiendo.
- **Que no "arreglen" sus artefactos para ayudar al modelo**: si el skill no dispara, **eso es el resultado**.
- **Si algo los sorprende, que repitan esa prueba con el modelo hosteado** antes de concluir. Es lo que separa *"el modelo abierto no puede"* de *"mi prompt siempre fue frágil y recién ahora se nota"*.
- **Que anoten mientras pasa.** Cuatro preguntas transversales: ¿respetó el schema de las tools?, ¿cuántos turnos necesitó?, ¿inventó archivos o funciones?, ¿cómo se sintió la latencia?
- **El error más probable no es conceptual**: un typo en el JSON o la key sin exportar. Por eso el Paso 0 se hace en conjunto.
- **Si sobra tiempo**, la segunda corrida contra el otro modelo del picker — están servidos los dos. Es un punto más de comparación, no un paso obligatorio.

**El callback que vale la pena tirar caminando la sala**: lo primero que se degrada con la cuantización es la salida estructurada — o sea, la primera de las cuatro preguntas.

### Retrospectiva del curso (~15 min)

**Debate abierto, y es el cierre de las seis sesiones.** Qué les pareció, si creen que les sirvió, qué mejorarían. **No se toca aunque el día se haya estirado.**

Son quince minutos sostenidos sólo por preguntas, así que conviene llegar con varias preparadas y usarlas si la sala se queda callada:

- ¿Qué sesión les sirvió más y cuál menos?
- ¿Qué habrían querido que dure el doble? ¿Y qué sacarían?
- ¿Qué van a usar el lunes, y qué no van a volver a abrir?
- ¿Qué esperaban del curso cuando se anotaron, y qué se llevan en cambio?
- ¿A quién se lo recomendarían, y a quién no?

**Escuchar más que defender.** Las respuestas honestas son las que hacen la próxima edición; las respuestas amables no sirven para nada. Si la sala es muy elogiosa, empujar con *"¿qué fue lo más aburrido?"*, que es la pregunta que siempre destraba.

Cerrar agradeciendo **a Ale y al CCAD con nombre** —sin ese acceso esta sesión no existe— y dejar tres punteros abiertos para el que quiera seguir: pedir su cuenta del CCAD (el trámite que contó Ale), la guía de Raschka para montarlo en su propia máquina, y el post de Copes para releer la teoría con calma.

## Timing de la sesión (2 h 30)

| Bloque | Tiempo |
|---|---|
| **Modelos de pesos abiertos (Diego)** | **30 min** |
| **Demo: la GPU portátil (Agus)** | **15 min** |
| **Invitado: Ale Silva — el CCAD** | **60 min** |
| **Práctica: probar el CCAD** | **30 min** |
| **Retrospectiva del curso** | **15 min** |

Da **150 minutos exactos**. Tres consecuencias prácticas:

- **No hay bloque elástico.** En las Sesiones 2 y 3 el recap absorbía los desbordes; acá no existe. Lo único recortable en vivo es la práctica, y recortarla es lo peor que puede pasarle a la sesión: es lo único que la sala hace con las manos.
- **Hay que ensayar los tres bloques expositivos con reloj**, y el riesgo está concentrado en el de 60. A Ale hay que decirle **60** con ese número.
- **No hay pausa formal.** Son 1 h 45 de exposición antes de tocar el teclado. Avisarlo al empezar y no fingir que no pasa: que sepan que pueden salir un minuto cuando lo necesiten, sin frenar la clase.

**Proteger, en este orden: la práctica completa, la retrospectiva, y el slot del invitado.**

## Puentes entre sesiones

- **Sesión 3** → el pago que nadie espera. Su `AGENTS.md`, sus skills y su config siguen funcionando contra un modelo que corre en un cluster de la UNC. Y un detalle concreto: `models.json` vive en `~/.pi/agent/`, al lado del `AGENTS.md` global que escribieron esa semana.
- **Sesión 4** → la ventana de contexto vuelve **tres veces en la misma clase**: como el KV cache que no entra en los 16 GB de Agus, como `--max-model-len` del lado del CCAD, y como `contextWindow` en su propio JSON. Deja de ser una propiedad del producto y pasa a ser un número que alguien eligió. Y el otro modelo de costo: **por hora y por GPU, no por token**.
- **Sesión 1** → LLM + tool + harness: hoy cambiamos la L.
- **Sesión 5** → **no es dependencia y ya no hay handoff.** El diseño anterior abría con un recap de la extensión que trajeran; esta versión no tiene recap. ⚠️ **Hay que avisarle a Agus**, porque su sesión les pide traerla diciendo que la Sesión 6 la usa (`sessions/session-5/INSTRUCTOR.md:290`).
- **Hilo transversal de seguridad** → cierra acá, adentro del bloque de teoría y no en uno propio, con dos puntas: **pasás a ser vos el operador** y **"local no significa privado automáticamente"**.

## Herramientas y recursos referenciados

- **El gateway del CCAD** — `https://litellm.ccad.unc.edu.ar` (sin `/v1`), API compatible con OpenAI. Es el vehículo de la práctica. **La key la emite Diego desde su cuenta**, una por estudiante, y se reparte antes de clase. **No se commitea**: en el material va `$CCAD_API_KEY`.
- [**Gemma 4 26B**](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) — `vllm/gemma4-26b`. **MoE: 26B totales, ~3,8B activos por token**, **Apache 2.0** (cambio respecto de Gemma 2 y 3, que tenían términos propios), contexto de hasta 256K, multimodal. Anunciada el 2026-04-02.
- [**Qwen3.8 30B**](https://huggingface.co/Qwen/) — `vllm/qwen3.8:30b`. **Apache 2.0**, contexto nativo de **262.144**, plantilla de chat con soporte de tools, repo sin gate.
- [Pi — modelos y providers custom](https://pi.dev/docs/latest/models) — la doc en la que se apoya el bloque de `models.json`. Config en `~/.pi/agent/models.json`, se relee al abrir `/model`. `api` acepta `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`. `apiKey` acepta `$VAR` / `${VAR}` e `!comando`. Defaults: `contextWindow` 128000, `maxTokens` 16384.
- [**Flavio Copes — *A Deep Dive into Open-Weight AI Models***](https://flaviocopes.com/open-weight-models/) — **la base del bloque de 30 minutos de Diego.** Recorre en orden: pesos, arquitectura vs. pesos, qué es open weight, la diferencia con open source, cómo se baja un modelo, cuantización, beneficios, límites y criterios de elección. Las dos frases que valen la clase: la definición de open source como *"los materiales y las libertades para estudiar, modificar y compartir el sistema entero"*, y **"local no significa privado automáticamente"**. Números útiles: de 16 a 4 bits lleva un modelo de ~60 GB a ~15 GB.
- **La GPU portátil de Agus** — **MSI GeForce RTX 5070 Ti 16 GB GDDR7 Ventus 3X OC**, por Thunderbolt, con **Ollama** sobre **CUDA**. Es una demo: la sala no se conecta.
- [**Ollama**](https://ollama.com/) — el runtime de la demo de Agus. `ollama pull <modelo>` y `ollama run <modelo>`. Expone endpoint compatible con OpenAI en `/v1`, lo que lo vuelve el ejemplo más fácil de la historia de interoperabilidad aunque hoy nadie se le conecte.
- [**Sebastian Raschka — "Using Local Coding Agents"**](https://magazine.sebastianraschka.com/p/using-local-coding-agents) — **el walkthrough de la vía local de punta a punta**, y el puntero que se llevan escrito para montarlo en su máquina. Sirve tres veces: el setup con Ollama; apuntar harnesses open source a ese endpoint, que es el mismo movimiento del `models.json` hecho por un tercero; y los números — 4-5/5 en tareas de razonamiento agéntico con un Qwen3.6 MoE, ~40 tok/s en una Mac Mini, y hasta **~30 GB de RAM con contextos de 50k**, que es el dato que le sirve a Agus para cerrar su demo. **El matiz al citarlo**: él mide **tareas acotadas**; sostener un proyecto largo es otra pregunta, y el cuello de botella ahí suele ser el tool calling confiable, no la capacidad de escribir código.
- [**Sebastian Raschka — "The Big LLM Architecture Comparison"**](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison) — el puntero para el que pregunte "¿y qué otros modelos hay?", que es la pregunta que el bloque de teoría deliberadamente no contesta con una lista.
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — lo que corre Ollama por abajo. Puntero para el que quiera bajar un nivel.
- [LiteLLM](https://github.com/BerriAI/litellm) — lo que el CCAD tiene adelante, y lo que explica el prefijo `vllm/`. Lo cuenta Ale.
- vLLM — lo que corre el CCAD atrás. También lo cuenta Ale.
- [CCAD — Centro de Computación de Alto Desempeño, UNC](https://supercomputo.unc.edu.ar/ccad/) · [wiki](https://wiki.ccad.unc.edu.ar/) · [abrir cuenta](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) · [equipamiento](https://supercomputo.unc.edu.ar/equipamiento/)
- [Pedido de cuentas](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/) · [uso intensivo](https://supercomputo.unc.edu.ar/servicios/pedido-de-uso-intensivo-ventanilla-permanente/) · [soporte a usuarios](https://supercomputo.unc.edu.ar/servicios/soporte-usuarios/)
- [Estado del servicio](https://stats.uptimerobot.com/eLhTV5CMni) · [dashboard](https://stats.ccad.unc.edu.ar/) — chequear antes de la clase.
- Licencias: los model cards de Hugging Face (el campo de licencia y el LICENSE del repo). Leer el texto real de lo que nombremos, no un resumen. Para el bloque 3 hacen falta **tres cards** y el contraste es el contenido: **Gemma 4** (Apache 2.0), **Gemma 3** (términos propios de Google, misma familia) y **Llama** (community licence con cláusula de escala).

## Lo que dejamos afuera a propósito

- **La mecánica del cluster** (`sbatch`, túnel SSH, nodos de login vs. de cómputo, módulos): son internals de un servicio de inferencia multiusuario. Lo que valga la pena lo dice Ale en su slot; si alguien pregunta, una frase y un puntero a la wiki.
- **Que la sala se conecte a la GPU de Agus.** Decidido: es demo. Se pierde el momento de la concurrencia en vivo, y está asumido.
- **Fine-tuning / LoRA**: es un curso aparte.
- **Multi-GPU e inferencia distribuida**: interesante y no lo necesita nadie hoy.
- **Benchmarking riguroso de abierto vs. hosteado**: una prueba cualitativa sobre su propia tarea enseña el punto; una eval de verdad no entra.
- **Entrenar cualquier cosa**: explícitamente afuera. Decirlo temprano o alguien va a pedir el resto de la sesión.
- **Un tour por cada familia de modelos de pesos abiertos**: se mueve rápido y como lista vale poco.
- **Cómo funciona LiteLLM por dentro**: es infraestructura del CCAD, no contenido del curso.
- **El bloque "¿está a la altura de un proyecto serio?"**, que en el diseño anterior eran 5 minutos después de la práctica con los números de Raschka y el *cuándo conviene y cuándo no*. **No entra en 150 minutos.** Sobrevive como material escrito en el ejercicio, y el número de VRAM de Raschka se lo pasamos a Agus para cerrar su demo.
- **El recap de la Sesión 5 y la extensión** de quien la haya terminado. No hay tiempo.

## Pendientes

- **Correr la práctica de punta a punta antes de la clase, en una máquina limpia**: `models.json` → key → `/model` → una tarea real en un repo real con su `AGENTS.md`. Es el único ensayo que importa.
- **Verificar que los dos modelos emitan tool calls válidos a través de LiteLLM**, contra un `AGENTS.md` de verdad y con varias tools cargadas. **Es el único punto que puede voltear la práctica**: un modelo que escribe bien pero no puede producir un tool call válido hace que no haya nada que mostrar. **Probar la cadena entera**, no la familia: que la plantilla de chat soporte tools no es lo mismo que que el modelo los emita bien a través del proxy.
- **Probar concurrencia**: 25-30 requests simultáneos contra el gateway. Si hay rate limit, definir si se practica en dos oleadas.
- **Repartir las keys** antes de entrar al aula, una por estudiante.
- **Confirmar el aula por 2 h 30** (las otras sesiones son de 2 h).
- **Cerrar con Agus su slot de 15 min**: que traiga la GPU, que el modelo esté bajado de antemano, que la VRAM se lea desde el proyector, y pasarle el punto del KV cache y el número de Raschka.
- **Pasarle a Ale el reloj por escrito**: 60 minutos, y el corte acordado con el Paso 0 (él llega hasta la primera llamada, nosotros seguimos con `models.json`).
- ⚠️ **Avisarle a Agus que se cayó el handoff de la Sesión 5.** Su sesión les pide traer la extensión porque "la Sesión 6 la usa" (`sessions/session-5/INSTRUCTOR.md:290`) y esta versión no tiene recap ni bloque de extensión. La tarea sigue teniendo valor propio; lo que hay que sacar es la promesa.

### Estado del material

**`slides.md` y `exercise/README.md` están escritos contra esta versión de las notas**, con los datos del CCAD ya confirmados (la `baseUrl` sin `/v1` y los dos `id`) y sin las advertencias de "confirmar antes de proyectar" que tenía el borrador anterior.

Si hace falta mirar versiones previas del material: `git log -- sessions/session-6/` y `git show <commit>:sessions/session-6/slides.md`.
