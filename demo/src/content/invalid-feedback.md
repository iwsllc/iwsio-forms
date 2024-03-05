# Styling Invalid Feedback

Using `<FieldManager>`, the value and error state is shared via context API. We can now more easily render error and value status.

To do this, use `useFieldManager()` to get a check function `checkFieldError(fieldName: string)`. The result of this function will indicate whether there is an error and it is "reportable" (meaning the form has been submitted at least once). You may also access the real-time error any time through `fieldErrors` state from the hook.

One additional note: `<FieldManager>` is now declared with an `errorMapping` property that allows us to override the different kinds of messaging used in [`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)

[Example source code](https://github.com/iwsllc/iwsio-forms/blob/main/demo/src/samples/InvalidFeedback.tsx)


</div>

## Try it out!


