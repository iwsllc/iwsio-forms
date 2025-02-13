import { render, screen } from '@testing-library/react'

describe('sanity', () => {
	it('should render a component', async () => {
		const Test = () => <div data-testid="test">Hello World</div>
		render(<Test />)
		expect(screen.getByTestId('test')).toBeTruthy()
	})
})
