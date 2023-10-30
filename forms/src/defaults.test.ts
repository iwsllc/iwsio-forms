import { defaults } from './defaults.js'

describe('defaults', () => {
	test('basic flat object', async() => {
		const result = defaults({}, { one: 1, two: 2, three: 'three' })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three' })
	})

	test('deep object (value exists), shallow defaults', async() => {
		const four = { four: 4 }
		const result = defaults({ four }, { one: 1, two: 2, three: 'three', four: { four: 4, five: 5 } })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three', four: { four: 4 } })
		expect(result.four).to.equal(four) // strict equal by ref
		expect(result.four.five).to.not.be.ok
	})

	test('deep object (value null), shallow defaults', async() => {
		const four = { four: 4, five: 5 }
		const result = defaults({}, { one: 1, two: 2, three: 'three', four })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three', four: { four: 4, five: 5 } })
		expect(result.four).to.equal(four) // strict equal by ref
		expect(result.four.five).to.be.ok
	})
})

