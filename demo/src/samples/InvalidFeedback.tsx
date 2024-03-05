import { FieldManager, InputField, InvalidFeedbackForField, useFieldManager, ErrorMapping, emptyValidity } from '@iwsio/forms'
import { FC, useState } from 'react'

// NOTE: leaving customError excluded so they report directly as-is.
const mapping: ErrorMapping = {
	badInput: 'Invalid',
	patternMismatch: 'Invalid',
	rangeOverflow: 'Too high',
	rangeUnderflow: 'Too low',
	stepMismatch: 'Invalid',
	tooLong: 'Too long',
	tooShort: 'Too short',
	typeMismatch: 'Invalid',
	valueMissing: 'Required'
}

/**
 * In this example, we render a text input field and apply custom onChange validation rules to treat it like a number.
 */
export const Field: FC<{name: string}> = ({ name }) => {
	const { checkFieldError, setFieldError } = useFieldManager()
	const fieldError = checkFieldError(name)

	// this change event invokes AFTER the field manager change handler; so the state should be updated with a value along with any validity state from the base input
	const handleChange = (e) => {
		// NOTE: dont' reference state here, it could be out of sync w/ the field manager
		if (!e.target.validity.valid) return // already failed; likely required or pattern mismatch
		// parsed
		// text value treated like a number; another way of handling step/min/max
		const value = +e.target.value
		if (isNaN(value)) return setFieldError(name, 'Invalid') // numeric: handled as custom error
		if (value < 2) return setFieldError(name, 'Too low') // range low: handled as custom error
		if (value > 99) return setFieldError(name, 'Too high') // range high: handled as custom error
		if (value % 1 !== 0) return setFieldError(name, 'Invalid') // step rules: handled as custom error
	}

	return (
		<>
			<div className="form-control w-1/2">
				<div className="indicator w-full">
					<InputField name={name} required className={`input input-bordered w-full ${fieldError ? 'input-error' : ''}`} type="text" pattern="^[\d\.]+$" onChange={handleChange} />
					<InvalidFeedbackForField name={name} className="indicator-item badge badge-error" />
				</div>
				<label className="label">
					<span className="label-text-alt">Text input with onChange custom valdiation; Required value:<code>number &gt; 1 and &lt; 100, step: 1</code></span>
				</label>
			</div>
			<p className="mt-0">This nuanced approach above shows a more responsive interaction. Try: <code>submit</code>, then enter: <code>.1</code> <em>(shows Too low)</em>, <code>backspace</code> <em>(will show invalid)</em>, <code>backspace</code> <em>(shows required)</em></p>
			<p className="m-0"><code>&lt;input type="number"&gt;</code> (below) does not do this. It only triggers onChange with number value differences and remains "Invalid" after clearing the text.</p>
		</>
	)
}

/**
 * This example shows a simple input type="number" with min, max, and step validation
 */
export const Field2: FC<{name: string}> = ({ name }) => {
	const { checkFieldError } = useFieldManager()
	const fieldError = checkFieldError(name)

	return (
		<div className="form-control w-1/2">
			<div className="indicator w-full">
				<InputField name={name} required className={`input input-bordered w-full ${fieldError ? 'input-error' : ''}`} type="number" step="1" min="2" max="99" />
				<InvalidFeedbackForField name={name} className="indicator-item badge badge-error" />
			</div>
			<label className="label">
				<span className="label-text-alt">Number input using min, max, and step validation. Required value:<code>number &gt; 1 and &lt; 100, step: 1</code></span>
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
		// happens before validation
		setSuccess(false)
	}
	const handleValidSubmit = (_fields: any) => {
		// happens after validation and when valid
		setSuccess(true)
	}
	return (
		<FieldManager fields={{ field: '', field2: '' }} onValidSubmit={handleValidSubmit} onSubmit={handleSubmit} onReset={() => setSuccess(false)} errorMapping={mapping}>
			<fieldset className="border p-5">
				<legend>Invalid Feedback</legend>
				<div className="flex flex-col gap-5">
					<Field name="field" />
					<Field2 name="field2" />
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
