---
marp: true
theme: default
paginate: true
title: Sesión 6 — Modelos open source y CCAD
---

<!--
Skeleton de la presentación de la Sesión 6, escrito contra
sessions/session-6/INSTRUCTOR.md. Misma convención que la Sesión 3:
cada slide es un título + una nota de oradora/orador (comentario HTML),
y SOLO traen cuerpo escrito las slides que la sala tiene que copiar
textual o leer despacio:

  - el `models.json` del CCAD y el de la GPU de Agus (se copian);
  - las tres cards de licencias (Gemma 4 / Gemma 3 / Llama);
  - la cuenta de cuantización (60 GB → 15 GB);
  - la tabla de las tres ventanas de contexto;
  - el checklist de siete puntos para elegir un modelo;
  - los números de Raschka;
  - las frases que quedan proyectadas.

SESIÓN DE 2 H 30 (las otras son de 2 h; la Sesión 1 es de 3):
5 recap, 30 invitado, 30 pesos abiertos, 5 pausa, 60 práctica,
5 puesta en común, 15 cierre del curso. Da 150 EXACTOS: NO HAY COLCHÓN.

LA PRÁCTICA ES VOLVER A HACER LAS PRIMERAS CUATRO SESIONES contra el
modelo abierto: vibecodear, planificar, skills y MCP, documentar. Una
prueba por sesión, 8 min de models.json + 40 de pruebas, y la GPU de
Agus como punto extra de comparación. Ver exercise/README.md.

El bloque elástico es el recap. Si algo se estira se sacrifica primero
la pausa, después la puesta en común. LA PRÁCTICA Y EL CIERRE NO SE TOCAN.
Los dos bloques de 30 hay que ensayarlos con reloj.

ANTES DE PROYECTAR ESTO HAY QUE CONFIRMAR CON ALE:
  - la `baseUrl` exacta (con o sin `/v1`),
  - los `id` textuales de los modelos,
  - el `contextWindow` real con el que arrancó vLLM,
  - cómo se entregan las keys.
Y con Agus: la IP del aula, el modelo que sirve y su ventana de contexto.
Están marcados con <ASÍ> en las slides que llevan cuerpo.

Y verificar la semana de la clase: licencias, tamaños y gates de los repos,
y los números de Raschka. Es el material más perecedero del curso.
-->

# Sesión 6
## Modelos open source y CCAD

**De Vibe Coding a Agentic Engineering** — FaMAF
Diego Piloni · invitado: Ale Silva (CCAD)

<!-- Portada. Anclar tres cosas: es la última sesión, dura 2 h 30, y hoy cambia UNA sola pieza de todo lo que vinieron construyendo. Las cinco sesiones anteriores usaron un modelo hosteado detrás de una API: fue un default sensato y también un supuesto que nadie examinó. Hoy lo rompemos. -->

---

## Hoy

<!-- Agenda en una slide: cómo les fue con la Sesión 5, media hora con Ale Silva sobre el CCAD, media hora de modelos de pesos abiertos, pausa, una hora de práctica apuntando SU repo a un modelo que corre en hardware de la UNC, puesta en común y cierre del curso. Avisar acá dos cosas operativas: (1) hoy nadie instala un runtime ni baja pesos — la práctica entera es un archivo de configuración; (2) hace falta que traigan SU repo con SU AGENTS.md y SUS skills de la Sesión 3, porque ese es el insumo. -->

---

## "Cambiás el modelo editando cinco líneas de JSON, y nada de lo que construiste en cinco sesiones se cae"

<!-- LA FRASE DE LA SESIÓN. Decirla al principio y dejarla escrita a la vista. Todo lo que viene hoy —el invitado, la teoría, la práctica— existe para que esa frase deje de ser una afirmación y pase a ser algo que hicieron ellos, en su propio repo. -->

---

# ¿Cómo les fue?

<!-- Sección de recap de la Sesión 5. ~5 MIN DE DISCUSIÓN, no de slides. ESTE ES EL BLOQUE ELÁSTICO y ya está en el mínimo: si el día se estira, se recorta de acá. COORDINAR CON AGUS ANTES DE LA CLASE: la Sesión 5 todavía está en TBD, así que este bloque se escribe recién cuando su sesión exista. Preguntarle con qué quedaron en la mano y si alguien terminó con un cliente propio andando — eso define si la extensión del final tiene público. -->

---

## ¿Qué se les rompió del loop por dentro?

<!-- Disparador. Qué hicieron, qué se les rompió, qué les sorprendió de ver el harness desde adentro. Levantar la mano: ¿a alguien le quedó un cliente propio funcionando? Si hay manos, avisar que al final de la práctica hay una extensión para ellos: apuntar SU loop a la misma base URL del CCAD. -->

---

# Invitado: Ale Silva — el CCAD

<!-- Sección. 30 MIN, y entregar la sala. DECIRLE "30" CON ESE NÚMERO Y CON LA PRIORIDAD: si algo se cae, que sean sus puntos 1 y 2 — los podemos abrir nosotros en dos minutos con la wiki. Los puntos 3 a 6 son los que nadie más puede dar con autoridad. Presentarlo en treinta segundos: es quien opera la máquina a la que la sala le va a pegar en una hora. -->

---

## Los siete puntos

1. Qué es el CCAD y a quién le sirve
2. Qué hardware tiene
3. Cómo pide cuenta un estudiante de la UNC
4. Cómo se corre un LLM ahí
5. **LiteLLM** — el gateway, desde adentro
6. **vLLM** — qué corre atrás, y qué es el batching
7. Para qué se usa el HPC en la UNC

<!-- Dejar esta slide proyectada durante todo el slot: le sirve de reloj a él y de mapa a la sala. Marcar antes de entregar la sala por qué importan los puntos 3 y 4: son EL CAMINO DE VUELTA. Nada de eso hace falta para la clase de hoy —entramos por el gateway— pero el que quiera correr algo en hardware real después del curso necesita saber cómo se pide la cuenta. Dicho por el que opera la máquina vale más que cualquier link que les pasemos. -->

---

## Dos palabras que vuelven en cuarenta minutos

<!-- PEDIRLE EXPLÍCITAMENTE A ALE que nombre las dos con nombre y apellido: LiteLLM y vLLM. Es lo que convierte su slot en la mejor versión posible del bloque de configuración: en una hora van a tipear `https://litellm.ccad.unc.edu.ar` y un `id` que arranca con `vllm/`, y no van a ser dos strings copiados de una slide — van a ser dos cosas que les explicó el que las eligió, media hora antes. Ese círculo no lo podemos comprar de otra manera. Y su punto 6 —qué pasa cuando 25 personas le pegan al mismo tiempo— es literalmente lo que va a pasar durante la práctica. -->

---

# Modelos de pesos abiertos

<!-- Sección. 30 MIN, siete sub-bloques, ENSAYAR CON RELOJ: 3 + 5 + 6 + 5 + 4 + 5 + 2. El bloque es "A Deep Dive into Open-Weight AI Models" de Flavio Copes, dado en español. No es una referencia de apoyo: es el contenido. Lo que compramos al adoptar su orden es que cada pieza habilita la siguiente y que el bloque TERMINA EN UN CRITERIO PARA ELEGIR UN MODELO, en vez de terminar en una lista de datos sueltos. Lo único que le cambiamos: los ejemplos van sobre EL MODELO QUE EL GATEWAY ESTÉ SIRVIENDO HOY, que es al que van a apuntar su repo en cuarenta minutos. -->

---

## Una mesa de mezcla con miles de millones de perillas

<!-- ~3 min. La analogía es la del post y funciona. Un modelo es una consola de audio gigante. Antes de entrenar las perillas tienen valores al azar y no sirve para nada. Entrenar es: pasarle datos, que prediga, medir cuánto se equivocó, mover las perillas, repetir millones de veces. LOS PESOS SON LOS VALORES QUE QUEDARON EN LAS PERILLAS. Adentro no hay perillas: hay miles de millones de números en TENSORES, arreglos multidimensionales. Cuando leen 8B o 30B en el nombre de un modelo, esa B son miles de millones de parámetros, y casi todos son pesos. -->

---

## "Los pesos no son el código que entrena el modelo — son el resultado de entrenarlo"

<!-- LA FRASE QUE ORDENA TODO EL BLOQUE. Los pesos son el estado aprendido. Y de ahí sale la distinción que la sala nunca separó: LA ARQUITECTURA define las capas, las conexiones, el mecanismo de atención, el camino que siguen los datos, y suele estar publicada en un paper. LOS PESOS son los números aprendidos puestos adentro de esa arquitectura, y son lo que costó millones. Dos modelos con arquitecturas parecidas se comportan distinto porque aprendieron de datos distintos o con objetivos distintos. -->

---

## Qué hace falta para correr uno

- Arquitectura y configuración
- Pesos
- Tokenizer
- Un runtime de inferencia — Ollama, llama.cpp, MLX, Transformers
- Memoria suficiente

**Una API esconde todo esto detrás de un request HTTP.**

<!-- Cerrar el sub-bloque enumerando esto, y rematar con la frase del post que está en el cuerpo. ESE CONTRASTE ES LA SESIÓN ENTERA EN UNA LÍNEA, y conviene decirlo acá porque en una hora lo van a estar viviendo desde el otro lado: hoy le pegan a un endpoint que alguien más operó, y ese alguien es Ale. -->

---

## Pesos abiertos ≠ open source

<!-- ~5 min. Un modelo de pesos abiertos es UNO CUYOS PESOS APRENDIDOS SE PUEDEN DESCARGAR. Nada más que eso. QUÉ PODÉS HACER CON ELLOS LO DICE LA LICENCIA, no el hecho de que estén disponibles. Lo que la licencia PUEDE habilitar —y el post insiste en que no hay que asumir que están todos—: correrlo local, quedarte con una versión fija, hacerle fine-tune, cuantizarlo o convertirlo de formato, inspeccionar cómo se comporta, redistribuir los pesos, usarlo comercialmente. -->

---

## Los pesos no te dicen de dónde salieron

<!-- LA DISTINCIÓN QUE CASI NADIE HACE BIEN. En software normal, el código fuente es la forma preferida para estudiar y modificar un programa. Con los pesos pasa algo parecido y peor: podés correrlos y modificarlos, pero LOS PESOS SOLOS NO TE DICEN QUÉ DATOS LOS PRODUJERON, CÓMO SE FILTRARON ESOS DATOS, NI CON QUÉ PROCESO SE ENTRENÓ. La definición de Open Source AI de la OSI (opensource.org/ai) pide más que pesos descargables: pide el código y la información de datos necesarios para estudiar y modificar el sistema, además de los parámetros. -->

---

> *"«Pesos abiertos» te dice que podés obtener los parámetros aprendidos. La IA open source debería además darte los materiales y las libertades para estudiar, modificar y compartir el sistema entero."*

<!-- La formulación del post, PARA DECIR CASI TEXTUAL. El límite todavía se discute, pero "pesos abiertos" es el término correcto cuando una empresa publica los parámetros entrenados sin el material completo con el que se hicieron — y casi todo lo que se vende como "IA open source" es eso. USAR EL TÉRMINO BIEN EN CLASE: la sloppiness está en el marketing de la industria, no en los estudiantes. -->

---

## Licencias: las tres preguntas

1. ¿Lo puedo usar **comercialmente**?
2. ¿Puedo **redistribuir un fine-tune**?
3. ¿**De quién** es lo que genera?

<!-- ~6 min, y es donde la distinción anterior tiene consecuencias. Es lo que hay que mirar ANTES de meter un modelo en un proyecto, no después. Hay licencias que restringen el uso comercial, la CANTIDAD DE USUARIOS de tu producto, industrias enteras, o cómo podés compartir las versiones que modificaste. Estas tres preguntas son las que un estudiante tiene que poder contestar sobre cualquier modelo que baje. -->

---

## Gemma 4 26B — Apache 2.0

- Uso comercial: **sí**
- Redistribuir un fine-tune: **sí**
- Lo que genera: **de ustedes**
- Sin cláusula de escala · sin obligación de naming · sin política de uso aceptable pegada

<!-- Card 1 de 3, MEDIO MINUTO. Es el modelo que el gateway sirve hoy y al que le van a pegar en cuarenta minutos: el campo `license` real del model card. VERIFICAR LA SEMANA DE LA CLASE y tener las tres cards abiertas en pestañas antes de entrar al aula. (Si el CCAD levantó además el Qwen3.8-27B: mismas tres respuestas, también Apache 2.0.) -->

---

## Gemma 3 — términos propios de Google

<!-- Card 2 de 3, MEDIO MINUTO, Y ES EL GANCHO DEL SUB-BLOQUE: Gemma 2 y 3 salieron con términos propios de Google; Gemma 4 salió Apache 2.0. MISMA FAMILIA, MISMO NOMBRE, MISMO BOTÓN DE DESCARGA, DERECHOS DISTINTOS. ⚠️ LA TRAMPA, Y HAY QUE TENERLA CLARA ANTES DE DAR EL BLOQUE: si uno tiene en la cabeza que "Gemma es licencia propia de Google", eso vale para Gemma 2 y 3 y ES FALSO PARA GEMMA 4 (verificado el 2026-08-24 contra el blog de Google). Decirlo mal justo en este bloque sería vergonzoso dos veces. -->

---

## Llama — community licence, con cláusula de escala

<!-- Card 3 de 3, MEDIO MINUTO. El contraejemplo, para que el contraste exista: una licencia propia que restringe según la CANTIDAD DE USUARIOS de tu producto. Tres modelos que la sala llamaría "open source" sin pestañear, con tres regímenes de derechos distintos. -->

---

## "«Pesos abiertos» no te dice nada sobre lo que podés hacer con ellos. Eso lo dice la licencia — y la licencia cambia entre versiones del mismo modelo"

<!-- La frase del sub-bloque. Dejarla caer y seguir. -->

---

## Qué pasa cuando te bajás un modelo

- **safetensors** — tensores **sin contenido ejecutable**: carga más rápido y es más seguro que los formatos viejos basados en pickle de Python
- **GGUF** — tensores + metadata en un solo archivo, que leen llama.cpp, Ollama y LM Studio

```
model-Q4_K_M.gguf
```

<!-- ~5 min. El sub-bloque que convierte "bajarse un modelo" de una idea vaga en algo concreto. Que "más seguro" tenga UNA RAZÓN TÉCNICA y no sea un adjetivo es medio minuto bien gastado. Y en el nombre de archivo, señalar el `Q4`: ESA ES LA CUANTIZACIÓN, que es el sub-bloque siguiente. -->

---

## Y cuando lo corrés

<!-- El loop entero en cuatro pasos: el runtime lee la configuración, reserva memoria, carga los pesos y espera. Vos escribís algo → el tokenizer lo convierte en ids de tokens → el modelo pasa esos tokens por sus capas y usa los pesos para calcular probabilidades del siguiente token → elige uno, lo agrega a la secuencia y vuelve a empezar. La frase para cerrar: "NADA TIENE QUE LLAMAR A UNA API EN LA NUBE. LAS CUENTAS PASAN EN TU HARDWARE." -->

---

## Casi todos exponen la misma API

<!-- EL PUENTE AL RESTO DE LA SESIÓN, es nuestro y son SESENTA SEGUNDOS. Casi cualquiera de esos runtimes expone un ENDPOINT COMPATIBLE CON LA API DE OPENAI. Por eso cualquier harness se le puede apuntar a cualquier modelo sin que nadie se haya puesto de acuerdo con nadie: no hay un estándar votado en un comité, hay una forma de API que todos copiaron. ES LA RAZÓN DE QUE CAMBIAR DE MODELO SEAN CINCO LÍNEAS DE JSON Y NO UNA TARDE DE TRABAJO — y en veinte minutos van a escribir esas cinco líneas. -->

---

## Cuantización

```
30 mil millones de parámetros × 16 bits ÷ 8 = 60 GB
30 mil millones de parámetros ×  4 bits ÷ 8 = 15 GB
```

<!-- ~4 min. La cuenta es la del post y VA EN EL PIZARRÓN además de la slide. Cuantizar es guardar los pesos con menos bits. ES LA DIFERENCIA ENTRE "ESTO NO ENTRA EN NINGUNA MÁQUINA DE ESTA SALA" Y "ENTRA EN VARIAS" — y explica solo por qué el modelo grande vive en el CCAD y por qué lo que sirva Agus en su GPU va a ser mucho más chico. Dejarla escrita: contra la GPU de Agus se compara con la VRAM real. -->

---

## El tradeoff, sin exagerar para ningún lado

<!-- Como lo dice el post: un archivo más chico usa menos memoria y a veces corre más rápido, pero bajar la precisión PUEDE cambiar la calidad. Los métodos buenos de cuantización conservan bastante más de lo que sugiere la cuenta de bits pelada — Y AUN ASÍ HAY QUE PROBAR ESE MODELO Y ESA CUANTIZACIÓN EN TU TAREA. No se deduce, se mide. Y lo que hay que nombrar acá porque VUELVE EN LA PUESTA EN COMÚN: lo primero que se suele degradar es LA SALIDA ESTRUCTURADA, que es exactamente el tool calling. O sea: lo que un coding agent necesita para funcionar. -->

---

## Por qué importan

<!-- ~5 min. Las cinco razones, que es lo que contesta el "¿y para qué?" que la sala va a preguntar. (1) LA VERSIÓN NO SE TE MUEVE ABAJO DE LOS PIES: el proveedor puede actualizar o retirar un modelo detrás del mismo nombre de API; el que te bajaste se queda quieto — "tu aplicación no cambia porque un proveedor reemplazó silenciosamente el modelo". (2) LOS DATOS PRIVADOS PUEDEN QUEDARSE EN TU MÁQUINA. (3) LO PODÉS CAMBIAR: fine-tune, merge, cuantizar, estudiarlo — y una comunidad lo adapta a hardware que el que lo publicó nunca probó. (4) NO QUEDÁS ATADO A UN SERVICIO: el mismo modelo corre en varios runtimes y en varios proveedores, "es portable de una manera en que una API cerrada no lo es". (5) LOS MODELOS CHICOS SIRVEN COMO COMPONENTES, no como el sistema entero: "no necesitan ganar todos los benchmarks, necesitan hacer una tarea útil de manera lo bastante confiable". -->

---

## Qué NO te garantiza

<!-- CON EL MISMO PESO QUE LA LISTA ANTERIOR Y SIN APURARLA. Pesos abiertos no te asegura: buena calidad de salida, respuestas correctas, datos de entrenamiento sin sesgo, uso seguro de tools, hardware barato, generación rápida en tu máquina, permiso para usarlo como quieras, ni información para reproducir el entrenamiento. LO QUE SÍ GARANTIZA ES QUE EL OPERADOR PASÁS A SER VOS: elegir el runtime, asegurar la máquina, instalar las actualizaciones y medir la calidad. Nadie lo hace por vos. -->

---

## "Local no significa privado automáticamente"

<!-- EL MATIZ QUE DESARMA EL REFLEJO MÁS COMÚN DE LA SALA, y el post lo pone justo al lado del beneficio de privacidad. Un agente corriendo contra un modelo local SIGUE LLAMANDO APIs, sigue leyendo cosas de afuera y sigue pudiendo subir archivos a otro lado. El modelo dejó de ser el tercero; el resto del sistema sigue estando ahí. NO HAY UNA CONFIGURACIÓN QUE TE HAGA PRIVADO: HAY DECISIONES QUE TOMÁS SOBRE CADA PIEZA. Acá cierra el hilo transversal de seguridad del curso, y cierra angosto a propósito: estas dos puntas —vos sos el operador, y local ≠ privado— y nada más. -->

---

## Cómo elegir uno

1. **Licencia** — qué te deja hacer
2. **Cantidad de parámetros** — que alcance para la tarea y entre en tu hardware
3. **Cuantizaciones disponibles** — y cuánta memoria pide cada una
4. **Runtimes que lo soportan**
5. **Longitud de contexto** — y lo que esa longitud cuesta en memoria
6. **El model card** — para qué lo diseñaron, qué evalúan, qué límites reconocen
7. **Tu propio set de pruebas**, con ejemplos reales de tu aplicación

<!-- ~2 min, y es LO MÁS ACCIONABLE QUE SE LLEVAN DEL BLOQUE. Es la rampa a la práctica y conviene decirlo así: EL PUNTO 7 DE ESTE CHECKLIST ES LO QUE VAN A HACER EN VEINTE MINUTOS, SOBRE SU PROPIO REPO. -->

---

> *"No elijas un modelo solo por un leaderboard. **El mejor modelo es el más chico que hace tu tarea suficientemente bien, en hardware que puedas operar.**"*

<!-- El cierre del bloque de teoría, y las dos mejores frases del post. Dejarla proyectada mientras arranca la pausa. -->

---

# Pausa (5 min)

<!-- Aprovechar para abrir la terminal y dejar listo el paso 0 de la práctica en pantalla. SI EL DÍA SE ESTIRÓ, ESTE ES EL PRIMER SACRIFICIO. -->

---

# Práctica (60 min)

<!-- Sección. EL BLOQUE MÁS LARGO DE LA SESIÓN Y EL QUE NO SE RECORTA. EL EJERCICIO ES VOLVER A HACER LAS PRIMERAS CUATRO SESIONES CON OTRO MODELO ABAJO: vibecodear, planificar, skills y MCP, documentar. Nadie instala un runtime: el swap es un archivo de configuración y /model. Ver exercise/README.md — no leer los pasos desde la slide. DECIR EN VOZ ALTA AL SOLTARLOS: el resultado de la sesión son las CUATRO PRUEBAS CONTRA EL CCAD; lo de la GPU de Agus es un punto más de comparación y nadie se va con la sensación de no haber terminado por no haberlo hecho. -->

---

## Cómo se reparte la hora

| | Quién | Tiempo |
|---|---|---|
| Paso 0 — `models.json` | todos, juntos | 8 min |
| **Las cuatro pruebas, contra el CCAD** | **todos** | 40 min |
| Una prueba más contra la GPU de Agus | opcional | 12 min |

<!-- Dejar proyectada. Y la etiqueta de recurso compartido, que es lo único que sobrevive del bloque de mecánica de cluster y va en UNA FRASE: hay gente corriendo su tesis en esas máquinas, así que respetar los rate limits y no dejar tareas absurdas corriendo por curiosidad. -->

---

## Paso 0 — `~/.pi/agent/models.json`

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

<!-- EL CORAZÓN DE LA SESIÓN, y se da acá y no en la teoría: es setup, así que SE CAMINA EN PANTALLA CON LA SALA TIPEANDO AL MISMO TIEMPO, y queda proyectado el resto de la hora. FRENAR LA PRÁCTICA HASTA QUE EL ARCHIVO LE FUNCIONE A TODO EL MUNDO: el que arranca tarde acá pierde la comparación, que es lo único que no se puede recuperar en casa. Frenar un segundo en el PATH: es el mismo directorio donde vive el AGENTS.md GLOBAL que escribieron en la Sesión 3 — la config global del agente y el catálogo de modelos son vecinos. ⚠️ CONFIRMAR CON ALE ANTES DE PROYECTAR: la baseUrl exacta (con o sin /v1) y los dos `id` textuales; los strings los decide el CCAD al registrar los modelos en LiteLLM. Y decir en voz alta: SI EL SEGUNDO MODELO NO APARECE EN EL PICKER ES PORQUE EL CCAD NO LO LEVANTÓ, NO ES UN TYPO SUYO. -->

---

## Cuatro cosas para frenar

<!-- Una por una, y cada una es un concepto que YA TIENEN. (1) `api: "openai-completions"` es la historia de interoperabilidad de hace veinte minutos convertida en un string que tipean; los valores posibles son openai-completions, openai-responses, anthropic-messages y google-generative-ai: CUATRO FORMAS DE API PARA TODO EL ECOSISTEMA. El CCAD no expone una API "del CCAD": expone la misma que expondría Ollama, o LM Studio, o vLLM crudo. POR ESO EL SWAP CUESTA CINCO LÍNEAS. (2) `apiKey: "$CCAD_API_KEY"` — el campo acepta $VAR y ${VAR}, y también ejecutar un comando si arranca con `!`. CADA UNO TIENE SU PROPIA KEY, emitida desde la cuenta de Diego y repartida antes de clase: decirlo en voz alta, porque significa que si la corrida de al lado anda y la suya no, el problema es su export y no el modelo. USAR LA VARIABLE, NO LA KEY LITERAL, y decir por qué: la key literal en un archivo es la key literal en un backup, en un screenshot del proyector y —el día que a alguien se le ocurra versionar sus dotfiles— en un repo público. ES LA PRIMERA CREDENCIAL PROPIA DEL CURSO Y ES EL MOMENTO DE ENSEÑAR EL REFLEJO. (3) `models` ES UNA LISTA: el catálogo de modelos y el modelo activo son cosas distintas — declarás lo que hay, elegís con /model. (4) El prefijo `vllm/` es routing de LiteLLM y de paso les cuenta qué hay atrás. ACÁ SE COBRA EL SLOT DE ALE: LiteLLM y vLLM ya tienen cara, así que esto se da COMO RECONOCIMIENTO Y NO COMO DATO NUEVO — "eso que les contó Ale hace media hora, acá está, en un string". Lo mismo con la baseUrl. -->

---

## Lo que *no* está en el JSON

| Quién lo decide | Número |
|---|---|
| El modelo, nativo | **~262.144** |
| Pi, si no le decís nada | **128.000** |
| El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

<!-- LA MEJOR PARTE DEL PASO 0. `contextWindow` tiene default 128000 y `maxTokens` default 16384: O SEA QUE LA VENTANA DE CONTEXTO ES UN NÚMERO QUE ALGUIEN ELIGIÓ. Después de cinco sesiones tratándola como una propiedad del producto que compraron, resulta ser un parámetro de arranque. Escribir las tres filas en el pizarrón, una debajo de la otra: el modelo puede 256K, Pi asume 128K, y LO QUE REALMENTE TIENEN ES LO QUE EL SERVIDOR ARRANCÓ. ⚠️ SI EL SERVER ARRANCÓ CON MENOS QUE EL DEFAULT DE PI, LOS REQUESTS VAN A FALLAR: fijar `contextWindow` explícitamente con el valor que confirme Ale. Es la misma perilla que Agus fija de su lado al servir su GPU, vista desde la otra punta. Y el detalle operativo que hace fácil la práctica: EL ARCHIVO SE RELEE CADA VEZ QUE ABRÍS /model, sin reiniciar nada. -->

---

## Las cuatro pruebas

| | La sesión | La pregunta |
|---|---|---|
| 1 | **Vibecodear** | ¿funciona igual de bien? |
| 2 | **Planificar** | ¿los planes mantienen la misma calidad? |
| 3 | **Skills y MCP** | ¿los sigue como debe? |
| 4 | **Documentar** | ¿qué tan buenos son los docs que genera? |

<!-- ~40 min, Y ES EL EJERCICIO ENTERO: volver a hacer las primeras cuatro sesiones con otro modelo abajo. Dejar la tabla proyectada toda la práctica. Ver exercise/README.md — no leer los pasos desde la slide. LA LÍNEA DE BASE NO ES OTRA CORRIDA: ES LO QUE YA SABEN de las primeras cuatro clases, así que la comparación arranca gratis. Decirlo así al soltarlos: "no estamos midiendo el modelo, estamos midiendo SU andamiaje contra otro motor". Y avisar cuál es cuál: la prueba 1 es la que menos va a diferenciar (en una sola pasada todos los modelos se parecen) y LA PRUEBA 3 ES LA QUE MÁS INFORMACIÓN DA — si algo se rompe hoy, se rompe ahí. -->

---

## Lo que hay que vigilar caminando la sala

<!-- (1) TODO EN SU REPO, con su AGENTS.md, sus skills y su .mcp.json: el que lo hace en /tmp hizo un ejercicio de configuración, no la clase. (2) SESIÓN NUEVA Y LIMPIA PARA CADA PRUEBA, y repo limpio entre una y otra — si arrastran la conversación no saben qué están midiendo. (3) QUE NO "ARREGLEN" SUS ARTEFACTOS PARA AYUDAR AL MODELO: si el skill no dispara, ESO ES EL RESULTADO. (4) Si algo los sorprende, QUE REPITAN ESA PRUEBA CON EL MODELO HOSTEADO antes de concluir: es lo que separa "el modelo abierto no puede" de "mi prompt siempre fue frágil y recién ahora se nota". (5) EL ERROR MÁS PROBABLE NO ES CONCEPTUAL: un typo en el JSON o la key sin exportar — por eso el paso 0 se hace en conjunto. -->

---

## Anotá mientras pasa, no después

- ¿**Respetó el schema** de las tools?
- ¿**Cuántos turnos** necesitó?
- ¿**Inventó** archivos, funciones o APIs?
- ¿Cómo se sintió la **latencia**?

<!-- Las cuatro preguntas transversales, además de lo específico de cada prueba. SON EL INSUMO DE LA PUESTA EN COMÚN, que dura cinco minutos: sin apuntes no hay nada que poner en común. Dejar la slide proyectada al lado de la tabla de las cuatro pruebas. Y el callback que vale la pena tirar caminando: lo primero que se degrada con la cuantización es la SALIDA ESTRUCTURADA — o sea, la primera de estas cuatro preguntas. -->

---

## Opcional — la GPU de Agus, acá en el aula

```json
"agus": {
  "baseUrl": "http://<IP-DE-AGUS>:11434/v1",
  "api": "openai-completions",
  "apiKey": "ollama",
  "models": [{ "id": "<MODELO-DE-AGUS>" }]
}
```

<!-- ~12 min, OPCIONAL, y del lado del estudiante es OTRA ENTRADA MÁS en el mismo models.json: cero instalación, cero descarga de pesos, cero pelea con drivers. ⚠️ COMPLETAR LA IP Y EL MODELO CON AGUS ANTES DE LA CLASE, y probar el flujo entero desde otra máquina del aula. NO SE REPITEN LAS CUATRO PRUEBAS: eligen UNA —la 3, skills y MCP, es la que más información da— y la vuelven a correr acá. QUÉ ENSEÑA, y no es lo mismo que enseñaba servirlo uno mismo: (1) SEPARA DOS COSAS QUE LA SALA MEZCLA — modelo grande en hardware de la UNC, modelo hosteado, y ahora modelo chico a tres metros: es el punto donde se separa "los modelos abiertos son peores" de "ESTE MODELO CHICO Y CUANTIZADO es peor", que es un salto de madurez técnica y sale casi gratis. (2) EL MODELO A TRES METROS Y LOS DATOS SIN SALIR DEL AULA: sin cuenta, sin key, sin nadie en el medio — la contracara exacta de las cinco sesiones anteriores. Mostrar la VRAM real contra la cuenta de cuantización, y los tokens por segundo, PARA QUE LA LATENCIA SE SIENTA EN VEZ DE DESCRIBIRSE. (3) EL SWAP POR SEGUNDA VEZ EN LA MISMA HORA. REPETIR AL SOLTARLOS Y OTRA VEZ A LOS DIEZ MINUTOS: NADIE TIENE QUE TERMINAR ESTO. -->

---

## Tres providers en un archivo

<!-- LA TESIS DE LA SESIÓN, Y NO ES UNA AFIRMACIÓN: ES UNA LISTA DE TRES ENTRADAS EN UN JSON. El hosteado que vienen usando hace cinco sesiones, el CCAD y la notebook que está a tres metros. El modelo activo se elige con /model y cambiar cuesta dos segundos. 💡 Y CUANDO LA GPU DE AGUS SE ENCOLE, NARRARLO EN VIVO EN VEZ DE TRATARLO COMO UNA FALLA: una GPU sirviendo a 25 personas a la vez se encola, y que se encole delante de todos muestra el techo de una sola GPU chica — QUE ES EXACTAMENTE LO QUE ALE EXPLICÓ MEDIA HORA ANTES al contar por qué el CCAD corre vLLM y no otra cosa. Avisarle a Agus para que lo esperemos y lo usemos como demostración. -->

---

## Extensión — si terminaste la Sesión 5

<!-- Para el que quedó con su propio loop andando: apuntarlo a la MISMA base URL de LiteLLM. Mismo endpoint, dos clientes. Es una oferta genuina y no un premio consuelo: con el gateway es una línea de config, no una tarde. Sale solo si el recap dijo que hay público. -->

---

# ¿Está a la altura de un proyecto serio?

<!-- Sección, ~5 min, Y VA DESPUÉS DE LA PRÁCTICA A PROPÓSITO: las discusiones de criterio salen mejor cuando ya midieron algo propio. Arrancar por la sala, con las cuatro preguntas que anotaron, y recién después poner los números de Raschka. -->

---

## Lo que midió Sebastian Raschka

- **Setup**: Ollama + harnesses open source apuntados al endpoint — *el mismo movimiento que acaban de hacer*
- **Calidad agéntica**: 4-5/5 en razonamiento agéntico con un **Qwen3.6 MoE**
- **Velocidad**: ~40 tokens/s en una Mac Mini
- **Memoria**: hasta ~30 GB de RAM con contextos de 50k

<!-- "Using Local Coding Agents": corrió esta misma pregunta de punta a punta, con otro runtime y por un tercero. Su conclusión: los MoE nuevos ya alcanzan para mucho trabajo real. La ventana de contexto se paga en hardware, Y ACÁ ESTÁ EL NÚMERO. ⚠️ RE-VERIFICAR LA SEMANA DE LA CLASE: esto se mueve rápido. EL MATIZ QUE HAY QUE DECIR JUNTO CON LOS NÚMEROS: él mide TAREAS ACOTADAS. Sostener un proyecto largo es otra pregunta, y el cuello de botella ahí suele ser EL TOOL CALLING CONFIABLE, no la capacidad de escribir código. No es una contradicción: son dos preguntas distintas, y distinguirlas es el criterio que este bloque quiere dejar. -->

---

## Cuándo conviene, y cuándo no

<!-- DOS MINUTOS, CERRANDO LA PUESTA EN COMÚN, y de ahí se sale al cierre del curso. ENCAJA BIEN: datos sensibles o regulados; tareas repetitivas de alto volumen donde el costo domina; investigación que necesita reproducibilidad y un modelo pineado; trabajo offline o air-gapped; y ESTUDIAR LA COSA EN SÍ — no podés inspeccionar logits que no tenés. ENCAJA MAL: querés el mejor coding agent disponible hoy; no tenés capacidad operativa; el volumen es bajo y una API hosteada va a salir más barata que tu tiempo. Y el otro modelo de costo, que es el callback a la Sesión 4: POR HORA Y POR GPU, NO POR TOKEN. -->

---

# Cierre del curso

<!-- Sección, ~15 min, Y NO SE TOCA aunque el día se haya estirado. Es el final del curso, no el final de la sesión. OJO CON EL REPARTO: la Sesión 4 ya cerró el arco base con el material de juicio (costo, límites, carrera, atrofia). ACÁ VA EL MATERIAL DE ARTEFACTO: el repo, el espectro y la tesis de la transferencia. No reintroducir lo de la Sesión 4. -->

---

## El repo, desde el primer commit hasta hoy

<!-- Que abran el log de su propio proyecto. En la Sesión 1 era prompt-and-accept. Después le agregaron un plan y un review, después un AGENTS.md y skills, después contexto y spec, después vieron el loop por dentro, y hoy le cambiaron el modelo abajo. NADA DE ESO SE CAYÓ HOY. Es el artefacto que se llevan, y es la mejor evidencia de la tesis del curso — no se los tenemos que decir nosotros, está en su git log. -->

---

## El espectro, otra vez

<!-- Los cinco niveles de la Sesión 1, ahora como mapa y no como promesa. La pregunta para la sala: ¿DÓNDE SE PARAN HOY, Y DÓNDE SE QUIEREN PARAR EL LUNES? Y la respuesta que el curso da: no hay un nivel correcto — hay una decisión que se toma por tarea, y hoy tienen el criterio para tomarla. -->

---

## Lo que se transfiere

<!-- LA TESIS DE CIERRE, hecha carne hace veinte minutos. El AGENTS.md, los skills, el plan mode, el flujo de review, la spec, el presupuesto de contexto: NADA DE ESO ERA SOBRE EL MODELO. Hoy le cambiaron el modelo por uno que corre en un cluster de la UNC y todo siguió funcionando. Ese es el pago de haber enseñado ESTRUCTURA en vez de un producto: lo que construyeron sobrevive al modelo, y va a sobrevivir a la herramienta. Cerrar con la frase de la sesión, que quedó proyectada desde el principio. -->

---

## ¿Qué les pareció? ¿Qué mejorarían?

<!-- DEBATE ABIERTO, y es el bloque más importante de los 15 minutos: SI LES SIRVIÓ, QUÉ SE LLEVAN, QUÉ CAMBIARÍAN. Preguntas para desbloquear si la sala está callada: ¿qué sesión les sirvió más y cuál menos? ¿qué habrían querido que dure el doble? ¿qué van a usar el lunes y qué no van a volver a abrir? Escuchar más que defender: las respuestas honestas son las que hacen la próxima edición. -->

---

## Gracias

**Diego Piloni** · **Agustín Carrasco** · invitado: **Ale Silva** (CCAD)

<!-- Agradecer a Ale y al CCAD con nombre: sin ese acceso esta sesión no existe. Y dejar tres punteros abiertos para el que quiera seguir: pedir su cuenta del CCAD (la wiki, el trámite que contó Ale), la guía de Raschka para montarlo en su propia máquina, y el post de Copes para releer la teoría de hoy con calma. -->
