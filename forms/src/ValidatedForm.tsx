import React, { FormEventHandler, FormHTMLAttributes, forwardRef, useMemo, useState } from 'react'
import { useForwardRef } from './useForwardRef'
import { ChildrenProp } from './types'

export type ValidatedFormProps = {
	onValidSubmit: () => void
	reportValidity?: boolean,
	nativeValidation?: boolean
} & FormHTMLAttributes<HTMLFormElement> & ChildrenProp

export const ValidatedForm = forwardRef<HTMLFormElement, ValidatedFormProps>(({ children, onValidSubmit, className, reportValidity, nativeValidation, onReset, ...props }, ref) => {
	const refForm = useForwardRef<HTMLFormElement>(ref)
	const [validatedClassName, setValidatedClassName] = useState('needs-validation')
	// TODO: setup context API to track THIS form's validation state. This allows consumers elsewhere to report it.

	/**
	 * Bootstrappiness: needs-validation, was-validated
	 */
	const consolidatedClassName = useMemo(() => `${validatedClassName}${className != null ? ' ' + className : ''}`, [className, validatedClassName])

	const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault()
		const form = refForm.current
		setValidatedClassName(() => 'was-validated')
		if (form.checkValidity()) {
			if (onValidSubmit) onValidSubmit()
		}
		if (reportValidity) form.reportValidity()
	}

	const handleReset: FormEventHandler<HTMLFormElement> = (e) => {
		setValidatedClassName('needs-validation')
		if (onReset != null) onReset(e)
	}

	return (
		<form ref={refForm} onSubmit={onSubmit} onReset={handleReset} className={consolidatedClassName} noValidate={!nativeValidation} {...props}>
			{children}
		</form>
	)
})
ValidatedForm.displayName = 'ValidatedForm'

ValidatedForm.defaultProps = {
	reportValidity: false,
	nativeValidation: false,
	className: ''
}
