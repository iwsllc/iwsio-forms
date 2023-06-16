import { ChangeEvent, useState } from 'react'
import defaults from 'lodash.defaults'
import omitBy from 'lodash.omitby'
import { UseFieldStateResult } from './UseFieldStateResult'

/**
 * Setup handler and state for a form.
 * @param initValues Default values for all fields; should include blank strings for fields without values.
 * @returns Form helpers
 */
export function useFieldState(initValues: Record<string, any>, defaultValues?: Record<string, string>): UseFieldStateResult {
	const defaultFieldValues = defaultValues != null ? defaults(omitBy(initValues, (v) => v == null || v === ''), defaultValues) : initValues

	const [fields, setFields] = useState<Record<string, string>>(initValues)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({})

	const setField = (key: string, value: string) => {
		setFields((oldFields) => ({ ...oldFields, [key]: value }))
	}

	const setFieldError = (key: string, message?: string) => {
		setFieldErrors((old) => ({ ...old, [key]: message }))
	}

	function reset() {
		setFieldErrors({})
		setFields(defaultFieldValues)
	}

	const onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Record<string, any> = (e) => {
		let value = e.target.value
		const name = e.target.name
		let updatedFields

		if (e.target.type === 'checkbox' || e.target.type === 'radiobutton') {
			value = (e.target as HTMLInputElement).checked ? value : ''
		}

		setFields((old) => {
			const newValues = { ...old } as Record<string, string>
			newValues[name] = value
			updatedFields = newValues
			return newValues
		})

		return updatedFields
	}

	return {
		reset,
		fields,
		setField,
		fieldErrors,
		setFieldError,
		setFieldErrors,
		onChange
	}
}
