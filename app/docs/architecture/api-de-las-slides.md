---
title: "API de las slides"
summary: "Cómo la web le dice al HTML de las slides de una sesión a qué slide y paso ir, cómo viaja la posición del profe hasta los estudiantes y qué pasa al marcar un HTML como slides: se revisa que respete la API y, si no, el modal de subida muestra un error."
created: "2026-10-18"
---

# API de las slides

## 🔭 Resumen

Las slides de una sesión son un archivo HTML que el profe sube como material y marca como slides. La web lo carga en el aula y habla con él por una API propia de dos mensajes: al cargar, el HTML le pasa a la web un `manifest` con sus slides; después, la web le dice a qué `slide` y `step` ir. La web maneja la navegación. Los controles, para el profe y para el estudiante, están fuera de las slides, y la web guarda la posición. La posición del profe se guarda en D1, en la sesión, y viaja por el aula como cualquier otro cambio, así los estudiantes pueden seguirlo.

## 📍 Qué es una posición

La posición es una `slide` y un `step` dentro de ella, como los ítems de una lista que aparecen de a uno. Pasar a otra slide vuelve el paso a 0. La web muestra solo la slide actual, al profe y al estudiante, y el HTML decide qué mostrar para cada paso.

Con el `manifest`, la web sabe si avanzar es mostrar el paso siguiente o pasar a la slide siguiente, y dónde termina la presentación:

```mermaid
flowchart TD
    Av@{ shape: stadium, label: "Avanzar" }
    Paso@{ shape: diam, label: "¿La slide tiene otro paso?" }
    Slide@{ shape: diam, label: "¿Hay otra slide?" }
    SigPaso@{ shape: rect, label: "Misma slide, paso siguiente" }
    SigSlide@{ shape: rect, label: "Slide siguiente, paso 0" }
    Fin@{ shape: rect, label: "Se queda: es el final" }

    Av --> Paso
    Paso -->|sí| SigPaso
    Paso -->|no| Slide
    Slide -->|sí| SigSlide
    Slide -->|no| Fin

    classDef grey fill:#f3f4f6,stroke:#4b5563,color:#1f2937
    classDef blue fill:#dbeafe,stroke:#2563eb,color:#1f2937
    classDef green fill:#dcfce7,stroke:#16a34a,color:#1f2937

    class Av,Fin grey
    class Paso,Slide blue
    class SigPaso,SigSlide green
```

Retroceder recorre lo mismo hacia atrás, y pasar a la slide anterior también la muestra desde el paso 0.

## ♠️ Qué expone el HTML de las slides

| Miembro | Responde | Quién lo manda |
|---|---|---|
| Anunciar el `manifest` | qué slides tiene el HTML, en `slides`, y cuántos pasos tiene cada una, en `steps` | el HTML a la web, una vez, al cargar |
| Ir a una posición | a qué `slide` y `step` tiene que ir el HTML, siempre los dos; `step` es 0 al entrar a una slide | la web al HTML, cada vez que cambia la posición |

El `manifest` es el único mensaje que el HTML le manda a la web: la posición la lleva solo la web.

## 📩 Cómo llega la posición del profe a los estudiantes

```mermaid
sequenceDiagram
    autonumber
    actor P as Profe
    participant WP as Web del profe
    participant HP as HTML del profe
    participant A as API
    participant D as D1
    participant AU as Aula
    participant WE as Web del estudiante
    participant HE as HTML del estudiante

    P->>WP: Avanza o retrocede
    WP->>HP: Ir a slide y step
    WP->>A: Nueva posición
    A->>D: Guarda current_slide y current_step
    A->>AU: Avisa el cambio
    AU-->>WE: Cambió la posición
    WE->>A: Pide la posición
    A-->>WE: current_slide y current_step
    WE->>HE: Ir a slide y step, si sigue al profe
```

El profe mueve la slide desde la pestaña Aula del admin de la sesión (1). Su web le dice a su HTML a qué `slide` y `step` ir (2) y le manda la nueva posición a la API (3), que la guarda en D1, en `current_slide` y `current_step` de la sesión (4) y le avisa al aula (5). El aula avisa a los conectados (6), cada web le pide la posición guardada a la API (7, 8), y la de quien sigue al profe lleva su HTML ahí (9) (ver [tiempo real del aula](tiempo-real-del-aula.md)).

Para presentar, el profe abre las slides en otra pestaña, que muestra la posición actual sin controles. Cuando el profe vuelve a la sesión, sigue desde la misma slide y el mismo paso, porque la entidad `Session` guarda su posición (ver [modelo de datos](modelo-de-datos.md)).

## 👀 Seguir al profe

Mientras el estudiante sigue al profe, su web va a la posición del profe en cada aviso. Si navega a mano, deja de seguirlo, y lo retoma cuando llega a la posición del profe. Sin el profe conectado, seguirlo no aparece y el estudiante navega solo.

[Prototipo del aula del estudiante, con la navegación y seguir al profe](../prototipos/aula-responsive.html)

## 📤 Subir las slides

El profe sube el HTML como cualquier material, desde el modal de subida del admin de la sesión, y lo marca como slides, con el campo `is_slides` del `Material`. Al marcarlo, se revisa que el HTML respete esta API; si no la respeta, el modal muestra un error y el archivo no queda como slides. Marcar otro HTML como slides desmarca el anterior (ver [modelo de datos](modelo-de-datos.md)). El estudiante también descarga el mismo HTML desde Material.

[Prototipo del admin de la sesión, con el modal de subida de material](../prototipos/admin-sesion.html)

---

Related: [tiempo real del aula](tiempo-real-del-aula.md), [modelo de datos](modelo-de-datos.md), [componentes](componentes.md), [estados de encuestas y sesiones](estados-de-encuestas-y-sesiones.md)
