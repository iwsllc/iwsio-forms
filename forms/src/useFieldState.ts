import { ChangeEvent, useCallback, useState } from 'react'
import { omitBy } from './omitBy'
import { defaults } from './defaults'
import { FieldValues, UseFieldStateResult } from './types'

/**
 * Manages field state via change handler, values and error state.
 * @param fields Initial values for all fields; should include blank strings for fields without values. Change these later with the setFieldValues and setFieldValue methods returned from the hook.
 * @param defaultValues Initial default values to be set when invoking `reset()`, which falls back to `fields` if undefined. Change these later with the setDefaultValues method returned from the hook.
 * @param onValidSubmit Optional callback when form submit event triggered with valid form. Provides current field values as an argument.
 */
export function useFieldState(fields: FieldValues, defaultValues?: FieldValues, onValidSubmit?: (fields: FieldValues) => void): UseFieldStateResult {
	const initDefaultFieldValues = defaultValues != null ? defaults(omitBy(fields, (v) => v == null || v === ''), defaultValues) : fields

	const [reportValidation, setReportValidation] = useState(false)
	const [fieldValues, setFieldValues] = useState<FieldValues>(fields)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({})
	const [defaultFieldValues, setDefaultFieldValues] = useState<FieldValues>(initDefaultFieldValues)

	const localOnValidSubmit = useCallback(onValidSubmit, [])

	const setField = useCallback((key: string, value: string) => {
		setFieldValues((oldFields) => ({ ...oldFields, [key]: value }))
		setFieldError(key, undefined) // clear this error if one exists.
	}, [])

	const setFields = useCallback((values: Partial<FieldValues>) => {
		setFieldValues((oldFields) => {
			const newFields = { ...oldFields }
			for (const key in values) {
				if (values[key] != null) newFields[key] = values[key] // only set fields provided
			}
			return newFields
		})
		// clear errors for fields provided when setting fields
		setFieldErrors((oldErrors) => {
			const newErrors = { ...oldErrors }
			for (const key in values) {
				if (values[key] != null) delete newErrors[key]
			}
			return newErrors
		})
	}, [])

	const setFieldError = useCallback((key: string, message?: string) => {
		setFieldErrors((old) => ({ ...old, [key]: message }))
	}, [])

	const checkFieldError = useCallback((key: string): string | undefined => {
		if (reportValidation && fieldErrors[key] != null && fieldErrors[key] !== '') return fieldErrors[key]
		return undefined
	}, [fieldErrors, reportValidation])

	const reset = useCallback(() => {
		setFieldErrors((_old) => ({}))
		setFieldValues((_old) => ({ ...defaultFieldValues }))
		setReportValidation((_old) => false)
	}, [defaultFieldValues])

	const handleChange: (_e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => FieldValues = useCallback((e) => {
		let value = e.target.value
		const name = e.target.name
		let updatedFields

		if (e.target.type === 'checkbox' || e.target.type === 'radiobutton') {
			value = (e.target as HTMLInputElement).checked ? value : ''
		}

		setFieldValues((old) => {
			const newValues = { ...old } as FieldValues
			newValues[name] = value
			updatedFields = newValues
			return newValues
		})

		return updatedFields
	}, [])

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
		setFields,
		setFieldError,
		setFieldErrors,
		setReportValidation,
		setDefaultValues: setDefaultFieldValues
	}
}
