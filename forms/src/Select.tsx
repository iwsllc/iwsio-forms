import React, { forwardRef, useEffect, ChangeEventHandler, FC, SelectHTMLAttributes } from 'react'
import { useForwardRef } from './useForwardRef'
import { ChildrenProp, ValidationProps } from './types'
import { useFieldManager } from './FieldManager'

export type SelectProps = ChildrenProp & ValidationProps & SelectHTMLAttributes<HTMLSelectElement>

type Ref = HTMLSelectElement;

export const Select = forwardRef<Ref, SelectProps>(({ onFieldError, onInvalid, fieldError, name, onChange, value, children, ...other }, ref) => {
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
		<select
			ref={localRef}
			name={name}
			value={value}
			onInvalid={handleInvalid}
			onChange={localOnChange}
			{...other}
		>
			{children}
		</select>
	)
})
Select.displayName = 'Select'

export const SelectField = forwardRef<Ref, SelectProps>(({ name, onChange, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)
	const { onChange: managerOnChange, fields, setFieldError, fieldErrors } = useFieldManager()

	const handleOnChange: ChangeEventHandler<Ref> = (e) => {
		managerOnChange(e)
		if (onChange != null) onChange(e)
	}

	return (
		<Select
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
SelectField.displayName = 'SelectField'
