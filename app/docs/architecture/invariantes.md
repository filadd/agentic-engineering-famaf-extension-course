---
title: "Invariantes"
summary: "Las reglas que respeta todo cambio en kurasu, sobre cómo se comporta el producto y cómo está armado el sistema."
created: "2026-10-21"
---

# Invariantes

Cada línea es una regla. Una regla es una oración y enlaza la nota que la explica, cuando hay una. Para hacer un cambio que rompe una regla, primero se cambia la regla acá.

## 🖥️ Interfaz

- Toda acción destructiva pide confirmación (ver [estados de encuestas y sesiones](estados-de-encuestas-y-sesiones.md)).
- El diálogo de confirmación queda en espera hasta que el servidor responde, y mientras espera no se cierra (ver [carga y acciones de la web](carga-y-acciones-de-la-web.md)).
- Una acción en espera muestra su error dentro de su formulario o modal (ver [carga y acciones de la web](carga-y-acciones-de-la-web.md)).
- Después de una acción, la web vuelve a pedir las listas que esa acción cambia.

## 🏗️ Sistema

- El backend controla siempre las reglas de negocio, aunque la pantalla ya las haya controlado.

---

Related: [carga y acciones de la web](carga-y-acciones-de-la-web.md), [estados de encuestas y sesiones](estados-de-encuestas-y-sesiones.md), [componentes](componentes.md)
