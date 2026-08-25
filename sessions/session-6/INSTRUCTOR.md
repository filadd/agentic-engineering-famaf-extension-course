# Sesión 6 — Modelos open source y CCAD (Notas para el instructor)

> 🔴 **TO REVIEW** — este archivo lo generó Claude y **Diego todavía no lo revisó**.
> Tratar cada afirmación, cada timing y cada decisión pedagógica como una propuesta, no como algo cerrado.
>
> **Excepciones, y estas sí son decisiones tomadas:**
> 1. **Al CCAD se llega por un gateway LiteLLM**, y Pi se apunta ahí con un provider propio en `~/.pi/agent/models.json`. Decisión de Diego. **Y los internals de ese servidor —scheduler, SSH, cómo se orquesta la inferencia para muchos usuarios— quedan fuera del curso**: son internals de un servicio de IA multiusuario. Ale los puede tocar como parte de qué es el CCAD, con poco detalle.
> 2. **La práctica tiene dos vías, y las dos son conectarse a un endpoint**: el gateway del CCAD para todos (Vía A) y **la GPU de Agus, servida en el aula**, como pista avanzada opcional (Vía B). Nadie instala un runtime: las dos vías son una entrada más en `models.json`. Decisión de Diego.
> 3. **Hay dos modelos en juego y el material tiene que funcionar con cualquiera de los dos.** **Gemma 4 26B** es lo que el gateway sirve hoy. El segundo es un **Qwen**, y no es un pedido a ciegas: Ale nos dio acceso al CCAD y **probamos Qwen3.6 ahí, andando** — hoy está bajado. Lo que le vamos a pedir para el curso es que **vuelva a levantarlo**, ahora en **Qwen3.8-27B**, que es la versión que existe hoy. Escribir todo contra "el modelo de hoy" y tener los dos números a mano. Si están los dos, mejor — abajo se explica por qué la comparación entre ellos es contenido y no lujo.
> 4. **El slot de Ale Silva son seis puntos**: qué es el CCAD, qué hardware tiene, cómo accede un estudiante de la UNC para correr un LLM ahí, cómo se corre un LLM ahí, **LiteLLM** (el gateway desde adentro) y **vLLM** (qué corre atrás). Decisión de Diego.

> A cargo: Diego. Estado: en armado. Este archivo es **todo lo que hay** de la sesión: las slides y el ejercicio se borraron porque estaban escritos contra el diseño viejo (SSH + cola de GPU + túnel), y hay que escribirlos de nuevo desde acá. Material en español.
>
> Invitado: **Ale Silva (CCAD)** — abre la sesión con seis puntos: qué es el CCAD, qué hardware tiene, cómo accede un estudiante de la UNC para correr un LLM ahí, cómo se corre un LLM ahí, y la infraestructura de inferencia por dentro: **LiteLLM** adelante y **vLLM** atrás. El alcance está definido; falta confirmar con él fecha, duración y formato.

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

**Y la lección se fortalece, no se debilita.** Apuntar un loop de 200 líneas escrito a mano a otro modelo prueba que el loop es agnóstico del modelo. Apuntar **Pi** a otro modelo prueba algo que al curso le importa mucho más: **el `AGENTS.md`, los skills, el plan mode, el flujo de review — todo lo de las Sesiones 2 y 3 — sigue funcionando cuando le cambiás el modelo abajo.** Esa es la tesis de cierre del curso, hecha carne, en la herramienta que ya conocen.

## La decisión de herramientas

Sigue **Pi**, sin instalar nada nuevo. Lo único que se agrega es un archivo de configuración.

| Vía | Quién la hace | Qué necesita | Qué enseña |
|---|---|---|---|
| **A — el gateway del CCAD** | todos | una entrada en `models.json` y una API key | el modelo es un componente: el swap es una línea |
| **B — la GPU de Agus, en el aula** | opcional | otra entrada en `models.json`, apuntada a la IP de Agus | qué cambia cuando el modelo es chico y la máquina está a tres metros |

**El cambio grande respecto del borrador anterior: nadie instala un runtime.** La Vía B era que cada uno se sirviera el modelo, y eso significaba 25 instalaciones, 25 descargas de pesos por la red del aula y 25 formas distintas de romperse. **Ahora Agus sirve un modelo en su GPU y la sala se conecta**, que es exactamente el mismo movimiento de la Vía A contra otro endpoint. El que quiera montarlo en su máquina tiene el apéndice y [la guía de Raschka](https://magazine.sebastianraschka.com/p/using-local-coding-agents) para hacerlo en casa.

**Y las dos vías juntas enseñan algo que ninguna sola:** el archivo de config termina con **tres providers** —el hosteado que vienen usando hace cinco sesiones, el CCAD y la notebook de Agus— y el modelo activo se elige con `/model`. La tesis de la sesión deja de ser una afirmación y pasa a ser una lista de tres entradas en un JSON.

> ⚠️ **El riesgo de la Vía B es la concurrencia, y hay que resolverlo con Agus antes de la clase.** Una GPU sirviendo a 25 personas a la vez es exactamente el problema que Ale va a explicar media hora antes cuando cuente por qué el CCAD usa vLLM y no otra cosa. Si se encola, **se encola en vivo y delante de todos** — y eso puede ser el mejor momento de la clase o un desastre, según si estaba previsto. Decidir con él: si sirve con un runtime que batchee, si la sala entra por tandas, o si se asume la cola y se la usa como contenido. **Lo que no puede pasar es que nos agarre de sorpresa.**

**El resultado de la sesión depende únicamente de la Vía A.** Decirlo explícitamente cuando se sueltan a la práctica: nadie se va con la sensación de no haber terminado por no haber hecho la B.

**Por qué Ollama y no vLLM en la Vía B**, y esta vez el contraste tiene un referente real en la sala: **el CCAD corre vLLM** detrás del gateway (el prefijo `vllm/` en el nombre del modelo lo delata) porque sirve a muchos usuarios y necesita batching de verdad. La notebook de Agus atiende a un aula durante veinte minutos. Ollama resuelve ese problema y arranca en cualquier sistema operativo; vLLM resuelve un problema de otra escala. Es la misma distinción de siempre entre runtimes, pero hoy se puede señalar con el dedo en vez de explicarla en abstracto.

## Audiencia y supuestos

- **La Vía A pide muy poca terminal**: editar un JSON y correr `/model`. La Vía B es más técnica, y es opcional a propósito.
- **Pi es el vehículo** — el mismo harness de todas las sesiones, ahora apuntado a otro modelo. Nada de la Sesión 5 es requisito. Lo que sí hace falta es que Pi siga andando en su máquina, que después de cinco sesiones es una apuesta segura.
- **Llegan con su repo, su `AGENTS.md` y sus skills de la Sesión 3.** Ese es el insumo de la práctica y no lo podemos generar nosotros. Avisarlo la semana anterior.
- **La cuenta del CCAD no es requisito bloqueante**: la práctica entra con una API key. **Igual hay que seguir recomendándola con semanas de anticipación**, por dos razones: es un aprendizaje que les sobrevive al curso, y es la puerta a correr algo en hardware real después. **La opción que hay que validar con Ale: que Diego emita una key por estudiante desde su propia cuenta**, y si a él le parece bien esa decisión (ver Pendiente de Ale). **Y ahora hay una tercera razón para insistir con la cuenta**: los puntos 3 y 4 del slot de Ale son cómo pedirla y qué hacer con ella, así que el que llegue con la cuenta aprobada escucha instrucciones y no anécdotas.
- **Nadie tuvo exposición previa a HPC.** El bloque de mecánica de cluster ahora es cultura general y no instrucciones de uso, lo que lo hace más corto y más fácil de dar.
- **No asumir que entienden qué es una API key** ni qué implica pegarla en un archivo. Es la primera vez en el curso que manejan una credencial propia y hay que decir en voz alta que no se commitea.

## Plan tema por tema

### Recap y compartir de la Sesión 5 (~5 min)

Discusión, no slides. Qué hicieron, qué se les rompió, qué les sorprendió del loop por dentro.

**Coordinar con Agus antes de la clase**: la Sesión 5 está en `TBD`, así que este bloque se escribe recién cuando su sesión exista. Preguntar con qué quedaron en la mano y si alguien terminó con un cliente propio andando — eso define si la extensión del final tiene público.

Este es el bloque elástico: **si el día se estira, se recorta de acá** (mismo criterio que las Sesiones 2 y 3).

### Invitado: Ale Silva — el CCAD y cómo correr un LLM ahí (~30 min)

Entregar la sala. **El alcance está definido y son seis puntos**, y el slot es de **30 minutos** (confirmar con Ale que le cierra; son seis puntos y no es poco):

1. **Qué es el CCAD** — qué es el centro y a quién le sirve (facultades de la UNC, el Observatorio, organismos externos; creado por Ordenanza HCS 18/2010).
2. **Qué hardware tiene** — los clusters de verdad, cuáles tienen GPU y de qué tipo. La cuenta de VRAM de un bloque posterior se apoya en esto: conviene que los números de él y los nuestros no se contradigan.
3. **Cómo accede un estudiante de la UNC** para correr un LLM ahí — el trámite real: quién puede pedir cuenta, qué hay que presentar, cuánto tarda, y qué te habilita cuando la tenés.
4. **Cómo se corre un LLM ahí** — **a grandes rasgos y sin entrar en detalle**: qué hacés una vez que tenés la cuenta, sin convertirlo en un tutorial de scheduler. Es el punto que le da un camino de vuelta al que quiera seguir después del curso; los internals del servidor quedan afuera.
5. **LiteLLM: el gateway visto desde adentro** — por qué el CCAD decidió poner un proxy adelante del cluster, qué le resuelve (un endpoint estable, auth por key, routing a varios modelos, límites por usuario), y qué se ve desde el lado del operador. Es literalmente la URL a la que la sala le va a pegar veinte minutos después.
6. **vLLM: qué corre atrás** — por qué vLLM y no Ollama ni otra cosa, qué es el batching y por qué un servidor con muchos usuarios lo necesita, y qué pasa cuando 25 personas le pegan al mismo tiempo. Que es exactamente lo que va a pasar durante la práctica.

**Los puntos 3 y 4 son el camino de vuelta.** La práctica entra por el gateway, así que nada de esto hace falta para la clase de hoy — pero el que quiera correr algo en hardware real después del curso necesita saber cómo se pide la cuenta y qué se hace con ella. Dicho por el que opera la máquina, vale más que cualquier link que les pasemos. **El punto 4 va con poco detalle**: la mecánica fina del cluster es internals de un servicio multiusuario y queda fuera del curso.

**Los puntos 5 y 6 son el mismo movimiento al revés, y cierran el círculo.** `https://litellm.ccad.unc.edu.ar` y el prefijo `vllm/` del nombre del modelo dejan de ser strings que copian de una slide: son dos cosas que les explicó el que las eligió, media hora antes de tipearlas. Es la mejor versión posible del bloque de `models.json` y no la podemos comprar de otra manera. **Pedirle explícitamente que nombre los dos con nombre y apellido** — "LiteLLM", "vLLM" — porque después esas dos palabras aparecen en la config, en la teoría y en la comparación con la Vía B.

**Consecuencias directas en el plan, y hay que respetarlas o se dice todo dos veces:**

- El bloque *"Un cluster no es tu notebook"* **se eliminó**: era mecánica de cluster, que ahora está fuera del curso. La etiqueta de recurso compartido se dice al soltar la práctica.
- **El bloque de familias de runtime ya no existe**: se fue cuando la teoría pasó a seguir el arco del post, que nombra runtimes pero no los divide en local vs. serving. Así que su punto 6 **no se pisa con nada nuestro** — es el único lugar de la sesión donde se explica el batching, y el contraste con Ollama queda del lado de la práctica, donde Agus sirve el suyo.
- En *`models.json`*, el prefijo `vllm/` y la `baseUrl` se leen como reconocimiento, no como novedad. Apoyarse en eso: cuesta menos tiempo y se entiende mejor.

**Lo que se cayó del alcance, y no es olvido**: para qué se usa normalmente el HPC en la UNC, y los clusters de Latam. Si él quiere meterlos, bienvenido, pero no los pedimos: seis puntos en media hora ya es un slot lleno.

**Y porque son seis, hay que darle una prioridad y no dejársela a él.** Si se va de tiempo, lo que se recorta es el punto 1 (podemos abrirlo nosotros en dos minutos) y el 2 se puede hacer con una sola slide de equipamiento. **Lo que no se recorta es 3, 5 y 6** — son los que nadie más en la sala puede dar. **El 4 va liviano por decisión**, no por falta de tiempo: la mecánica fina del cluster está fuera del curso. Decírselo así, con esas palabras, cuando le confirmemos el slot.

Más allá de eso, no sobre-especificar la charla de un invitado. Confirmar si quiere slides, un tour en vivo del dashboard, una sesión real en el cluster proyectada, o solo hablar.

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

**El gancho, y es el mejor momento del bloque: Gemma cambió de licencia entre versiones.** Gemma 2 y 3 salieron con términos propios de Google; **Gemma 4 salió Apache 2.0**, y el anuncio lo dice explícitamente (*"a commercially permissive Apache 2.0 license"*). **Misma familia, mismo nombre, mismo botón de descarga, derechos distintos.** Eso convierte la advertencia genérica —"revisá la licencia"— en algo que se ve en pantalla en treinta segundos, sobre el modelo al que están por apuntar su repo.

> ⚠️ **La trampa, y hay que tenerla clara antes de dar el bloque.** Si uno tiene en la cabeza que "Gemma es licencia propia de Google", eso vale para **Gemma 2 y 3** y **es falso para Gemma 4**. Verificado el 2026-08-24 contra el blog de Google. Decirlo mal justo en este bloque sería vergonzoso dos veces.

**La secuencia en pantalla, tres cards, medio minuto cada una**: el campo `license` de Gemma 4 (Apache 2.0), los términos de Gemma 3 (propios), y la community licence de Llama (propia, con cláusula de escala). Tres modelos que la sala llamaría "open source" sin pestañear, con tres regímenes de derechos distintos.

Y el remate: sobre el modelo que van a usar hoy, las tres preguntas se contestan **sí, sí y de ustedes**. Sin cláusula de escala, sin obligación de naming, sin política de uso aceptable pegada.

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

**La pregunta que la sala realmente quiere contestada**, y este es el lugar: apenas terminan la práctica, con sus propias mediciones en la mano. **Son cinco minutos, así que es cosecha y no debate**: que cada uno tire una línea de lo que midió, se anota en el pizarrón, y el criterio se cierra en la retrospectiva. Que argumenten desde lo que acabaron de medir, no desde lo que leyeron.

Los ejes que lo deciden, todos cosas que midieron en el último paso de la práctica:

- ¿Llama las tools respetando el schema — *siempre*, no casi siempre?
- ¿Sobrevive una tarea de veinte pasos sin perder el hilo?
- ¿Alcanza la ventana de contexto para un repo real?
- ¿La latencia es tolerable dentro de un loop, donde cada paso es otro round trip?

Nuestra respuesta honesta hoy — **re-verificar la semana de la clase, esto se mueve rápido**: para tareas acotadas, reviews, trabajo repetitivo de alto volumen y cualquier cosa con datos sensibles, sí. Como motor principal de un coding agent en un proyecto serio y de vida larga, todavía no del todo — y el cuello de botella suele ser **el tool calling confiable, no la capacidad de escribir código**. Decirlo así, plano: les sirve más que el entusiasmo o el desprecio.

**Y hay un dato externo que conviene tener a mano, porque alguien lo va a preguntar**: Sebastian Raschka corrió [esta misma pregunta con agentes locales](https://magazine.sebastianraschka.com/p/using-local-coding-agents) y midió 4-5 sobre 5 en tareas de razonamiento agéntico con un Qwen3.6 MoE, concluyendo que los MoE nuevos alcanzan para mucho trabajo real. **Es más optimista que nuestra respuesta de arriba y vale decirlo así**, con la diferencia que lo explica: él mide tareas acotadas, y nosotros hablamos de sostener un proyecto largo. No es una contradicción, son dos preguntas distintas — y distinguirlas es exactamente el criterio que este bloque quiere dejar.

Y el matiz que la Vía B habilita, si alguien la hizo: parte de lo que van a haber medido no es el modelo, es **la cuantización**. El mismo modelo a 4 bits y a 16 bits no falla igual en salida estructurada. Que la sala distinga "el modelo abierto es peor" de "esta versión cuantizada de este modelo es peor" es un salto de madurez técnica y sale gratis acá.

Este bloque desemboca en el siguiente: la respuesta no es sí o no, es "para qué trabajo".

### Cuándo conviene open source — **se pliega dentro del cierre del curso**

> Ya no es un bloque propio: con la sesión repartida en tres bloques grandes no hay lugar, y el contenido siempre fue la rampa del cierre. **Se da adentro de la retrospectiva**, en dos minutos, justo antes de la frase final. Lo que sigue es el material.

- **Encaja bien**: datos sensibles o regulados, tareas repetitivas de alto volumen donde el costo domina, investigación que necesita reproducibilidad y un modelo pineado, trabajo offline o air-gapped, y *estudiar la cosa en sí* — no podés inspeccionar logits que no tenés.
- **Encaja mal**: querés el mejor coding agent disponible hoy; no tenés capacidad operativa; el volumen es bajo (una API hosteada va a salir más barata que tu tiempo).
- Y ensanchar al cierre real del curso: **el modelo es un componente.** Todo lo de las Sesiones 2 a 5 — planificación, review, tests, contexto, tools, harness — se transfiere entre modelos. Ese es el pago de haber enseñado estructura en vez de un producto.

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
- **`models` es una lista, y por eso hay dos.** El `id` es lo que se manda a la API y es lo que van a ver en el picker de `/model`. **`vllm/gemma4-26b` es el que está servido; `vllm/qwen3.8-27b` es el que le pedimos a Ale que vuelva a levantar y puede no llegar a tiempo.** Dejar los dos en la slide y decirlo en voz alta: *"si el segundo no aparece en el picker, es porque el CCAD no lo levantó — no es un typo suyo"*. Y los strings exactos los decide el CCAD al registrar los modelos en LiteLLM, así que **los dos hay que confirmarlos antes de proyectarlos** (ver Pendiente de Ale).
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

> ⚠️ **La concurrencia es el riesgo, y es también el contenido.** Una GPU atendiendo a la sala entera se encola — que es exactamente lo que Ale explicó media hora antes al contar por qué el CCAD corre vLLM. **Acordarlo con Agus antes de la clase**: runtime que batchee, tandas, o asumir la cola y usarla como demostración en vivo. Cualquiera de las tres sirve; lo que no sirve es descubrirlo en el momento.

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

Notar el orden: la puesta en común va *después* de la práctica a propósito, y "cuándo conviene open source" se da adentro del cierre. Las discusiones de criterio salen mejor cuando ya midieron algo propio.

**Proteger, en este orden: la Vía A completa con la comparación, la retrospectiva de cierre, y el slot del invitado.**

## Cierre del curso (~15 min)

No es el cierre de la sesión, es el cierre de las seis. Merece que no lo agarre el reloj.

**Arranca con dos minutos de *cuándo conviene open source*** —el material está más arriba, plegado acá— porque es la rampa natural: la pregunta deja de ser "¿es bueno?" y pasa a ser "¿para qué trabajo?", y de ahí se sale directo a la retrospectiva.

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
4. **El pedido: ¿pueden volver a levantar el Qwen, ahora Qwen3.8-27B?** **No es un pedido en frío**: con el acceso que nos dio Ale, **Qwen3.6 corrió en el CCAD y anduvo**, y después se bajó. O sea que servir un Qwen ahí ya está demostrado y lo que estamos pidiendo es reponerlo, con la versión que existe hoy. Lo queremos **además** de Gemma 4 26B, no en lugar de. Sigue siendo **un pedido y no un supuesto** —el material está escrito para funcionar sin él— pero el precedente cambia la conversación. **Lo que el precedente no cubre, y hay que decirlo al pedirlo**: lo que probamos fue 3.6, no 3.8. Los números de 3.8 que están en este archivo salen de la model card, no de haberlo visto correr en ese hardware; si el salto de versión les cambia el encaje en la GPU, que nos avisen. Por qué lo pedimos: con dos modelos abiertos en el mismo endpoint, la práctica gana un punto más de comparación —mismo prompt, mismo repo, tres modelos— y el `models.json` de la slide muestra que `models` es una lista y no un campo. **Es un pedido más flojo que antes y conviene saberlo**: la razón fuerte era que la sala midiera denso contra MoE, y ese contenido ya no se da. Si no se puede, la sesión no pierde nada de la tesis.
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
- **Hilo transversal de seguridad** → cierra acá, y **cierra más angosto de lo que prometía**: quedan las dos puntas que trae el bloque de modelos abiertos —**pasás a ser vos el operador** y **"local no significa privado automáticamente"**— dichas adentro de ese bloque y no en uno propio. La cadena de suministro de pesos, el gateway como tercero y el callback de prompt injection **se sacaron** al adoptar el arco del post. Si alguien quiere recuperarlos, el lugar natural es el cierre del curso, no la teoría.

## Herramientas y recursos referenciados

- **El gateway del CCAD** — `https://litellm.ccad.unc.edu.ar`, API compatible con OpenAI. Es el vehículo de la práctica. La key se entrega en clase y **no se commitea**. Los `id` de los modelos van textuales en una slide y **hay que confirmarlos con Ale**.
- [**Gemma 4 26B**](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) — **el modelo que el gateway sirve hoy**, y el default del material. **MoE: 26B totales, ~3,8B activos por token**, **Apache 2.0** (cambio respecto de Gemma 2 y 3, que tenían términos propios), contexto de hasta 256K, multimodal. Familia de cuatro tamaños: E2B, E4B, 26B MoE y 31B denso — los dos chicos son los candidatos naturales para la Vía B. Anunciada el 2026-04-02. Los repos de Google en Hugging Face suelen estar **gateados**: chequearlo antes de apoyar la Vía B en ellos.
- [**Qwen3.8-27B**](https://huggingface.co/Qwen/Qwen3.8-27B) — **el modelo que le pedimos a Ale, todavía no disponible.** 27B **densos**, **Apache 2.0**, `bfloat16`, contexto nativo de **262.144**, multimodal (no usamos esa parte), plantilla de chat con soporte de tools, repo **sin gate**. Verificado el 2026-08-24 contra el model card; el repo se actualizó el 2026-08-14. **Denso contra el MoE de Gemma es el motivo del pedido**: con los dos servidos, la tabla de VRAM se mide en vez de explicarse.
- **Los dos son el dato más perecedero del archivo** — re-verificar tamaños, licencias y gates la semana de la clase.
- [Pi — modelos y providers custom](https://pi.dev/docs/latest/models) — la doc en la que se apoya el bloque de `models.json`. Config en `~/.pi/agent/models.json`, se relee al abrir `/model`. `api` acepta `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`. `apiKey` acepta `$VAR` / `${VAR}` e `!comando`. Defaults: `contextWindow` 128000, `maxTokens` 16384.
- [**Ollama**](https://ollama.com/) — **el runtime con el que Agus sirve la Vía B.** `ollama pull <modelo>` y `OLLAMA_HOST=0.0.0.0:11434 ollama serve`. Expone endpoint compatible con OpenAI en `/v1`, así que la sala le entra con una entrada de provider en `models.json` igual que al CCAD — no hace falta `/login` ni nada específico del runtime. Las tres variables que importan: `OLLAMA_HOST` (para que se le pueda llegar), `OLLAMA_CONTEXT_LENGTH` (la ventana) y `OLLAMA_NUM_PARALLEL` (cuántos pedidos atiende a la vez). **Verificar los defaults antes de la clase.**
- [**Flavio Copes — *A Deep Dive into Open-Weight AI Models***](https://flaviocopes.com/open-weight-models/) — **la base del bloque de 30 minutos de Diego.** Recorre en orden: pesos, arquitectura vs. pesos, qué es open weight, la diferencia con open source, cómo se baja un modelo, cuantización, beneficios, límites y criterios de elección. Las dos frases que valen la clase: la definición de open source como *"los materiales y las libertades para estudiar, modificar y compartir el sistema entero"*, y **"local no significa privado automáticamente"**, que es la que desarma el reflejo más común de la sala. Números útiles: de 16 a 4 bits lleva un modelo de ~60 GB a ~15 GB. Sus ejemplos van sobre un modelo propio — nosotros los hacemos sobre el que sirva el gateway ese día.
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
- **Definir cómo se entregan las keys** y no improvisarlo en el aula. Si es una key compartida, tenerla en una slide; si es una por estudiante, repartirlas antes. Y **no dejar la key en un archivo commiteado del repo del curso** — en el material va `$CCAD_API_KEY`.
- **Fijar `contextWindow`** con el valor real del servidor, apenas Ale lo confirme.
- **Verificar las licencias de las revisiones exactas** de lo que esté servido, y el estado de gate de cada repo, la semana de la clase. Tener las tres cards del contraste abiertas en pestañas antes de entrar al aula: Gemma 4, Gemma 3, Llama.
- **Pedirle a Ale el Qwen con tiempo** (item 4 de la lista), y **decidir una fecha de corte**: pasada esa fecha, las slides se cierran con un solo modelo y la tercera corrida sale del ejercicio. No dejar esa decisión para la semana de la clase.
- **Confirmar que Agus trae la GPU portátil**, qué modelo va a servir, y probar el flujo entero: `ollama serve` con `OLLAMA_HOST=0.0.0.0` alcanzable desde otra máquina del aula, un provider en `models.json` apuntándole, un tool call que funcione, y **varias máquinas pegándole a la vez** para ver cómo se comporta `OLLAMA_NUM_PARALLEL`. Ya no es el respaldo de la sesión, así que si no llega no se cae nada — pero es el mejor momento visual del día.
- **Confirmar la participación de Ale, fecha y formato.** El plan B ya no es equivalente y hay que saberlo: los puntos 1 y 2 los podemos dar nosotros en 10 minutos con la wiki y la página de equipamiento, y de LiteLLM y vLLM podemos explicar *qué son* — pero **cómo se pide la cuenta, cómo se corre un LLM en el cluster y por qué el CCAD eligió esta arquitectura no lo podemos dar con autoridad**. Sin él, los puntos 3 a 6 se degradan a "acá están los links". Si su participación queda en duda, pedirle igual algo grabado o un walkthrough escrito de esos cuatro puntos.
- **Decidir la duración real de la sesión** y, si son 2 horas, adoptar la variante de arriba de entrada en vez de improvisar recortes.
- ~~Decidir quién cierra el curso~~ → **decidido: se reparte por tipo.** La Sesión 4 cierra el primer arco (costo, límites, carrera, atrofia); esta sesión cierra el curso (el repo, el espectro, la tesis de la transferencia). La duplicación era un resto de cuando el curso tenía 4 sesiones y la 4 era el final. **Avisarle a Agus**, porque le cambia el cierre de una sesión que todavía no escribió.
- **Coordinar con Agus el recap de la Sesión 5**, que todavía está en `TBD`.

### Las slides y el ejercicio hay que escribirlos de nuevo

**`slides.md` y `exercise/README.md` se borraron**, no se parchearon. Estaban escritos contra el diseño anterior —entrar por SSH, ganarle a la cola, servir el modelo, forwardear el puerto, cambiar la base URL del agente de la Sesión 5— y no quedaba casi nada rescatable: el ejercicio era literalmente ese flujo paso por paso. Están en el historial de git si hace falta mirarlos: `git log --diff-filter=D -- sessions/session-6/slides.md` te da el commit que los borró, y `git show <commit>^:sessions/session-6/slides.md` el contenido.

Lo que hay que tener presente al escribirlos:

- **Las slides** necesitan una que no existía y que ahora es el centro de la sesión: el `models.json` completo, para copiar textual. Igual que en la Sesión 3, la mayoría de las slides son título + nota de orador, pero las que la sala tiene que copiar o leer llevan cuerpo: **el JSON del provider** (el CCAD y el de Agus), **las tres cards de licencias**, **la cuenta de cuantización** (60 GB → 15 GB) y **el checklist de siete puntos** para elegir un modelo. El esqueleto viejo ya no sirve de mucho: el bloque de teoría se reescribió entero sobre el post de Copes, así que las slides de ese bloque salen de ahí y no de lo que había.
- **El ejercicio** se estructura como Vía A + Vía B, no como pasos numerados de uno a seis. La Vía A tiene que poder resolverse sin descubrir nada: el JSON listo para copiar, la key a mano, y todo el esfuerzo del estudiante puesto en la tarea que le da al agente y en anotar la comparación. La Vía B va como apéndice, con la advertencia de que no terminarla no es no haber hecho el ejercicio.
- **No escribir el ejercicio antes de leer el hilo con Ale.** La `baseUrl` exacta, el `contextWindow` y la forma de las keys son datos que van textuales en el material y que hoy no tenemos.

El resto de las dependencias ya está arreglado: `COURSE_PROGRAM.md` (Tier 6, sección de la Sesión 6, preguntas abiertas y recursos), `sessions/session-5/INSTRUCTOR.md` y el `README.md` de la raíz.
