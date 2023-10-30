import { omitBy } from './utils'

describe('omitby', () => {
	it('should omit matching args', async () => {
		const result = omitBy({ a: 1, b: 2, c: 3 }, (v) => v % 2 === 0)
		expect(result).to.deep.equal({ a: 1, c: 3 })
	})
	it('should omit matching args', async () => {
		const result = omitBy([1, 2, 3], (v) => v % 2 === 0)
		expect(result).to.deep.equal([1, 3])
	})
})

