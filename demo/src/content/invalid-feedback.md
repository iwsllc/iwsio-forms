# Invalid Feedback

One major change with the older version `0.1.0` is the removal of the feedback JSX Element prop. Now, with `<FieldManager>` and the value is shares via context API, we can make error and value status available to all its children. 

Before, we passed a prop `validationMessageComponent={<InvalidFeedbackLabel />}` to give the component something to render when invalid. I found this doesn't always work well, especially when dealing with radio buttons (groups of inputs with shared error state), or other styling scenarios where we may want a different DOM location for the feedback.

To do this now, you would follow this pattern with `useFieldManager()` hook to get the current `fieldErrors` state. Then place it wherever you want.

<div class="not-prose border-2">

```javascript
const InvalidFeedbackLabel = ({ children }) => <label className="peer-invalid:visible font-light">{children}</label>

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
	const { reset, fieldErrors } = fieldState /** You can also access fieldErrors here **/
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
				<fieldset>
					<legend>Invalid Feedback</legend>
					<Field />
					<button type="reset" className="btn" onClick={() => resetForm()}>Reset</button>
					<button type="submit" className={`btn ${success ? 'btn-success' : ''}`}>Submit</button>
				</fieldset>
			</ValidatedForm>
		</FieldManager>
	)
}
```

</div>

## Try it out!

You can find the [code for this demo here](https://github.com/iwsllc/iwsio-forms/blob/main/demo/src/samples/InvalidFeedback.tsx).

