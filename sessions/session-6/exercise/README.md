# Sesión 6 — Ejercicio práctico: cambiale el modelo

## Objetivo

**Apuntar tu agente —el mismo Pi de las cinco sesiones anteriores, con tu `AGENTS.md` y tus skills— a un modelo de pesos abiertos corriendo en hardware de la UNC, y comparar.**

No se trata de dejar una configuración "bien puesta". Se trata de que al final de la hora tengas **una opinión propia, medida sobre tu propio repo**, de qué cambia y qué no cuando le cambiás el modelo abajo al agente.

**Nadie instala un runtime hoy.** No hay pesos que bajar, drivers que pelear ni servidores que levantar: todo el ejercicio es **un archivo de configuración** y el comando `/model`.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1, **con su `AGENTS.md` y sus skills de la Sesión 3**. Esto no es negociable y es lo que hace aterrizar la sesión: si lo hacés en un directorio de prueba, hiciste un ejercicio de configuración y no la clase.
- `git status` limpio antes de arrancar.
- **Tené a mano la API key del CCAD.** Se entrega en clase.
- Un editor abierto en `~/.pi/agent/models.json`. Si el archivo no existe, lo creás vos — y fijate quién es el vecino: en ese mismo directorio vive el **`AGENTS.md` global** que escribiste en la Sesión 3.

## Las dos vías

| | Quién la hace | Qué necesita |
|---|---|---|
| **Paso 0 — `models.json`** | todos, juntos y en voz alta | 8 min |
| **Vía A — el gateway del CCAD** | **todos** | 32 min |
| **Vía B — la GPU de Agus, en el aula** | opcional | 20 min |

> **El resultado de la sesión depende únicamente de la Vía A.** La Vía B es una pista avanzada: **no terminarla no es no haber hecho el ejercicio**. Si llegás al final de la Vía A con la comparación anotada, la clase te sirvió entera.

## Antes de soltar el teclado: la etiqueta

Del otro lado del endpoint hay **una máquina compartida**, y hay gente corriendo su tesis ahí. Respetá los rate limits y no dejes tareas absurdas corriendo por curiosidad. Es la misma cortesía de cualquier recurso compartido, y hoy es literal.

Y lo otro: **la key no se commitea.** Ni hoy ni nunca. Más abajo está el cómo.

---

## Paso 0 — `models.json` (~8 min, todos juntos)

Esto lo hacemos **en conjunto, con el archivo proyectado**. No arranques solo: si te trabás acá, perdés la comparación, que es lo único que no se puede recuperar en casa.

Pi busca los proveedores de modelos en:

```
~/.pi/agent/models.json
```

Pegá esto adentro:

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

> ⚠️ **La `baseUrl` y los `id` de los modelos van textuales de la slide.** Los strings exactos los decide el CCAD al registrar los modelos, así que copiá lo que esté proyectado, no lo que está acá.

Y exportá la key en la terminal desde la que vas a levantar Pi:

```
export CCAD_API_KEY=<la key que te dimos en clase>
```

### Las cuatro cosas que hay que entender de ese archivo

**1. `api: "openai-completions"` — por qué esto funciona.**
Es la historia de interoperabilidad de la teoría, convertida en un string que estás tipeando. Los valores posibles son `openai-completions`, `openai-responses`, `anthropic-messages` y `google-generative-ai`: **cuatro formas de API para todo el ecosistema**. El CCAD no expone una API "del CCAD" — expone la misma que expondría Ollama en una notebook, o LM Studio, o vLLM crudo. Por eso cambiar de modelo cuesta cinco líneas y no una tarde.

**2. `apiKey: "$CCAD_API_KEY"` — por qué la variable y no la key.**
El campo acepta interpolación de variables de entorno (`$VAR`, `${VAR}`) y también ejecutar un comando si arranca con `!`. **Usá la variable.** Una key literal en un archivo es una key literal en un backup, en un screenshot, y —el día que versiones tus dotfiles— en un repo público. Es la primera credencial propia del curso: es el momento de agarrar el reflejo.

**3. `models` es una lista, y por eso hay dos.**
El `id` es lo que se manda a la API y es lo que vas a ver en el picker de `/model`. **Declarás el catálogo; el modelo activo lo elegís aparte.** Son dos cosas distintas y este archivo las separa.

> Si el segundo modelo **no aparece** en el picker, es porque el CCAD no lo tiene levantado hoy. **No es un typo tuyo** y no te falta nada: la Vía A se hace igual con el que esté.

**4. El prefijo `vllm/` y la URL no son magia.**
Son las dos cosas que te explicó Ale hace media hora: `litellm.ccad.unc.edu.ar` es el **gateway LiteLLM**, y el `vllm/` es su routing hacia **vLLM**, que es lo que corre atrás sirviendo el modelo. Estás tipeando la arquitectura que te acaban de contar.

### Lo que *no* está en ese JSON, y es la mejor parte

Pi tiene defaults: `contextWindow` **128000** y `maxTokens` **16384**.

O sea que **la ventana de contexto es un número que alguien eligió**. Después de cinco sesiones tratándola como una propiedad del producto, resulta que hay tres números distintos para la misma cosa:

| Quién lo decide | Número |
|---|---|
| El modelo, nativo | **~262.144** |
| Pi, si no le decís nada | **128.000** |
| El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

Si el servidor arrancó con menos que el default de Pi, los requests fallan. Por eso, si en clase te damos un número, fijalo explícitamente:

```json
{ "id": "vllm/gemma4-26b", "contextWindow": 128000 }
```

**Dato operativo que te va a servir toda la hora:** el archivo **se relee cada vez que abrís `/model`**. No hace falta reiniciar nada.

---

## Vía A — el gateway del CCAD (~32 min, todos)

### 1. Elegí el modelo abierto

Desde tu proyecto, abrí Pi y:

```
/model
```

Elegí el modelo del CCAD que esté en el picker. Eso es todo el swap.

### 2. Dale una tarea real, en tu repo

**Dos requisitos, y los dos importan:**

- **En tu repo**, con tu `AGENTS.md` y tus skills cargados. Todo el punto del ejercicio es ver si tu andamiaje sobrevive al cambio de modelo.
- **Multi-paso, con al menos dos llamadas a tools.** Si le pedís algo de un solo turno, los dos modelos van a parecer iguales y la comparación no dice nada.

El molde que funciona:

```
Leé <archivo A> y <archivo B>, encontrá la inconsistencia entre los dos y arreglala.
```

Otras que sirven: agregar un test que falle y después hacerlo pasar; renombrar algo que aparece en tres archivos; agregar un endpoint chico siguiendo las convenciones que ya están escritas en tu `AGENTS.md`.

### 3. Anotá **mientras pasa**, no después

Cuatro preguntas. Escribilas en un archivo o en papel, pero escribilas: **son el insumo de la puesta en común**, y sin ellas no hay nada que poner en común.

1. **¿Respetó el schema de las tools?** ¿Los tool calls salieron bien formados, o hubo llamadas que el harness rechazó?
2. **¿Cuántos turnos necesitó** para terminar la tarea?
3. **¿Inventó** nombres de archivos, de funciones o de APIs que no existen?
4. **¿Cómo se sintió la latencia** adentro del loop del agente? No los tokens por segundo en abstracto: la espera real entre que le pedís algo y el agente hace la siguiente cosa.

Y una quinta, que es la de la sesión: **¿el agente usó lo que dice tu `AGENTS.md` y disparó tus skills?**

### 4. La misma tarea, con el modelo hosteado

**Sesión nueva y limpia** — no `/model` en el medio de la conversación. Para que la comparación sea justa, los dos modelos tienen que arrancar del mismo contexto: mismo repo, mismo estado de git, mismo prompt, cero historial.

```
git stash   # o revertí lo que hizo la corrida anterior
```

Volvé a `/model`, elegí el modelo hosteado que venís usando, y dale **exactamente el mismo prompt**. Anotá las mismas cuatro preguntas.

### 5. (Extra, si el gateway tiene los dos modelos abiertos)

Tercera corrida: mismo prompt, mismo repo, el otro modelo abierto. **No es obligatorio.** Es un punto más de comparación, no parte de la tesis — el que no llega no se perdió nada.

### Si algo falla

El error más probable **no es conceptual**:

- `models.json` con un JSON inválido — una coma de más, una comilla de menos.
- La key sin exportar, o exportada en otra terminal.
- La `baseUrl` con o sin `/v1`. Probá la que está proyectada.
- Requests que fallan por longitud: fijá `contextWindow` como está más arriba.

**Levantá la mano.** Este paso no es donde está el aprendizaje.

---

## Vía B — la GPU de Agus, acá en el aula (opcional, ~20 min)

Agus tiene una GPU en la sala sirviendo un modelo chico. Del lado tuyo es **otra entrada más en el mismo archivo**: misma operación, otro endpoint.

```json
{
  "providers": {
    "ccad": { "...": "lo de arriba, no lo borres" },
    "agus": {
      "baseUrl": "http://<IP-DE-AGUS>:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "models": [{ "id": "<EL-MODELO-QUE-SIRVA-AGUS>" }]
    }
  }
}
```

> La IP y el nombre del modelo van en la slide. Notá que es **la misma forma** que el provider del CCAD: cambia la URL y nada más. Del lado del estudiante no hay nada específico del runtime.

Después: `/model`, elegís el modelo de Agus, **mismo prompt, mismo repo**, y anotás las mismas cuatro preguntas.

### Qué mirar, que no es lo mismo que en la Vía A

- **La tercera corrida separa dos cosas que la sala mezcla.** Modelo grande en hardware de la UNC, modelo hosteado, y ahora modelo chico a tres metros. Eso te deja distinguir *"los modelos abiertos son peores"* de *"**este** modelo chico y cuantizado es peor"*. No es lo mismo, y es un salto de madurez técnica que sale casi gratis.
- **La VRAM contra la cuenta que hicimos en la teoría.** Agus va a mostrar cuánta memoria ocupa el modelo que está sirviendo. Comparalo con la cuenta de cuantización: parámetros × bits ÷ 8. Ahí se ve por qué el modelo grande vive en un cluster.
- **Los datos no salen del aula.** Sin cuenta, sin key, sin nadie en el medio: la contracara exacta de las cinco sesiones anteriores. Y el matiz de la teoría, que sigue valiendo acá: **local no significa privado automáticamente** — tu agente sigue pudiendo llamar a cualquier otra cosa.
- **Cuando se encole, mirá.** Una GPU atendiendo a toda la sala hace cola. Eso no es una falla del día: es exactamente lo que Ale explicó al contar por qué el CCAD corre vLLM y qué es el batching. Estás viendo el techo de una sola GPU chica, en vivo.

### Y el archivo, al final

Tu `models.json` termina con **tres proveedores**: el hosteado que usás hace cinco sesiones, un cluster de la UNC, y una notebook que está a tres metros. Cambiar entre ellos cuesta `/model` y dos segundos.

**Esa lista es la tesis de la sesión.** No es una afirmación nuestra: es un archivo tuyo.

---

## Extensión — si terminaste la Sesión 5 con un cliente propio

Apuntá **tu propio loop** a la misma `baseUrl` de LiteLLM, con la misma key. Mismo endpoint, dos clientes distintos: uno que escribiste vos y uno que instalaste.

Es una línea de configuración, no una tarde. Y es la prueba más directa de todo el argumento: el endpoint no sabe ni le importa quién le está hablando.

## Resultado esperado

Al final del ejercicio deberías tener:

- Un `models.json` con **al menos dos proveedores** (tres si hiciste la Vía B).
- **La misma tarea corrida en tu repo con dos modelos distintos**, en sesiones limpias.
- **Cuatro respuestas anotadas por corrida** — schema, turnos, alucinaciones, latencia.
- Una opinión propia, y con evidencia, sobre **qué se cayó y qué no** cuando le cambiaste el modelo abajo al agente.

**Lo que no deberías tener:** la API key escrita en ningún archivo del repo. Chequealo antes de commitear.

## Preguntas para la discusión final

1. ¿**Tu `AGENTS.md` y tus skills** funcionaron igual con el modelo abierto? ¿Se disparó lo que tenía que dispararse?
2. ¿Dónde se notó la diferencia: en **escribir código** o en **usar las tools**? Es la pregunta importante, y la respuesta más común no es la que la gente espera.
3. Si tuvieras que sostener **un proyecto largo** con el modelo abierto, ¿qué te preocuparía primero?
4. Para tu propio trabajo: ¿en qué caso concreto **elegirías** el modelo abierto, y en cuál no?

## Apéndice — servirlo en tu propia máquina, en casa

Hoy no lo hacemos en clase a propósito: bajar pesos y pelear con drivers en el aula se come la hora y no enseña nada que no hayamos visto. Pero es la continuación natural, y es media tarde de trabajo.

Con [Ollama](https://ollama.com/) —que se instala igual en Mac, Linux y Windows y resuelve solo cuántas capas manda a la GPU—:

```
ollama pull <modelo>
ollama serve
```

Eso te deja un endpoint compatible con la API de OpenAI en `http://127.0.0.1:11434/v1`, y ahí le apuntás **otra entrada más** en `models.json`, exactamente igual que hoy.

Tres cosas para saber antes de intentarlo:

- **El modelo tiene que soportar tool calling.** Uno sin plantilla de tools deja al agente sin poder hacer nada: no es que ande peor, es que no anda. Probalo antes de sacar conclusiones sobre el modelo.
- **Elegí el tamaño con la cuenta de cuantización**, no con el leaderboard: parámetros × bits ÷ 8, contra la memoria que tenés de verdad.
- **La ventana de contexto la elegís vos** (`OLLAMA_CONTEXT_LENGTH`, o `num_ctx` según cómo lo levantes). Es la misma perilla que del lado del CCAD eligió Ale, ahora en tu máquina.

Y si querés el recorrido completo hecho por alguien más, con mediciones: [**Using Local Coding Agents**, de Sebastian Raschka](https://magazine.sebastianraschka.com/p/using-local-coding-agents).

## Para seguir después del curso

- **Pedí tu cuenta del CCAD.** Ale contó el trámite: [abrir cuenta](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) · [pedido de cuentas](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/). Es la puerta a correr algo en hardware real, y te sobrevive al curso.
- [**A Deep Dive into Open-Weight AI Models**, de Flavio Copes](https://flaviocopes.com/open-weight-models/) — la teoría de hoy, para releerla con calma.
- [**The Big LLM Architecture Comparison**, de Sebastian Raschka](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison) — si la pregunta que te quedó es "¿y qué otros modelos hay?".
- [Pi — modelos y providers custom](https://pi.dev/docs/latest/models) — la documentación del archivo que escribiste hoy.
