import { PropsWithChildren, forwardRef } from 'react'
import { FieldManagerContext } from './FieldManagerContext'
import { useFieldState } from './useFieldState'
import { FieldManagerForm } from './FieldManagerForm'
import { ValidatedFormProps } from './ValidatedForm'
import { FieldValues } from './types'

export type FieldManagerProps = PropsWithChildren & {
	fields: FieldValues
	defaultValues?: Record<string, string>
	onValidSubmit?: (fields: FieldValues) => void
} & Omit<ValidatedFormProps, 'onValidSubmit'>

/**
 * Setup a field manager to maintain field values and validation state in a form. This directly renders a <form> with attributes provided to this component.
 *
 * `onValidSubmit`: provides calls on submit when form is valid and provides current fields with values.
 * `ref` here will give access to the HTML Form element rendered.
 */
export const FieldManager = forwardRef<HTMLFormElement, FieldManagerProps>(({ children, fields, defaultValues, onValidSubmit, ...props }, ref) => {
	const fieldState = useFieldState(fields, defaultValues, onValidSubmit)
	return (
		<FieldManagerContext.Provider value={fieldState}>
			<FieldManagerForm ref={ref} {...props}>
				{children}
			</FieldManagerForm>
		</FieldManagerContext.Provider>
	)
})
FieldManager.displayName = 'FieldManager'
