/**
 * Tree-shaken ECharts core for the Profile Panel charts.
 *
 * Registers only the chart types and components actually used by the usage
 * dashboard (bar + line charts, grid/tooltip/legend, canvas renderer). This
 * keeps the bundle far smaller than importing the full `echarts` package,
 * which pulls in every chart type and renderer.
 *
 * Import `echarts` from here and pass it to `ReactEChartsCore` via the
 * `echarts` prop; import `ECOption` for option typing.
 */

import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, DataZoomComponent, DataZoomInsideComponent } from 'echarts/components';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCoreImport from 'echarts-for-react/lib/core';
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
  DataZoomComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  LegacyGridContainLabel,
  CanvasRenderer,
]);

/**
 * CJS/ESM interop guard. `echarts-for-react/lib/core` is a CommonJS module that
 * assigns the component to `exports.default`. Depending on the bundler's interop
 * (Vite dev vs. production), the default import may arrive either as the class
 * itself or wrapped as `{ default: class }`. Normalise to the actual component.
 */
const interopDefault = <T>(mod: T): T => (mod as { default?: T }).default ?? mod;

/** Tree-shaken ECharts React wrapper. Pass `echarts={echarts}` to it. */
export const ReactECharts = interopDefault(ReactEChartsCoreImport);

/** Option type composed from only the registered charts and components. */
export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
>;

export { echarts };
