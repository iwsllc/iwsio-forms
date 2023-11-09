import { render, screen, waitFor } from '@testing-library/react'
import { InputField } from './Input'
import { useFieldManager } from './useFieldManager'
import userEvent from '@testing-library/user-event'
import { FC, PropsWithChildren } from 'react'
import { FieldManager } from './FieldManager'

const spySuccess = vi.fn()

const SampleFieldWithRenderError = () => {
	const { checkFieldError, reset, fieldErrors } = useFieldManager()
	const error = checkFieldError('field')
	return (
		<>
			<InputField data-testid="field" name="field" required />
			<button type="submit" data-testid="submit">Submit</button>
			<button type="button" data-testid="reset" onClick={() => reset()}>Reset</button>
			{fieldErrors.field && <div data-testid="error-state">{fieldErrors.field}</div>}
			{error && <div data-testid="error-show">{error}</div>}
		</>
	)
}

const FullyControlledFieldWrapper: FC<PropsWithChildren> = ({ children }) => (
	<FieldManager fields={{ field: '' }} onValidSubmit={spySuccess}>
		{children}
	</FieldManager>
)

describe('FieldManagerForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should setup validation form and not report any errors if form is valid', async () => {
		render(<SampleFieldWithRenderError />, { wrapper: FullyControlledFieldWrapper })

		const button = screen.getByTestId('submit')
		const input = screen.getByTestId('field')

		expect(screen.queryByTestId('error-show')).toBeFalsy()

		await userEvent.type(input, '123')

		expect(screen.queryByTestId('error-show')).toBeFalsy()

		await userEvent.click(button)

		expect(spySuccess).toHaveBeenCalled()
	})

	it('should setup validation form and report validation after first submit', async () => {
		render(<SampleFieldWithRenderError />, { wrapper: FullyControlledFieldWrapper })

		const button = screen.getByTestId('submit')
		const input = screen.getByTestId('field')
		const reset = screen.getByTestId('reset')

		expect(screen.queryByTestId('error-show')).toBeFalsy()
		expect(screen.queryByTestId('error-state')).toBeTruthy() // has error but not yet reportable

		await userEvent.click(button) // trigger reportable

		await waitFor(() => {
			expect(screen.queryByTestId('error-show')).toBeTruthy() // now error shows
		})

		expect(spySuccess).not.toHaveBeenCalled() // not valid yet.

		await userEvent.type(input, '123') // fix validation error

		expect(screen.queryByTestId('error-show')).toBeFalsy() // error hides.

		await userEvent.click(reset) // reset form state

		expect(screen.queryByTestId('error-show')).toBeFalsy()
	})
})
