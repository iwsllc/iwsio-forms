import { useCallback, useState } from 'react'

import { defaults } from './defaults.js'
import { FieldError, FieldStateChangeEventHandler, FieldValues, isHTMLInput, UseFieldStateResult } from './types.js'
import { ErrorMapping, useErrorMapping } from './useErrorMapping.js'
import { emptyValidity } from './validityState.js'

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
	const initDefaultFieldValues = defaults({}, defaultValues, fields)

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

	const setFieldError = useCallback((key: string, message?: string, validity?: ValidityState) => {
		let _validity: ValidityState
		const hasMessage = message != null && message.trim().length > 0

		if (hasMessage) {
			_validity = validity ?? { ...emptyValidity, customError: true }
		}
		setFieldErrors((old) => {
			const result = { ...old }
			delete result[key] // clear this error
			if (!hasMessage) return result

			result[key] = { message, validity: _validity }
			return result
		})
	}, [])

	const setField = useCallback((key: string, value: string) => {
		setFieldValues(oldFields => ({ ...oldFields, [key]: value }))
		setFieldError(key) // clear this error if one exists.
	}, [setFieldError])

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

	const checkFieldError = useCallback((key: string): string | undefined => {
		let fieldError: FieldError | undefined = undefined
		if (reportValidation && fieldErrors[key] != null && fieldErrors[key].message !== '') fieldError = fieldErrors[key]

		if (fieldError == null) return undefined
		return mapError(fieldError.validity!, fieldError.message)
	}, [fieldErrors, reportValidation, mapError])

	const reset = useCallback(() => {
		setFieldErrors(_old => ({}))
		setFieldValues(_old => ({ ...defaultFieldValues }))
		setReportValidation(_old => false)
	}, [defaultFieldValues])

	const handleChange: FieldStateChangeEventHandler = useCallback((e) => {
		setFieldError(e.target.name) // clear this error if one exists.
		let value = e.target.value
		const name = e.target.name
		const updatedFields = { ...fieldValues, [name]: value }

		if (isHTMLInput(e.target) && (e.target.type === 'checkbox' || e.target.type === 'radiobutton')) {
			value = e.target.checked ? value : ''
		}

		setFieldValues((old) => {
			const newValues = { ...old }
			newValues[name] = value
			return newValues
		})

		return { fields: updatedFields, target: e.target }
	}, [fieldValues, setFieldError])

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
