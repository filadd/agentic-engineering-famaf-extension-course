# Sesión 6 — Ejercicio práctico: poné a prueba tu andamiaje con otro modelo abajo

## Objetivo

**Apuntar tu agente a un modelo de pesos abiertos corriendo en hardware de la UNC, y volver a probar contra él algo de lo que aprendiste en las primeras cuatro sesiones.**

Hay cuatro pruebas, una por sesión. **En clase hacés la que elijas** — con los ~22 minutos de práctica entrás cómodo en una y apretado en dos. Las otras quedan acá escritas para terminarlas en casa:

| | La sesión | La pregunta |
|---|---|---|
| 1 | **Vibecodear** | ¿funciona igual de bien? |
| 2 | **Planificar** | ¿los planes mantienen la misma calidad? |
| 3 | **Skills y MCP** | ¿los sigue como debe? |
| 4 | **Documentar** | ¿qué tan buenos son los docs que genera? |

> **¿No sabés cuál elegir? La 3.** Es la que más información da y donde más probable es que algo se rompa, porque es la que depende del tool calling. La 1 es la que menos va a diferenciar: en tareas de una sola pasada casi todos los modelos se parecen.

No estamos midiendo el modelo en abstracto: **estamos midiendo tu andamiaje contra otro motor**. La pregunta de fondo es cuánto de lo que construiste en cinco sesiones dependía del modelo — y la respuesta la sacás vos, midiendo, no nosotros afirmándola.

**Nadie instala un runtime hoy.** No hay pesos que bajar ni drivers que pelear: el cambio de modelo es un archivo de configuración y el comando `/model`.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1, con **su `AGENTS.md`, sus skills y su `.mcp.json`**. Esto no es negociable: si lo hacés en un directorio de prueba, hiciste un ejercicio de configuración y no la clase.
- `git status` limpio antes de arrancar, y limpiá entre prueba y prueba (`git stash` o `git checkout .`).
- **Tu API key del CCAD.** Se entrega en clase y **es tuya, no del curso**: no la compartas, no la pegues en un chat y no la commitees.
- **Tu memoria de las primeras cuatro sesiones es la línea de base.** Ya sabés cómo se porta tu agente con el modelo hosteado: eso es contra lo que vas a comparar.

## Paso 0 — `models.json` (~8 min, todos juntos)

Esto lo hacemos **en conjunto, con el archivo proyectado**. No arranques solo: si te trabás acá te quedás sin prueba, que es lo único que no se puede recuperar en casa.

Pi busca los proveedores de modelos en `~/.pi/agent/models.json` — el mismo directorio donde vive el **`AGENTS.md` global** que escribiste en la Sesión 3:

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

Y en la terminal desde la que vas a levantar Pi:

```
export CCAD_API_KEY=<tu key>
```

Cada uno tiene **su propia key**. Si la corrida de al lado anda y la tuya no, no es el modelo: es tu `export`.

**Los dos modelos están servidos**, así que los vas a ver a los dos en el picker de `/model`.

**Cuatro cosas de ese archivo, y cada una es algo que ya sabés:**

1. **`api: "openai-completions"`** es la interoperabilidad de la teoría convertida en un string. Los valores posibles son `openai-completions`, `openai-responses`, `anthropic-messages` y `google-generative-ai`: **cuatro formas de API para todo el ecosistema**. El CCAD no expone una API "del CCAD" — expone la misma que expone el Ollama que Agus mostró hace una hora. Por eso el swap cuesta cinco líneas.
2. **`apiKey: "$CCAD_API_KEY"`** — el campo acepta `$VAR` y `${VAR}`, y también ejecutar un comando si arranca con `!`. **Usá la variable, nunca la key literal**: una key en un archivo es una key en un backup, en un screenshot y —el día que versiones tus dotfiles— en un repo público.
3. **`models` es una lista.** Declarás el catálogo; el modelo activo lo elegís con `/model`. Son dos cosas distintas.
4. **`litellm.ccad.unc.edu.ar` y el prefijo `vllm/`** son las dos cosas que te acaba de explicar Ale: el gateway adelante, y su routing hacia lo que corre atrás.

**Lo que *no* está en el JSON:** `contextWindow` tiene default **128000** y `maxTokens` **16384**. O sea que la ventana de contexto es un número que alguien eligió — y hay tres para la misma cosa:

| Quién lo decide | Número |
|---|---|
| El modelo, nativo | **~262.144** |
| Pi, si no le decís nada | **128.000** |
| El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

Si en clase te damos el número del servidor, fijalo: `{ "id": "...", "contextWindow": 128000 }`.

Es la misma perilla que Agus tuvo que elegir de su lado, vista desde la otra punta — y la que explica por qué en 16 GB de VRAM no entraba todo.

Y el dato que te va a servir toda la práctica: **el archivo se relee cada vez que abrís `/model`**, sin reiniciar nada.

Ahora sí: `/model`, elegís uno de los dos modelos del CCAD, y arrancás con la prueba que hayas elegido.

---

## Cómo se corre cada prueba

Las cuatro tienen la misma forma, y conviene tenerla clara antes de arrancar:

- **Sesión nueva y limpia.** Contexto limpio, repo limpio. Si arrastrás la conversación anterior, no sabés qué estás midiendo.
- **Usá tus artefactos tal como están.** No los "arregles" para ayudar al modelo abierto: si tu skill no dispara, eso *es* el resultado.
- **Anotá mientras pasa, no después.**
- **Si algo te sorprende, verificá antes de concluir.** Repetí *esa* prueba con el modelo hosteado, mismo prompt y misma sesión limpia. Es lo que separa *"el modelo abierto no puede"* de *"mi prompt siempre fue frágil y recién ahora se nota"*.

Y las cuatro preguntas transversales, valgan para la que valgan:

- ¿**Respetó el schema** de las tools?
- ¿**Cuántos turnos** necesitó?
- ¿**Inventó** archivos, funciones o APIs?
- ¿Cómo se sintió la **latencia**?

---

## Prueba 1 — Vibecodear (~8 min)

**La Sesión 1, otra vez: prompt-and-accept.** Sin plan, sin plan mode, sin ceremonia. Pedile algo chico y bien acotado, del tamaño de lo que le pedías en la primera clase — un helper, un endpoint mínimo, un componente, un script.

**Qué mirar:**

- ¿**Corre**? ¿Compila, pasa el linter, hace lo que le pediste?
- ¿**Cuántas idas y vueltas** hasta llegar a algo aceptable? Es la métrica honesta del vibe coding.
- ¿**Inventó** una API, una función o una opción de librería que no existe?
- ¿Cómo se sintió la **latencia** adentro del loop? No los tokens por segundo en abstracto: la espera real entre pedir y ver la siguiente acción.

> La pregunta: *¿funciona igual de bien?* Y la trampa a evitar: en tareas de una pasada casi todos los modelos parecen iguales. Si te da lo mismo, **eso también es un resultado** — y explica por qué las otras tres pruebas existen.

## Prueba 2 — Planificar (~12 min)

**La Sesión 2.** Elegí una feature de verdad de tu repo —algo que no se describa en una frase— y pedile el plan como aprendiste a pedirlo: plan mode, o tu flujo de Plannotator, o el skill de planificación que escribiste en la Sesión 3.

**Qué mirar, que es exactamente lo que le anotabas a mano en la Sesión 2:**

- ¿**Preguntó lo que le faltaba**, o lo adivinó y siguió?
- ¿El plan dice **qué archivos toca**, con la ruta?
- ¿Dice **cómo se verifica** cada paso — qué test lo cubre y dónde vive?
- ¿**Se quedó planificando**, o se puso a escribir código igual? (Ojo acá: si tenés plan mode con bloqueo de tools, el bloqueo lo hace el harness y no el modelo. Lo que estás midiendo es **cómo reacciona al `reason`** que le devuelve el harness: ¿cambia de estrategia o reintenta a ciegas?)
- ¿**Cuánto le tuviste que anotar** para que el plan sirviera, comparado con lo que le anotabas en la Sesión 2?

> La pregunta: *¿los planes mantienen la misma calidad?* Es la prueba donde la diferencia entre modelos se empieza a ver de verdad, porque planificar es razonamiento largo y no autocompletado.

## Prueba 3 — Skills y MCP (~12 min) · **la recomendada**

**La Sesión 3, y es la prueba que más información da.** Acá se mide si tu configuración sobrevive al cambio de modelo.

Pedile una tarea que **tendría que disparar tu skill** — sin nombrarlo, sin `/skill:...`, dejando que la `description` haga su trabajo — y que además **necesite una tool del MCP** que configuraste (context7 o el que tengas).

**Qué mirar:**

- ¿**Disparó el skill solo**? Si no, forzalo con `/skill:<nombre>` y fijate si el problema era el disparo o el contenido. **Son dos fallas distintas**: la primera es de la `description`, la segunda del cuerpo.
- Una vez cargado, ¿**siguió el procedimiento**, o hizo lo suyo igual? ¿Se saltó pasos?
- ¿**Respetó el `AGENTS.md`** — los comandos, las convenciones, las decisiones que ya tenías escritas?
- ¿Los **tool calls salieron bien formados**? ¿Hubo llamadas que el harness rechazó por schema inválido, argumentos faltantes o nombres de tools inventados?
- Con **muchas tools cargadas**, ¿eligió la correcta o se confundió?

> La pregunta: *¿los sigue como debe?* Y el dato de la teoría que hay que tener a mano al interpretar lo que veas: **lo primero que se degrada con la cuantización suele ser la salida estructurada** — o sea, exactamente el tool calling. Si algo se rompe hoy, lo más probable es que se rompa acá y no en la calidad del código.

## Prueba 4 — Documentar (~8 min)

**La Sesión 4.** Pedile que documente algo **real y verificable** de tu repo: un módulo que ya existe, el README de una parte del proyecto, la explicación de un flujo que atraviesa varios archivos.

**Qué mirar:**

- ¿La documentación es **fiel al código**, o describe un proyecto parecido al tuyo pero que no es el tuyo? Chequealo contra los archivos, no contra tu recuerdo.
- ¿**Leyó** lo que tenía que leer antes de escribir, o escribió de memoria?
- ¿Documentó **lo que hace falta** — cómo se usa, qué decisiones hay detrás — o llenó líneas repitiendo lo que el código ya dice?
- ¿**Siguió el formato y las convenciones** que ya están en tu repo?

> La pregunta: *¿qué tan buenos son los docs que genera?* Documentar es la tarea que más castiga la alucinación, porque nada la hace fallar ruidosamente: un test roto se ve, un párrafo que miente no.

---

## Si te sobra tiempo en clase

El picker tiene **dos** modelos abiertos. Corré la misma prueba contra el otro y compará: es un punto más de comparación y no cuesta nada más que `/model`.

Y notá cómo quedó tu archivo: **dos proveedores** —el hosteado de cinco sesiones y un cluster de la UNC— y cambiar entre ellos cuesta dos segundos.

## Resultado esperado

- **Al menos una prueba corrida** contra el modelo abierto, en tu repo, con tus artefactos.
- **Apuntes de esa prueba**, no impresiones generales: qué hizo, en qué falló, cuántos turnos.
- Una respuesta propia y con evidencia a la pregunta del día: **¿qué se cayó y qué no** cuando le cambiaste el modelo abajo al agente?

**Y una cosa que no deberías tener:** la API key escrita en ningún archivo del repo. Chequealo antes de commitear.

## Para pensar (y para la retrospectiva)

1. De las pruebas que hayas corrido, **¿cuál se degradó más y cuál casi nada?** ¿Coincide con lo que esperabas antes de empezar?
2. Cuando algo falló, ¿fue **escribiendo código** o **usando las tools**? La respuesta más común no es la que la gente espera.
3. ¿Tu **`AGENTS.md` y tus skills** funcionaron igual? Si un skill no disparó, ¿el problema era el modelo o tu `description`?
4. Para tu propio trabajo: ¿en qué caso concreto **elegirías** el modelo abierto, y en cuál no?

---

## Apéndice A — ¿cuándo conviene un modelo abierto?

No entró en la clase, pero es el criterio que el ejercicio quiere dejarte:

**Encaja bien:**

- Datos sensibles o regulados.
- Tareas repetitivas de alto volumen, donde el costo domina.
- Investigación que necesita reproducibilidad y un modelo pineado.
- Trabajo offline o air-gapped.
- **Estudiar la cosa en sí**: no podés inspeccionar logits que no tenés.

**Encaja mal:**

- Querés el mejor coding agent disponible hoy.
- No tenés capacidad operativa — acordate de que el operador pasás a ser vos.
- El volumen es bajo, y una API hosteada te va a salir más barata que tu tiempo.

Y el otro modelo de costo, que es el que cambia respecto de todo lo que vieron en la Sesión 4: **por hora y por GPU, no por token**.

## Apéndice B — montarlo en tu propia máquina

Agus lo mostró con su GPU; si querés hacerlo vos, la referencia completa de punta a punta es [**Sebastian Raschka — *Using Local Coding Agents***](https://magazine.sebastianraschka.com/p/using-local-coding-agents). Sirve por tres cosas:

1. **El setup con Ollama**, que se instala igual en Mac, Linux y Windows y expone el endpoint compatible con OpenAI en `http://127.0.0.1:11434/v1` — o sea, **otra entrada más en tu `models.json`**, exactamente igual que el CCAD.
2. **Apunta harnesses open source a ese endpoint** (Qwen-Code, Codex, Claude Code): el mismo movimiento que hiciste hoy, hecho por un tercero y contra otro runtime.
3. **Mide**: 4-5 sobre 5 en tareas de razonamiento agéntico con un Qwen3.6 MoE, ~40 tokens/s en una Mac Mini, y hasta **~30 GB de RAM con contextos de 50k** — que es el número que explica la cuenta de los 16 GB que hizo Agus.

**El matiz al leerlo**: él mide **tareas acotadas**. Sostener un proyecto largo es otra pregunta, y el cuello de botella ahí suele ser el tool calling confiable, no la capacidad de escribir código.

## Apéndice C — seguir después del curso

- **Pedir tu cuenta del CCAD**: el trámite que contó Ale — [wiki](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) · [pedido de cuentas](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/).
- **Releer la teoría de hoy con calma**: [Flavio Copes — *A Deep Dive into Open-Weight AI Models*](https://flaviocopes.com/open-weight-models/).
- **¿Y qué otros modelos hay?**: [Sebastian Raschka — *The Big LLM Architecture Comparison*](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison).
