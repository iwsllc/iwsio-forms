import { FieldManager, InputField, ValidatedForm, useFieldManager, useFieldState } from '@iwsio/forms'
import React, { useState } from 'react'

export const InvalidFeedbackLabel = ({ children }) => <label className="peer-invalid:visible text-error font-light">{children}</label>

export const Fields = () => {
	const { fieldErrors } = useFieldManager()
	return (
		<label className="flex flex-row gap-4 items-center">
			Generic field:
			<InputField name="field" required className="input input-bordered" /> {/** value, checked, onChange, fieldError, etc are all automatically bound in InputField; regular <input/> requires bindings **/}
			{/** Here, we're placing feedback dom adjacent to field **/}
			{fieldErrors?.field && <InvalidFeedbackLabel>{fieldErrors.field}</InvalidFeedbackLabel>}
		</label>
	)
}

export const InvalidFeedbackDemo = () => {
	const [success, setSuccess] = useState(false)
	const fieldState = useFieldState({ field: '' })
	const { setField } = fieldState
	const handleSubmit = () => {
		setSuccess(true)
	}
	const reset = () => {
		setField('field', '')
		setSuccess(false)
	}
	return (
		<FieldManager fieldState={fieldState}> {/** FieldManager just shares fieldState **/}
			<ValidatedForm onValidSubmit={handleSubmit}>
				<fieldset className="border p-5 flex flex-col gap-5">
					<legend>Invalid Feedback</legend>
					<Fields />
					<div className="flex flex-row gap-4">
						<button type="reset" className="btn" onClick={() => reset()}>Reset</button>
						<button type="submit" className={`btn ${success ? 'btn-success' : ''}`}>Submit</button>
					</div>
				</fieldset>
			</ValidatedForm>
		</FieldManager>
	)
}
