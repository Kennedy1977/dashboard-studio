# Orbit Dashboard Studio

Orbit is a framework-agnostic dashboard starter. The static demo is the visual reference, while `dashboard-config.json` and `universal-widget.js` are the portable architecture layer.

## 1. Run the demo

You only need a browser and a local HTTP server.

```bash
cd dashboard-studio
python3 -m http.server 4173
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in your browser. The written guide is at `/guide.html` and the live copyable widget examples are at `/guide-examples.html`.

The dashboard uses CDN versions of Tailwind CSS, GSAP and Lenis, so no install step is required for the demo.

## 2. Understand the project files

| File | Purpose |
| --- | --- |
| `index.html` | Dashboard markup and widget examples |
| `styles.css` | Core dashboard styles and chart styling |
| `widgets.css` | Component-lab widget styles |
| `app.js` | Interactions, animation, export and share actions |
| `dashboard-config.json` | Portable dashboard layout and widget configuration |
| `universal-widget.js` | Framework-agnostic widget contract and event bus |

Start with `index.html` for visual changes. Use `dashboard-config.json` for layout and widget configuration changes. Use `universal-widget.js` when connecting the dashboard to a real application.

## 3. Change the theme

The main colors are defined near the top of `styles.css`:

```css
:root {
  --ink: #101115;
  --line: #e7e9ee;
}
```

The accent colors are used directly by the widgets:

```text
Violet: #7357ff
Mint:   #55d6be
Coral:  #ff7b65
Sky:    #67b7ff
```

Replace those values to create a branded theme. The dashboard theme button toggles the `dark-mode` class on the document body.

## 4. Add a widget to the layout

Add a new item to the `layout` array in `dashboard-config.json`:

```json
{
  "id": "conversion-rate",
  "type": "metric",
  "x": 0,
  "y": 8,
  "w": 3,
  "h": 2
}
```

Then add its definition to `widgets`:

```json
"conversion-rate": {
  "title": "Conversion rate",
  "source": "analytics.conversionRate",
  "config": {
    "adapter": "native-metric",
    "format": "percent",
    "showDelta": true
  }
}
```

The layout coordinates use a simple grid contract: `x` and `y` locate the widget, while `w` and `h` control its size.

## 5. Create a widget in JavaScript

Import the widget factory and provide data separately from visual configuration:

```js
import { createWidget } from './universal-widget.js';

const revenueWidget = createWidget({
  id: 'revenue',
  title: 'Revenue & growth',
  config: { adapter: 'svg-line', currency: 'GBP' },
  data: { points: [12000, 18000, 24000, 42000] },
  filters: { dateRange: 'last-30-days' },
  isLoading: false,
  error: null
});

revenueWidget.refresh();
revenueWidget.export('csv');
```

This contract works with vanilla JavaScript or can be called from React, Vue, Svelte, Angular, or another framework.

## 6. Connect a data source

Keep fetching separate from the widget renderer:

```js
async function loadRevenue(filters) {
  const query = new URLSearchParams(filters);
  const response = await fetch(`/api/revenue?${query}`);
  if (!response.ok) throw new Error('Revenue request failed');
  return response.json();
}
```

Then pass the normalized result into the widget. A widget should not need to know whether its data came from REST, GraphQL, SQL, WebSocket, CSV or static JSON.

Recommended normalized shape:

```js
{
  labels: ['Jan', 'Feb', 'Mar'],
  series: [{ name: 'Revenue', values: [12000, 18000, 24000] }],
  updatedAt: '2026-11-02T09:30:00Z'
}
```

## 7. Share filters between widgets

Use the shared dashboard bus so one filter can update every widget:

```js
import { dashboardBus, setFilters } from './universal-widget.js';

dashboardBus.on('filters:change', ({ detail }) => {
  console.log('Reload widgets with:', detail);
});

setFilters({ dateRange: 'last-7-days', region: 'north' });
```

For URL-driven dashboards, serialize the same filter object into query parameters so views can be bookmarked and shared.

## 8. Listen for widget actions

Widget buttons dispatch standard actions through the same bus:

```js
dashboardBus.on('widget:action', ({ detail }) => {
  const { widgetId, actionType, payload } = detail;

  if (actionType === 'refresh') refreshWidget(widgetId);
  if (actionType === 'export') exportWidget(widgetId, payload.format);
  if (actionType === 'remove') removeWidget(widgetId);
});
```

This keeps widget controls independent from your application framework.

## 9. Save, export and restore a dashboard

```js
import {
  saveDashboard,
  loadDashboard,
  exportDashboard,
  importDashboard
} from './universal-widget.js';

saveDashboard(config);                         // browser localStorage
const saved = loadDashboard();                 // restore saved config
const backup = exportDashboard(config);        // JSON string
const restored = importDashboard(backup);      // validated config
```

Send the exported JSON to your backend if you need shared team dashboards, templates or user-specific saved views.

## 10. Add a new widget type

Add metadata to `widgetCatalog` in `universal-widget.js`:

```js
{
  type: 'funnel',
  label: 'Conversion funnel',
  category: 'Flows',
  adapter: 'svg-funnel'
}
```

Then create an adapter that understands the widget's normalized data and config. The surrounding contract stays the same, so loading, error, refresh, export and filter behavior can be reused.

## 11. Production checklist

Before using Orbit in a production app:

- Replace CDN dependencies with pinned package versions.
- Add a real chart adapter such as ECharts, Chart.js, Vega-Lite or D3 where needed.
- Persist dashboard JSON in your backend for multi-user access.
- Add authentication and permission checks to share/export actions.
- Validate API responses before rendering charts.
- Keep `prefers-reduced-motion` support enabled.
- Add keyboard focus states and screen-reader labels to custom widgets.
- Virtualize large tables and event feeds.

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
