import { FieldErrorHandler, Input, ValidatedForm } from '@iwsio/forms'
import classNames from 'classnames'
import { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react'

const Form = ({ setSuccess, success }: { success: boolean, setSuccess: Dispatch<SetStateAction<boolean>> }) => {
	const [value, setValue] = useState('')
	const [fieldError, setFieldError] = useState<{ message: string | undefined, validity: ValidityState } | undefined>()

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setValue(e.target.value)
		setFieldError(undefined)
		setSuccess(false)
		if (e.target.value === 'abc') {
			e.target.setCustomValidity('Cannot use abc.')
		}
	}

	const handleFieldError: FieldErrorHandler = (key, validity, message) => {
		setFieldError({ message, validity })
	}

	const reset = () => {
		setValue('')
		setFieldError(undefined)
		setSuccess(false)
	}

	return (
		<>
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
				name="field"
				value={value}
				onFieldError={handleFieldError}
				className="input input-bordered"
				onChange={handleChange}
				required
				pattern="^[a-zA-Z]+$"
			/>
			<p className="text-sm">
				<em>
					Try
					{' '}
					<code>abc</code>
					{' '}
					for custom error,
					{' '}
					<strong>blank</strong>
					{' '}
					for required, or any
					{' '}
					<strong>non-alpha</strong>
					{' '}
					for pattern check.
				</em>
			</p>
			<p className="flex flex-row justify-end gap-2">
				<button type="reset" className="btn btn-secondary" onClick={reset}>Reset</button>
				<button type="submit" className={classNames('btn', { 'btn-primary': !success }, { 'btn-success': success })}>Submit</button>
			</p>
		</>
	)
}
export const InputDemo = () => {
	const [success, setSuccess] = useState(false)
	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		setSuccess(false)
	}

	const handleValidSubmit = () => {
		setSuccess(true)
	}

	// Handle the form validation manually
	return (
		<ValidatedForm className="not-prose flex flex-col gap-4" onValidSubmit={handleValidSubmit} onSubmit={onSubmit} nativeValidation>
			<Form setSuccess={setSuccess} success={success} />
		</ValidatedForm>
	)
}
