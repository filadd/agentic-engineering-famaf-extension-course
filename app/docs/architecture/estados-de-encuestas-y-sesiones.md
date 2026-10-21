---
title: "Estados de encuestas y sesiones, y sus pantallas"
summary: "Los ciclos de vida de las encuestas, las sesiones y las preguntas, qué ve el estudiante en su inicio, cómo maneja el profe las sesiones desde el admin y qué acciones piden confirmación."
created: "2026-10-18"
---

# Estados de encuestas y sesiones, y sus pantallas

## 🔭 Resumen

Una encuesta pasa de `draft` a `active` y de `active` a `closed`, y no vuelve atrás. Una sesión se habilita y se deshabilita desde su página, y solo una deshabilitada se borra. Una pregunta está abierta o respondida, y el profe la puede reabrir. Una encuesta o sesión borrada queda guardada con lo que cuelga de ella, con la fecha en que se borró en `deleted_at`, y nadie la ve (ver [modelo de datos](modelo-de-datos.md)). Toda acción destructiva pide confirmación, salvo las que se deshacen fácil.

## 📊 Encuesta

```mermaid
stateDiagram-v2
    direction LR
    [*] --> draft
    draft --> active: el profe la activa
    active --> closed: el profe la cierra
    draft --> Borrada: el profe la borra
    active --> Borrada: el profe la borra
    closed --> Borrada: el profe la borra

    classDef grey fill:#f3f4f6,stroke:#4b5563,color:#1f2937
    classDef green fill:#dcfce7,stroke:#16a34a,color:#1f2937
    classDef red fill:#fee2e2,stroke:#dc2626,color:#1f2937
    class draft,closed grey
    class active green
    class Borrada red
```

Una encuesta (`Poll`) se crea en el estado `draft`, un borrador que solo ve el profe y que puede editar. Existe recién cuando el profe la guarda como borrador. Solo las encuestas de opción múltiple tienen opciones, y solo las de escala tienen textos para el 1 y el 5. La API rechaza y no guarda una encuesta que trae el contenido del otro tipo. Cuando la activa, pasa a `active` y los estudiantes la ven en la card de la sesión y en el aula, y votan; ven los resultados al votar, y pueden cambiar el voto mientras está activa. Puede haber varias activas a la vez, y una activa no vuelve a borrador. Cuando el profe la cierra, pasa a `closed` y queda con sus resultados en el modal Encuestas de la sesión y en el aula, y no se reabre.

El profe puede borrar una encuesta en cualquier estado: queda guardada con sus respuestas, con la fecha en `deleted_at`, y nadie la ve. Si una activa tiene un error, el profe la borra y crea otra.

## 📚 Sesión

```mermaid
stateDiagram-v2
    direction LR
    [*] --> disabled: el profe la crea
    disabled --> enabled: habilitar
    enabled --> disabled: deshabilitar
    disabled --> Borrada: el profe la borra, con confirmación

    classDef grey fill:#f3f4f6,stroke:#4b5563,color:#1f2937
    classDef green fill:#dcfce7,stroke:#16a34a,color:#1f2937
    classDef red fill:#fee2e2,stroke:#dc2626,color:#1f2937
    class disabled grey
    class enabled green
    class Borrada red
```

Una sesión (`Session`) se crea deshabilitada (`enabled` en falso), con título y resumen, al final de la lista del profe. Se habilita o se deshabilita solo desde su página. Deshabilitarla la saca de la vista del estudiante y saca a todos del aula, pero conserva todo lo que tiene: las encuestas activas, las manos levantadas y la posición del profe siguen ahí cuando se vuelve a habilitar. Solo una deshabilitada se borra, con confirmación; queda guardada con todo lo que cuelga de ella, con la fecha en `deleted_at`, y el profe vuelve a la lista de sesiones.

## ❓ Pregunta

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Abierta: un estudiante la deja
    Abierta --> Respondida: el profe la marca
    Respondida --> Abierta: el profe la reabre
    Abierta --> [*]: el autor la borra

    classDef grey fill:#f3f4f6,stroke:#4b5563,color:#1f2937
    classDef green fill:#dcfce7,stroke:#16a34a,color:#1f2937
    class Abierta green
    class Respondida grey
```

Una pregunta (`Question`) está abierta o respondida, según su campo `answered`. Una pregunta respondida deja de verse para los estudiantes. El profe la ve al final, atenuada, y la puede reabrir; reabierta, los estudiantes la vuelven a ver. El estudiante borra las suyas. Los cambios de estado de encuestas y preguntas llegan al instante a quienes están en el aula (ver [tiempo real del aula](tiempo-real-del-aula.md)).

## 🏠 Inicio del estudiante

En el inicio, el estudiante ve solo las sesiones habilitadas, en el orden de la lista del profe. Arriba está la sesión destacada, la habilitada que está más adelante en la lista. Es la única desde la que se entra al aula; las demás están en "Sesiones anteriores". Cada card muestra el resumen, las encuestas activas, donde el estudiante vota, y los links a Material, Encuestas y Preguntas, sin cantidades. Cada link abre un modal, que en celular es una hoja desde abajo y en escritorio va centrado. Cada card que se pliega muestra un caret, que apunta hacia abajo cuando está plegada y hacia arriba cuando está desplegada, como la lista de Presentes. Una sesión anterior muestra su material, sus encuestas cerradas y sus preguntas para leer, y en ella no se pregunta ni se vota.

El inicio no recibe avisos: una encuesta que el profe activa o cierra aparece en el inicio cuando la web vuelve a pedir sus datos, cada cinco minutos, o cuando el estudiante vuelve a cargar la página (ver [componentes](componentes.md)).

[Prototipo del inicio del estudiante, en celular y escritorio](../prototipos/inicio-responsive.html)

## 🛠️ Admin de las sesiones

El profe ve la lista de sesiones, crea una nueva al final de la lista, las reordena arrastrándolas, y llega desde ahí a Usuarios (ver [login y acceso](login-y-acceso.md)). El número de una sesión es su posición en la lista.

[Prototipo de la lista de sesiones del profe](../prototipos/admin-sesiones.html)

La página de una sesión tiene las pestañas Contenido, Encuestas y Aula. En esa página, el profe habilita o deshabilita la sesión con el switch de su card, y una deshabilitada se borra desde la misma card. En Contenido edita el título y el resumen. El profe sube el material con un nombre desde un modal, y no lo puede reordenar ni renombrar. La API rechaza una subida mal formada y no guarda ni el material ni el archivo. En Encuestas crea encuestas de cada tipo, edita los borradores, y activa, cierra y borra las encuestas. Sin encuestas, la pestaña muestra "Todavía no hay encuestas" debajo del creador. En el panel del aula el profe solo activa y cierra encuestas. La pestaña Aula está en [tiempo real del aula](tiempo-real-del-aula.md), y la subida de las slides en [API de las slides](api-de-las-slides.md).

[Prototipo del admin de una sesión, con sus pestañas Contenido, Encuestas y Aula](../prototipos/admin-sesion.html)

## 🛑 Qué acciones piden confirmación

Toda acción destructiva pide confirmación: borrar una sesión, una encuesta, un material o una pregunta propia, sacarle el acceso a alguien y regenerar el código de registro. No la piden los cambios que se deshacen fácil, como marcar una pregunta como respondida o bajar una mano.

La confirmación es un diálogo que se abre encima de lo que haya, también sobre un modal o una hoja. Escape cierra solo el diálogo de arriba, igual que su botón Cerrar o Cancelar: una confirmación abierta sobre una hoja se cierra y la hoja queda. El menú del usuario también se cierra con Escape o con un click fuera de él, como los modales.

Toda acción que pide confirmación queda en espera hasta que responde el servidor, según la regla de [carga y acciones de la web](carga-y-acciones-de-la-web.md). Mientras espera, Cancelar está deshabilitado y ni Escape ni un click afuera cierran el diálogo.

---

Related: [modelo de datos](modelo-de-datos.md), [tiempo real del aula](tiempo-real-del-aula.md), [login y acceso](login-y-acceso.md), [API de las slides](api-de-las-slides.md), [carga y acciones de la web](carga-y-acciones-de-la-web.md), [novedades por mail](novedades-por-mail.md)
