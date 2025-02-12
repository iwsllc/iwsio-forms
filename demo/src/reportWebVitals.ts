import type { CLSMetric, FCPMetric, LCPMetric, TTFBMetric } from 'web-vitals'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

type PerfEntryFunction = (
	metric: CLSMetric | FCPMetric | LCPMetric | TTFBMetric,
) => void

const reportWebVitals = (onPerfEntry?: PerfEntryFunction): void => {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		onCLS(onPerfEntry)
		onFCP(onPerfEntry)
		onLCP(onPerfEntry)
		onTTFB(onPerfEntry)
	}
}

export default reportWebVitals
