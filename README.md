# Orbit Dashboard Studio

Orbit is a framework-agnostic dashboard starter: the static demo is the visual reference, while `dashboard-config.json` and `universal-widget.js` are the portable architecture layer.

## The contract

Every widget can be created with the same shape, regardless of whether the renderer is SVG, Chart.js, ECharts, D3, Canvas, React, Vue, Svelte, or vanilla DOM:

```js
createWidget({
  id: 'revenue',
  title: 'Revenue & growth',
  config: { adapter: 'svg-line' },
  data: { points: [] },
  filters: { dateRange: 'last-30-days' },
  isLoading: false,
  error: null,
  onAction: (type, payload) => {}
})
```

The widget wrapper owns lifecycle actions (`refresh`, `export`, `remove`, `duplicate`) and renders can subscribe to `DashboardBus` events without knowing how the rest of the app is built.

## Persistable layout

`dashboard-config.json` stores the full dashboard state: theme, inherited filters, grid coordinates, widget types, data sources, adapters and visual configuration. It can be stored in a database, local storage, or exported as a template.

## Events

```js
dashboardBus.on('filters:change', ({ detail }) => queryAllWidgets(detail));
dashboardBus.on('widget:action', ({ detail }) => handleWidgetAction(detail));
```

This keeps filter controls, URL state, widgets and data adapters decoupled.

## Current project

Open `index.html` for the visual demo. The demo is intentionally dependency-light: Tailwind CDN, inline SVG/CSS charts, GSAP motion and Lenis smooth scrolling. The architecture files are ES modules so they can be imported directly into any modern build tool.
