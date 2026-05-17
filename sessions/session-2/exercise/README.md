# Sesión 2 — Ejercicio práctico: Planificar y revisar

## Objetivo

Agregar **una feature** a tu proyecto siguiendo un flujo estructurado: planificar antes de implementar, externalizar el plan, escribir el test primero, implementar, y revisar el diff antes de aceptar.

El objetivo no es que la feature sea grande ni perfecta. Es que **vivas la diferencia** entre tirarle un prompt al agente y aceptar lo que salga (Sesión 1) y trabajar con intención.

## Antes de empezar

- Trabajá sobre el proyecto que venís usando desde la Sesión 1 (sea el de default o uno propio).
- Abrí Claude Code en una terminal sobre tu proyecto.
- Tené [plannotator](https://github.com/backnotprop/plannotator) instalado o accesible en el navegador.
- Asegurate de tener un test runner configurado (vitest, pytest, jest, el que sea — si no tenés, agregalo como parte de este ejercicio).

## Pasos

Seguí los pasos en orden. Vas a sentir fricción en algunos — esa fricción **es la lección**.

### 1. Elegí una feature (~5 min)

Elegí algo chico que puedas terminar en ~75 minutos *incluyendo* la planificación y la revisión.

Buenos ejemplos:
- Agregar un campo "completado el" a tus todos.
- Filtrar la lista por estado.
- Validar el input de un formulario.
- Agregar un endpoint nuevo.

Malos ejemplos: cualquier cosa que toque autenticación de cero, refactors grandes, o features que tocan más de 5-6 archivos.

### 2. Plan mode (~10 min)

Activá plan mode en Claude Code (`Shift+Tab` dos veces) y describí la feature. Dejá que el agente arme un plan.

**Iterá sobre el plan**: pedile más detalle donde te parezca vago, sacale pasos que sobren, cambiá el orden si conviene. No salgas de plan mode hasta que el plan **te sirva a vos** — no al agente.

### 3. Externalizá el plan en plannotator (~10 min)

Copiá el plan final de plan mode y pegalo en plannotator. Andá leyendo cada paso y **anotá**:
- ¿Qué supone el agente que no dijiste explícitamente?
- ¿Hay decisiones que dos personas implementarían diferente? (Si la respuesta es sí, el plan tiene huecos.)
- ¿Falta algún paso?

La anotación es para vos misma/mismo. No la entregás. El valor está en el acto de leer el plan con ojo crítico antes de ejecutarlo.

### 4. Test primero (~10 min)

Antes de pedirle al agente que implemente, **escribí vos al menos un test** que describa el comportamiento esperado de la feature. Puede fallar (todavía no hay código), eso es lo esperado.

Idea: pensá el test como **el contrato que el agente no puede falsear**. Si el agente "implementa" la feature pero tu test sigue fallando, no implementó nada.

### 5. Implementá con el agente (~25 min)

Salí de plan mode. Pedile al agente que ejecute el plan **paso por paso** — no todo de una. Después de cada paso, leé qué hizo.

Si algo se rompe o no entendés un cambio, **pará y leé el código vos**. No le pidas al agente que arregle algo que no entendiste primero — esa es la trampa más común.

### 6. Revisá el diff (~15 min)

Antes de aceptar el resultado, revisá el diff completo. Usá el surface que prefieras:
- `git diff` desde la terminal.
- Tu IDE (VS Code, etc.).
- `hunk` para ir hunk por hunk de manera interactiva.
- Plannotator en modo review.

Buscá:
- ¿Coincide con el plan?
- ¿Hay código muerto, imports sin usar, comentarios narrativos de más?
- ¿El test que escribiste pasa?
- ¿Hay algún smell de seguridad? (input sin validar, secrets expuestos, falta de auth)

Si encontrás algo, **no le tires un "arreglá esto" al agente sin pensar**. Decidí si querés que lo arregle, lo arreglás vos, o si el cambio quedaba mejor sin esa parte.

## Resultado esperado

Al final del ejercicio deberías tener:
- La feature funcionando (el test pasa, la app corre).
- Una idea concreta de la diferencia entre este flujo y el de la Sesión 1.

No hay nada formal para entregar. El resultado es la experiencia.

## Preguntas para la discusión final

Reservá ~5 minutos antes del cierre para pensar:

1. ¿En qué se diferenció esta sesión de la Sesión 1? ¿Te sentiste más rápido o más lento?
2. ¿La externalización del plan te hizo ver algo que en plan mode se te había escapado?
3. ¿El test que escribiste primero te ayudó? ¿Se cumplió o lo terminaste cambiando para que pase?
4. ¿Encontraste algún problema durante la revisión del diff que de otra forma se te habría escapado?
