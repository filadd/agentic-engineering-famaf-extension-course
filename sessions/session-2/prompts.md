# Prompts de referencia: explorar, diseñar, documentar, implementar

Un prompt por etapa, para arrancar cada una. Son un punto de partida, no pasos para copiar: cambialos según tu proyecto y reemplazá lo que está entre corchetes.

## Exploración

### Proyecto desde cero

```
Quiero arrancar un proyecto nuevo: [qué querés construir, para quién y qué problema resuelve]. Antes de decidir nada, quiero entender qué hay hecho: buscá [3-5] proyectos o herramientas parecidas y contame qué resuelven, qué features tienen y qué evitan. Después comparame [los stacks que estás considerando, o "los stacks que veas razonables"] con sus ventajas, desventajas y trade-offs para este proyecto. No escribas código ni me propongas decisiones todavía.

Cerrá con las prioridades que ves: qué es lo más importante del proyecto y por dónde arrancarías. Respondeme en pocas líneas; después te voy a ir preguntando de a una cosa para profundizar.
```

### Feature nueva en un proyecto existente

```
Quiero hacer [la feature] en [la parte del proyecto que vas a tocar]. Antes de decidir nada, quiero entender lo que hay: contame cómo funciona hoy esa parte, qué datos maneja, qué implica el cambio y qué otras partes del sistema se verían afectadas. Si hay documentos de cambios anteriores en [docs/], leelos también. No escribas ni modifiques nada, y no me propongas decisiones todavía.

Respondeme en pocas líneas, con referencias a los archivos. Después te voy a ir preguntando de a una cosa para profundizar.
```

### Bug fix

```
Tengo este bug: [qué hiciste, qué esperabas que pasara y qué pasó, con el error o el log si hay]. Antes de arreglar nada, quiero entender por qué pasa: reproducilo, seguí el camino del código desde [dónde arranca, por ejemplo la pantalla o el endpoint] hasta donde falla, y contame la causa con referencias a los archivos. No modifiques nada todavía.

Si no podés reproducirlo, decime qué probaste en vez de suponer la causa. Si la encontrás, contame también qué otras partes usan ese mismo código y podrían tener el mismo problema.
```

## Diseño

```
Quiero [agregar la feature / arreglar el bug]. Con lo que exploramos, preguntame las decisiones que hay que tomar, de a una, y esperá mi respuesta antes de pasar a la siguiente. Para cada pregunta, traeme lo que necesito para decidir: las opciones que ves, qué implica cada una y cuál recomendarías y por qué. No me preguntes lo que ya decidimos; concentrate en lo que falta definir: cómo encaja con lo que existe, qué datos maneja, cómo se ven las pantallas que toca y cómo pasa el usuario de una pantalla a otra.

Cuando no queden decisiones, haceme un resumen corto de todo lo que decidimos, para confirmar que entendimos lo mismo.
```

## Documentación

```
Armame un borrador del documento de diseño con lo que decidimos: cada decisión y por qué, cómo encaja con lo que existe y un diagrama de [el flujo / la arquitectura]. Escribí solo lo que decidimos; si algo no lo hablamos, marcalo como pendiente en vez de completarlo vos. Todavía no lo guardes.

Cuando lo apruebe, guardalo en docs/[feature].md.
```

Después abrilo con `/plannotator-annotate docs/[feature].md`, anotá lo que esté suponiendo sin que lo hayas dicho y mandale las anotaciones. Iterá hasta que el documento te sirva a vos.

## Diseño de tests

```
Con docs/[feature].md, proponé los casos de test antes de escribir código: qué varía (las entradas y el estado que cambian el resultado), qué valores importan de cada cosa (los grupos que el código trata distinto, como vacío / uno / muchos o válido / inválido) y qué combinaciones cubrir, una fila por caso con el resultado esperado. Cada caso tiene que probar un comportamiento que decidimos, no cómo está implementado. Marcá cada fila según cómo se verifica: con un test [unitario / de integración / e2e], con el agente usando la app, o con los dos.

Mostrame la tabla y esperá: yo confirmo, recorto o agrego casos. Cuando la apruebe, sumala a docs/[feature].md.
```

## Implementación

```
Implementá docs/[feature].md, empezando por los tests de los casos marcados como test. Seguí el documento: si encontrás algo que no resuelve o que no se puede hacer como dice, frená y preguntame antes de decidirlo vos.

Cuando pasen los tests, verificá la feature usándola [con curl contra la API / con agent-browser en la pantalla], contra los casos marcados como agente. Mostrame cada pedido y su respuesta [o una captura por caso], y al final decime qué casos se comportan como dice el documento y cuáles no.
```
