import { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input, InputField } from './Input'
import { useFieldManager, useFieldState } from '.'
import { FieldManagerWrapper } from './__tests__/FieldManagerWrapper'

const ControlledInput = () => {
	const [value, setValue] = useState('')
	const handleChange = (e) => {
		setValue(e.target.value)
	}
	return <Input name="field" value={value} onChange={handleChange} required data-testid="field" />
}

const ControlledInputWithErrors = () => {
	const [value, setValue] = useState('')
	const [error, setError] = useState<string | undefined>()
	const handleChange = (e) => {
		setValue(e.target.value)
		if (e.target.value === 'abc') setError("Cannot enter 'abc'.")
	}
	const handleFieldError = (key, message) => {
		setError(message)
	}
	return (
		<>
			<Input name="field" value={value} onChange={handleChange} required data-testid="field" fieldError={error} onFieldError={handleFieldError} />
			<span data-testid="error">{error}</span>
		</>
	)
}

describe('Input', function() {
	it('should work as an uncontrolled input', async () => {
		render(<Input name="field" required data-testid="field" />)

		expect(screen.getByTestId('field')).to.be.ok

		const input = screen.getByTestId('field') as HTMLInputElement
		act(() => { input.checkValidity() })
		expect(input.validity.valid).to.be.false

		await userEvent.clear(input)
		await userEvent.type(input, 'abc')

		expect(input.value).to.eq('abc')
		act(() => { input.checkValidity() })
		expect(input.validity.valid).to.be.true
	})

	it('should work as an controlled input (without controlled fieldError)', async () => {
		render(<ControlledInput />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		act(() => { input.checkValidity() })
		expect(input.validity.valid).to.be.false

		await userEvent.clear(input)
		await userEvent.type(input, 'abc')

		expect(input.value).to.eq('abc')
		act(() => { input.checkValidity() })
		expect(input.validity.valid).to.be.true
	})

	it('should work as an controlled input (with controlled fieldError)', async () => {
		render(<ControlledInputWithErrors />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		act(() => { input.checkValidity() })
		expect(input.validity.valueMissing).to.be.true

		await userEvent.clear(input)
		await userEvent.type(input, 'ab')

		// basic validation pass
		expect(input.value).to.eq('ab')
		act(() => { input.checkValidity() })
		expect(input.validity.valid).to.be.true

		await userEvent.type(input, 'c')

		// validation fail (from controlled state error)
		expect(input.value).to.eq('abc')

		act(() => { input.checkValidity() })

		expect(input.validity.customError).to.be.true
		expect(input.validationMessage).to.eq("Cannot enter 'abc'.")

		await userEvent.type(input, 'c')

		act(() => { input.checkValidity() })

		expect(input.value).to.eq('abcc')
	})

	it('should work as an controlled checkbox input', async () => {
		const FullyControlledCheckboxTest = () => {
			const { handleChange: onChange, fields, fieldErrors, setFieldError } = useFieldState({ field: '' })
			return (
				<Input
					name="field"
					value="123"
					checked={fields.field === '123'}
					type="checkbox"
					onChange={onChange}
					required
					data-testid="field"
					fieldError={fieldErrors.field}
					onFieldError={setFieldError}
				/>
			)
		}

		render(<FullyControlledCheckboxTest />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		act(() => {
			input.checkValidity()
		})

		// basic validation fail
		expect(input.validity.valid).to.be.false

		await userEvent.click(input)
		act(() => { input.checkValidity() })

		expect(input.value).to.eq('123')

		expect(input.validity.valid).to.be.true
	})

	it('should work as an controlled radio input', async () => {
		const FullyControlledRadioTest = () => {
			const { handleChange: onChange, fields, fieldErrors, setFieldError } = useFieldState({ field: '' })
			return (
				<>
					<Input name="field" value="1" checked={fields.field === '1'} type="radio" onChange={onChange} required data-testid="field1" fieldError={fieldErrors.field} onFieldError={setFieldError} />
					<Input name="field" value="2" checked={fields.field === '2'} type="radio" onChange={onChange} required data-testid="field2" fieldError={fieldErrors.field} onFieldError={setFieldError} />
					<Input name="field" value="3" checked={fields.field === '3'} type="radio" onChange={onChange} required data-testid="field3" fieldError={fieldErrors.field} onFieldError={setFieldError} />
				</>
			)
		}

		render(<FullyControlledRadioTest />)

		expect(screen.getByTestId('field1')).to.be.ok
		expect(screen.getByTestId('field2')).to.be.ok
		expect(screen.getByTestId('field3')).to.be.ok

		const input = screen.getByTestId('field1') as HTMLInputElement

		// basic validation fail
		act(() => { input.checkValidity() })

		expect(input.validity.valid).to.be.false
		expect(input.validity.valueMissing).to.be.true

		await userEvent.click(input)

		expect(input.value).to.eq('1')

		act(() => { input.checkValidity() })

		expect(input.validity.valid).to.be.true
	})
})

describe('InputField', () => {
	it('should work as an controlled input and handle custom errors', async () => {
		const CustomErrorField = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.target.value === 'abc') setFieldError(e.target.name, "Cannot enter 'abc'.")
			}
			return <InputField name="field" onChange={handleChange} required data-testid="field" />
		}

		render(<CustomErrorField />, { wrapper: FieldManagerWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		act(() => {
			input.checkValidity()
		})
		expect(input.validity.valueMissing).to.be.true

		await userEvent.clear(input)
		await userEvent.type(input, 'ab')

		// basic validation pass
		expect(input.value).to.eq('ab')

		act(() => { input.checkValidity() })

		await userEvent.type(input, 'c')

		// validation fail (from controlled state error)
		expect(input.value).to.eq('abc')

		act(() => { input.checkValidity() })

		expect(input.validity.customError).to.be.true
		expect(input.validationMessage).to.eq("Cannot enter 'abc'.")

		await userEvent.type(input, 'c')

		expect(input.value).to.eq('abcc')

		act(() => { input.checkValidity() })

		expect(input.validity.valid).to.be.true
	})
	it('should work as an controlled checkbox input', async () => {
		render(<InputField name="field" type="checkbox" value="123" required data-testid="field" />, { wrapper: FieldManagerWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		act(() => { input.checkValidity() })

		expect(input.validity.valueMissing).to.be.true

		await userEvent.click(input)

		expect(input.value).to.eq('123')

		act(() => { input.checkValidity() })

		expect(input.validity.valid).to.be.true
	})

	it('should work as an controlled radio input', async () => {
		render(
			<>
				<Input name="field" value="1" type="radio" required data-testid="field1" />
				<Input name="field" value="2" type="radio" required data-testid="field2" />
				<Input name="field" value="3" type="radio" required data-testid="field3" />
			</>, { wrapper: FieldManagerWrapper })

		expect(screen.getByTestId('field1')).to.be.ok
		expect(screen.getByTestId('field2')).to.be.ok
		expect(screen.getByTestId('field3')).to.be.ok

		const input = screen.getByTestId('field1') as HTMLInputElement

		act(() => { input.checkValidity() })

		expect(input.validity.valueMissing).to.be.true

		await userEvent.click(input)

		expect(input.value).to.eq('1')

		act(() => { input.checkValidity() })

		expect(input.validity.valid).to.be.true
	})
})
