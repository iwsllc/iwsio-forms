import { FieldManager, FieldValues } from '@iwsio/forms'
import { FormEventHandler, PropsWithChildren, ReactNode, useState } from 'react'

export const RawSampleField = ({ children, title, label, help }: PropsWithChildren<{ title?: string, label?: string, help?: ReactNode }>) => {
	const [success, setSuccess] = useState(false)

	const handleSubmit = (_fields: FieldValues) => {
		setSuccess(true)
		// do something with fields
	}

	const handleReset: FormEventHandler<HTMLFormElement> = () => {
		setSuccess(false)
	}

	return (
		<FieldManager fields={{ field: '', field2: '', field3: '' }} onValidSubmit={handleSubmit} className="flex flex-col" nativeValidation onReset={handleReset}>
			<fieldset className="flex flex-col gap-2 border-2 p-5">
				<legend>{title}</legend>

				<label className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
					<span className="label-text">{label}</span>
					{children}
				</label>
				{help && <small className="flex flex-row justify-end">{help}</small>}

				<div className="flex flex-row justify-end gap-3">
					<button className="btn" type="reset">Reset</button>
					<button className={`btn ${success ? 'btn-success' : ''}`} type="submit" onClick={() => setSuccess(false)}>
						{success && 'Success!!'}
						{!success && 'Submit'}
					</button>
				</div>
			</fieldset>
		</FieldManager>
	)
}
