import { type ComponentProps, type SubmitEventHandler, useMemo, useState } from 'react'

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
	/**
	 * Controls the `was-validated` class. Leave unset and the form tracks it itself: on after a
	 * submit, off after a native reset. `FieldManagerForm` sets it from field state's
	 * `reportValidation`, so `fieldState.reset()` clears it too.
	 */
	validated?: boolean
}

export const ValidatedForm = ({
	children,
	onValidSubmit,
	onReset,
	reportValidity = false,
	onSubmit,
	nativeValidation = false,
	className = '',
	validated,
	...props
}: ValidatedFormProps) => {
	const [localSubmitted, setSubmitted] = useState(false)
	const submitted = validated ?? localSubmitted

	const onLocalSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault()
		onSubmit?.(event)
		const form = event.target as HTMLFormElement
		setSubmitted(true)
		if (form.checkValidity()) {
			onValidSubmit?.()
		}
		if (reportValidity) form.reportValidity()
	}

	const handleReset: SubmitEventHandler<HTMLFormElement> = (e) => {
		setSubmitted(false)
		if (onReset != null) onReset(e)
	}

	const classNames = useMemo(() => {
		return `${className} ${submitted ? 'was-validated' : ''} ${!submitted ? 'needs-validation' : ''}`
	}, [className, submitted])

	return (
		<form
			{...props}
			onSubmit={onLocalSubmit}
			onReset={handleReset}
			className={classNames}
			noValidate={!nativeValidation}
		>
			{children}
		</form>
	)
}
