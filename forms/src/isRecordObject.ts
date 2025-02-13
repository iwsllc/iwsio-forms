export const isRecordObject = (source: unknown): source is Record<string, unknown> => {
	return typeof source === 'object' && source !== null && !Array.isArray(source) && !(source instanceof Date)
}
