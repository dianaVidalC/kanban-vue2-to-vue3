# Kanban Board — Migración de Vue 2 a Vue 3

Tablero Kanban con columnas, tarjetas arrastrables, checklist por tarjeta y
edición inline, construido primero en **Vue 2** y migrado después a
**Vue 3**, como ejercicio de práctica para una migración real de este tipo.

## Qué hace la app

- Tres columnas (Por hacer / En progreso / Hecho) con tarjetas
- Arrastrar y soltar tarjetas entre columnas (y reordenar dentro de la misma)
- Edición inline del título de una tarjeta (clic para editar)
- Checklist por tarjeta: agregar, tildar y borrar items
- Fecha relativa ("hace X min") por tarjeta
- Transición suave al agregar/quitar tarjetas

## Stack

| | Vue 2 (rama `main` histórica) | Vue 3 (estado actual) |
|---|---|---|
| Framework | Vue 2.7 | Vue 3.4 |
| Estado global | Vuex 3 | Vuex 4 |
| Drag & drop | `vuedraggable` 2.x | `zhyswan-vuedraggable` (fork de `vue.draggable.next`) |
| Build | Vite + `@vitejs/plugin-vue2` | Vite + `@vitejs/plugin-vue` |
| Estilos | CSS propio | CSS propio + Bootstrap 5 (CDN) |

## Cómo se hizo la migración

El proceso tuvo dos etapas, no una sola pasada:

**1. Migración incremental con `@vue/compat`.** Antes de tocar el código,
se instaló Vue 3 junto con el Migration Build (`@vue/compat`), configurado
para arrancar en modo "compórtate como Vue 2, pero avisá" (`compatConfig:
{ MODE: 2 }` + alias de `vue` hacia el paquete de compatibilidad en
`vite.config.js`). Con eso, la app siguió funcionando con código viejo
mientras la consola marcaba, uno por uno, qué había que actualizar:

- `INSTANCE_LISTENERS` → se sacó `v-on="$listeners"` de `EditableTitle.vue`
  (en Vue 3, `$attrs` ya incluye los listeners, no hace falta reenviarlos
  aparte)
- `TRANSITION_CLASSES` → se renombraron las clases de transición en
  `Column.vue`: `.card-fade-enter` → `.card-fade-enter-from` (la clase
  `-active` no cambia de nombre)

**2. Se abandonó `@vue/compat` a mitad de camino.** Al llegar a
`vuedraggable`, la capa de compatibilidad empezó a generar sus propios
errores (`RENDER_FUNCTION`, fallos internos de `fnOptions`) porque la
versión nueva de la librería (`vuedraggable@next`, ya escrita nativamente
contra Vue 3) chocaba con el modo de compatibilidad en vez de beneficiarse
de él. La decisión fue sacar `@vue/compat` del todo y terminar la
migración en Vue 3 puro — la capa de compatibilidad es una herramienta
para código propio en transición, no para dependencias de terceros que ya
se actualizaron por su cuenta.

Con `@vue/compat` fuera, quedaron dos cambios más, sin capa de
compatibilidad de por medio:

- `main.js`: `new Vue({...}).$mount('#app')` → `createApp(App).use(store)
  .mount('#app')`
- `store/index.js`: `new Vuex.Store({...})` → `createStore({...})`
  (contenido interno sin cambios), y se eliminaron `Vue.set`/`Vue.delete`
  de las mutations — con el sistema de reactividad basado en `Proxy` de
  Vue 3, asignar o borrar una propiedad de un objeto reactivo ya es
  reactivo por sí solo, sin necesitar esas dos funciones.

## El bug real: `vuedraggable` + `transition-group`

El paso más largo de la migración no fue de Vue en sí, sino de una
dependencia externa. `vuedraggable@next` (la versión oficial para Vue 3)
tiene un bug conocido y sin resolver en su release de npm: al usar
`tag="transition-group"`, tira `TypeError: Cannot set properties of null
(setting '__draggable_context')` — reportado en varios issues abiertos del
repositorio oficial, con un Pull Request de fix que nunca se publicó.

La solución fue cambiar a **`zhyswan-vuedraggable`**, un fork mantenido
por la comunidad que sí incluye ese fix, con una API 100% idéntica al
paquete original (mismo componente, mismas props, mismo evento `change`) —
el único cambio fue el nombre del paquete en el `import`.

```js
// Antes
import draggable from 'vuedraggable'

// Después
import draggable from 'zhyswan-vuedraggable'
```

## Instalación

```bash
npm install
npm run dev
```

## Lecciones de esta migración

- El Migration Build (`@vue/compat`) es la herramienta correcta para
  código Vue propio en transición, pero no es garantía universal:
  dependencias de terceros ya migradas a Vue 3 pueden chocar con él en
  vez de beneficiarse.
- No todo lo que rompe en una migración es "culpa" de Vue — a veces es una
  librería externa con su propio bug, y la solución pasa por investigar el
  ecosistema (issues, forks mantenidos por la comunidad) en vez de forzar
  el código propio a acomodarse.
- Vue 3 simplifica código real: `Vue.set`/`Vue.delete` desaparecen del
  store sin reemplazo, gracias al nuevo sistema de reactividad basado en
  `Proxy`.
