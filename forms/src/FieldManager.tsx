import { PropsWithChildren, forwardRef } from 'react'
import { FieldManagerContext } from './FieldManagerContext'
import { useFieldState } from './useFieldState'
import { FieldManagerForm } from './FieldManagerForm'
import { ValidatedFormProps } from './ValidatedForm'
import { FieldValues } from './types'

export type FieldManagerProps = PropsWithChildren & {
	/**
	 * Initial field values to setup the form with. If you want to change these after initialization, use the `setFieldValues` method from the `useFieldManager` hook.
	 */
	fields: FieldValues
	/**
	 * Initial default values to setup the form with. If you want to change these after initialization, use the `setDefaultValues` method from the `useFieldManager` hook.
	 */
	defaultValues?: Record<string, string>
	/**
	 * Callback to be called when form is valid and submitted. Provides current field values.
	 */
	onValidSubmit?: (fields: FieldValues) => void
} & Omit<ValidatedFormProps, 'onValidSubmit' | 'noValidate'>

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

export type ControlledFieldManagerProps = Omit<FieldManagerProps, 'fields' | 'defaultValues' | 'onValidSubmit'> & { fieldState: ReturnType<typeof useFieldState>}

/**
 * Use this component if you want to manage field state remotely. This is useful when you're setting up form context elswhere and want the field values to change from outside input interactions.
 */
export const ControlledFieldManager = forwardRef<HTMLFormElement, ControlledFieldManagerProps>(({ children, fieldState, ...props }, ref) => {
	return (
		<FieldManagerContext.Provider value={fieldState}>
			<FieldManagerForm ref={ref} {...props}>
				{children}
			</FieldManagerForm>
		</FieldManagerContext.Provider>
	)
})
ControlledFieldManager.displayName = 'ControlledFieldManager'
