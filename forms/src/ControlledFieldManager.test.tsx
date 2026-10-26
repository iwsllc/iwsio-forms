import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { ControlledFieldManager } from './ControlledFieldManager.js'
import { Input } from './Input.js'
import { InputField } from './InputField.js'
import { useFieldState } from './useFieldState.js'

describe('ControlledFieldManager', () => {
	test('When rendering field manager with fields; happy path', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' })
			return (
				<ControlledFieldManager fieldState={fieldState}>
					<InputField data-testid="field" name="field" />
				</ControlledFieldManager>
			)
		}
		render(<Test />)

		const input = screen.getByTestId('field') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
	})

	test('When rendering field manager with no fields', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field1: '' })
			return <ControlledFieldManager fieldState={fieldState} />
		}
		const { container } = render(<Test />)

		expect(container.textContent).to.eq('')
	})

	test('When rendering field manager with manually controlled field', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field1: '' })
			const { fields, handleChange } = fieldState
			return (
				<ControlledFieldManager fieldState={fieldState}>
					<Input data-testid="field1" name="field1" onChange={handleChange} value={fields.field1} />
				</ControlledFieldManager>
			)
		}
		render(<Test />)

		// input field2 is an uncontrolled field in this case.
		const input = screen.getByTestId('field1') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
	})

	test('When rendering field manager with uncontrolled field', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field1: '' })
			return (
				<ControlledFieldManager fieldState={fieldState}>
					<Input data-testid="field2" name="field2" />
				</ControlledFieldManager>
			)
		}
		render(<Test />)

		// input field2 is an uncontrolled field in this case.
		const input = screen.getByTestId('field2') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // field still works as normal
	})

	test('When rendering field manager with fields and error mapping; should not render component attributes', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' }, { errorMapping: { customError: 'failed' } })
			return (
				<ControlledFieldManager fieldState={fieldState} data-testid="form">
					<Input data-testid="field" name="field" />
					<button type="submit" data-testid="submit">
						submit
					</button>
				</ControlledFieldManager>
			)
		}
		const { container } = render(<Test />)

		await userEvent.click(screen.getByTestId('submit'))

		expect(container.querySelector('form[errorMapping]')).toBeFalsy()
		expect(screen.getByTestId('form')).toBeTruthy()
	})

	test('fieldState.reset() after a submit clears was-validated, so an emptied required field is not shown invalid', async () => {
		const Test = () => {
			const fieldState = useFieldState({ body: '' })
			return (
				<ControlledFieldManager fieldState={fieldState} data-testid="form" onValidSubmit={() => fieldState.reset()}>
					<InputField data-testid="body" name="body" required />
					<button type="submit" data-testid="submit">
						submit
					</button>
				</ControlledFieldManager>
			)
		}
		render(<Test />)
		const form = screen.getByTestId('form')

		await userEvent.click(screen.getByTestId('submit'))
		expect(form.className).to.match(/was-validated/)

		await userEvent.type(screen.getByTestId('body'), 'hello')
		await userEvent.click(screen.getByTestId('submit'))

		expect((screen.getByTestId('body') as HTMLInputElement).value).to.eq('')
		expect(form.className).not.to.match(/was-validated/)
		expect(form.className).to.match(/needs-validation/)
	})

	test('a native form reset turns report validation off as well as was-validated', async () => {
		const onReset = vi.fn()
		const Test = () => {
			const fieldState = useFieldState({ body: '' })
			return (
				<ControlledFieldManager fieldState={fieldState} data-testid="form" onReset={onReset}>
					<InputField data-testid="body" name="body" required />
					<span data-testid="report">{String(fieldState.reportValidation)}</span>
					<button type="submit" data-testid="submit">
						submit
					</button>
					<button type="reset" data-testid="reset">
						reset
					</button>
				</ControlledFieldManager>
			)
		}
		render(<Test />)

		await userEvent.click(screen.getByTestId('submit'))
		expect(screen.getByTestId('report').textContent).to.eq('true')
		await userEvent.click(screen.getByTestId('reset'))

		expect(screen.getByTestId('report').textContent).to.eq('false')
		expect(screen.getByTestId('form').className).not.to.match(/was-validated/)
		expect(onReset).toHaveBeenCalledOnce()
	})
})
