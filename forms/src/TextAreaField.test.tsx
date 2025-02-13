import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { FieldManagerWrapper } from './__tests__/FieldManagerWrapper.js'
import { TextAreaField } from './TextAreaField.js'
import { useFieldManager } from './useFieldManager.js'

describe('TextAreaField', () => {
	it('should work as an controlled input and handle custom errors', async () => {
		const CustomErrorField = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.target.value === 'abc') setFieldError(e.target.name, 'Cannot enter \'abc\'.')
			}
			return <TextAreaField name="field" onChange={handleChange} required data-testid="field" />
		}

		render(<CustomErrorField />, { wrapper: FieldManagerWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const textarea = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		act(() => { textarea.checkValidity() })

		expect(textarea.validity.valid).to.be.false
		expect(textarea.validity.valueMissing).to.be.true

		await userEvent.clear(textarea)
		await userEvent.type(textarea, 'ab')

		// basic validation pass
		expect(textarea.value).to.eq('ab')
		expect(textarea.checkValidity()).to.be.true

		await userEvent.type(textarea, 'c')

		// validation fail (from controlled state error)
		expect(textarea.value).to.eq('abc')

		act(() => { textarea.checkValidity() })

		expect(textarea.validity.valid).to.be.false
		expect(textarea.validity.customError).to.be.true
		expect(textarea.validationMessage).to.eq('Cannot enter \'abc\'.')

		await userEvent.type(textarea, 'c')

		expect(textarea.value).to.eq('abcc')
		expect(textarea.checkValidity()).to.be.true
	})
	it('should work as an controlled input and handle custom errors via field results', async () => {
		const CustomErrorField = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.fields.field === 'abc') setFieldError('field', 'Cannot enter \'abc\'.')
			}
			return <TextAreaField name="field" onChange={handleChange} required data-testid="field" />
		}

		render(<CustomErrorField />, { wrapper: FieldManagerWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const textarea = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		act(() => { textarea.checkValidity() })

		expect(textarea.validity.valid).to.be.false
		expect(textarea.validity.valueMissing).to.be.true

		await userEvent.clear(textarea)
		await userEvent.type(textarea, 'ab')

		// basic validation pass
		expect(textarea.value).to.eq('ab')
		expect(textarea.checkValidity()).to.be.true

		await userEvent.type(textarea, 'c')

		// validation fail (from controlled state error)
		expect(textarea.value).to.eq('abc')

		act(() => { textarea.checkValidity() })

		expect(textarea.validity.valid).to.be.false
		expect(textarea.validity.customError).to.be.true
		expect(textarea.validationMessage).to.eq('Cannot enter \'abc\'.')

		await userEvent.type(textarea, 'c')

		expect(textarea.value).to.eq('abcc')
		expect(textarea.checkValidity()).to.be.true
	})
})
