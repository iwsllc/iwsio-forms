/**
 * Return a new shallow copied array/object with values/keys ommitted that match the provided check.
 * @param values Source values/keys
 * @param omitWhen Excludes values that return true
 * @returns Shallow copied object or array without values/keys ommitted.
 */
export function omitBy<T = unknown>(values: T | T[], omitWhen?: (v: T) => boolean): T | T[] {
	if (Array.isArray(values)) return values.filter((v) => !omitWhen(v))

	if (typeof values !== 'object') return values
	const result: Partial<T> = {}

	const keys = Object.keys(values)
	for (const key of keys) {
		if (!omitWhen(values[key])) result[key as keyof T] = values[key]
	}
	return result as T
}
