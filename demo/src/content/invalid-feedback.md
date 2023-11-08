# Invalid Feedback

Using `<FieldManager>`, the value and error state is shared via context API. We can now more easily render error and value status.

To do this, you would use `useFieldManager()` to get the current `fieldErrors` state. Then render wherever you want.

<div class="not-prose">

```jsx
const InvalidFeedbackLabel = ({ children }) => <label className="peer-invalid:visible font-light">{children}</label>

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
	const { reset } = useFieldManager() // We need to use the field manager reset to reset validation state.
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
```

</div>

## Try it out!

You can find the [code for this demo here](https://github.com/iwsllc/iwsio-forms/blob/main/demo/src/samples/InvalidFeedback.tsx).

