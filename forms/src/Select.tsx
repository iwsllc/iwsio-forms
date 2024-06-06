import { ChangeEventHandler, PropsWithChildren, SelectHTMLAttributes, forwardRef, useEffect } from 'react'
import { FieldChangeEventHandler, ValidationProps } from './types'
import { useFieldManager } from './useFieldManager'
import { useForwardRef } from './useForwardRef'

export type SelectProps = PropsWithChildren & ValidationProps & SelectHTMLAttributes<HTMLSelectElement>

export type SelectFieldProps = Omit<SelectProps, 'DefaultValue' | 'onChange'> & { onChange?: FieldChangeEventHandler }

type Ref = HTMLSelectElement;

export const Select = forwardRef<Ref, SelectProps>(({ onFieldError, onInvalid, fieldError, name, onChange, value, children, ...other }, ref) => {
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
		if (fieldError.validity?.customError && fieldError.message !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError.message || '')
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

export const SelectField = forwardRef<Ref, Omit<SelectFieldProps, 'DefaultValue'>>(({ name, onChange, ...other }, ref) => {
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
		<Select
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
SelectField.displayName = 'SelectField'
