import { defaults, omitBy } from './utils'

describe('omitby', () => {
	it('should omit matching args', async() => {
		const result = omitBy({ a: 1, b: 2, c: 3 }, (v) => v % 2 === 0)
		expect(result).to.deep.equal({ a: 1, c: 3 })
	})
	it('should omit matching args', async() => {
		const result = omitBy([1, 2, 3], (v) => v % 2 === 0)
		expect(result).to.deep.equal([1, 3])
	})
})

describe('defaults', () => {
	it('should apply defaults in order when target undefined', async() => {
		const result = defaults(undefined, { a: 1 }, { b: 2 }, { a: 3 })
		expect(result).to.deep.equal({ a: 1, b: 2 })
	})
	it('should apply defaults in order to target instance', async() => {
		const target = {}
		const result = defaults(target, { a: 1 }, { b: 2 }, { a: 3 })
		expect(target).to.deep.equal({ a: 1, b: 2 })
		expect(target).to.equal(result)
	})
	it('should apply defaults for multiple props in order to target instance', async() => {
		const target = {}
		const result = defaults(target, { a: 1, b: 4 }, { b: 2, c: 5 }, { a: 3, d: 6 })
		expect(target).to.deep.equal({ a: 1, b: 4, c: 5, d: 6 })
		expect(target).to.equal(result)
	})
})
