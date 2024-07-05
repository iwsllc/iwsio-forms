import { ChangeEventHandler, forwardRef } from 'react'
import { Ref, TextArea, TextAreaProps } from './TextArea'
import { FieldChangeEventHandler } from './types'
import { useFieldManager } from './useFieldManager'
import { useForwardRef } from './useForwardRef'

export type TextAreaFieldProps = Omit<TextAreaProps, 'DefaultValue' | 'onChange'> & { onChange?: FieldChangeEventHandler }

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
