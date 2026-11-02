/**
 * Framework-agnostic dashboard contracts.
 * Use UniversalWidgetProps as the boundary between data, state and view.
 */
export class DashboardBus extends EventTarget {
  dispatch(type, detail = {}) { this.dispatchEvent(new CustomEvent(type, { detail })); }
  on(type, listener) { this.addEventListener(type, listener); return () => this.removeEventListener(type, listener); }
}

export const dashboardBus = new DashboardBus();

export const widgetCatalog = [
  { type: 'metric', label: 'KPI card', category: 'Metrics', adapter: 'native-metric' },
  { type: 'line', label: 'Line / area chart', category: 'Trends', adapter: 'svg-line' },
  { type: 'bar', label: 'Bar chart', category: 'Comparison', adapter: 'svg-bar' },
  { type: 'donut', label: 'Donut / pie chart', category: 'Proportion', adapter: 'svg-donut' },
  { type: 'scatter', label: 'Scatter plot', category: 'Correlation', adapter: 'svg-scatter' },
  { type: 'heatmap', label: 'Heatmap', category: 'Correlation', adapter: 'svg-heatmap' },
  { type: 'gauge', label: 'Gauge / progress', category: 'Status', adapter: 'native-gauge' },
  { type: 'table', label: 'Data table', category: 'Records', adapter: 'native-table' },
  { type: 'timeline', label: 'Audit timeline', category: 'Records', adapter: 'native-timeline' },
  { type: 'text', label: 'Text / annotation', category: 'Content', adapter: 'native-text' }
];

export function createWidget(props) {
  const state = { ...props, isLoading: props.isLoading ?? false, error: props.error ?? null };
  const emit = (actionType, payload) => dashboardBus.dispatch('widget:action', { widgetId: state.id, actionType, payload });
  return {
    get state() { return state; },
    refresh() { emit('refresh'); },
    export(format = 'csv') { emit('export', { format }); },
    updateConfig(config) { state.config = { ...state.config, ...config }; dashboardBus.dispatch('widget:config', state); },
    remove() { emit('remove'); },
    duplicate() { emit('duplicate', { sourceId: state.id }); }
  };
}

export function setFilters(filters) { dashboardBus.dispatch('filters:change', filters); }
export function saveDashboard(config, key = 'orbit-dashboard') { localStorage.setItem(key, JSON.stringify(config, null, 2)); }
export function loadDashboard(key = 'orbit-dashboard') { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : null; }
export function exportDashboard(config) { return JSON.stringify(config, null, 2); }
export function importDashboard(json) { const config = typeof json === 'string' ? JSON.parse(json) : json; if (!config?.layout || !config?.widgets) throw new Error('Invalid dashboard schema'); return config; }
