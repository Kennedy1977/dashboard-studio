# Orbit widget guide

## Quick start

```bash
cd dashboard-studio
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/` for the dashboard or `http://127.0.0.1:4173/guide.html` for the visual guide.

## Universal widget contract

```js
import { createWidget } from './universal-widget.js';

const widget = createWidget({
  id: 'revenue',
  title: 'Revenue',
  config: { adapter: 'svg-line' },
  data: { labels: ['Jan', 'Feb'], values: [12000, 18000] },
  filters: { dateRange: 'last-30-days' },
  isLoading: false,
  error: null
});
```

Every widget gets the same lifecycle actions: `refresh()`, `export(format)`, `updateConfig(config)`, `remove()` and `duplicate()`.

## Widget examples

### KPI / metric card

Use for one important number, a comparison and a sparkline.

```json
{ "id": "active-users", "type": "metric", "config": { "format": "number", "showDelta": true, "sparkline": true }, "data": { "value": 18294, "delta": 8.2, "trend": [12, 18, 15, 24] } }
```

### Line / area chart

Use for trends over time.

```json
{ "id": "revenue", "type": "line", "config": { "area": true, "showTarget": true }, "data": { "labels": ["Jan", "Feb", "Mar"], "series": [{ "name": "Revenue", "values": [22, 31, 42] }] } }
```

### Bar chart

Use to compare categories or grouped values.

```json
{ "id": "activity", "type": "bar", "config": { "grouped": true }, "data": { "labels": ["Mon", "Tue", "Wed"], "series": [{ "name": "Sessions", "values": [45, 62, 55] }] } }
```

### Donut / pie chart

Use for part-to-whole relationships.

```json
{ "id": "traffic", "type": "donut", "config": { "legend": "right" }, "data": { "labels": ["Organic", "Direct", "Social"], "values": [42, 28, 18] } }
```

### Gauge / progress

Use for goals and completion states.

```json
{ "id": "goal", "type": "gauge", "config": { "min": 0, "max": 100, "suffix": "%" }, "data": { "value": 78, "target": 100 } }
```

### Heatmap and scatter plot

Use a heatmap for intensity across two dimensions and a scatter plot for relationships.

```json
{ "type": "heatmap", "data": { "rows": ["Mon", "Tue"], "columns": ["AM", "PM"], "values": [[12, 42], [30, 18]] } }
{ "type": "scatter", "data": { "points": [{ "x": 12, "y": 18 }, { "x": 35, "y": 54 }] } }
```

### Table, timeline and profile card

```json
{ "type": "table", "config": { "pageSize": 10, "sortable": true }, "data": { "columns": ["customer", "status"], "rows": [] } }
{ "type": "timeline", "data": { "items": [{ "time": "09:42", "title": "Import complete" }] } }
{ "type": "profile", "data": { "name": "Andrew Kennedy", "role": "Frontend developer", "status": "online" } }
```

### Controls and shared filters

The component lab includes text inputs, selects, radio buttons, checkboxes, toggles and range sliders. Use the shared bus when several widgets should update together:

```js
import { setFilters, dashboardBus } from './universal-widget.js';
dashboardBus.on('filters:change', ({ detail }) => reloadAllWidgets(detail));
setFilters({ dateRange: 'last-7-days', region: 'north' });
```

### Loading, empty and error states

Every widget should handle these states independently:

```js
createWidget({ id: 'forecast', data: null, isLoading: true });
createWidget({ id: 'forecast', data: [], error: new Error('Request failed') });
```

Show a skeleton while loading, a CTA when empty and a retry action when an error occurs.

## Add a new widget

1. Add metadata to `widgetCatalog` in `universal-widget.js`.
2. Define its normalized data shape.
3. Add a renderer or adapter.
4. Add layout and widget config to `dashboard-config.json`.
5. Add loading, empty and error states.
6. Add the example to this guide and `guide.html`.

Keep data separate from visual config, use stable widget IDs, validate imported JSON, and respect reduced-motion preferences.
