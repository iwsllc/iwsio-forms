import { ComponentProps, FormEventHandler, useMemo, useState } from 'react'

export interface ValidatedFormProps extends Omit<ComponentProps<'form'>, 'noValidate'> {
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
}

export const ValidatedForm = ({ children, onValidSubmit, onReset, reportValidity = false, onSubmit, nativeValidation = false, className = '', ...props }: ValidatedFormProps) => {
	const [submitted, setSubmitted] = useState(false)

	const onLocalSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault()
		onSubmit?.(event)
		const form = event.target as HTMLFormElement
		setSubmitted(true)
		if (form.checkValidity()) {
			onValidSubmit?.()
		}
		if (reportValidity) form.reportValidity()
	}

	const handleReset: FormEventHandler<HTMLFormElement> = (e) => {
		setSubmitted(false)
		if (onReset != null) onReset(e)
	}

	const classNames = useMemo(() => {
		return `${className} ${submitted ? 'was-validated' : ''} ${!submitted ? 'needs-validation' : ''}`
	}, [className, submitted])

	return (
		<form {...props} onSubmit={onLocalSubmit} onReset={handleReset} className={classNames} noValidate={!nativeValidation}>
			{children}
		</form>
	)
}
