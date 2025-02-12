import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { FieldManagerWrapper } from './__tests__/FieldManagerWrapper.js'
import { InputField } from './InputField.js'
import { InvalidFeedbackForField } from './InvalidFeedbackForField.js'

describe('InvalidFeedbackForField', () => {
	it('should render nothing without an error and with report validation off', async () => {
		const Test = () => (
			<>
				<InputField name="field" required pattern="^\D+$" data-testid="input" />
				<InvalidFeedbackForField name="field" data-testid="error" className="frogs" />
				<button type="submit" data-testid="submit">submit</button>
			</>
		)
		render(<Test />, { wrapper: FieldManagerWrapper })

		expect(screen.queryByTestId('error')).to.not.be.ok // doesn't show yet

		await userEvent.type(screen.getByTestId('input'), '2')

		expect(screen.queryByTestId('error')).to.not.be.ok // doesn't show yet

		await userEvent.click(screen.getByTestId('submit'))

		expect(screen.getByTestId('error')).to.be.ok // now it shows
		expect(screen.getByTestId('error').className).to.eq('frogs')

		// clear the invalid '2' and type 'abc'
		await userEvent.clear(screen.getByTestId('input'))
		await userEvent.type(screen.getByTestId('input'), 'abc')

		// error is gone again
		expect(screen.queryByTestId('error')).to.not.be.ok

		// type an invalid '2'
		await userEvent.type(screen.getByTestId('input'), '2')

		// error shows up without submission.
		expect(screen.getByTestId('error')).to.be.ok
		expect(screen.getByTestId('error').className).to.eq('frogs')
	})
})
