import { forwardRef } from 'react'
import { useFieldManager } from './useFieldManager'
import { ValidatedForm, ValidatedFormProps } from './ValidatedForm'
import { FieldValues } from './types'

export type FieldManagerFormProps = Omit<ValidatedFormProps, 'onValidSubmit' | 'noValidate'> & {
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
}

export const FieldManagerForm = forwardRef<HTMLFormElement, FieldManagerFormProps>(({ children, onValidSubmit, holdBusyAfterSubmit, reportValidity = false, nativeValidation = false, className = '', ...props }, ref) => {
	const { fields, setReportValidation, toggleFormBusy } = useFieldManager()
	const handleLocalSubmit = () => {
		setReportValidation(true)
	}
	// no args; this comes from ValidatedForm
	const handleLocalValidSubmit = () => {
		toggleFormBusy(true)
		if (onValidSubmit != null) {
			onValidSubmit(fields)
		}
		if (holdBusyAfterSubmit) return
		toggleFormBusy(false)
	}
	return <ValidatedForm ref={ref} {...props} nativeValidation={nativeValidation} reportValidity={reportValidity} className={className} onValidSubmit={handleLocalValidSubmit} onSubmit={handleLocalSubmit}>{children}</ValidatedForm>
})

FieldManagerForm.displayName = 'FieldManagerForm'
