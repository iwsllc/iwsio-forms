import { FC, FormEventHandler, PropsWithChildren, ReactNode, useState } from 'react'
import { FieldManager, useFieldManager } from '@iwsio/forms'

export const Field: FC<PropsWithChildren & {name: string, label: string}> = ({ children, label }) => {
	const { fieldErrors } = useFieldManager()
	const error = fieldErrors.field
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

	const handleSubmit = (_fields: Record<string, any>) => {
		setSuccess(true)
		// do something with fields
	}

	const handleReset: FormEventHandler<HTMLFormElement> = (_e) => {
		setSuccess(false)
	}

	return (
		<FieldManager fields={{ field: '' }} onValidSubmit={handleSubmit} className="flex flex-col" onReset={handleReset}>
			<fieldset className="border-2 p-5">
				<legend>{title}</legend>

				<Field name="field" label={label}>{children}</Field>
				{help && <small className="flex flex-row justify-end">{help}</small>}

				<div className="flex flex-row justify-end gap-3">
					<button className="btn" type="reset">Reset</button>
					<button className={`btn ${success ? 'btn-success' : ''}`} type="submit">{success && 'Success!!'}{!success && 'Submit'}</button>
				</div>
			</fieldset>
		</FieldManager>
	)
}
