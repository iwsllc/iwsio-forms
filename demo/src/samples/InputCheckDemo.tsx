/* eslint-disable jsx-a11y/label-has-associated-control */
import { FieldError, Input } from '@iwsio/forms'
import { FormEventHandler, useRef, useState } from 'react'

export const InputCheckDemo = () => {
	const refForm = useRef<HTMLFormElement>(null)
	const [success, setSuccess] = useState(false)

	const [checked, setChecked] = useState(false)
	const [selectedRadio, setSelectedRadio] = useState('')

	const [checkError, setCheckError] = useState<FieldError | undefined>()
	const [radioError, setRadioError] = useState<FieldError | undefined>()

	const reset = () => {
		setSuccess(false)
		setCheckError(undefined)
		setRadioError(undefined)
		setChecked(false)
		setSelectedRadio('')
	}

	// validation is handled automatically with form submit event.
	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		setSuccess(true)
	}

	return (
		<form className="not-prose" onSubmit={handleSubmit} ref={refForm}>
			<fieldset className="border-2 p-5">
				<legend>Checkbox</legend>
				<div className="flex flex-row">
					<label className="label gap-2">
						<span className="label-text">Did you see the example?</span>
						<Input
							onChange={e => setChecked(e.target.checked)}
							value="true"
							type="checkbox"
							checked={checked}
							name="field"
							fieldError={checkError}
							onFieldError={(key, validity, message) => { setCheckError({ message, validity }) }}
							className="checkbox"
							required
						/>
					</label>
				</div>
			</fieldset>
			<fieldset className="border-2 p-5">
				<legend>Options</legend>
				<div className="flex flex-row">
					<label className="label gap-2">
						<span className="label-text">Yes</span>
						<Input
							onChange={e => setSelectedRadio(e.target.value)}
							value="yes"
							name="field2"
							type="radio"
							checked={selectedRadio === 'yes'}
							fieldError={radioError}
							onFieldError={(key, validity, message) => { setRadioError({ message, validity }) }}
							required
						/>
					</label>
					<label className="label gap-2">
						<span className="label-text">No</span>
						<Input
							onChange={e => setSelectedRadio(e.target.value)}
							value="no"
							type="radio"
							name="field2"
							checked={selectedRadio === 'no'}
							fieldError={radioError}
							onFieldError={(key, validity, message) => { setRadioError({ message, validity }) }}
							required
						/>
					</label>
				</div>
			</fieldset>
			<p className="text-sm">
				<em>
					Try
					<code>abc</code>
					{' '}
					for custom error,
					<strong>blank</strong>
					{' '}
					for required, or any
					<strong>non-alpha</strong>
					{' '}
					for pattern check.
				</em>
			</p>
			<p className="flex flex-row justify-end gap-2">
				<button type="reset" className="btn btn-secondary" onClick={() => reset()}>Reset</button>
				<button type="submit" className={`btn ${success ? 'btn-success' : 'btn-primary'}`}>Submit</button>
			</p>
		</form>
	)
}
