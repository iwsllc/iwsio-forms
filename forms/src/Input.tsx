import { ChangeEventHandler, ComponentProps, FormEventHandler, useEffect, useImperativeHandle, useRef } from 'react'

import { ValidationProps } from './types.js'

export interface InputProps extends ValidationProps, Omit<ComponentProps<'input'>, 'name'> {
	name: string
}

export const Input = ({ onFieldError, fieldError, name, type = 'text', onChange, value, checked, onInvalid, ref, ...other }: InputProps) => {
	const localRef = useRef<HTMLInputElement>(null)
	// @ts-expect-error -- returning whole ref object
	useImperativeHandle(ref, () => localRef.current, [localRef])

	const localOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.target.setCustomValidity('')
		onChange?.(e)
		if (!e.target.validity.valid) onFieldError?.(name, e.target.validity, e.target.validationMessage)
	}

	const handleInvalid: FormEventHandler<HTMLInputElement> = (e) => {
		const target = e.target as HTMLInputElement
		onFieldError?.(name, target.validity, target.validationMessage)
		onInvalid?.(e)
	}

	useEffect(() => {
		if (fieldError == null) return localRef.current?.setCustomValidity('') // clear it.

		// intended to track upstream errors.
		if (fieldError.validity?.customError && fieldError.message !== localRef.current?.validationMessage) {
			localRef.current?.setCustomValidity(fieldError.message ?? '')
		}
	}, [fieldError])

	return (
		<input
			{...other}
			ref={localRef}
			name={name}
			type={type}
			onInvalid={handleInvalid}
			{...(/checkbox|radio/i.test(type) ? { value, checked } : { value })}
			onChange={localOnChange}
		/>
	)
}
