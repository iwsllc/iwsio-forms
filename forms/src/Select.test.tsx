import { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select, SelectField } from './Select'
import { useFieldManager } from './useFieldManager'
import { FieldManagerWrapper } from './__tests__/FieldManagerWrapper'
import { FieldError } from './types'

const ControlledSelect = () => {
	const [value, setValue] = useState('')
	const handleChange = (e) => {
		setValue(e.target.value)
	}
	return (
		<Select name="field" value={value} onChange={handleChange} required data-testid="field">
			<option />
			<option>1</option>
			<option>2</option>
		</Select>
	)
}

const ControlledSelectWithErrors = () => {
	const [value, setValue] = useState('')
	const [error, setError] = useState<FieldError | undefined>()
	const handleChange = (e) => {
		setValue(e.target.value)
		if (e.target.value === '1') setError({ message: "Cannot select '1'.", validity: { valid: false, customError: true } as any })
	}
	const handleFieldError = (_key, validity, message) => {
		setError({ message, validity })
	}
	return (
		<>
			<Select name="field" value={value} onChange={handleChange} required data-testid="field" fieldError={error} onFieldError={handleFieldError}>
				<option />
				<option>1</option>
				<option>2</option>
			</Select>
			<span data-testid="error">{error?.message}</span>
			<button onClick={() => setError(undefined)} data-testid="clear">Clear</button>
		</>
	)
}

describe('Select', function() {
	it('should work as an uncontrolled select', async () => {
		render(
			<Select name="field" required data-testid="field">
				<option />
				<option>1</option>
				<option>2</option>
			</Select>
		)

		expect(screen.getByTestId('field')).to.be.ok

		const select = screen.getByTestId('field') as HTMLSelectElement

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		await userEvent.selectOptions(select, '1')

		expect(select.selectedOptions[0].value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true
	})

	it('should work as an controlled input (without controlled fieldError)', async () => {
		render(<ControlledSelect />)

		expect(screen.getByTestId('field')).to.be.ok

		const select = screen.getByTestId('field') as HTMLSelectElement

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		await act(async () => {
			await userEvent.selectOptions(select, '1')
		})

		expect(select.selectedOptions[0].value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true
	})

	it('should work as an controlled input (with controlled fieldError)', async () => {
		render(<ControlledSelectWithErrors />)

		expect(screen.getByTestId('field')).to.be.ok
		const select = screen.getByTestId('field') as HTMLSelectElement

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		expect(select.validity.valueMissing).to.be.true

		await userEvent.selectOptions(select, '2')

		expect(select.value).to.eq('2')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true

		await userEvent.selectOptions(select, '1')

		expect(select.value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		expect(select.validity.customError).to.be.true
		expect(select.validationMessage).to.eq("Cannot select '1'.")
	})

	it('should clear custom validity when upstream fieldError changes to nothing', async () => {
		render(<ControlledSelectWithErrors />)

		const field = screen.getByTestId('field') as HTMLSelectElement

		await userEvent.selectOptions(field, '1')

		act(() => { field.checkValidity() })

		expect(field.validity.valid).to.be.false
		expect(field.validity.customError).to.be.true
		expect(field.validationMessage).to.eq("Cannot select '1'.")

		await userEvent.click(screen.getByTestId('clear'))

		expect(field.validity.customError).to.be.false

		await userEvent.selectOptions(field, '2')
		act(() => { field.checkValidity() })

		expect(field.validity.valid).to.be.true
	})
})

describe('SelectField', () => {
	it('should work as an controlled input and handle custom errors', async () => {
		const CustomErrorSelect = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.target.value === '2') setFieldError(e.target.name, "Cannot select '2'.")
			}
			return (
				<SelectField name="field" onChange={handleChange} required data-testid="field">
					<option />
					<option>1</option>
					<option>2</option>
				</SelectField>

			)
		}
		render(<CustomErrorSelect />, { wrapper: FieldManagerWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const select = screen.getByTestId('field') as HTMLSelectElement

		// basic validation fail

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		expect(select.validity.valueMissing).to.be.true

		await userEvent.selectOptions(select, '1')

		// basic validation pass
		expect(select.value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true

		await userEvent.selectOptions(select, '2')

		// validation fail (from controlled state error)
		expect(select.value).to.eq('2')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		expect(select.validity.customError).to.be.true
		expect(select.validationMessage).to.eq("Cannot select '2'.")

		await userEvent.selectOptions(select, '1')

		expect(select.value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true
	})
	it('should work as an controlled input and handle custom errors via field results', async () => {
		const CustomErrorSelect = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.fields.field === '2') setFieldError('field', "Cannot select '2'.")
			}
			return (
				<SelectField name="field" onChange={handleChange} required data-testid="field">
					<option />
					<option>1</option>
					<option>2</option>
				</SelectField>

			)
		}
		render(<CustomErrorSelect />, { wrapper: FieldManagerWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const select = screen.getByTestId('field') as HTMLSelectElement

		// basic validation fail

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		expect(select.validity.valueMissing).to.be.true

		await userEvent.selectOptions(select, '1')

		// basic validation pass
		expect(select.value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true

		await userEvent.selectOptions(select, '2')

		// validation fail (from controlled state error)
		expect(select.value).to.eq('2')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.false

		expect(select.validity.customError).to.be.true
		expect(select.validationMessage).to.eq("Cannot select '2'.")

		await userEvent.selectOptions(select, '1')

		expect(select.value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true
	})
})
