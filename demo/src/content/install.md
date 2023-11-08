# Install

[@iwsio/forms on npmjs.com](https://www.npmjs.com/package/@iwsio/forms)

```bash
npm install @iwsio/forms
yarn install @iwsio/forms
pnpm install @iwsio/forms
```

## Setup

<div class="not-prose">

```jsx
import { FieldManager, InputField } from '@iwsio/forms'

export const SimpleForm = () => {
	const handleSubmit = (fieldsWithValues) => {
		/* submit event when form is valid: fields with values provided */
	}

	return (
		<FieldManager fields={{field: ''}} onValidSubmit={handleSubmit}>
			<InputField type="text" name="field" required pattern="^\w{3,5}$"/>
		</FieldManager>
	)
}
```

</div>