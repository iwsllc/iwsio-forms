import { ChangeEventHandler, InputHTMLAttributes, forwardRef, useEffect } from 'react'
import { ValidationProps } from './types'
import { useForwardRef } from './useForwardRef'

export type InputProps = ValidationProps & InputHTMLAttributes<HTMLInputElement>

export type Ref = HTMLInputElement

export const Input = forwardRef<Ref, InputProps>(({ onFieldError, fieldError, name, type = 'text', onChange, value, checked, onInvalid, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)

	const localSetError = (message?: string) => {
		if (onFieldError != null) onFieldError(name, localRef.current.validity, message)
	}

	const localOnChange: ChangeEventHandler<Ref> = (e) => {
		localSetError(undefined)
		e.target.setCustomValidity('')
		if (onChange != null) onChange(e)
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}

	const handleInvalid = (e) => {
		localSetError(e.target.validationMessage)
		if (onInvalid != null) onInvalid(e)
	}

	useEffect(() => {
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}, [])

	useEffect(() => {
		if (fieldError == null) return localRef.current.setCustomValidity('')
		if (fieldError.message == null) return localRef.current.setCustomValidity('')

		if (fieldError.validity?.customError && fieldError.message !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError.message)
		}
	}, [fieldError])

	return (
		<input
			ref={localRef}
			name={name}
			type={type}
			onInvalid={handleInvalid}
			{...(/checkbox|radio/i.test(type) ? { value, checked } : { value })}
			onChange={localOnChange}
			{...other}
		/>
	)
})
Input.displayName = 'Input'
