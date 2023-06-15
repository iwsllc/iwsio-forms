import { ChangeEvent, useState } from 'react'
import defaults from 'lodash.defaults'
import omitBy from 'lodash.omitby'
import isNull from 'lodash.isnull'
import { UseFieldStateResult } from './UseFieldStateResult'

/**
 * Setup handler and state for a form.
 * @param initValues Default values for all fields; should include blank strings for fields without values.
 * @returns Form helpers
 */
export function useFieldState(initValues: Record<string, any>, defaultValues?: Record<string, string>): UseFieldStateResult {
	const initFieldValues = defaultValues != null ? defaults(omitBy(initValues, isNull), defaultValues) : initValues

	const [fields, setFields] = useState<Record<string, string>>(initFieldValues)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({})

	const setField = (key: string, value: string) => {
		setFields((oldFields) => ({ ...oldFields, [key]: value }))
	}

	const setFieldError = (key: string, message?: string) => {
		setFieldErrors((old) => ({ ...old, [key]: message }))
	}

	function reset() {
		setFields(initFieldValues)
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
		onChange
	}
}
