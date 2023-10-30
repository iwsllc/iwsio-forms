/**
 * Return a new shallow copied array/object with values/keys ommitted that match the provided check.
 * @param values Source values/keys
 * @param omitWhen Excludes values that return true
 * @returns Shallow copied object or array without values/keys ommitted.
 */
export const omitBy = (values: Record<string, any> | any[], omitWhen: (v: any) => boolean): Record<string, any> | any[] => {
	if (Array.isArray(values)) return values.filter((v) => !omitWhen(v))

	const result = {}

	const keys = Object.keys(values)
	for (const key of keys) {
		if (!omitWhen(values[key])) result[key] = values[key]
	}
	return result
}

