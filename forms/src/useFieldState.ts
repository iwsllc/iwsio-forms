import { ChangeEvent, useCallback, useState } from 'react'
import { omitBy } from './omitBy'
import { defaults } from './defaults'
import { FieldValues, UseFieldStateResult } from './types'

/**
 * Manages field state via change handler, values and error state.
 * @param fields Initial values for all fields; should include blank strings for fields without values.
 * @param defaultValues Default values to be set when invoking `reset()`, which falls back to `fields` if undefined.
 * @param onValidSubmit Optional callback when form submit event triggered with valid form. Provides current field values as an argument.
 */
export function useFieldState(fields: FieldValues, defaultValues?: FieldValues, onValidSubmit?: (fields: FieldValues) => void): UseFieldStateResult {
	const defaultFieldValues = defaultValues != null ? defaults(omitBy(fields, (v) => v == null || v === ''), defaultValues) : fields

	const [reportValidation, setReportValidation] = useState(false)
	const [fieldValues, setFieldValues] = useState<FieldValues>(fields)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({})

	const localOnValidSubmit = useCallback(onValidSubmit, [])

	const setField = (key: string, value: string) => {
		setFieldValues((oldFields) => ({ ...oldFields, [key]: value }))
	}

	const setFieldError = (key: string, message?: string) => {
		setFieldErrors((old) => ({ ...old, [key]: message }))
	}

	const checkFieldError = (key: string): string | undefined => {
		if (reportValidation && fieldErrors[key] != null && fieldErrors[key] !== '') return fieldErrors[key]
		return undefined
	}

	function reset() {
		setFieldErrors({})
		setFieldValues(defaultFieldValues)
		setReportValidation(false)
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
		fieldErrors,
		checkFieldError,
		fields: fieldValues,
		handleChange,
		onChange: handleChange, // alias
		onValidSubmit: localOnValidSubmit,
		reportValidation,
		reset,
		setField,
		setFieldError,
		setFieldErrors,
		setReportValidation
	}
}
