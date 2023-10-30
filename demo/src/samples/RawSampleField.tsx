import { FC, FormEventHandler, ReactNode, useState } from 'react'
import { FieldManager, ValidatedForm, useFieldState } from '@iwsio/forms'

// NOTE: use context API to transient setup access to onChange, name, value, checked, etc.

export const RawSampleField: FC<{children?: ReactNode, title?: string, label?: string, help?: ReactNode}> = ({ children, title, label, help }) => {
	const [success, setSuccess] = useState(false)
	const fieldState = useFieldState({ field: '', field2: '', field3: '' })
	const { reset } = fieldState

	const handleSubmit = () => {
		setSuccess(true)
	}

	const handleReset: FormEventHandler<HTMLFormElement> = () => {
		setSuccess(false)
		if (reset != null) reset()
	}

	return (
		<FieldManager fieldState={fieldState}>
			<ValidatedForm onValidSubmit={handleSubmit} className="flex flex-col" nativeValidation onReset={handleReset}>
				<fieldset className="border-2 p-5">
					<legend>{title}</legend>

					<label className="flex flex-row items-center gap-5">
						<span className="label-text">{label}</span>
						{children}
					</label>
					{help && <small className="flex flex-row justify-end">{help}</small>}

					<div className="flex flex-row justify-end gap-3">
						<button className="btn" type="reset">Reset</button>
						<button className={`btn ${success ? 'btn-success' : ''}`} type="submit" onClick={() => setSuccess(false)}>{success && 'Success!!'}{!success && 'Submit'}</button>
					</div>
				</fieldset>
			</ValidatedForm>
		</FieldManager>
	)
}
