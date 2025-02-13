import { ChangeEventHandler } from 'react'

import { Input, InputProps } from './Input.js'
import { FieldChangeEventHandler, FieldErrorHandler } from './types.js'
import { useFieldManager } from './useFieldManager.js'

export interface InputFieldProps extends Omit<InputProps, 'onChange'> {
	onChange?: FieldChangeEventHandler
}

export const InputField = ({ type = 'text', name, onChange, value, ...other }: InputFieldProps) => {
	const { handleChange: managerOnChange, fields, setFieldError, fieldErrors, mapError } = useFieldManager()

	const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const result = managerOnChange(e)
		onChange?.(result)
	}

	const handleFieldError: FieldErrorHandler = (key, validity, message) => {
		const mappedError = mapError(validity, message)
		setFieldError(key, mappedError, validity)
	}

	return (
		<Input
			{...other}
			onChange={handleOnChange}
			{...(/checkbox|radio/i.test(type) ? { value, checked: fields[name] === value } : { value: fields[name] })}
			type={type}
			name={name}
			fieldError={fieldErrors[name]}
			onFieldError={handleFieldError}
		/>
	)
}
