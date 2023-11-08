import { FieldManager, InputField, useFieldManager } from '@iwsio/forms'
import { useMemo, useState } from 'react'

export const InvalidFeedbackLabel = ({ children }) => <label className="peer-invalid:visible font-light">{children}</label>

export const Field = () => {
	const { fieldErrors } = useFieldManager()
	const hasError = useMemo(() => fieldErrors.field != null, [fieldErrors])

	return (
		<label className={`flex flex-row gap-4 items-center ${hasError ? 'text-error' : ''}`}>
			Generic field:
			<InputField name="field" required className={`input input-bordered ${hasError ? 'input-error' : ''}`} />
			{hasError && <InvalidFeedbackLabel>{fieldErrors.field}</InvalidFeedbackLabel>}
		</label>
	)
}

export const ResetButton = () => {
	const { reset } = useFieldManager()
	return <button type="reset" className="btn" onClick={() => reset()}>Reset</button>
}
export const InvalidFeedbackDemo = () => {
	const [success, setSuccess] = useState(false)
	const handleSubmit = () => {
		setSuccess(false)
	}
	const handleValidSubmit = (_fields: any) => {
		setSuccess(true)
	}
	return (
		<FieldManager fields={{ field: '' }} onValidSubmit={handleValidSubmit} onSubmit={handleSubmit}>
			<fieldset className="border p-5">
				<legend>Invalid Feedback</legend>
				<div className="flex flex-col gap-5">
					<Field />
					<div className="flex flex-row gap-4">
						<ResetButton />
						<button type="submit" className={`btn ${success ? 'btn-success' : ''}`}>Submit</button>
					</div>
					<p><em>Submit with empty for error</em></p>
				</div>
			</fieldset>
		</FieldManager>
	)
}
