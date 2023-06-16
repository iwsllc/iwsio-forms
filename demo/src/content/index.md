# Why @iwsio/forms?

I found myself recreating similar code in every project that performed the simple task of local state management for controlled inputs and client validation. So I abstracted this out into a library for re-use.

## Controlled inputs: `<Input />`, `<Select />`, and `<TextArea />` 
These controlled inputs allow you to track error state with a controlled value. They are identical to (and pass along) all the props from their counterparts `input`, `select` and `textarea`. These means you can use regular HTML 5 browser validation AND you can set custom errors easily with React state and let browser validation do the work of reporting or checking for invalid fields. These components include: `Input`, `Select`, and `TextArea` and work exactly how native elements work, the key difference being: you can include a `fieldError` and `onFieldError` props to manage error state. 

## `<ValidatedForm>`
Complimenting this, I've included a simple form component to simplify styling and success submit handling. It includes some CSS sugar `needs-validation` and `was-validated` for pre and post first submission. (This is kind of a throwback to [Bootstrap](https://getbootstrap.com/docs/5.3/forms/validation/#custom-styles)).

`onSubmit` invokes when form submit happens with all valid inputs. It's the same as using a regular `<form/>` `onSubmit` but with a built-in `form.checkValidity()` call to ensure field inputs are valid.


<div class="not-prose border-2">

```javascript
const Sample = () => {
	const handleSubmit = () => {
		// Form is valid; fields are safe to consume here.
	}

	return (
		<ValidatedForm onSubmit={handleSubmit}>
			<Input type="text" name="field1" required pattern="^\w+$" />
		</ValidatedForm>
	)
}
```

</div>

### Renders:

#### Before submit

<div class="not-prose border-2">

```xml
		<form class="needs-validation">
			<input type="text" name="field1" required pattern="^\w+$" value="" />
		</form>
```

</div>

#### After submit

<div class="not-prose border-2">

```xml
		<form class="was-validated">
			<input type="text" name="field1" required pattern="^\w+$" value="" />
		</form>
```

</div>

## `useFieldState`
Next there is a [`useFieldState`](/use-field-state) hook, which simplifies state and onChange management for your form. This can be used independent of all the other components. The idea is to simply use a `Record<string,string>` type of state where the keys are the field names and their values, the value.

<div class="not-prose border-2">

```javascript
const Sample = () => {
	const { fields, handleChange } = useFieldState({field1: ''})

	return (
		<form>
			<input type="text" name="field1" required pattern="^\w+$" onChange={handleChange} value={fields.field1} />
		</form>
	)
}
```

</div>

## `<FieldManager>`
Finally, it's brought all together with [`FieldManager`](/field-manager), which elevates the field state to a context API provider and automatically wirese up your controlled inputs. Rather than using the default `Input`, `Select` and `TextArea` components, you'll use extensions of those: `InputField`, `SelectField`, and `TextAreaField` respectively to further simplify your code. Here is a quick example:

<div class="not-prose border-2">

```javascript
const Sample = () => {
	const fieldState = useFieldState({field1: '', field2: '', field3: ''})

	return (
		<FieldManager fieldState={fieldState}>
			<ValidatedForm>
				<InputField type="text" name="field1" required pattern="^\w+$" />
				<InputField type="number" name="field2" required min={0} max={10} step={1} />
				<InputField type="phone" name="field3" required />
				<button type="submit">Submit</button>
			</ValidatedForm>
		</FieldManager>
	)
}
```

</div>
