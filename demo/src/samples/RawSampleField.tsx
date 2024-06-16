import { FC, FormEventHandler, ReactNode, useState } from 'react'
import { FieldManager } from '@iwsio/forms'

export const RawSampleField: FC<{children?: ReactNode, title?: string, label?: string, help?: ReactNode}> = ({ children, title, label, help }) => {
	const [success, setSuccess] = useState(false)

	const handleSubmit = (_fields: Record<string, any>) => {
		setSuccess(true)
		// do something with fields
	}

	const handleReset: FormEventHandler<HTMLFormElement> = () => {
		setSuccess(false)
	}

	return (
		<FieldManager fields={{ field: '', field2: '', field3: '' }} onValidSubmit={handleSubmit} className="flex flex-col" nativeValidation onReset={handleReset}>
			<fieldset className="border-2 p-5 flex flex-col gap-2">
				<legend>{title}</legend>

				<label className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
					<span className="label-text">{label}</span>
					{children}
				</label>
				{help && <small className="flex flex-row justify-end">{help}</small>}

				<div className="flex flex-row justify-end gap-3">
					<button className="btn" type="reset">Reset</button>
					<button className={`btn ${success ? 'btn-success' : ''}`} type="submit" onClick={() => setSuccess(false)}>{success && 'Success!!'}{!success && 'Submit'}</button>
				</div>
			</fieldset>
		</FieldManager>
	)
}
