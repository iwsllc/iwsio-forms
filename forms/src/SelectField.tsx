import { forwardRef, ChangeEventHandler } from 'react'
import { Ref, Select, SelectProps } from './Select'
import { useFieldManager } from './useFieldManager'
import { useForwardRef } from './useForwardRef'
import { FieldChangeEventHandler } from './types'

export type SelectFieldProps = Omit<SelectProps, 'DefaultValue' | 'onChange'> & { onChange?: FieldChangeEventHandler }

export const SelectField = forwardRef<Ref, SelectFieldProps>(({ name, onChange, ...other }, ref) => {
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
