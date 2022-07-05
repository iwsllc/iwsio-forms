# @iwsio/forms

[![Tests CI](https://github.com/IWSLLC/iwsio-forms/actions/workflows/test.yaml/badge.svg)](https://github.com/IWSLLC/iwsio-forms/actions/workflows/test.yaml)

This is just a basic module to simplify the use of browser validation in forms with React. This package is **incomplete**. I've pretty much only worked with/tested `TextInput` for demos. If there is any interest in this, I'll continue to improve and expand it.

## MDN Forms validation
https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation


## Example
```jsx
<ValidatedForm onValidSubmit={() => {/* Calls on submit if form is valid. */}}>
  <label className="form-label" for="name">Name</label>
  <TextInput name="name" required pattern="^\a+$" validationMessageComponent={<div className="form-text invalid-feedback" />} />
  <p className="mt-3">
    <button type="submit" className="btn btn-primary">Submit</button>
  </p>
</ValidatedForm>
```
### Renders HTML (always)
As the validation events trigger in the browser, the component is listening for these and updating the validation message for the input. This was kind of built with Bootstrap 4/5 in mind where class names drive visibility of those validation states. i.e. `invalid-feedback` will not be visible unless the form `was-validated` and the field is in a state that is `:invalid`.

```html
<form class=" was-validated" novalidate="">
  <label class="form-label" for="name">Name</label>
  <input name="name" type="text" class="form-control" id="name" required="" value="">
  <div class="form-text invalid-feedback" data-testid="text-input-name-child-0"></div>
</form>
```

### When invalid:
```html
<div class="form-text invalid-feedback" data-testid="text-input-name-child-0">Please fill out this field.</div>
```

## See [Demo Readme](./demo/README.md) for testing this out locally.