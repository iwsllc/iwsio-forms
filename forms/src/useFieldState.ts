import { ChangeEvent, useCallback, useState } from 'react'
import { omitBy } from './omitBy'
import { defaults } from './defaults'
import { FieldError, FieldValues, UseFieldStateResult } from './types'
import { ErrorMapping, useErrorMapping } from './useErrorMapping'
import { emptyValidity } from './validityState'

export type UseFieldStateMethod = (
	/**
	 * Initial values for all fields; should include blank strings for fields without values. Change these later with the setFieldValues and setFieldValue methods returned from the hook.
	 */
	fields: FieldValues,
	options?: {
		/**
		 * Initial default values to be set when invoking `reset()`, which falls back to `fields` if undefined. Change these later with the setDefaultValues method returned from the hook.
		*/
		defaultValues?: FieldValues
		/**
		 * Optional error mapping function to map custom error messages to validity state.
		*/
		errorMapping?: ErrorMapping
	}
) => UseFieldStateResult

/**
 * Manages field state via change handler, values and error state.
 */
export const useFieldState: UseFieldStateMethod = (fields, options = {}) => {
	const { defaultValues, errorMapping } = options
	const initDefaultFieldValues = defaultValues != null ? defaults(omitBy(fields, (v) => v == null || v === ''), defaultValues) : fields

	const [reportValidation, setReportValidation] = useState(false)
	const [fieldValues, setFieldValues] = useState<FieldValues>(fields)
	const [fieldErrors, setFieldErrors] = useState<Record<string, FieldError>>({})
	const [defaultFieldValues, setDefaultFieldValues] = useState<FieldValues>(initDefaultFieldValues)
	const [isFormBusy, setIsFormBusy] = useState(false)
	const mapError = useErrorMapping(errorMapping)

	const toggleFormBusy = useCallback((value?: boolean) => {
		if (value == null) return setIsFormBusy(_old => !_old)
		setIsFormBusy(_old => value)
	}, [])

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

	const setFieldError = useCallback((key: string, message?: string, validity?: ValidityState) => {
		let _validity: ValidityState
		const hasMessage = message != null && message.trim().length > 0

		if (hasMessage) {
			_validity = validity ?? { ...emptyValidity, customError: true }
		}
		setFieldErrors((old) => ({ ...old, [key]: !hasMessage ? undefined : { message, validity: _validity } }))
	}, [errorMapping])

	const checkFieldError = useCallback((key: string): string | undefined => {
		let fieldError: FieldError | undefined = undefined
		if (reportValidation && fieldErrors[key] != null && fieldErrors[key].message !== '') fieldError = fieldErrors[key]

		if (fieldError == null) return undefined
		return mapError(fieldError.validity, fieldError.message)
	}, [fieldErrors, reportValidation, mapError, fieldValues])

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
		onChange: handleChange,
		reportValidation,
		reset,
		setField,
		setFields,
		setFieldError,
		setFieldErrors,
		setReportValidation,
		setDefaultValues: setDefaultFieldValues,
		mapError,
		isFormBusy,
		toggleFormBusy
	}
}
