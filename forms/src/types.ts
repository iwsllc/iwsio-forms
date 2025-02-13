import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export interface FieldError { message: string | undefined, validity?: ValidityState | undefined }

export type FieldErrorHandler = (key: string, validity: ValidityState, message?: string) => void

export interface ValidationProps {
	fieldError?: FieldError
	onFieldError?: FieldErrorHandler
}

export type FieldValues = Record<string, string>

export interface FieldChangeResult<Element extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
	/**
	* The updated field values after the change event.
	*/
	fields: FieldValues
	/**
	* The target element that triggered the change event.
	*/
	target: EventTarget & Element
}

export type FieldChangeEventHandler = <Element extends (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)>(e: FieldChangeResult<Element>) => void

export type FieldStateChangeEventHandler = <Element extends (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)>(e: ChangeEvent<Element>) => FieldChangeResult<Element>

export interface UseFieldStateResult {
	/**
	 * Indicates whether InputFields within should render validation errors based on the fieldError state. This is unrelated to the native browser `reportValidity()` function.
	 */
	reportValidation: boolean
	/**
	 * Set report validation manually. This reportValidation is the managed toggle that indicates whether to render validation error messages based on fieldError state. This is unrelated to the native browser `reportValidity()` function.
	 */
	setReportValidation: Dispatch<SetStateAction<boolean>>
	/**
	 * Reset a form's error and value states.
	 */
	reset: () => void
	/**
	 * Current field values where keys match input names.
	 */
	fields: FieldValues
	/**
	 * Set a field's value.
	 * @param key Field name
	 * @param value Value to set
	 */
	setField: (key: string, value: string) => void

	/**
	 * Set all field values at once. Ignores undefined values.
	 */
	setFields: (values: Partial<FieldValues>) => void
	/**
	 * Current field errors where kesy match input names.
	 */
	fieldErrors: Record<string, FieldError>

	/**
	 * Combines `reportValidation` and the `fieldErrors` state to determine if field requested should show an error.
	 * @param name Field input name.
	 * @returns Field error if it has one and should be reported.
	 */
	checkFieldError: (name: string) => string | undefined
	/**
	 * Set a single field's error
	 * @param key Field name key
	 * @param message Error message
	 */
	setFieldError: (key: string, message?: string, validity?: ValidityState | undefined) => void

	/** Set ALL errors at once */
	setFieldErrors: Dispatch<SetStateAction<Record<string, FieldError>>>
	/**
	 * onChange handler to manage state and errors for input, select, and textarea changes.
	 * @param e passthrough of native change event arguments
	 * @returns Returns the latest field value state after change applied.
	 */
	handleChange: FieldStateChangeEventHandler
	/**
	 * @deprecated Please use handleChange
	 * @param e passthrough of native change event arguments
	 * @returns Returns the latest field value state after change applied.
	 */
	onChange: FieldStateChangeEventHandler

	/**
	 * Use this to change the default values after initialization.
	 * @param values The new default values to set.
	 */
	setDefaultValues: (values: FieldValues) => void

	/**
	 * Map the error message based on the field's validity state.
	 * @param validity
	 * @param message
	 * @returns
	 */
	mapError: (validity: ValidityState, message?: string) => string | undefined

	/**
	 * Indicates whether the form is in a busy state. This is useful for forms that need to wait for a server response before allowing another submit.
	 *
	 * Use this to disable form inputs or show a loading indicator.
	 */
	isFormBusy: boolean
	/**
	 * Toggles the form's `isFormBusy` state. If no value is provided, it will toggle the current state.
	 */
	toggleFormBusy: (value?: boolean) => void
}

export const isHTMLInput = (target: EventTarget): target is HTMLInputElement => {
	return target instanceof HTMLElement && target.tagName === 'INPUT'
}
export const isHTMLSelect = (target: EventTarget): target is HTMLSelectElement => {
	return target instanceof HTMLElement && target.tagName === 'SELECT'
}
export const isHTMLTextArea = (target: EventTarget): target is HTMLTextAreaElement => {
	return target instanceof HTMLElement && target.tagName === 'TEXTAREA'
}
