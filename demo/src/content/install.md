# Install
 - `npm install @iwsio/forms`
 - `yarn install @iwsio/forms`
 - `pnpm install @iwsio/forms`

## Setup

<div class="not-prose border-2">

```javascript
import { ValidatedForm, FieldManager, InputField, useFieldState } from '@iwsio/forms'

export const SimpleForm = () => {
	const fieldState = useFieldState()
	const { fields } = fieldState

	const handleSubmit = () => {
		/* fields are validated */
	}

return (
		<FieldManager fieldState={fieldState}>
			<ValidatedForm onSubmit={handleSubmit}>
				<InputField type="text" name="field" required pattern="^\w{3,5}$"/>
			</ValidatedForm>
		</FieldManager>
	)
}
```

</div>