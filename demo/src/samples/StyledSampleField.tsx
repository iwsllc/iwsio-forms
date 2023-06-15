import React, { FC, FormEventHandler, ReactNode, useState } from 'react'
import { ChildrenProp, FieldManager, ValidatedForm, useFieldManager, useFieldState } from '@iwsio/forms'

// NOTE: use context API to transient setup access to onChange, name, value, checked, etc.

export const Field: FC<ChildrenProp & {name: string, label: string}> = ({ children, name, label }) => {
	const { errors } = useFieldManager()
	const error = errors.field
	const isInvalid = error != null && error.length > 0

	return (
		<label className={`flex flex-row items-center gap-5 form-control ${isInvalid ? 'has-error' : ''}`}>
			<span className="label-text">{label}</span>
			{children}
		</label>

	)
}

export const StyledSampleField: FC<{children?: ReactNode, title?: string, label?: string, help?: ReactNode}> = ({ children, title, label, help }) => {
	const [success, setSuccess] = useState(false)
	const form = useFieldState({ field: '' })
	const { reset } = form

	const handleSubmit = () => {
		setSuccess(true)
	}

	const handleReset: FormEventHandler<HTMLFormElement> = (e) => {
		setSuccess(false)
		if (reset != null) reset()
	}

	return (
		<FieldManager form={form}>
			<ValidatedForm onValidSubmit={handleSubmit} className="flex flex-col" onReset={handleReset}>
				<fieldset className="border-2 p-5">
					<legend>{title}</legend>

					<Field name="field" label={label}>{children}</Field>
					{help && <small className="flex flex-row justify-end">{help}</small>}

					<div className="flex flex-row justify-end gap-3">
						<button className="btn" type="reset">Reset</button>
						<button className={`btn ${success ? 'btn-success' : ''}`} type="submit">{success && 'Success!!'}{!success && 'Submit'}</button>
					</div>
				</fieldset>
			</ValidatedForm>
		</FieldManager>
	)
}

// export default DemoForm1
