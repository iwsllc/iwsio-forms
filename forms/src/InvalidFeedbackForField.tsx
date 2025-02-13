import { ComponentProps } from 'react'

import { useFieldManager } from './useFieldManager.js'

export interface InvalidFeedbackForFieldProps extends ComponentProps<'span'> {
	name: string
}

/**
 * Returns a simple <span/> containing the error if one exists while `reportValidation` in field state is `true`.
 * @returns
 */
export const InvalidFeedbackForField = ({ name, ...props }: InvalidFeedbackForFieldProps) => {
	const { checkFieldError } = useFieldManager()
	const error = checkFieldError(name)
	return <>{error && <span {...props}>{error}</span>}</>
}
