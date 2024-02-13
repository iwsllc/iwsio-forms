import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export type FieldError = { message: string | undefined, validity?: ValidityState | undefined }

export type ValidationProps = {
	fieldError?: FieldError;
	onFieldError?: (key: string, validity: ValidityState, message?: string) => void;
};

export type FieldValues = Record<string, string>

export type UseFieldStateResult = {
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
	reset: () => void;
	/**
	 * Current field values where keys match input names.
	 */
	fields: FieldValues;
	/**
	 * Set a field's value.
	 * @param key Field name
	 * @param value Value to set
	 */
	setField: (key: string, value: string) => void;

	/**
	 * Set all field values at once. Ignores undefined values.
	 */
	setFields: (values: Partial<FieldValues>) => void;
	/**
	 * Current field errors where kesy match input names.
	 */
	fieldErrors: Record<string, FieldError>;

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
	setFieldError: (key: string, message?: string, validity?: ValidityState | undefined) => void;

	/** Set ALL errors at once */
	setFieldErrors: Dispatch<SetStateAction<Record<string, FieldError>>>;
	/**
	 * onChange handler to manage state and errors for input, select, and textarea changes.
	 * @param e passthrough of native change event arguments
	 * @returns Returns the latest field value state after change applied.
	 */
	handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => FieldValues;
	/**
	 * @deprecated Please use handleChange
	 * @param e passthrough of native change event arguments
	 * @returns Returns the latest field value state after change applied.
	 */
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => FieldValues;

	/**
	 * Invokes when submit event triggered and form has been validated and is valid.
	 * @param fields Current values stored in field state.
	 */
	onValidSubmit: (fields: FieldValues) => void

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
};
