import { FormEventHandler, FormHTMLAttributes, PropsWithChildren, forwardRef, useMemo, useState } from 'react'
import { useForwardRef } from './useForwardRef'

export type ValidatedFormProps = {
	/**
	 * Invokes when submit event triggered and form has been validated and is valid.
	 * @param fields Current values stored in field state.
	 */
	onValidSubmit?: () => void
	/**
	 * Trigger report validity on every submission? Default: false
	 */
	reportValidity?: boolean
	/**
	 * When true, relies on native browser validation. In other words: it toggles `noValidate` on the `<form/>`. When false, `noValidate` is true.
	 */
	nativeValidation?: boolean
} & FormHTMLAttributes<HTMLFormElement> & PropsWithChildren

export const ValidatedForm = forwardRef<HTMLFormElement, ValidatedFormProps>(({ children, onValidSubmit, onSubmit, onReset, reportValidity = false, nativeValidation = false, className = '', ...props }, ref) => {
	const refForm = useForwardRef<HTMLFormElement>(ref)
	const [validatedClassName, setValidatedClassName] = useState('needs-validation')
	// TODO: setup context API to track THIS form's validation state. This allows consumers elsewhere to report it.

	/**
	 * Bootstrappiness: needs-validation, was-validated
	 */
	const consolidatedClassName = useMemo(() => `${validatedClassName}${className != null ? ' ' + className : ''}`, [className, validatedClassName])

	const onLocalSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault()
		const form = refForm.current
		setValidatedClassName(() => 'was-validated')
		if (onSubmit != null) onSubmit(event)
		if (form.checkValidity()) {
			if (onValidSubmit != null) onValidSubmit()
		}
		if (reportValidity) form.reportValidity()
	}

	const handleReset: FormEventHandler<HTMLFormElement> = (e) => {
		setValidatedClassName('needs-validation')
		if (onReset != null) onReset(e)
	}

	return (
		<form ref={refForm} onSubmit={onLocalSubmit} onReset={handleReset} className={consolidatedClassName} noValidate={!nativeValidation} {...props}>
			{children}
		</form>
	)
})
ValidatedForm.displayName = 'ValidatedForm'
