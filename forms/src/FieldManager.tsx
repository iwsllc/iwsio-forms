import { PropsWithChildren, forwardRef } from 'react'
import { FieldManagerContext } from './FieldManagerContext'
import { useFieldState } from './useFieldState'
import { FieldManagerForm } from './FieldManagerForm'
import { ValidatedFormProps } from './ValidatedForm'
import { FieldValues } from './types'
import { ErrorMapping } from './useErrorMapping'

export type FieldManagerProps = Omit<ValidatedFormProps, 'onValidSubmit' | 'noValidate'> &
	PropsWithChildren<{
		/**
		 * Initial field values to setup the form with. If you want to change these after initialization, use the `setFieldValues` method from the `useFieldManager` hook.
		 */
		fields: FieldValues
		/**
		 * Initial default values to setup the form with. If you want to change these after initialization, use the `setDefaultValues` method from the `useFieldManager` hook.
		 */
		defaultValues?: Record<string, string>

		/**
		 * Error mapping to be used for validation. If not provided, default error messages are used.
		 */
		errorMapping?: ErrorMapping
		/**
		 * Callback to be called when form is valid and submitted. Provides current field values.
		 */
		onValidSubmit?: (fields: FieldValues) => void
		/**
		 * If true, the form will be set to busy after a valid submit event is triggered and wait for `toggleBusy` to be called with a value of `false` to reset.
		 * This is useful for forms that need to wait for a server response before allowing another submit.
		 * Default value: false
		 */
		holdBusyAfterSubmit?: boolean
	}>

/**
 * Setup a field manager to maintain field values and validation state in a form. This directly renders a <form> with attributes provided to this component.
 *
 * `onValidSubmit`: provides calls on submit when form is valid and provides current fields with values.
 * `ref` here will give access to the HTML Form element rendered.
 */
export const FieldManager = forwardRef<HTMLFormElement, FieldManagerProps>(({ children, fields, defaultValues, errorMapping, ...props }, ref) => {
	const fieldState = useFieldState(fields, { defaultValues, errorMapping })

	return (
		<FieldManagerContext.Provider value={fieldState}>
			<FieldManagerForm ref={ref} {...props}>
				{children}
			</FieldManagerForm>
		</FieldManagerContext.Provider>
	)
})
FieldManager.displayName = 'FieldManager'
