# @iwsio/forms

[![@iwsio/forms: PUSH to main](https://github.com/iwsllc/iwsio-forms/actions/workflows/forms-push-main.yaml/badge.svg)](https://github.com/iwsllc/iwsio-forms/actions/workflows/forms-push-main.yaml)

[See documentation](https://forms.iws.io) for more examples and working demos.

This package combines browser form validation with React so you can more easily manage errors and input values in forms. More specifically, it tracks input validation in state making it available to React AND allows you to set input errors in state that in turn trigger `setCustomValidity` on DOM inputs enabling more control over how you render form errors in your applications.

## Install

```bash
npm install @iwsio/forms
yarn install @iwsio/forms
pnpm install @iwsio/forms
```

## Controlled/Uncontrolled inputs: `<Input />`, `<Select />`, and `<TextArea />`

These controlled inputs allow you to track error state with a controlled component value. They are identical to (and pass along) all the props from their counterparts `input`, `select` and `textarea`. These means you can use regular HTML 5 browser validation AND you can set custom errors easily with React state and let browser validation do the work of reporting or checking for invalid fields. These components include: `Input`, `Select`, and `TextArea` and work exactly how native elements work, the key difference being: you can include a `fieldError` and `onFieldError` props to manage error state.

## `<ValidatedForm>`

Complimenting the inputs, I've included a form component to simplify styling and validated submit handling. It includes some CSS sugar `needs-validation` and `was-validated` for pre and post first submission. (This is kind of a throwback to Bootstrap, but you can use it however you like). You also still have acess to the psuedo classes `:valid` or `:invalid` as usual with these input components.

`onValidSubmit` invokes when form submit happens with all valid inputs. It's the same as using a regular `<form/>` `onSubmit` but with a built-in `form.checkValidity()` call to ensure field inputs are valid. `className` provided here will style the underlying HTML form.

Also, it should be mentioned that `ValidatedForm` works with controlled and uncontrolled inputs. It simply serves as a utility for the browser validation happening under the covers. 

```jsx
const Sample = () => {
  const handleValidSubmit = () => {
    // Form is valid; form inputs are safe to consume here.
  };

  return (
    <ValidatedForm onValidSubmit={handleValidSubmit}>
      <Input type="text" name="field1" required pattern="^\w+$" />
    </ValidatedForm>
  );
};
```

### Renders:

#### Before submit

```html
<form class="needs-validation">
  <input type="text" name="field1" required pattern="^\w+$" value="" />
</form>
```

#### After submit

```html
<form class="was-validated">
  <input type="text" name="field1" required pattern="^\w+$" value="" />
</form>
```

## `useFieldState`

Next there is `useFieldState`, which manages all the field values and error states for a form. This can be used independent of all the other components. The idea is to simply use a `Record<string, string>` type of state where the keys are the field names and they hold the current text value of the inputs. `useFieldState` manages both `values` and `fieldErrors` and provides methods to hook into that and make custom updates.

hook props | Definition
--- | ---
`checkFieldError` | helper function to check error state in combination with `reportValidation`; returns true when fieldError exists and reportValidation is `true`
`fieldErrors` | current field errors; `Record<string,string>` where keys match input names.
`handleChange` | `ChangeEventHandler<*>` used to control the input.
`onChange` | alias to `handleChange`
`reportValidation` | boolean field that indicates if errors should be shown. Sets to true when using `FieldManager` after first form submit.
`reset` | resets the fields back to `defaultValues` or `initValues` and resets fieldError state. 
`setField` | manually set a single field's value by name.
`setFieldError` | Sets a single field error. Useful when needing to set errors outside of browser validation. 
`setFieldErrors` | Sets ALL field errors. This is useful when you want to set more than one error at once. Like for example handling an HTTP 400 response with specific input errors. 
`setReportValidation` | sets reportValidation toggle for manual implementation.

```jsx
const Sample = () => {
  const { fields, onChange, fieldErrors } = useFieldState({ field1: "" });

  return (
    <form>
      <input
        type="text"
        name="field1"
        required
        pattern="^\w+$"
        onChange={onChange}
        value={fields.field1}
      />
      {fieldErrors.field1 && <span>{fieldErrors.field1}</span>}
    </form>
  );
};
```

## `<FieldManager>`

Finally, `FieldManager` brings it all together and automatically wires up field state and form validation. Rather than using the default `Input`, `Select` and `TextArea` components, you'll use extensions of those: `InputField`, `SelectField`, and `TextAreaField` respectively. The only prop (outside validation attributes) you need to provide is the `name` so `FieldManager` knows how to connect it to field state. 

The props on `FieldManager` passthrough to the underlying `<form/>`. You can provide `className` and other HTML attributes commonly used on `<form/>`. For this to work however, you will need to provide at least an initial field state as `fields`. Use `onValidSubmit` to know when the form submit occurred with valid fields.

This can be manually styled as well. Use `useFieldManager()` to get a check function `checkFieldError(fieldName: string)`. The result of this function will indicate whether there is an error and it is "reportable" (meaning the form has been submitted at least once). The real-time error is accessible using the `fieldErrors` state from the hook as well.


Here is a quick example:

```tsx
const Sample = () => {
  const handleValidSubmit = (fields: Record<string, any>) => {
    // Do whatever you want with fields.
  }
  return (
    <FieldManager fields={{ field1: "", field2: "", field3: "" }} onValidSubmit={handleValidSubmit} className="custom-form-css" nativeValidation>
      <InputField type="text" name="field1" required pattern="^\w+$" />
      <InputField
        type="number"
        name="field2"
        required
        min={0}
        max={10}
        step={1}
      />
    
      <InputField type="phone" name="field3" required />
      <button type="submit">Submit</button>
    </FieldManager>
  )
}
```

## `<InvalidFeedbackForField />`
One last component: this is just a helper component to display errors using the `useFieldState` properties mentioned above. Feel free to use this an example to make your own or consume it as-is. It currently returns a `<span/>` containing the error with any additional span attributes you provide as props. It consumes `checkFieldError(name)` to determine when to render and will return `null` when no error exists.

### Source:
```tsx
<InvalidFeedbackForField name="field1" className="text-[red] font-bold text-2xl" />
```

### Renders with error:
```html
<span className="text-[red] font-bold text-2xl">This field is required.</span>
```

## References:

### MDN Forms validation

https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
