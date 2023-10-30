/**
 * Shallow defaults. This basically assigns in when target is undefined.
 *
 * i.e.
 *
 * ```
 * defaults({a: 1}, {b: 2}, {b: 3, c: 4})
 * result: {a: 1, b: 2, c: 4}
 * ```
 *
 * @param dest destination object.
 * @param sources params sources applied sequentially left to right.
 * @returns
 */
export const defaults = (dest, ...sources) => {
	if (sources == null) return dest

	// for each source
	for (let ix = 0; ix < sources.length; ix++) {
		const source = sources[ix]
		const keys = Object.keys(source)
		// for each key
		for (let kx = 0; kx < keys.length; kx++) {
			const key = keys[kx]
			if (typeof dest[key] === 'undefined' && typeof source[key] !== 'undefined') { // prop doesn't exist on dest
				dest[key] = source[key]
			}
		}
	}

	return dest
}
