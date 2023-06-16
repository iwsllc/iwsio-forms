import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'

export type UseFieldStateResult = {
	/**
	 * Reset a form's error and value states.
	 */
	reset: () => void;
	fields: Record<string, string>;
	/**
	 * Set a field's value.
	 * @param key Field name
	 * @param value Value to set
	 */
	setField: (key: string, value: string) => void;
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
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Record<string, string>;
};
