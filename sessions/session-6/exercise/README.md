# Sesión 6 — Ejercicio práctico: tu agente, otro modelo

> ⚠️ **Este ejercicio está en borrador.** Los comandos concretos del CCAD (scheduler, módulos, partición con GPU, política de trabajos interactivos) se completan una vez confirmado el setup con el CCAD. Los pasos de abajo describen el flujo; la sintaxis exacta se entrega en clase.

## Objetivo

Servir un modelo de pesos abiertos en una GPU del CCAD y **apuntar el agente que escribiste en la Sesión 5 a ese modelo**, cambiando una línea.

El objetivo no es que el modelo abierto sea mejor. Es que veas que el loop no sabe ni le importa quién le contesta — y que sientas en el cuerpo qué cuesta operar tu propia inferencia.

## Antes de empezar (pre-work, NO se resuelve en clase)

- **Cuenta en el CCAD.** Se pide con un formulario y las credenciales llegan por mail: **no es del día**. Seguí las instrucciones de [abrir cuenta](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) con semanas de anticipación:
  1. Generá un par de claves SSH.
  2. Completá el formulario de solicitud.
  3. Esperá el mail con tu usuario e instrucciones de conexión.
- Verificá que podés conectarte por SSH **antes** de la clase.
- Tené a mano un cliente que hable con un modelo por HTTP y que ande contra el modelo hosteado — el agente que armaste en la Sesión 5, si esa sesión termina produciendo uno. Si no, se entrega uno mínimo en clase.
- Si tu cuenta no llegó a tiempo: trabajá de a dos con alguien que sí la tenga.

## Pasos

### 1. Entrá y mirá dónde estás (~10 min)

Conectate por SSH. Antes de correr nada, ubicate:

- ¿Estás en un nodo de login o en un nodo de cómputo?
- ¿Qué clusters y particiones hay disponibles? ¿Cuáles tienen GPU?
- ¿Qué tan larga está la cola?

**No corras el modelo en el nodo de login.** El nodo de login es para editar archivos y mandar trabajos, y lo comparten todos.

### 2. Pedí una GPU (~10 min)

Pedí una asignación **interactiva**: una GPU, un rato acotado (lo que se indique en clase).

Mientras esperás la cola, leé el paso 3 así estás listo cuando entre.

Si la cola está imposible, no te quedes trabado: pasá al **endpoint de respaldo** (paso 5) y volvés a esto después.

### 3. Servir un modelo chico (~15 min)

Levantá un servidor de inferencia con un endpoint **compatible con OpenAI** sobre un modelo **chico**.

Antes de elegir el modelo, hacé la cuenta: parámetros × bytes por parámetro ≈ piso de VRAM, sin contar el contexto. Si la cuenta no cierra con la GPU que te dieron, bajá de tamaño o usá una versión cuantizada.

Verificá que el servidor responda **desde el mismo nodo** antes de pelearte con la red. Un `curl` al endpoint de modelos alcanza.

### 4. Traé el endpoint a tu máquina (~10 min)

El servidor escucha en un nodo sin dirección pública. Armá un túnel SSH desde tu notebook hasta ese puerto.

Este es el paso que más tiempo se come. Andá despacio y verificá cada salto:

- ¿El servidor responde en el nodo?
- ¿El túnel está levantado?
- ¿Responde en `localhost` de tu máquina?

### 5. Cambiá la base URL de tu agente (~10 min)

Acá está todo el punto del ejercicio: en tu agente de la Sesión 5, cambiá la **base URL** (y el nombre del modelo) para que apunte a tu endpoint local en vez de a la API hosteada.

Nada más del loop cambia. El resto de tu código no sabe que pasó algo.

> Si te ganó la cola: usá el **endpoint de respaldo** que se entrega en clase — va a estar corriendo sobre la GPU portátil que trae Agus, ahí mismo en el aula. El paso importante es este, y el que viene.

### 6. Compará (~15 min)

Dale **la misma tarea** al agente contra los dos modelos. Algo que necesite varios pasos y al menos dos llamadas a tools: por ejemplo "leé estos dos archivos y arreglá la inconsistencia entre ellos".

Anotá:

- ¿Llamó las tools bien? ¿Respetó el schema?
- ¿Cuántos turnos necesitó? ¿Se quedó en loop?
- ¿Inventó nombres de archivo o de funciones?
- ¿Cómo se sintió la latencia?

Es esperable que el modelo abierto sea visiblemente peor en tool calling de varios pasos. **Eso es dato, no fracaso**: es exactamente el eje de la discusión del cierre.

Guardá estos números: la discusión de después es **¿este modelo está a la altura de mover un proyecto serio?**, y queremos que se conteste con lo que midieron y no con opiniones.

## Resultado esperado

- Tu agente de la Sesión 5 corriendo contra un modelo de pesos abiertos.
- Una comparación concreta, con tu propia tarea, entre los dos modelos.
- Una cuenta del CCAD que te sigue sirviendo después del curso.

## Etiqueta

Cuando termines, **liberá la GPU**. Es hardware compartido y alguien está esperando para correr su tesis.

## Preguntas para la discusión final

1. ¿Qué fue más difícil: hacer andar el modelo o hacer andar la red?
2. ¿Dónde se rompió el modelo abierto? ¿Fue capacidad, o fue el formato de las tools?
3. ¿Lo pondrías como motor de un coding agent en un proyecto serio? ¿Qué le falta, concretamente?
4. Con lo que te costó: ¿para qué proyecto tuyo valdría la pena, y para cuál claramente no?
5. Después de seis sesiones: ¿qué parte de lo que aprendiste depende del modelo que uses, y qué parte no?
