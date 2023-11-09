/**
 * Return a new shallow copied array/object with values/keys ommitted that match the provided check.
 * @param values Source values/keys
 * @param omitWhen Excludes values that return true
 * @returns Shallow copied object or array without values/keys ommitted.
 */
export function omitBy(values: any, omitWhen?: (v: any) => boolean): any {
	if (Array.isArray(values)) return values.filter((v) => !omitWhen(v))

	if (typeof values !== 'object') return values
	const result: any = {}

	const keys = Object.keys(values)
	for (const key of keys) {
		if (!omitWhen(values[key])) result[key] = values[key]
	}
	return result
}
