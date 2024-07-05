import { ChangeEventHandler, forwardRef, TextareaHTMLAttributes, useEffect } from 'react'
import { ValidationProps } from './types'
import { useForwardRef } from './useForwardRef'

export type TextAreaProps = ValidationProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export type Ref = HTMLTextAreaElement

export const TextArea = forwardRef<Ref, TextAreaProps>(({ onFieldError, onInvalid, fieldError, name, onChange, value, ...other }, ref) => {
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
		if (fieldError == null) return localRef.current.setCustomValidity('') // clear it.
		if (fieldError.validity?.customError && fieldError.message !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError.message || '')
		}
	}, [fieldError])

	return (
		<textarea
			ref={localRef}
			name={name}
			value={value}
			onInvalid={handleInvalid}
			onChange={localOnChange}
			{...other}
		/>
	)
})

TextArea.displayName = 'TextArea'
