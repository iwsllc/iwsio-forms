import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export type ValidationProps = {
	fieldError?: string;
	onFieldError?: (key: string, message?: string) => void;
};

export type FieldValues = Record<string, string>

export type UseFieldStateResult = {
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
	 * Current field errors where kesy match input names.
	 */
	fieldErrors: Record<string, string>;
	/**
	 * Set a single field's error
	 * @param key Field name key
	 * @param message Error message
	 */
	setFieldError: (key: string, message?: string) => void;
	/** Set ALL errors at once */
	setFieldErrors: Dispatch<SetStateAction<Record<string, string>>>;
	/**
	 * onChange handler to manage state and errors for input, select, and textarea changes.
	 * @param e passthrough of native change event arguments
	 * @returns Returns the latest field value state after change applied.
	 */
	handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Record<string, string>;
	/**
	 * @deprecated Please use handleChange
	 * @param e passthrough of native change event arguments
	 * @returns Returns the latest field value state after change applied.
	 */
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Record<string, string>;

	/**
	 * Invokes when submit event triggered and form has been validated and is valid.
	 * @param fields Current values stored in field state.
	 */
	onValidSubmit: (fields: FieldValues) => void
};
