import { ChangeEventHandler, useRef, useState } from 'react'
import { FieldError, Input } from '@iwsio/forms'

export const InputDemo = () => {
	const refForm = useRef<HTMLFormElement>(null)
	const [success, setSuccess] = useState(false)
	const [text, setText] = useState('')
	// Keep track of validation state. (This will be the first error, if any, encountered in browser validation)
	const [fieldError, setFieldError] = useState<FieldError | undefined>(undefined)

	const reset = () => {
		setSuccess(false)
		setFieldError(undefined)
		setText('')
	}

	// validation is handled automatically with form submit event.
	const handleSubmit = (e) => {
		e.preventDefault()
		setSuccess(true)
	}

	// Handle the form validation manually
	const handleButton = () => {
		if (refForm.current.checkValidity()) {
			setSuccess(true)
		}
		else refForm.current.reportValidity()
	}

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setSuccess(false)
		setText(e.target.value)
		if (e.target.value === 'abc') setFieldError({ message: 'cannot use abc', validity: { customError: true, valid: false } as any })
	}

	return (
		<form className="flex flex-col gap-4 not-prose" onSubmit={handleSubmit} ref={refForm}>
			<div className="flex flex-row">
				<table className="table">
					<thead>
						<tr>
							<th>Error state</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>{fieldError?.message ?? 'undefined'}</code></td>
						</tr>
					</tbody>
				</table>
			</div>
			<Input
				className="input input-bordered"
				onChange={handleChange}
				value={text}
				name="field"
				required
				pattern="^[a-zA-Z]+$"
				fieldError={fieldError}
				onFieldError={(key, validity, message) => { setFieldError({ message, validity }) }}
			/>
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
				<button type="button" className="btn btn-secondary" onClick={reset}>Reset</button>
				<button type="submit" className={`btn ${success ? 'btn-success' : 'btn-primary'}`}>Submit</button>

				{/* Intentionally hidden; just an example of using button click handler to validate the form. */}
				<button type="button" onClick={handleButton} className={`hidden btn ${success ? 'btn-success' : 'btn-primary'}`}>Manual check</button>
			</p>
		</form>
	)
}
