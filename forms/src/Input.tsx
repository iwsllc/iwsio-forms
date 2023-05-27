import React, { forwardRef, useEffect, InputHTMLAttributes, ChangeEventHandler } from 'react'
import { useForwardRef } from './useForwardRef'
import { ValidationProps } from './types'
import { useFieldManager } from './FieldManager'

export type InputProps = ValidationProps & InputHTMLAttributes<HTMLInputElement>

type Ref = HTMLInputElement;

export const Input = forwardRef<Ref, InputProps>(({ onFieldError, fieldError, name, type, onChange, value, checked, onInvalid, ...other }, ref) => {
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
Input.defaultProps = {
	type: 'text'
}

export const InputField = forwardRef<Ref, InputProps>(({ type, name, onChange, value, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)
	const { onChange: managerOnChange, fields, setFieldError, fieldErrors } = useFieldManager()

	const handleOnChange: ChangeEventHandler<Ref> = (e) => {
		managerOnChange(e)
		if (onChange != null) onChange(e)
	}

	return (
		<Input
			ref={localRef}
			onChange={handleOnChange}
			{...(/checkbox|radio/i.test(type) ? { value, checked: fields[name] === value } : { value: fields[name] })}
			type={type}
			name={name}
			fieldError={fieldErrors[name]}
			onFieldError={setFieldError}
			{...other}
		/>
	)
})
InputField.displayName = 'InputField'
InputField.defaultProps = {
	type: 'text'
}
