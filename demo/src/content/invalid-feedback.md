# Invalid Feedback

Using `<FieldManager>`, the value and error state is shared via context API. We can now more easily render error and value status.

To do this, use `useFieldManager()` to get a check function `checkFieldError(fieldName: string)`. The result of this function will indicate whether there is an error and it is "reportable" (meaning the form has been submitted at least once). You may also access the real-time error any time through `fieldErrors` state from the hook.

<div class="not-prose">

```jsx
export const Field = () => {
	const { checkFieldError } = useFieldManager()
	const fieldError = checkFieldError('field')

	return (
		<div className="form-control">
			<div className="indicator">
				<InputField name="field" required className={`input input-bordered ${fieldError ? 'input-error' : ''}`} pattern="^[a-zA-Z]+$" />
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
		setSuccess(false) // before validation, reset success.
	}
	const handleValidSubmit = (_fields: any) => {
		setSuccess(true)
	}
	return (
		<FieldManager fields={{ field: '' }} onValidSubmit={handleValidSubmit} onSubmit={handleSubmit} onReset={() => setSuccess(false)} nativeValidation={false}>
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
```

</div>

## Try it out!

You can find the [code for this demo here](https://github.com/iwsllc/iwsio-forms/blob/main/demo/src/samples/InvalidFeedback.tsx).

