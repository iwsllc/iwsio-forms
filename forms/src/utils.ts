export const omitBy = (values: Record<string, any> | any[], omitWhen: (v: any) => boolean): Record<string, any> | any[] => {
	if (Array.isArray(values)) return values.filter((v) => !omitWhen(v))

	const result = {}

	const keys = Object.keys(values)
	for (const key of keys) {
		if (!omitWhen(values[key])) result[key] = values[key]
	}
	return result
}

/**
 * Applies values from sources to target. First in, wins; subsequent sources ignored.
 * @param target Target instance to apply defaults; will initialize to empty object if undefined.
 * @param sources Source objects with default values applied first [left] to last [right].
 * @returns target
 */
export const defaults = (target: Record<string, any> = {}, ...sources: Record<string, any>[]) => {
	for (const source of sources) {
		for (const key in source) {
			if (typeof target[key] === 'undefined' && typeof source[key] !== 'undefined') {
				target[key] = source[key]
			}
		}
	}
	return target
}
