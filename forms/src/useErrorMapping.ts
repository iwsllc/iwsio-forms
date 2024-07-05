/**
 * Overrides input validation message with custom message. When undefined, the default message will be used.
 */
export type ErrorMapping = {
	badInput?: string
	/**
		 * Override custom error to display. If not provided, the default message will be used.
		 */
	customError?: string
	patternMismatch?: string
	rangeOverflow?: string
	rangeUnderflow?: string
	stepMismatch?: string
	tooLong?: string
	tooShort?: string
	typeMismatch?: string
	valueMissing?: string
}

export const useErrorMapping = (mapping?: ErrorMapping | undefined) => {
	const mapError = (validity: ValidityState, message: string | undefined) => {
		if (mapping == null) return message
		if (validity.valid) return undefined
		if (validity.badInput) return mapping.badInput ?? message
		if (validity.customError) return mapping.customError ?? message
		if (validity.patternMismatch) return mapping.patternMismatch ?? message
		if (validity.rangeOverflow) return mapping.rangeOverflow ?? message
		if (validity.rangeUnderflow) return mapping.rangeUnderflow ?? message
		if (validity.stepMismatch) return mapping.stepMismatch ?? message
		if (validity.tooLong) return mapping.tooLong ?? message
		if (validity.tooShort) return mapping.tooShort ?? message
		if (validity.typeMismatch) return mapping.typeMismatch ?? message
		if (validity.valueMissing) return mapping.valueMissing ?? message
		return undefined
	}
	return mapError
}
