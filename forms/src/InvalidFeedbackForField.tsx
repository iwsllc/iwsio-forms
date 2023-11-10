import { FC, HTMLAttributes } from 'react'
import { useFieldManager } from './useFieldManager'

export type InvalidFeedbackForFieldProps = {
	name: string
} & HTMLAttributes<HTMLSpanElement>

/**
 * Returns a simple <span/> containing the error if one exists while `reportValidation` in field state is `true`.
 * @returns
 */
export const InvalidFeedbackForField: FC<InvalidFeedbackForFieldProps> = ({ name, ...props }) => {
	const { checkFieldError } = useFieldManager()
	const error = checkFieldError(name)

	return <>{error && <span {...props}>{error}</span>}</>
}
