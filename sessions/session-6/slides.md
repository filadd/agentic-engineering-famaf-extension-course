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

  - el `models.json` del CCAD (se copia);
  - la card de licencia de Gemma 4;
  - la cuenta de cuantización (60 GB → 15 GB) y la de la VRAM de Agus;
  - la tabla de las tres ventanas de contexto;
  - el checklist de siete puntos para elegir un modelo;
  - los cuatro puntos del programa de Ale;
  - la tabla de las cuatro pruebas;
  - las frases que quedan proyectadas.

SESIÓN DE 2 H 30 (las otras son de 2 h; la Sesión 1 es de 3). CINCO BLOQUES:
30 teoría (Diego), 15 demo GPU (Agus), 60 CCAD (Ale), 30 práctica, 15 retrospectiva.
Da 150 EXACTOS: NO HAY COLCHÓN, NO HAY PAUSA, NO HAY RECAP.

NO HAY BLOQUE ELÁSTICO. Si algo se estira, lo único recortable en vivo es la
práctica — y es lo peor que puede pasar, porque es lo único que la sala hace
con las manos. Los tres bloques expositivos hay que ensayarlos con reloj y a
Ale hay que decirle 60 CON ESE NÚMERO.

EL ORDEN ES EL DISEÑO: abstracto (qué es un modelo) → una GPU en un escritorio
(16 GB, a tres metros) → un centro de cómputo nacional → la sala le pega.
Hacer esas transiciones en voz alta.

DATOS DEL CCAD, YA CONFIRMADOS Y TEXTUALES:
  baseUrl  https://litellm.ccad.unc.edu.ar   (SIN /v1)
  modelos  vllm/gemma4-26b   y   vllm/qwen3.8:30b
Los dos están servidos: el picker muestra los dos.

Verificar la semana de la clase: licencias, tamaños y gates de los repos.
Es el material más perecedero del curso.
-->

# Sesión 6
## Modelos open source y CCAD

**De Vibe Coding a Agentic Engineering** — FaMAF
Diego Piloni · Agustín Carrasco · invitado: Ale Silva (CCAD)

<!-- Portada. Anclar tres cosas: es la última sesión, dura 2 h 30, y hoy cambia UNA sola pieza de todo lo que vinieron construyendo. Las cinco sesiones anteriores usaron un modelo hosteado detrás de una API: fue un default sensato y también un supuesto que nadie examinó. Hoy lo rompemos. -->

---

## Hoy

<!-- Agenda en una slide: media hora de modelos de pesos abiertos, quince minutos de Agus corriendo uno en su GPU acá adelante, una hora con Ale Silva sobre el CCAD, media hora de práctica apuntando SU repo a un modelo que corre en hardware de la UNC, y el cierre del curso. NOMBRAR EL ORDEN COMO LO QUE ES —una escalada: primero qué es la cosa, después una GPU en un escritorio, después un centro de cómputo entero, después ustedes le pegan. Avisar acá tres cosas operativas: (1) hoy nadie instala un runtime ni baja pesos — la práctica entera es un archivo de configuración; (2) hace falta que traigan SU repo con SU AGENTS.md y SUS skills de la Sesión 3, porque ese es el insumo; (3) NO HAY PAUSA FORMAL y son 1 h 45 antes de tocar el teclado: que salgan un minuto cuando lo necesiten, sin frenar la clase. -->

---

## "Cambiás el modelo editando cinco líneas de JSON, y nada de lo que construiste en cinco sesiones se cae"

<!-- LA FRASE DE LA SESIÓN. Decirla al principio y dejarla escrita a la vista. Todo lo que viene hoy —la teoría, las dos demos, la práctica— existe para que esa frase deje de ser una afirmación y pase a ser algo que hicieron ellos, en su propio repo. -->

---

# Modelos de pesos abiertos

<!-- Sección. 30 MIN, siete sub-bloques, ENSAYAR CON RELOJ: 3 + 5 + 6 + 5 + 4 + 5 + 2. El bloque es "A Deep Dive into Open-Weight AI Models" de Flavio Copes, dado en español. No es una referencia de apoyo: es el contenido. Lo que compramos al adoptar su orden es que cada pieza habilita la siguiente y que el bloque TERMINA EN UN CRITERIO PARA ELEGIR UN MODELO, en vez de terminar en una lista de datos sueltos. Lo único que le cambiamos: los ejemplos van sobre LOS DOS MODELOS QUE SIRVE EL GATEWAY, a los que van a apuntar su repo al final de la clase. ⚠️ ESTE BLOQUE ABRE LA SESIÓN: todo lo que diga del CCAD es ANTICIPACIÓN, no callback. Todavía no escucharon a Ale ni vieron la GPU de Agus. -->

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

<!-- Cerrar el sub-bloque enumerando esto, y rematar con la frase del post que está en el cuerpo. ESE CONTRASTE ES LA SESIÓN ENTERA EN UNA LÍNEA. Y avisar que esta lista NO SE VA A QUEDAR EN UNA SLIDE: en quince minutos Agus va a mostrar cada uno de estos cinco renglones en su máquina, con las piezas a la vista. -->

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

<!-- Card 1 de 3, MEDIO MINUTO. Es uno de los dos modelos que sirve el gateway y al que le van a pegar al final de la clase: el campo `license` real del model card. El otro, Qwen3.8 30B, tiene las mismas tres respuestas y también es Apache 2.0. VERIFICAR LA SEMANA DE LA CLASE y tener las tres cards abiertas en pestañas antes de entrar al aula. -->

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

<!-- El loop entero en cuatro pasos: el runtime lee la configuración, reserva memoria, carga los pesos y espera. Vos escribís algo → el tokenizer lo convierte en ids de tokens → el modelo pasa esos tokens por sus capas y usa los pesos para calcular probabilidades del siguiente token → elige uno, lo agrega a la secuencia y vuelve a empezar. La frase para cerrar: "NADA TIENE QUE LLAMAR A UNA API EN LA NUBE. LAS CUENTAS PASAN EN TU HARDWARE." Y avisar: en quince minutos eso deja de ser una afirmación. -->

---

## Casi todos exponen la misma API

<!-- EL PUENTE AL RESTO DE LA SESIÓN, es nuestro y son SESENTA SEGUNDOS. Casi cualquiera de esos runtimes expone un ENDPOINT COMPATIBLE CON LA API DE OPENAI. Por eso cualquier harness se le puede apuntar a cualquier modelo sin que nadie se haya puesto de acuerdo con nadie: no hay un estándar votado en un comité, hay una forma de API que todos copiaron. ES LA RAZÓN DE QUE CAMBIAR DE MODELO SEAN CINCO LÍNEAS DE JSON Y NO UNA TARDE DE TRABAJO — y al final de la clase van a escribir esas cinco líneas. -->

---

## Cuantización

```
30 mil millones de parámetros × 16 bits ÷ 8 = 60 GB
30 mil millones de parámetros ×  4 bits ÷ 8 = 15 GB
```

<!-- ~4 min. La cuenta es la del post y VA EN EL PIZARRÓN además de la slide. Cuantizar es guardar los pesos con menos bits. ES LA DIFERENCIA ENTRE "ESTO NO ENTRA EN NINGUNA MÁQUINA DE ESTA SALA" Y "ENTRA EN VARIAS". 💡 DEJARLA ESCRITA EN EL PIZARRÓN Y NO BORRARLA: Agus la va a usar en quince minutos contra los 16 GB reales de su GPU, y ahí es donde la cuenta muestra lo que le falta. -->

---

## El tradeoff, sin exagerar para ningún lado

<!-- Como lo dice el post: un archivo más chico usa menos memoria y a veces corre más rápido, pero bajar la precisión PUEDE cambiar la calidad. Los métodos buenos de cuantización conservan bastante más de lo que sugiere la cuenta de bits pelada — Y AUN ASÍ HAY QUE PROBAR ESE MODELO Y ESA CUANTIZACIÓN EN TU TAREA. No se deduce, se mide. Y lo que hay que nombrar acá porque VUELVE EN LA PRÁCTICA: lo primero que se suele degradar es LA SALIDA ESTRUCTURADA, que es exactamente el tool calling. O sea: lo que un coding agent necesita para funcionar. -->

---

## Por qué importan

<!-- ~5 min. Las cinco razones, que es lo que contesta el "¿y para qué?" que la sala va a preguntar. (1) LA VERSIÓN NO SE TE MUEVE ABAJO DE LOS PIES: el proveedor puede actualizar o retirar un modelo detrás del mismo nombre de API; el que te bajaste se queda quieto — "tu aplicación no cambia porque un proveedor reemplazó silenciosamente el modelo". (2) LOS DATOS PRIVADOS PUEDEN QUEDARSE EN TU MÁQUINA. (3) LO PODÉS CAMBIAR: fine-tune, merge, cuantizar, estudiarlo — y una comunidad lo adapta a hardware que el que lo publicó nunca probó. (4) NO QUEDÁS ATADO A UN SERVICIO: el mismo modelo corre en varios runtimes y en varios proveedores, "es portable de una manera en que una API cerrada no lo es". (5) LOS MODELOS CHICOS SIRVEN COMO COMPONENTES, no como el sistema entero: "no necesitan ganar todos los benchmarks, necesitan hacer una tarea útil de manera lo bastante confiable". -->

---

## Qué NO te garantiza

<!-- CON EL MISMO PESO QUE LA LISTA ANTERIOR Y SIN APURARLA. Pesos abiertos no te asegura: buena calidad de salida, respuestas correctas, datos de entrenamiento sin sesgo, uso seguro de tools, hardware barato, generación rápida en tu máquina, permiso para usarlo como quieras, ni información para reproducir el entrenamiento. LO QUE SÍ GARANTIZA ES QUE EL OPERADOR PASÁS A SER VOS: elegir el runtime, asegurar la máquina, instalar las actualizaciones y medir la calidad. Nadie lo hace por vos. Y el puente: "en quince minutos van a ver a un operador; en cuarenta y cinco, a otro, con un cluster atrás". -->

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

<!-- ~2 min, y es LO MÁS ACCIONABLE QUE SE LLEVAN DEL BLOQUE. ES LA RAMPA A LA DEMO DE AGUS y conviene decirlo con esas palabras: LOS PUNTOS 2, 3 Y 5 —que entre en tu hardware, qué cuantización elegís, y lo que el contexto cuesta en memoria— son literalmente lo que él va a resolver en vivo en los próximos quince minutos, con 16 GB. El punto 7 es lo que van a hacer ustedes al final de la clase, sobre su propio repo. -->

---

> *"No elijas un modelo solo por un leaderboard. **El mejor modelo es el más chico que hace tu tarea suficientemente bien, en hardware que puedas operar.**"*

<!-- El cierre del bloque de teoría, y las dos mejores frases del post. Dejarla proyectada mientras Agus enchufa la GPU: "el hardware que puedas operar" es literalmente lo próximo que van a ver. -->

---

# Agus — un modelo en una GPU, acá

<!-- Sección. 15 MIN Y LA SALA ES DE AGUS. Presentarlo en treinta segundos y entregarla. EL HARDWARE: MSI GeForce RTX 5070 Ti 16 GB GDDR7 Ventus 3X OC, conectada POR THUNDERBOLT (o sea, una eGPU externa, no una placa adentro de la máquina), con Ollama sobre CUDA. LO QUE ESTE SLOT LE PAGA A LA CLASE: la lista de "qué hace falta para correr uno" de hace veinte minutos, dejando de ser una enumeración; y sobre todo la slide siguiente. ⚠️ COORDINAR ANTES: que el modelo esté bajado (no bajarlo en vivo por la red del aula) y que la salida de nvidia-smi se lea desde el proyector. -->

---

## 16 GB

```
30B × 4 bits ÷ 8 = 15 GB   ← los PESOS
        + la ventana de contexto (KV cache)
        ─────────────────────────────────
        > 16 GB
```

<!-- 💡 EL MEJOR MOMENTO DEL BLOQUE DE TEORÍA, Y HACE FALTA UNA GPU REAL PARA TENERLO. La cuenta del pizarrón dice que un 30B a 4 bits son ~15 GB. La placa tiene 16. LA LECTURA INGENUA ES "ENTRA JUSTO" — Y NO ENTRA: los pesos no son lo único que vive en la VRAM. LA VENTANA DE CONTEXTO TAMBIÉN SE PAGA AHÍ (el KV cache) y crece con cada token de la conversación. Convierte el punto 5 del checklist —"longitud de contexto, y lo que esa longitud cuesta en memoria"— de un bullet en una restricción que la sala VE. Y prepara lo que Ale cuenta después: POR ESO EL MODELO GRANDE VIVE EN UN CLUSTER Y NO EN UNA NOTEBOOK. El número de referencia para cerrar: Raschka midió hasta ~30 GB de RAM con contextos de 50k. -->

---

## Qué se ve cuando arranca

<!-- Lo demás del slot, en orden de cuánto le paga a la clase y SIEMPRE A CRITERIO DE AGUS: (1) `ollama pull` y `ollama run` — los cinco renglones de "qué hace falta para correr uno" convertidos en archivos que se bajan y un proceso que arranca, Y NADA LLAMA A UNA API EN LA NUBE, que es la frase que quedó dicha hace veinte minutos; (2) TOKENS POR SEGUNDO, para que la latencia se sienta en vez de describirse; (3) la eGPU por Thunderbolt como tema propio: una vez que los pesos están en la VRAM el bus no es el cuello de botella de la generación, se paga sobre todo al cargar — DATO SUYO PARA MEDIR, NO NUESTRO PARA AFIRMAR; (4) CUDA en una frase: por qué el ecosistema de inferencia asume NVIDIA en la práctica. -->

---

## "Con esto, ¿qué tamaño de modelo puedo correr de verdad?"

<!-- La pregunta con la que cierra el slot, y la transición hacia Ale. La respuesta honesta es "menos de lo que la cuenta sugiere", y de ahí sale sola la pregunta siguiente: ¿Y SI NECESITO MÁS? Que es exactamente con lo que arranca Ale. Puntero escrito para el que quiera montarlo en su máquina: la guía de Raschka, que está en el ejercicio. -->

---

# Invitado: Ale Silva — el CCAD

<!-- Sección. 60 MIN, y entregar la sala. Presentarlo en treinta segundos: es quien opera la máquina a la que la sala le va a pegar en una hora. ⚠️ DECIR EN VOZ ALTA ANTES DE ENTREGARLA, porque si no media clase va a pensar que necesita un trámite para la práctica de hoy: PEDIR UNA CUENTA DEL CCAD ES EL CAMINO DE VUELTA PARA DESPUÉS DEL CURSO. Hoy entran con la key que ya les repartimos. -->

---

## El programa

1. Una breve introducción a **HPC**
2. **UNC Supercómputo** — historia, clusters, métricas, la región y el mundo
3. **Nuevos servicios** — desplegar modelos con hardware limitado, y convertir una prueba que anda en un servicio para muchos usuarios
4. **Cómo usar los recursos del CCAD** — pedir una cuenta, qué acceso tienen, y la primera llamada a sus modelos

<!-- Dejar esta slide proyectada durante todo el slot: le sirve de reloj a él y de mapa a la sala. POR QUÉ ESTE PROGRAMA LE CAE PERFECTO A LA SESIÓN, y conviene tenerlo claro para hacer bien las transiciones: SU PUNTO 1 ES EL ESCALÓN QUE FALTA —nadie tuvo exposición previa a HPC, y viene justo después de ver UNA sola GPU en un escritorio, así que "por qué hacen falta clusters" tiene un referente de quince minutos antes. SU PUNTO 3 ES EL CORAZÓN DEL SLOT PARA NOSOTROS: "desplegar modelos con hardware limitado" y "convertirlo en un servicio usable por múltiples usuarios" es exactamente la historia de LiteLLM, vLLM y el batching, contada por el que la vivió. VA A NOMBRAR LAS DOS HERRAMIENTAS, y eso es lo que hace que en quince minutos `litellm.ccad.unc.edu.ar` y el prefijo `vllm/` no sean dos strings copiados de una slide. SU PUNTO 4 DESEMBOCA DIRECTO EN EL PASO 0: el corte está acordado — él llega hasta la primera llamada, nosotros seguimos con models.json. NO REPETIR LO SUYO. -->

---

# Práctica (30 min)

<!-- Sección. EL ÚNICO BLOQUE QUE LA SALA HACE CON LAS MANOS Y EL QUE NO SE RECORTA. Una sola vía: el gateway del CCAD. Nadie instala un runtime — el swap es un archivo de configuración y /model. Ver exercise/README.md; no leer los pasos desde la slide. LA ETIQUETA DE RECURSO COMPARTIDO VA ACÁ Y EN UNA FRASE: hay gente corriendo su tesis en esas máquinas, así que respetar los rate limits y no dejar tareas absurdas corriendo por curiosidad. -->

---

## Cómo se reparte la media hora

| | Quién | Tiempo |
|---|---|---|
| Paso 0 — `models.json` | todos, juntos | 8 min |
| **Una prueba, a elección** | cada uno | 22 min |

<!-- Dejar proyectada. Y decir en voz alta lo que la tabla no dice: NO HAY PRUEBA OBLIGATORIA Y NADIE TIENE QUE HACER LAS CUATRO. Con 22 minutos se entra cómodo en una y apretado en dos; las que no hagan quedan escritas para terminar en casa. -->

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
        { "id": "vllm/qwen3.8:30b" }
      ]
    }
  }
}
```

<!-- EL CORAZÓN DE LA SESIÓN, y se da acá y no en la teoría: es setup, así que SE CAMINA EN PANTALLA CON LA SALA TIPEANDO AL MISMO TIEMPO, y queda proyectado el resto de la media hora. FRENAR HASTA QUE EL ARCHIVO LE FUNCIONE A TODO EL MUNDO: con 22 minutos de práctica, el que arranca tarde acá se queda sin prueba. Frenar un segundo en el PATH: es el mismo directorio donde vive el AGENTS.md GLOBAL que escribieron en la Sesión 3 — la config global del agente y el catálogo de modelos son vecinos. Los dos modelos ESTÁN SERVIDOS: el picker va a mostrar los dos. -->

---

## Cuatro cosas para frenar

<!-- Una por una, y cada una es un concepto que YA TIENEN. (1) `api: "openai-completions"` es la historia de interoperabilidad de hace una hora convertida en un string que tipean; los valores posibles son openai-completions, openai-responses, anthropic-messages y google-generative-ai: CUATRO FORMAS DE API PARA TODO EL ECOSISTEMA. El CCAD no expone una API "del CCAD": expone la misma que expone el Ollama que Agus acaba de mostrar. POR ESO EL SWAP CUESTA CINCO LÍNEAS. (2) `apiKey: "$CCAD_API_KEY"` — el campo acepta $VAR y ${VAR}, y también ejecutar un comando si arranca con `!`. CADA UNO TIENE SU PROPIA KEY, emitida desde la cuenta de Diego y repartida antes de clase: decirlo en voz alta, porque significa que si la corrida de al lado anda y la suya no, el problema es su export y no el modelo. USAR LA VARIABLE, NO LA KEY LITERAL, y decir por qué: la key literal en un archivo es la key literal en un backup, en un screenshot del proyector y —el día que a alguien se le ocurra versionar sus dotfiles— en un repo público. ES LA PRIMERA CREDENCIAL PROPIA DEL CURSO Y ES EL MOMENTO DE ENSEÑAR EL REFLEJO. (3) `models` ES UNA LISTA: el catálogo de modelos y el modelo activo son cosas distintas — declarás lo que hay, elegís con /model. (4) El prefijo `vllm/` es routing de LiteLLM. ACÁ SE COBRA EL SLOT DE ALE, QUE TERMINÓ RECIÉN: LiteLLM y vLLM ya tienen cara, así que esto se da COMO RECONOCIMIENTO Y NO COMO DATO NUEVO — "eso que les acaba de contar Ale, acá está, en un string". Lo mismo con la baseUrl. -->

---

## Lo que *no* está en el JSON

| Quién lo decide | Número |
|---|---|
| El modelo, nativo | **~262.144** |
| Pi, si no le decís nada | **128.000** |
| El CCAD, al levantar vLLM (`--max-model-len`) | **el que manda** |

<!-- LA MEJOR PARTE DEL PASO 0. `contextWindow` tiene default 128000 y `maxTokens` default 16384: O SEA QUE LA VENTANA DE CONTEXTO ES UN NÚMERO QUE ALGUIEN ELIGIÓ. Después de cinco sesiones tratándola como una propiedad del producto que compraron, resulta ser un parámetro de arranque. Escribir las tres filas en el pizarrón, una debajo de la otra: el modelo puede 256K, Pi asume 128K, y LO QUE REALMENTE TIENEN ES LO QUE EL SERVIDOR ARRANCÓ. ES LA MISMA PERILLA QUE AGUS TUVO QUE ELEGIR HACE UNA HORA, VISTA DESDE LA OTRA PUNTA — y la que explica por qué su GPU de 16 GB no podía con todo. Y el detalle operativo que hace fácil la práctica: EL ARCHIVO SE RELEE CADA VEZ QUE ABRÍS /model, sin reiniciar nada. -->

---

## Elegí una

| | La sesión | La pregunta |
|---|---|---|
| 1 | **Vibecodear** | ¿funciona igual de bien? |
| 2 | **Planificar** | ¿los planes mantienen la misma calidad? |
| 3 | **Skills y MCP** | ¿los sigue como debe? |
| 4 | **Documentar** | ¿qué tan buenos son los docs que genera? |

<!-- ~22 min, Y ES UN MENÚ, NO UNA SECUENCIA. Dejar la tabla proyectada toda la práctica. Ver exercise/README.md — no leer los pasos desde la slide. LA RECOMENDACIÓN HONESTA, EN VOZ ALTA AL SOLTARLOS: si no saben cuál elegir, LA 3 — es la que más información da y donde más probable es que algo se rompa, porque es la que depende del tool calling. La 1 es la que menos va a diferenciar: en tareas de una sola pasada casi todos los modelos se parecen. LA LÍNEA DE BASE NO ES OTRA CORRIDA: ES LO QUE YA SABEN de las primeras cuatro clases, así que la comparación arranca gratis. Decirlo así: "no estamos midiendo el modelo, estamos midiendo SU andamiaje contra otro motor". -->

---

## Lo que hay que vigilar caminando la sala

<!-- (1) TODO EN SU REPO, con su AGENTS.md, sus skills y su .mcp.json: el que lo hace en /tmp hizo un ejercicio de configuración, no la clase. (2) SESIÓN NUEVA Y LIMPIA, y repo limpio — si arrastran una conversación previa no saben qué están midiendo. (3) QUE NO "ARREGLEN" SUS ARTEFACTOS PARA AYUDAR AL MODELO: si el skill no dispara, ESO ES EL RESULTADO. (4) Si algo los sorprende, QUE REPITAN ESA PRUEBA CON EL MODELO HOSTEADO antes de concluir: es lo que separa "el modelo abierto no puede" de "mi prompt siempre fue frágil y recién ahora se nota". (5) EL ERROR MÁS PROBABLE NO ES CONCEPTUAL: un typo en el JSON o la key sin exportar — por eso el paso 0 se hace en conjunto. (6) SI A ALGUIEN LE SOBRA TIEMPO: la misma prueba contra el otro modelo del picker. -->

---

## Anotá mientras pasa, no después

- ¿**Respetó el schema** de las tools?
- ¿**Cuántos turnos** necesitó?
- ¿**Inventó** archivos, funciones o APIs?
- ¿Cómo se sintió la **latencia**?

<!-- Las cuatro preguntas transversales, además de lo específico de la prueba que hayan elegido. Dejar la slide proyectada al lado de la tabla de las pruebas. Y el callback que vale la pena tirar caminando: lo primero que se degrada con la cuantización es la SALIDA ESTRUCTURADA — o sea, la primera de estas cuatro preguntas. Sirven además para arrancar la retrospectiva si la sala queda callada. -->

---

# ¿Qué les pareció el curso?

<!-- Sección, 15 MIN, Y NO SE TOCA aunque el día se haya estirado. Es el final del curso. DEBATE ABIERTO: si les sirvió, qué se llevan, qué cambiarían. ESCUCHAR MÁS QUE DEFENDER — las respuestas honestas son las que hacen la próxima edición; las amables no sirven para nada. -->

---

## Preguntas para destrabar

<!-- Son quince minutos sostenidos SÓLO POR PREGUNTAS, así que llegar con varias y usarlas si la sala se queda callada: ¿qué sesión les sirvió más y cuál menos? ¿qué habrían querido que dure el doble, y qué sacarían? ¿qué van a usar el lunes y qué no van a volver a abrir? ¿qué esperaban del curso cuando se anotaron, y qué se llevan en cambio? ¿a quién se lo recomendarían y a quién no? Y SI LA SALA ES MUY ELOGIOSA, empujar con "¿qué fue lo más aburrido?", que es la pregunta que siempre destraba. -->

---

## Gracias

**Diego Piloni** · **Agustín Carrasco** · invitado: **Ale Silva** (CCAD)

<!-- Y ANTES DE SOLTAR LA SALA, RECORDAR EL CANAL DEL CURSO: lo que quedó trabado —la extensión de la Sesión 5, o cualquier cosa de las seis semanas— se pregunta ahí. ⚠️ PENDIENTE definir el canal con Agus (Google Chat o Discord); si no sale, esta línea se cae. Agradecer a Ale y al CCAD con nombre: sin ese acceso esta sesión no existe. Y dejar tres punteros abiertos para el que quiera seguir: pedir su cuenta del CCAD (el trámite que contó Ale), la guía de Raschka para montarlo en su propia máquina, y el post de Copes para releer la teoría de hoy con calma. Los tres están escritos en exercise/README.md. -->
