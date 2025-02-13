import { ChangeEventHandler } from 'react'

import { TextArea, TextAreaProps } from './TextArea.js'
import { FieldChangeEventHandler, FieldErrorHandler } from './types.js'
import { useFieldManager } from './useFieldManager.js'

export interface TextAreaFieldProps extends Omit<TextAreaProps, 'onChange'> {
	onChange?: FieldChangeEventHandler
}

export const TextAreaField = ({ name, onChange, ref, ...other }: TextAreaFieldProps) => {
	const { handleChange: managerOnChange, fields, setFieldError, fieldErrors, mapError } = useFieldManager()

	const handleOnChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		const result = managerOnChange(e)
		if (onChange != null) onChange(result)
	}
	const handleFieldError: FieldErrorHandler = (key, validity, message) => {
		const mappedError = mapError(validity, message)
		setFieldError(key, mappedError, validity)
	}

	return (
		<TextArea
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
