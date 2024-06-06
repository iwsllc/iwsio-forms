import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input, InputField } from './Input'
import { FieldError, FieldManager, InvalidFeedbackForField, useFieldManager, useFieldState } from '.'
import { FieldManagerWrapper } from './__tests__/FieldManagerWrapper'
import { ErrorMapping } from './useErrorMapping'

const ControlledInput = () => {
	const [value, setValue] = useState('')
	const handleChange = (e) => {
		setValue(e.target.value)
	}
	return <Input name="field" value={value} onChange={handleChange} required data-testid="field" />
}

const ControlledInputWithErrors = () => {
	const [value, setValue] = useState('')
	const [error, setError] = useState<FieldError | undefined>()
	const handleChange = (e) => {
		setValue(e.target.value)
		if (e.target.value === 'abc') {
			setError({
				message: "Cannot enter 'abc'.",
				validity: {
					valid: false,
					customError: true,
					badInput: false,
					patternMismatch: false,
					rangeOverflow: false,
					rangeUnderflow: false,
					stepMismatch: false,
					tooLong: false,
					tooShort: false,
					typeMismatch: false,
					valueMissing: false
				}
			})
		}
	}
	const handleFieldError = (_key, validity, message) => {
		setError({ message, validity })
	}
	return (
		<>
			<Input name="field" value={value} onChange={handleChange} required data-testid="field" fieldError={error} onFieldError={handleFieldError} />
			<span data-testid="error">{error?.message}</span>
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
					onFieldError={(key, _validity, message) => setFieldError(key, message)}
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
					<Input name="field" value="1" checked={fields.field === '1'} type="radio" onChange={onChange} required data-testid="field1" fieldError={fieldErrors.field} onFieldError={(key, _validity, message) => setFieldError(key, message)} />
					<Input name="field" value="2" checked={fields.field === '2'} type="radio" onChange={onChange} required data-testid="field2" fieldError={fieldErrors.field} onFieldError={(key, _validity, message) => setFieldError(key, message)} />
					<Input name="field" value="3" checked={fields.field === '3'} type="radio" onChange={onChange} required data-testid="field3" fieldError={fieldErrors.field} onFieldError={(key, _validity, message) => setFieldError(key, message)} />
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
			const handleChange = (results) => {
				if (results.target.value === 'abc') setFieldError(results.target.name, "Cannot enter 'abc'.")
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
	it('should work as an controlled input and handle custom errors via field results', async () => {
		const CustomErrorField = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (results) => {
				if (results.fields.field === 'abc') setFieldError('field', "Cannot enter 'abc'.")
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

	describe('ErrorMapping', () => {
		test('When using errorMapper with invalid fields', async () => {
			const fieldValues = { field1: '', field2: '', field3: '', field4: '', field5: '', field6: '', field7: '', field8: '', field9: '', field0: '' }
			const mapping: ErrorMapping = {
				badInput: 'Invalid1',
				customError: 'Invalid2',
				patternMismatch: 'Invalid3',
				rangeOverflow: 'Invalid4',
				rangeUnderflow: 'Invalid5',
				stepMismatch: 'Invalid6',
				tooLong: 'Invalid7',
				tooShort: 'Invalid8',
				typeMismatch: 'Invalid9',
				valueMissing: 'Invalid0'
			}

			const Wrapper: FC<PropsWithChildren> = ({ children }) => (
				<FieldManager action="/" fields={fieldValues} errorMapping={mapping}>
					{children}
				</FieldManager>
			)
			const Test = () => {
				const { setFieldError } = useFieldManager()
				const handleTest2Change = (updatedFields) => {
					if (updatedFields.fields.field2 === 'abc') setFieldError('field2', 'custom error')
				}
				return (
					<>
						<InputField name="field1" type="number" data-testid="field1" />
						<InputField name="field2" onChange={handleTest2Change} type="text" data-testid="field2" />
						<InputField name="field3" type="text" data-testid="field3" pattern="\d+" />
						<InputField name="field4" type="number" data-testid="field4" max={10} />
						<InputField name="field5" type="number" data-testid="field5" min={1} />
						<InputField name="field6" type="number" step={1} data-testid="field6" />
						<InputField name="field7" type="text" data-testid="field7" maxLength={2} />
						<InputField name="field8" type="text" data-testid="field8" minLength={2} />
						<InputField name="field9" type="email" data-testid="field9" />
						<InputField name="field0" type="text" data-testid="field0" required />
						<InvalidFeedbackForField name="field1" data-testid="error-field1" />
						<InvalidFeedbackForField name="field2" data-testid="error-field2" />
						<InvalidFeedbackForField name="field3" data-testid="error-field3" />
						<InvalidFeedbackForField name="field4" data-testid="error-field4" />
						<InvalidFeedbackForField name="field5" data-testid="error-field5" />
						<InvalidFeedbackForField name="field6" data-testid="error-field6" />
						<InvalidFeedbackForField name="field7" data-testid="error-field7" />
						<InvalidFeedbackForField name="field8" data-testid="error-field8" />
						<InvalidFeedbackForField name="field9" data-testid="error-field9" />
						<InvalidFeedbackForField name="field0" data-testid="error-field0" />
						<button type="submit" data-testid="submit">submit</button>
					</>
				)
			}
			render(<Test />, { wrapper: Wrapper })

			await userEvent.type(screen.getByTestId('field1'), 'abc')
			await userEvent.type(screen.getByTestId('field2'), 'abc')
			await userEvent.type(screen.getByTestId('field3'), 'abc')
			await userEvent.type(screen.getByTestId('field4'), '11')
			await userEvent.type(screen.getByTestId('field5'), '0')
			await userEvent.type(screen.getByTestId('field6'), '1.3')
			await userEvent.type(screen.getByTestId('field7'), 'abcd')
			await userEvent.type(screen.getByTestId('field8'), 'abbb{Backspace}{Backspace}{Backspace}')
			await userEvent.type(screen.getByTestId('field9'), 'not-an-email')
			await userEvent.type(screen.getByTestId('field0'), 'test')
			await userEvent.clear(screen.getByTestId('field0'))

			await userEvent.click(screen.getByTestId('submit'))

			await waitFor(() => {
			// expect(screen.getByTestId('error-field1').textContent).toEqual('Invalid1') // jsdom isn't setting badInput
				expect(screen.getByTestId('error-field2').textContent).toEqual('Invalid2')
				expect(screen.getByTestId('error-field3').textContent).toEqual('Invalid3')
				expect(screen.getByTestId('error-field4').textContent).toEqual('Invalid4')
				expect(screen.getByTestId('error-field5').textContent).toEqual('Invalid5')
				// expect(screen.getByTestId('error-field6').textContent).toEqual('Invalid6') // jsdom isn't setting stepMismatch
				// expect(screen.getByTestId('error-field7').textContent).toEqual('Invalid7') // jsdom isn't setting tooLong
				// expect(screen.getByTestId('error-field8').textContent).toEqual('Invalid8') // jsdom isn't setting tooShort
				expect(screen.getByTestId('error-field9').textContent).toEqual('Invalid9')
				expect(screen.getByTestId('error-field0').textContent).toEqual('Invalid0')
			})
		})
	})
})
