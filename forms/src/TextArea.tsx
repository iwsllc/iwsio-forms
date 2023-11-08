import { forwardRef, useEffect, ChangeEventHandler, TextareaHTMLAttributes } from 'react'
import { useForwardRef } from './useForwardRef'
import { ValidationProps } from './types'
import { useFieldManager } from './useFieldManager'

export type TextAreaProps = ValidationProps & TextareaHTMLAttributes<HTMLTextAreaElement>

type Ref = HTMLTextAreaElement;

export const TextArea = forwardRef<Ref, TextAreaProps>(({ onFieldError, onInvalid, fieldError, name, onChange, value, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)

	const localSetError = (message?: string) => {
		if (onFieldError != null) onFieldError(name, message)
	}

	const localOnChange: ChangeEventHandler<Ref> = (e) => {
		localSetError(undefined)
		e.target.setCustomValidity('')
		if (onChange != null) onChange(e)
	}

	const handleInvalid = (e) => {
		localSetError(e.target.validationMessage)
		if (onInvalid != null) onInvalid(e)
	}

	useEffect(() => {
		if (fieldError !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError || '')
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

export const TextAreaField = forwardRef<Ref, TextAreaProps>(({ name, onChange, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)

	const { handleChange: managerOnChange, fields, setFieldError, fieldErrors } = useFieldManager()

	const handleOnChange: ChangeEventHandler<Ref> = (e) => {
		managerOnChange(e)
		if (onChange != null) onChange(e)
	}
	return (
		<TextArea
			ref={localRef}
			onChange={handleOnChange}
			onFieldError={setFieldError}
			name={name}
			fieldError={fieldErrors[name]}
			value={fields[name]}
			{...other}
		/>
	)
})
TextAreaField.displayName = 'TextAreaField'
