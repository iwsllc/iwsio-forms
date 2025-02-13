import { act, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

// import userEventDefault from '@testing-library/user-event'
import { ValidatedForm } from './ValidatedForm.js'

describe('ValidatedForm', () => {
	it('should call onSubmit always and onValidSubmit when valid; should set proper css classes', async () => {
		const spyOnValidSubmit = vi.fn()
		const spyOnSubmit = vi.fn()

		render(
			<ValidatedForm data-testid="form" nativeValidation={false} onValidSubmit={spyOnValidSubmit} onSubmit={() => { spyOnSubmit() }}>
				<input data-testid="field" type="text" name="field" required />
				<button type="reset" data-testid="reset">reset</button>
				<button data-testid="submit" type="submit">submit</button>
			</ValidatedForm>
		)

		const field = screen.getByTestId('field')
		const form = screen.getByTestId('form')
		const submit = screen.getByTestId('submit')
		const reset = screen.getByTestId('reset')

		// default css classes
		expect(form.className).to.match(/needs-validation/i)
		expect(form.className).not.to.match(/was-validated/i)

		// submit an invalid form
		await userEvent.clear(field)
		await userEvent.click(submit)

		await waitFor(() => {
			expect(spyOnSubmit).toHaveBeenCalled()
			expect(spyOnValidSubmit).not.toHaveBeenCalled()
			expect(form.className).not.to.match(/needs-validation/i)
			expect(form.className).to.match(/was-validated/i)
		})

		// reset counters
		spyOnSubmit.mockClear()
		spyOnValidSubmit.mockClear()

		// submit valid form
		await act(async () => {
			await userEvent.clear(field)
			await userEvent.type(field, 'abc')
			await userEvent.click(submit)
		})

		// check css classes; should call onvalidatedsubmit
		await waitFor(() => {
			expect(spyOnSubmit).toHaveBeenCalled()
			expect(spyOnValidSubmit).toHaveBeenCalled()
			expect(form.className).not.to.match(/needs-validation/i)
			expect(form.className).to.match(/was-validated/i)
		})

		// reset the form
		await act(async () => {
			await userEvent.click(reset)
		})

		// should toggle back the css classes
		await waitFor(() => {
			expect(form.className).to.match(/needs-validation/i)
			expect(form.className).not.to.match(/was-validated/i)
		})
	})
})
