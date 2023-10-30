# @iwsio/forms

[![@iwsio/forms: PUSH to main](https://github.com/iwsllc/iwsio-forms/actions/workflows/forms-push-main.yaml/badge.svg)](https://github.com/iwsllc/iwsio-forms/actions/workflows/forms-push-main.yaml)

## For more info and working examples, checkout [the demo site](https://forms.iws.io).

I found myself recreating similar code in every project I worked on that performed the simple task of local state management with controlled inputs and client validation. So I abstracted it out into this library for re-use.

## Install

```bash
npm install @iwsio/forms
yarn install @iwsio/forms
pnpm install @iwsio/forms
```

## Controlled inputs: `<Input />`, `<Select />`, and `<TextArea />`

These controlled inputs allow you to track error state with a controlled value. They are identical to (and pass along) all the props from their counterparts `input`, `select` and `textarea`. These means you can use regular HTML 5 browser validation AND you can set custom errors easily with React state and let browser validation do the work of reporting or checking for invalid fields. These components include: `Input`, `Select`, and `TextArea` and work exactly how native elements work, the key difference being: you can include a `fieldError` and `onFieldError` props to manage error state.

## `<ValidatedForm>`

Complimenting this, I've included a simple form component to simplify styling and success submit handling. It includes some CSS sugar `needs-validation` and `was-validated` for pre and post first submission. (This is kind of a throwback to Bootstrap, but you can use it however you like).

`onSubmit` invokes when form submit happens with all valid inputs. It's the same as using a regular `<form/>` `onSubmit` but with a built-in `form.checkValidity()` call to ensure field inputs are valid.

```jsx
const Sample = () => {
  const handleValidSubmit = () => {
    // Form is valid; fields are safe to consume here.
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

```jsx
<form class="needs-validation">
  <input type="text" name="field1" required pattern="^\w+$" value="" />
</form>
```

#### After submit

```jsx
<form class="was-validated">
  <input type="text" name="field1" required pattern="^\w+$" value="" />
</form>
```

## `useFieldState`

Next there is a `useFieldState` hook, which manages all the field value and error states for a form. This can be used independent of all the other components. The idea is to simply use a `Record<string,string>` type of state where the keys are the field names and their values, the value. It manages both `values` and `errors` and provides methods to hook into that and make custom updates.

```jsx
const Sample = () => {
  const { fields, onChange } = useFieldState({ field1: "" });

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
    </form>
  );
};
```

## `<FieldManager>`

Finally, it's brought all together with `FieldManager`. This provider is used to automatically wire up components into the field state and hook up form validation and onChange events. Rather than using the default `Input`, `Select` and `TextArea` components, you'll use extensions of those: `InputField`, `SelectField`, and `TextAreaField` respectively to further simplify your code. Here is a quick example:

```jsx
const Sample = () => {
  const fieldState = useFieldState({ field1: "", field2: "", field3: "" });

  return (
    <FieldManager form={fieldState}>
      <ValidatedForm>
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
      </ValidatedForm>
    </FieldManager>
  );
};
```

## References:

### MDN Forms validation

https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
