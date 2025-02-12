import { ChangeEventHandler, ComponentProps, FormEventHandler, useEffect, useImperativeHandle, useRef } from 'react'

import { ValidationProps } from './types.js'

export interface SelectProps extends ValidationProps, Omit<ComponentProps<'select'>, 'name'> {
	name: string // name required
}

export const Select = ({ onFieldError, onInvalid, fieldError, name, onChange, value, children, ref, ...other }: SelectProps) => {
	const localRef = useRef<HTMLSelectElement>(null)
	// @ts-expect-error -- returning whole ref object
	useImperativeHandle(ref, () => localRef.current, [localRef])

	const localOnChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
		e.target.setCustomValidity('')
		onChange?.(e)
		if (!e.target.validity.valid) onFieldError?.(name, e.target.validity, e.target.validationMessage)
	}

	const handleInvalid: FormEventHandler<HTMLSelectElement> = (e) => {
		const target = e.target as HTMLSelectElement
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
}
