# Sesión 6 — Ejercicio práctico: volvé a hacer las primeras cuatro sesiones, con otro modelo abajo

## Objetivo

**Apuntar tu agente a un modelo de pesos abiertos corriendo en hardware de la UNC, y volver a probar contra él todo lo que aprendiste en las primeras cuatro sesiones.**

Cuatro pruebas, una por sesión:

| | La sesión | La pregunta |
|---|---|---|
| 1 | **Vibecodear** | ¿funciona igual de bien? |
| 2 | **Planificar** | ¿los planes mantienen la misma calidad? |
| 3 | **Skills y MCP** | ¿los sigue como debe? |
| 4 | **Documentar** | ¿qué tan buenos son los docs que genera? |

No estamos midiendo el modelo en abstracto: **estamos midiendo tu andamiaje contra otro motor**. La pregunta de fondo es cuánto de lo que construiste en cinco sesiones dependía del modelo — y la respuesta la sacás vos, midiendo, no nosotros afirmándola.

**Nadie instala un runtime hoy.** No hay pesos que bajar ni drivers que pelear: el cambio de modelo es un archivo de configuración y el comando `/model`.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1, con **su `AGENTS.md`, sus skills y su `.mcp.json`**. Esto no es negociable: si lo hacés en un directorio de prueba, hiciste un ejercicio de configuración y no la clase.
- `git status` limpio antes de arrancar, y limpiá entre prueba y prueba (`git stash` o `git checkout .`).
- **Tu API key del CCAD.** Se entrega en clase y **es tuya, no del curso**: no la compartas, no la pegues en un chat y no la commitees.
- **Tu memoria de las primeras cuatro sesiones es la línea de base.** Ya sabés cómo se porta tu agente con el modelo hosteado: eso es contra lo que vas a comparar.

## Paso 0 — `models.json` (~8 min, todos juntos)

Esto lo hacemos **en conjunto, con el archivo proyectado**. No arranques solo: si te trabás acá perdés las pruebas, que es lo único que no se puede recuperar en casa.

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
        { "id": "vllm/qwen3.8-27b" }
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

> ⚠️ **La `baseUrl` y los `id` van textuales de la slide.** Los strings exactos los decide el CCAD al registrar los modelos, así que copiá lo proyectado, no lo de acá. Si el segundo modelo no aparece en el picker, es porque el CCAD no lo levantó: **no es un typo tuyo** y las cuatro pruebas se hacen igual con el que esté.

**Cuatro cosas de ese archivo, y cada una es algo que ya sabés:**

1. **`api: "openai-completions"`** es la interoperabilidad de la teoría convertida en un string. Los valores posibles son `openai-completions`, `openai-responses`, `anthropic-messages` y `google-generative-ai`: **cuatro formas de API para todo el ecosistema**. El CCAD no expone una API "del CCAD" — expone la misma que expondría Ollama, o LM Studio, o vLLM crudo. Por eso el swap cuesta cinco líneas.
2. **`apiKey: "$CCAD_API_KEY"`** — el campo acepta `$VAR` y `${VAR}`, y también ejecutar un comando si arranca con `!`. **Usá la variable, nunca la key literal**: una key en un archivo es una key en un backup, en un screenshot y —el día que versiones tus dotfiles— en un repo público.
3. **`models` es una lista.** Declarás el catálogo; el modelo activo lo elegís con `/model`. Son dos cosas distintas.
4. **`litellm.ccad.unc.edu.ar` y el prefijo `vllm/`** son las dos cosas que te explicó Ale hace media hora: el gateway adelante, y su routing hacia lo que corre atrás.

**Lo que *no* está en el JSON:** `contextWindow` tiene default **128000** y `maxTokens` **16384**. O sea que la ventana de contexto es un número que alguien eligió — y hay tres para la misma cosa:

| Quién lo decide | Número |
|---|---|
| El modelo, nativo | **~262.144** |
| Pi, si no le decís nada | **128.000** |
| El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

Si en clase te damos el número del servidor, fijalo: `{ "id": "...", "contextWindow": 128000 }`.

Y el dato que te va a servir toda la hora: **el archivo se relee cada vez que abrís `/model`**, sin reiniciar nada.

Ahora sí: `/model`, elegís el modelo abierto del CCAD, y empiezan las cuatro pruebas.

---

## Cómo se corre cada prueba

Las cuatro tienen la misma forma, y conviene tenerla clara antes de arrancar:

- **Sesión nueva y limpia para cada una.** Contexto limpio, repo limpio. Si arrastrás la conversación anterior, no sabés qué estás midiendo.
- **Usá tus artefactos tal como están.** No los "arregles" para ayudar al modelo abierto: si tu skill no dispara, eso *es* el resultado.
- **Anotá mientras pasa, no después.** Son el insumo de la puesta en común, y dura cinco minutos: sin apuntes no hay nada que poner en común.
- **Si algo te sorprende, verificá antes de concluir.** Repetí *esa* prueba con el modelo hosteado, mismo prompt y misma sesión limpia. Es lo que separa *"el modelo abierto no puede"* de *"mi prompt siempre fue frágil y recién ahora se nota"*.

---

## Prueba 1 — Vibecodear (~8 min)

**La Sesión 1, otra vez: prompt-and-accept.** Sin plan, sin plan mode, sin ceremonia. Pedile algo chico y bien acotado, del tamaño de lo que le pedías en la primera clase — un helper, un endpoint mínimo, un componente, un script.

**Qué mirar:**

- ¿**Corre**? ¿Compila, pasa el linter, hace lo que le pediste?
- ¿**Cuántas idas y vueltas** hasta llegar a algo aceptable? Es la métrica honesta del vibe coding.
- ¿**Inventó** una API, una función o una opción de librería que no existe?
- ¿Cómo se sintió la **latencia** adentro del loop? No los tokens por segundo en abstracto: la espera real entre pedir y ver la siguiente acción.

> La pregunta: *¿funciona igual de bien?* Y la trampa a evitar: en tareas de una pasada casi todos los modelos parecen iguales. Si te da lo mismo, **eso también es un resultado** — y explica por qué las tres pruebas siguientes existen.

## Prueba 2 — Planificar (~12 min)

**La Sesión 2.** Elegí una feature de verdad de tu repo —algo que no se describa en una frase— y pedile el plan como aprendiste a pedirlo: plan mode, o tu flujo de Plannotator, o el skill de planificación que escribiste en la Sesión 3.

**Qué mirar, que es exactamente lo que le anotabas a mano en la Sesión 2:**

- ¿**Preguntó lo que le faltaba**, o lo adivinó y siguió?
- ¿El plan dice **qué archivos toca**, con la ruta?
- ¿Dice **cómo se verifica** cada paso — qué test lo cubre y dónde vive?
- ¿**Se quedó planificando**, o se puso a escribir código igual? (Ojo acá: si tenés plan mode con bloqueo de tools, el bloqueo lo hace el harness y no el modelo. Lo que estás midiendo es **cómo reacciona al `reason`** que le devuelve el harness: ¿cambia de estrategia o reintenta a ciegas?)
- ¿**Cuánto le tuviste que anotar** para que el plan sirviera, comparado con lo que le anotabas en la Sesión 2?

> La pregunta: *¿los planes mantienen la misma calidad?* Es la prueba donde la diferencia entre modelos se empieza a ver de verdad, porque planificar es razonamiento largo y no autocompletado.

## Prueba 3 — Skills y MCP (~12 min)

**La Sesión 3, y es la prueba más importante de las cuatro.** Acá se mide si tu configuración sobrevive al cambio de modelo.

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

## Opcional — las mismas pruebas contra la GPU de Agus

Agus tiene una GPU en la sala sirviendo un modelo chico. Del lado tuyo es **otra entrada más** en el mismo archivo:

```json
"agus": {
  "baseUrl": "http://<IP-DE-AGUS>:11434/v1",
  "api": "openai-completions",
  "apiKey": "ollama",
  "models": [{ "id": "<EL-MODELO-QUE-SIRVA-AGUS>" }]
}
```

**No hace falta correr las cuatro. Elegí una** —la 3 es la que más información da— y repetila.

Lo que agrega: separa *"los modelos abiertos son peores"* de *"**este** modelo chico y cuantizado es peor"*. Mirá también la VRAM que ocupa contra la cuenta de cuantización de la teoría, y qué pasa cuando toda la sala le pega al mismo tiempo: eso que ves encolarse es el batching que explicó Ale, en chiquito.

> **Nadie tiene que terminar esto.** El resultado del ejercicio son las cuatro pruebas contra el CCAD; esto es un punto más de comparación.

Y notá cómo queda tu archivo al final: **tres proveedores** — el hosteado de cinco sesiones, un cluster de la UNC, y una notebook a tres metros — y cambiar entre ellos cuesta `/model`. Esa lista es la tesis de la sesión, y no es una afirmación nuestra: es un archivo tuyo.

## Resultado esperado

- Las **cuatro pruebas corridas** contra el modelo abierto, en tu repo, con tus artefactos.
- **Apuntes por prueba**, no impresiones generales: qué hizo, en qué falló, cuántos turnos.
- Una respuesta propia y con evidencia a la pregunta del día: **¿qué se cayó y qué no** cuando le cambiaste el modelo abajo al agente?

**Y una cosa que no deberías tener:** la API key escrita en ningún archivo del repo. Chequealo antes de commitear.

## Preguntas para la discusión final

1. De las cuatro pruebas, **¿cuál se degradó más y cuál casi nada?** ¿Coincide con lo que esperabas antes de empezar?
2. Cuando algo falló, ¿fue **escribiendo código** o **usando las tools**? La respuesta más común no es la que la gente espera.
3. ¿Tu **`AGENTS.md` y tus skills** funcionaron igual? Si un skill no disparó, ¿el problema era el modelo o tu `description`?
4. Para tu propio trabajo: ¿en qué caso concreto **elegirías** el modelo abierto, y en cuál no?
