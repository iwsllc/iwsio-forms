import { ChangeEventHandler } from 'react'

import { Select, SelectProps } from './Select.js'
import { FieldChangeEventHandler, FieldErrorHandler } from './types.js'
import { useFieldManager } from './useFieldManager.js'

export interface SelectFieldProps extends Omit<SelectProps, 'onChange'> {
	onChange?: FieldChangeEventHandler
}

export const SelectField = ({ name, onChange, ref, ...other }: SelectFieldProps) => {
	const { handleChange: managerOnChange, fields, setFieldError, fieldErrors, mapError } = useFieldManager()

	const handleOnChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
		const result = managerOnChange(e)
		if (onChange != null) onChange(result)
	}

	const handleFieldError: FieldErrorHandler = (key, validity, message) => {
		const mappedError = mapError(validity, message)
		setFieldError(key, mappedError, validity)
	}

	return (
		<Select
			ref={ref}
			onChange={handleOnChange}
			onFieldError={handleFieldError}
			name={name}
			fieldError={fieldErrors[name]}
			value={fields[name]}
			{...other}
		/>
	)
}
