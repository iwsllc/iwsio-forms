import { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select, SelectField } from './Select'
import { useFieldManager } from './useFieldManager'
import { UncontrolledFieldWrapper } from './__tests__/UncontrolledFieldWrapper'
import { FullyControlledFieldWrapper } from './__tests__/FullyControlledFieldWrapper'

export const Controlled = () => {
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

export const FullyControlled = () => {
	const [value, setValue] = useState('')
	const [error, setError] = useState<string | undefined>()
	const handleChange = (e) => {
		setValue(e.target.value)
		if (e.target.value === '1') setError("Cannot select '1'.")
	}
	const handleFieldError = (key, message) => {
		setError(message)
	}
	return (
		<>
			<Select name="field" value={value} onChange={handleChange} required data-testid="field" fieldError={error} onFieldError={handleFieldError}>
				<option />
				<option>1</option>
				<option>2</option>
			</Select>
			<span data-testid="error">{error}</span>
		</>
	)
}

describe('Select', function() {
	it('should work as an uncontrolled input', async () => {
		render(
			<Select name="field" required data-testid="field">
				<option />
				<option>1</option>
				<option>2</option>
			</Select>
		)

		expect(screen.getByTestId('field')).to.be.ok

		const select = screen.getByTestId('field') as HTMLSelectElement
		expect(select.checkValidity()).to.be.false

		await act(async () => {
			await userEvent.selectOptions(select, '1')
		})

		expect(select.selectedOptions[0].value).to.eq('1')
		expect(select.checkValidity()).to.be.true
	})

	it('should work as an controlled input (without controlled fieldError)', async () => {
		render(<Controlled />)

		expect(screen.getByTestId('field')).to.be.ok

		const select = screen.getByTestId('field') as HTMLSelectElement
		expect(select.checkValidity()).to.be.false

		await act(async () => {
			await userEvent.selectOptions(select, '1')
		})

		expect(select.selectedOptions[0].value).to.eq('1')
		expect(select.checkValidity()).to.be.true
	})

	it('should work as an controlled input (with controlled fieldError)', async () => {
		render(<FullyControlled />)

		expect(screen.getByTestId('field')).to.be.ok
		const select = screen.getByTestId('field') as HTMLSelectElement

		expect(select.checkValidity()).to.be.false
		expect(select.validity.valueMissing).to.be.true

		await act(async () => {
			await userEvent.selectOptions(select, '2')
		})

		expect(select.value).to.eq('2')
		expect(select.checkValidity()).to.be.true

		await act(async () => {
			await userEvent.selectOptions(select, '1')
		})

		expect(select.value).to.eq('1')
		expect(select.checkValidity()).to.be.false
		expect(select.validity.customError).to.be.true
		expect(select.validationMessage).to.eq("Cannot select '1'.")
	})
})

describe('SelectField', () => {
	it('should throw error without field manager context provider', async () => {
		let error
		try {
			render(
				<SelectField name="field" required data-testid="field">
					<option />
					<option>1</option>
					<option>2</option>
				</SelectField>)
		} catch (err) {
			error = err
		}

		expect(error.message).toEqual('Must be used within a FieldManager')
	})
	it('should work as an uncontrolled input', async () => {
		render(
			<SelectField name="field2" required data-testid="field2">
				<option />
				<option>1</option>
				<option>2</option>
			</SelectField>
			, { wrapper: UncontrolledFieldWrapper })

		expect(screen.getByTestId('field2')).to.be.ok

		const select = screen.getByTestId('field2') as HTMLSelectElement
		expect(select.checkValidity()).to.be.false

		await act(async () => {
			await userEvent.selectOptions(select, '1')
		})

		expect(select.value).to.eq('1')
		expect(select.checkValidity()).to.be.true
	})

	it('should work as an controlled input and handle custom errors', async () => {
		const CustomErrorSelect = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.target.value === '2') setFieldError(e.target.name, "Cannot select '2'.")
			}
			return (
				<SelectField name="field" onChange={handleChange} required data-testid="field" defaultValue="">
					<option />
					<option>1</option>
					<option>2</option>
				</SelectField>

			)
		}
		render(<CustomErrorSelect />, { wrapper: FullyControlledFieldWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const select = screen.getByTestId('field') as HTMLSelectElement

		// basic validation fail
		expect(select.checkValidity()).to.be.false
		expect(select.validity.valueMissing).to.be.true

		await act(async () => {
			await userEvent.selectOptions(select, '1')
		})

		// basic validation pass
		expect(select.value).to.eq('1')
		expect(select.checkValidity()).to.be.true

		await act(async () => {
			await userEvent.selectOptions(select, '2')
		})

		// validation fail (from controlled state error)
		expect(select.value).to.eq('2')
		expect(select.checkValidity()).to.be.false
		expect(select.validity.customError).to.be.true
		expect(select.validationMessage).to.eq("Cannot select '2'.")

		await act(async () => {
			await userEvent.selectOptions(select, '1')
		})

		expect(select.value).to.eq('1')
		expect(select.checkValidity()).to.be.true
	})
})
