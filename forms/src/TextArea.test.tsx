import { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextArea, TextAreaField } from './TextArea'
import { useFieldManager } from './useFieldManager'
import { FullyControlledFieldWrapper } from './__tests__/FullyControlledFieldWrapper'

export const ControlledWrapper = () => {
	const [value, setValue] = useState('')
	const handleChange = (e) => {
		setValue(e.target.value)
	}
	return <TextArea name="field" value={value} onChange={handleChange} required data-testid="field" />
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
			<TextArea name="field" value={value} onChange={handleChange} required data-testid="field" fieldError={error} onFieldError={handleFieldError} />
			<span data-testid="error">{error}</span>
		</>
	)
}

describe('TextArea', function() {
	it('should work as an uncontrolled textarea', async () => {
		render(<TextArea name="field" required data-testid="field" />)

		expect(screen.getByTestId('field')).to.be.ok

		const textarea = screen.getByTestId('field') as HTMLTextAreaElement
		expect(textarea.checkValidity()).to.be.false

		await act(async () => {
			await userEvent.clear(textarea)
			await userEvent.type(textarea, 'abc')
		})

		expect(textarea.value).to.eq('abc')
		expect(textarea.checkValidity()).to.be.true
	})

	it('should work as an controlled input (without controlled fieldError)', async () => {
		render(<ControlledWrapper />)

		expect(screen.getByTestId('field')).to.be.ok
		const textarea = screen.getByTestId('field') as HTMLTextAreaElement

		expect(textarea.checkValidity()).to.be.false

		await act(async () => {
			await userEvent.clear(textarea)
			await userEvent.type(textarea, 'abc')
		})

		expect(textarea.value).to.eq('abc')
		expect(textarea.checkValidity()).to.be.true
	})

	it('should work as an controlled input (with controlled fieldError)', async () => {
		render(<FullyControlledWrapper />)

		expect(screen.getByTestId('field')).to.be.ok
		const textarea = screen.getByTestId('field') as HTMLTextAreaElement

		expect(textarea.checkValidity()).to.be.false
		expect(textarea.validity.valueMissing).to.be.true

		await act(async () => {
			await userEvent.clear(textarea)
			await userEvent.type(textarea, 'ab')
		})

		expect(textarea.value).to.eq('ab')
		expect(textarea.checkValidity()).to.be.true

		await act(async () => {
			await userEvent.type(textarea, 'c')
		})

		expect(textarea.value).to.eq('abc')
		expect(textarea.checkValidity()).to.be.false
		expect(textarea.validity.customError).to.be.true
		expect(textarea.validationMessage).to.eq("Cannot enter 'abc'.")
	})
})

describe('TextAreaField', () => {
	it('should throw error without field manager context provider', async () => {
		let error
		try {
			render(<TextAreaField name="field" required data-testid="field" />)
		} catch (err) {
			error = err
		}

		expect(error.message).toEqual('Must be used within a FieldManager')
	})

	it('should work as an controlled input and handle custom errors', async () => {
		const CustomErrorField = () => {
			const { setFieldError } = useFieldManager()
			const handleChange = (e) => {
				if (e.target.value === 'abc') setFieldError(e.target.name, "Cannot enter 'abc'.")
			}
			return <TextAreaField name="field" onChange={handleChange} required data-testid="field" />
		}

		render(<CustomErrorField />, { wrapper: FullyControlledFieldWrapper })

		expect(screen.getByTestId('field')).to.be.ok
		const textarea = screen.getByTestId('field') as HTMLInputElement

		// basic validation fail
		expect(textarea.checkValidity()).to.be.false
		expect(textarea.validity.valueMissing).to.be.true

		await act(async () => {
			await userEvent.clear(textarea)
			await userEvent.type(textarea, 'ab')
		})

		// basic validation pass
		expect(textarea.value).to.eq('ab')
		expect(textarea.checkValidity()).to.be.true

		await act(async () => {
			await userEvent.type(textarea, 'c')
		})

		// validation fail (from controlled state error)
		expect(textarea.value).to.eq('abc')
		expect(textarea.checkValidity()).to.be.false
		expect(textarea.validity.customError).to.be.true
		expect(textarea.validationMessage).to.eq("Cannot enter 'abc'.")

		await act(async () => {
			await userEvent.type(textarea, 'c')
		})

		expect(textarea.value).to.eq('abcc')
		expect(textarea.checkValidity()).to.be.true
	})
})
