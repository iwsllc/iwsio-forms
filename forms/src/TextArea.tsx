import { ChangeEventHandler, ComponentProps, FormEventHandler, useEffect, useImperativeHandle, useRef } from 'react'

import { ValidationProps } from './types.js'

export interface TextAreaProps extends ValidationProps, Omit<ComponentProps<'textarea'>, 'name'> {
	name: string
}

export const TextArea = ({ onFieldError, onInvalid, fieldError, name, onChange, value, ref, ...other }: TextAreaProps) => {
	const localRef = useRef<HTMLTextAreaElement>(null)
	// @ts-expect-error -- returning whole ref object
	useImperativeHandle(ref, () => localRef.current, [localRef])

	const localOnChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		e.target.setCustomValidity('')
		onChange?.(e)
		if (!e.target.validity.valid) onFieldError?.(name, e.target.validity, e.target.validationMessage)
	}

	const handleInvalid: FormEventHandler<HTMLTextAreaElement> = (e) => {
		const target = e.target as HTMLTextAreaElement
		onInvalid?.(e)
		onFieldError?.(name, target.validity, target.validationMessage)
	}

	useEffect(() => {
		if (fieldError == null) return localRef.current?.setCustomValidity('') // clear it.

		// intended to track upstream errors.
		if (fieldError.validity?.customError && fieldError.message !== localRef.current?.validationMessage) {
			localRef.current?.setCustomValidity(fieldError.message ?? '')
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
}
