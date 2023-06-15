import React, { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input, InputField } from './Input'
import { FieldManager, useFieldState } from '.'

export const ControlledWrapper = () => {
	const [value, setValue] = useState('')
	const handleChange = (e) => {
		setValue(e.target.value)
	}
	return <Input name="field" value={value} onChange={handleChange} required data-testid="field" />
}

export const FullyControlledWrapper = () => {
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

export const ControlledFieldWrapper = () => {
	const fieldState = useFieldState({ field: '' })
	return <FieldManager fieldState={fieldState}><InputField name="field" required data-testid="field" /></FieldManager>
}

export const UncontrolledFieldWrapper = () => {
	const fieldState = useFieldState({ field: '' })
	// intentionally setting field name to a non-managed field; field2
	return <FieldManager fieldState={fieldState}><InputField name="field2" required data-testid="field2" /></FieldManager>
}

export const FullyControlledFieldWrapper = () => {
	const fieldState = useFieldState({ field: '' })
	const { onChange: fieldStateOnChange, setFieldError: setError } = fieldState
	const handleChange = (e) => {
		fieldStateOnChange(e)
		if (e.target.value === 'abc') setError(e.target.name, "Cannot enter 'abc'.")
	}
	return (
		<FieldManager fieldState={fieldState}>
			<InputField name="field" onChange={handleChange} required data-testid="field" />
		</FieldManager>
	)
}

describe('Input', function() {
	it('should work as an uncontrolled input', async() => {
		render(<Input name="field" required data-testid="field" />)

		expect(screen.getByTestId('field')).to.be.ok

		const input = screen.getByTestId('field') as HTMLInputElement
		expect(input.checkValidity()).to.be.false

		await act(async() => {
			await userEvent.clear(input)
			await userEvent.type(input, 'abc')
		})

		expect(input.value).to.eq('abc')
		expect(input.checkValidity()).to.be.true
	})

	it('should work as an controlled input (without controlled fieldError)', async() => {
		render(<ControlledWrapper />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		expect(input.checkValidity()).to.be.false

		await act(async() => {
			await userEvent.clear(input)
			await userEvent.type(input, 'abc')
		})

		expect(input.value).to.eq('abc')
		expect(input.checkValidity()).to.be.true
	})

	it('should work as an controlled input (with controlled fieldError)', async() => {
		render(<FullyControlledWrapper />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		expect(input.checkValidity()).to.be.false
		expect(input.validity.valueMissing).to.be.true

		await act(async() => {
			await userEvent.clear(input)
			await userEvent.type(input, 'ab')
		})

		// basic validation pass
		expect(input.value).to.eq('ab')
		expect(input.checkValidity()).to.be.true

		await act(async() => {
			await userEvent.type(input, 'c')
		})

		// validation fail (from controlled state error)
		expect(input.value).to.eq('abc')
		expect(input.checkValidity()).to.be.false
		expect(input.validity.customError).to.be.true
		expect(input.validationMessage).to.eq("Cannot enter 'abc'.")

		await act(async() => {
			await userEvent.type(input, 'c')
		})

		expect(input.value).to.eq('abcc')
		expect(input.checkValidity()).to.be.true
	})

	it('should work as an controlled checkbox input', async() => {
		const FullyControlledCheckboxTest = () => {
			const { onChange, fields, fieldErrors, setFieldError } = useFieldState({ field: '' })
			return <Input name="field" value="123" checked={fields.field === '123'} type="checkbox" onChange={onChange} required data-testid="field" fieldError={fieldErrors.field} onFieldError={setFieldError} />
		}

		render(<FullyControlledCheckboxTest />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		expect(input.checkValidity()).to.be.false
		expect(input.validity.valueMissing).to.be.true

		await act(async() => {
			await userEvent.click(input)
		})

		// basic validation pass
		expect(input.value).to.eq('123')
		expect(input.checkValidity()).to.be.true
	})

	it('should work as an controlled radio input', async() => {
		const FullyControlledRadioTest = () => {
			const { onChange, fields, fieldErrors, setFieldError } = useFieldState({ field: '' })
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
		expect(input.checkValidity()).to.be.false
		expect(input.validity.valueMissing).to.be.true

		await act(async() => {
			await userEvent.click(input)
		})

		// basic validation pass
		expect(input.value).to.eq('1')
		expect(input.checkValidity()).to.be.true
	})
})

describe('InputField', () => {
	it('should throw error without field manager context provider', async() => {
		let error
		try {
			render(<InputField name="field" required data-testid="field" />)
		} catch (err) {
			error = err
		}

		expect(error.message).toEqual('Must be used within a FieldManager')
	})
	it('should work as an uncontrolled input', async() => {
		render(<UncontrolledFieldWrapper />)

		expect(screen.getByTestId('field2')).to.be.ok

		const input = screen.getByTestId('field2') as HTMLInputElement
		expect(input.checkValidity()).to.be.false

		await act(async() => {
			await userEvent.clear(input)
			await userEvent.type(input, 'abc')
		})

		expect(input.value).to.eq('abc')
		expect(input.checkValidity()).to.be.true
	})

	it('should work as an controlled input and handle custom errors', async() => {
		render(<FullyControlledFieldWrapper />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		expect(input.checkValidity()).to.be.false
		expect(input.validity.valueMissing).to.be.true

		await act(async() => {
			await userEvent.clear(input)
			await userEvent.type(input, 'ab')
		})

		// basic validation pass
		expect(input.value).to.eq('ab')
		expect(input.checkValidity()).to.be.true

		await act(async() => {
			await userEvent.type(input, 'c')
		})

		// validation fail (from controlled state error)
		expect(input.value).to.eq('abc')
		expect(input.checkValidity()).to.be.false
		expect(input.validity.customError).to.be.true
		expect(input.validationMessage).to.eq("Cannot enter 'abc'.")

		await act(async() => {
			await userEvent.type(input, 'c')
		})

		expect(input.value).to.eq('abcc')
		expect(input.checkValidity()).to.be.true
	})
	it('should work as an controlled checkbox input', async() => {
		const FullyControlledCheckboxTest = () => {
			const fieldState = useFieldState({ field: '' })
			return (
				<FieldManager fieldState={fieldState}>
					<InputField name="field" type="checkbox" value="123" required data-testid="field" />
				</FieldManager>
			)
		}

		render(<FullyControlledCheckboxTest />)

		expect(screen.getByTestId('field')).to.be.ok
		const input = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		expect(input.checkValidity()).to.be.false
		expect(input.validity.valueMissing).to.be.true

		await act(async() => {
			await userEvent.click(input)
		})

		// basic validation pass
		expect(input.value).to.eq('123')
		expect(input.checkValidity()).to.be.true
	})

	it('should work as an controlled radio input', async() => {
		const FullyControlledRadioTest = () => {
			const fieldState = useFieldState({ field: '' })
			return (
				<FieldManager fieldState={fieldState}>
					<Input name="field" value="1" type="radio" required data-testid="field1" />
					<Input name="field" value="2" type="radio" required data-testid="field2" />
					<Input name="field" value="3" type="radio" required data-testid="field3" />
				</FieldManager>
			)
		}

		render(<FullyControlledRadioTest />)

		expect(screen.getByTestId('field1')).to.be.ok
		expect(screen.getByTestId('field2')).to.be.ok
		expect(screen.getByTestId('field3')).to.be.ok

		const input = screen.getByTestId('field1') as HTMLInputElement

		// basic validation fail
		expect(input.checkValidity()).to.be.false
		expect(input.validity.valueMissing).to.be.true

		await act(async() => {
			await userEvent.click(input)
		})

		// basic validation pass
		expect(input.value).to.eq('1')
		expect(input.checkValidity()).to.be.true
	})
})
