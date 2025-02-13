# Input, Select, or TextArea

These components can be used with regular `<form>` or with `<ValidatedForm>`. 

Like all controlled inputs, you need to connect a value and a change handler to the input. Additionally, you can set a `fieldError` property and connecting an `onFieldError` handler. Not only will the input report back validation errors as they occur, you can set your own `fieldError` in state to propagate a `setCustomValidationMessage` on the input for custom errors. 

<div class="not-prose">

```tsx
const [value, setValue] = useState('')
const [fieldError, setFieldError] = useState<{ message: string | undefined, validity: ValidityState } | undefined>()

const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
	// reset success state because something changed.
	setSuccess(false)
	// clear errors
	setFieldError(undefined)

	// always update input value
	setValue(e.target.value)

	// custom validation check
	if (e.target.value === 'abc') {
		// using browser validation; this will trigger onFieldError where we update state.
		e.target.setCustomValidity('Cannot use abc.')
	}
}


const handleFieldError: FieldErrorHandler = (key, validity, message) => {
	setFieldError({ message, validity })
}

return (
	{/* ... */}
		<Input
			name="field"
			value={value}
			onFieldError={handleFieldError}
			className="input input-bordered"
			onChange={handleChange}
			required
			pattern="^[a-zA-Z]+$"
		/>
)
```

</div>

## Try it out.

This example form includes a couple validations: required, and regex pattern matching any alpha character. However, during `onChange`, I've added a custom validation to flag `abc` as invalid.

 - The error state is shown below
 - Clicking submit with a valid state will allow the form to submit (showing a green button).
 - Clicking submit with an invalid state will report the validity.

You can find [the source](https://github.com/iwsllc/iwsio-forms/tree/main/demo/src/samples/InputDemo.tsx) of this demo
