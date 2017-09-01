'use strict';

import {Config} from 'metal-state';

import Chart from './Chart';

/**
 * Spline Chart component.
 * @augments Chart
 */
class SplineChart extends Chart {
}

SplineChart.PROPS = {
	/**
	 * The variety of chart that will be rendered.
	 * @instance
	 * @memberof SplineChart
	 * @type {?string|undefined}
	 * @default spline
	 */
	type: Config.oneOf([
		'area',
		'area-spline',
		'area-step',
		'bar',
		'line',
		'scatter',
		'spline',
		'step',
	]).value('spline')
};

export {SplineChart};
export default SplineChart;