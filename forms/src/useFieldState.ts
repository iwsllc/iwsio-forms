import { ChangeEvent, useState } from 'react'
import { UseFieldStateResult } from './UseFieldStateResult'
import { omitBy } from './omitBy'
import { defaults } from './defaults'

/**
 * Manages field state via change handler, values and error state.
 * @param fields Default values for all fields; should include blank strings for fields without values.
 * @param defaultValues Default values to be set when invoking `reset()`
 */
export function useFieldState(fields: Record<string, any>, defaultValues?: Record<string, string>): UseFieldStateResult {
	const defaultFieldValues = defaultValues != null ? defaults(omitBy(fields, (v) => v == null || v === ''), defaultValues) : fields

	const [fieldValues, setFieldValues] = useState<Record<string, string>>(fields)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({})

	const setField = (key: string, value: string) => {
		setFieldValues((oldFields) => ({ ...oldFields, [key]: value }))
	}

	const setFieldError = (key: string, message?: string) => {
		setFieldErrors((old) => ({ ...old, [key]: message }))
	}

	function reset() {
		setFieldErrors({})
		setFieldValues(defaultFieldValues)
	}

	const handleChange: (_e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Record<string, string> = (e) => {
		let value = e.target.value
		const name = e.target.name
		let updatedFields

		if (e.target.type === 'checkbox' || e.target.type === 'radiobutton') {
			value = (e.target as HTMLInputElement).checked ? value : ''
		}

		setFieldValues((old) => {
			const newValues = { ...old } as Record<string, string>
			newValues[name] = value
			updatedFields = newValues
			return newValues
		})

		return updatedFields
	}

	return {
		reset,
		fields: fieldValues,
		setField,
		fieldErrors,
		setFieldError,
		setFieldErrors,
		handleChange,
		onChange: handleChange // alias
	}
}
