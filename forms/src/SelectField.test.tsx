import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { FieldManagerWrapper } from './__tests__/FieldManagerWrapper.js'
import { SelectField } from './SelectField.js'
import { useFieldManager } from './useFieldManager.js'

describe('SelectField', () => {
	it('should work as an controlled input and handle custom errors', async () => {
		const CustomErrorSelect = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.target.value === '2') setFieldError(e.target.name, 'Cannot select \'2\'.')
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
		expect(select.validationMessage).to.eq('Cannot select \'2\'.')

		await userEvent.selectOptions(select, '1')

		expect(select.value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true
	})
	it('should work as an controlled input and handle custom errors via field results', async () => {
		const CustomErrorSelect = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.fields.field === '2') setFieldError('field', 'Cannot select \'2\'.')
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
		expect(select.validationMessage).to.eq('Cannot select \'2\'.')

		await userEvent.selectOptions(select, '1')

		expect(select.value).to.eq('1')

		act(() => { select.checkValidity() })

		expect(select.validity.valid).to.be.true
	})
})
