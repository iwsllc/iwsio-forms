import { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextArea, TextAreaField } from './TextArea'
import { useFieldManager } from './useFieldManager'
import { FieldManagerWrapper } from './__tests__/FieldManagerWrapper'
import { FieldError } from './types'

export const ControlledTextArea = () => {
	const [value, setValue] = useState('')
	const handleChange = (e) => {
		setValue(e.target.value)
	}
	return <TextArea name="field" value={value} onChange={handleChange} required data-testid="field" />
}

export const ControlledTextAreaWithErrors = () => {
	const [value, setValue] = useState('')
	const [error, setError] = useState<FieldError | undefined>()
	const handleChange = (e) => {
		setValue(e.target.value)
		if (e.target.value === 'abc') setError({ message: "Cannot enter 'abc'.", validity: { valid: false, customError: true } as any })
	}
	const handleFieldError = (_key, validity, message) => {
		setError({ message, validity })
	}
	return (
		<>
			<TextArea name="field" value={value} onChange={handleChange} required data-testid="field" fieldError={error} onFieldError={handleFieldError} />
			<span data-testid="error">{error?.message}</span>
		</>
	)
}

describe('TextArea', function() {
	it('should work as an uncontrolled textarea', async () => {
		render(<TextArea name="field" required data-testid="field" />)

		expect(screen.getByTestId('field')).to.be.ok

		const textarea = screen.getByTestId('field') as HTMLTextAreaElement

		act(() => { textarea.checkValidity() })

		expect(textarea.validity.valid).to.be.false

		await userEvent.clear(textarea)
		await userEvent.type(textarea, 'abc')

		expect(textarea.value).to.eq('abc')
		act(() => { textarea.checkValidity() })
		expect(textarea.validity.valid).to.be.true
	})

	it('should work as an controlled input (without controlled fieldError)', async () => {
		render(<ControlledTextArea />)

		expect(screen.getByTestId('field')).to.be.ok
		const textarea = screen.getByTestId('field') as HTMLTextAreaElement

		act(() => { textarea.checkValidity() })

		expect(textarea.validity.valid).to.be.false

		await userEvent.clear(textarea)
		await userEvent.type(textarea, 'abc')

		expect(textarea.value).to.eq('abc')
		act(() => { textarea.checkValidity() })
		expect(textarea.validity.valid).to.be.true
	})

	it('should work as an controlled input (with controlled fieldError)', async () => {
		render(<ControlledTextAreaWithErrors />)

		expect(screen.getByTestId('field')).to.be.ok
		const textarea = screen.getByTestId('field') as HTMLTextAreaElement

		act(() => { textarea.checkValidity() })
		expect(textarea.validity.valid).to.be.false

		expect(textarea.validity.valueMissing).to.be.true

		await userEvent.clear(textarea)
		await userEvent.type(textarea, 'ab')

		expect(textarea.value).to.eq('ab')
		act(() => { textarea.checkValidity() })
		expect(textarea.validity.valid).to.be.true

		await userEvent.type(textarea, 'c')

		expect(textarea.value).to.eq('abc')

		act(() => { textarea.checkValidity() })

		expect(textarea.validity.valid).to.be.false
		expect(textarea.validity.customError).to.be.true
		expect(textarea.validationMessage).to.eq("Cannot enter 'abc'.")
	})
})

describe('TextAreaField', () => {
	it('should work as an controlled input and handle custom errors', async () => {
		const CustomErrorField = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.target.value === 'abc') setFieldError(e.target.name, "Cannot enter 'abc'.")
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
		expect(textarea.validationMessage).to.eq("Cannot enter 'abc'.")

		await userEvent.type(textarea, 'c')

		expect(textarea.value).to.eq('abcc')
		expect(textarea.checkValidity()).to.be.true
	})
})
