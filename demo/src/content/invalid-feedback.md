# Invalid Feedback

One major change with the older version `0.1.0` is the removal of the feedback JSX Element prop. Now, with `<FieldManager>` and the value is shares via context API, we can make error and value status available to all its children. 

Before, we passed a prop `validationMessageComponent={<InvalidFeedbackLabel />}` to give the component something to render when invalid. I found this doesn't always work well, especially when dealing with radio buttons (groups of inputs with shared error state), or other styling scenarios where we may want a different DOM location for the feedback.

To do this now, you would follow this pattern with `useFieldManager()` hook to get the current `fieldErrors` state. Then place it wherever you want.

<div class="not-prose border-2">

```javascript
const InvalidFeedbackLabel = ({ children }) => <label className="peer-invalid:visible text-error font-light">{children}</label>

const Fields = () => {
	const { fieldErrors } = useFieldManager()
	return (
		<>
			<InputField name="field" required /> {/** value, checked, onChange, fieldError, etc are all automatically bound in InputField; regular <input/> requires bindings **/}
			{ /**Here, we're placing feedback dom adjacent to field **/}
			{fieldErrors?.field && <InvalidFeedbackLabel>{fieldErrors.field}</InvalidFeedbackLabel>}
		</>
	)
}

const Form = () => {
	const fieldState = useFieldState({field: ''})
	const { fieldErrors } = fieldState // NOTE: you can destructure/access fieldErrors at the top level too.
	return (
		<FieldManager fieldState={fieldState}> {/** FieldManager just shares fieldState **/}
			<ValidatedForm>
				<Fields />
			</ValidatedForm>
		</FieldManager>
	)
}
```

</div>

## Try it out!