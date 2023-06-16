import { FieldManager, InputField, ValidatedForm, useFieldManager, useFieldState } from '@iwsio/forms'
import React, { useMemo, useState } from 'react'

export const InvalidFeedbackLabel = ({ children }) => <label className="peer-invalid:visible font-light">{children}</label>

export const Field = () => {
	const { fieldErrors } = useFieldManager()
	const hasError = useMemo(() => fieldErrors?.field != null, [fieldErrors])

	return (
		<label className={`flex flex-row gap-4 items-center ${hasError ? 'text-error' : ''}`}>
			Generic field:
			<InputField name="field" required className={`input input-bordered ${hasError ? 'input-error' : ''}`} /> {/** value, checked, onChange, fieldError, etc are all automatically bound in InputField; regular <input/> requires bindings **/}
			{/** Here, we're placing feedback dom adjacent to field **/}
			{fieldErrors?.field && <InvalidFeedbackLabel>{fieldErrors.field}</InvalidFeedbackLabel>}
		</label>
	)
}

export const InvalidFeedbackDemo = () => {
	const [success, setSuccess] = useState(false)
	const fieldState = useFieldState({ field: '' })
	const { reset } = fieldState
	const handleSubmit = () => {
		setSuccess(true)
	}
	const resetForm = () => {
		reset()
		setSuccess(false)
	}
	return (
		<FieldManager fieldState={fieldState}> {/** FieldManager just shares fieldState **/}
			<ValidatedForm onValidSubmit={handleSubmit}>
				<fieldset className="border p-5">
					<legend>Invalid Feedback</legend>
					<div className="flex flex-col gap-5">
						<Field />
						<div className="flex flex-row gap-4">
							<button type="reset" className="btn" onClick={() => resetForm()}>Reset</button>
							<button type="submit" className={`btn ${success ? 'btn-success' : ''}`}>Submit</button>
						</div>
						<p><em>Submit with empty for error</em></p>
					</div>
				</fieldset>
			</ValidatedForm>
		</FieldManager>
	)
}
