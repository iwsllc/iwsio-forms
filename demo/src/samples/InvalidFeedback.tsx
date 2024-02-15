import { FieldManager, InputField, InvalidFeedbackForField, useFieldManager, ErrorMapping } from '@iwsio/forms'
import { useState } from 'react'

const mapping: ErrorMapping = {
	badInput: 'Invalid',
	customError: 'Invalid',
	patternMismatch: 'Invalid',
	rangeOverflow: 'Too high',
	rangeUnderflow: 'Too low',
	stepMismatch: 'Invalid',
	tooLong: 'Too long',
	tooShort: 'Too short',
	typeMismatch: 'Invalid',
	valueMissing: 'Required'
}

export const Field = () => {
	const { checkFieldError } = useFieldManager()
	const fieldError = checkFieldError('field')

	return (
		<div className="form-control">
			<div className="indicator">
				<InputField name="field" required className={`input input-bordered ${fieldError ? 'input-error' : ''}`} pattern="^[a-zA-Z]+$" minLength={2} />
				<InvalidFeedbackForField name="field" className="indicator-item badge badge-error" />
			</div>
			<label className="label">
				<span className="label-text-alt">Required pattern:<code>^[a-zA-Z]+$</code></span>
			</label>
		</div>
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
		<FieldManager fields={{ field: '' }} onValidSubmit={handleValidSubmit} onSubmit={handleSubmit} onReset={() => setSuccess(false)} errorMapping={mapping}>
			<fieldset className="border p-5">
				<legend>Invalid Feedback</legend>
				<div className="flex flex-col gap-5">
					<Field />
					<div className="flex flex-row gap-4">
						<ResetButton />
						<button type="submit" className={`btn ${success ? 'btn-success' : ''}`}>Submit</button>
					</div>
					<p><em>Submit with empty or any non-alpha character for error.</em></p>
				</div>
			</fieldset>
		</FieldManager>
	)
}
