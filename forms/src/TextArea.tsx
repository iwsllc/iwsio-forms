import { forwardRef, useEffect, ChangeEventHandler, TextareaHTMLAttributes } from 'react'
import { useForwardRef } from './useForwardRef'
import { FieldChangeEventHandler, ValidationProps } from './types'
import { useFieldManager } from './useFieldManager'

export type TextAreaProps = ValidationProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export type TextAreaFieldProps = Omit<TextAreaProps, 'DefaultValue' | 'onChange'> & { onChange?: FieldChangeEventHandler }

type Ref = HTMLTextAreaElement;

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

export const TextAreaField = forwardRef<Ref, Omit<TextAreaFieldProps, 'DefaultValue'>>(({ name, onChange, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)

	const { handleChange: managerOnChange, fields, setFieldError, fieldErrors, mapError } = useFieldManager()

	const handleOnChange: ChangeEventHandler<Ref> = (e) => {
		const result = managerOnChange(e)
		if (onChange != null) onChange(result)
	}
	const handleFieldError = (key, validity, message) => {
		const mappedError = mapError(validity, message)
		setFieldError(key, mappedError, validity)
	}

	return (
		<TextArea
			ref={localRef}
			onChange={handleOnChange}
			onFieldError={handleFieldError}
			name={name}
			fieldError={fieldErrors[name]}
			value={fields[name]}
			{...other}
		/>
	)
})
TextAreaField.displayName = 'TextAreaField'
