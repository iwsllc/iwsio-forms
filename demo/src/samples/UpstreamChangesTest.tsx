import { FieldManager, FieldValues, InputField, useFieldManager } from '@iwsio/forms'
import { FC, createContext, useContext, useEffect, useState } from 'react'

export const TestForm: FC<{fields: FieldValues}> = ({ fields }) => {
	const handleSubmit = (values: FieldValues) => {
		console.log(values)
	}

	return (
		<FieldManager className="flex flex-col items-start justify-start gap-2 max-w-4xl " fields={fields} onValidSubmit={handleSubmit} nativeValidation>
			<UpstreamFieldMonitor />
			<InputField placeholder="Name" name="name" type="text" className="input input-bordered" required />
			<InputField placeholder="Phone" name="phone" type="text" pattern="^\d+$" className="input input-bordered" required />
			<InputField placeholder="Email" name="email" type="email" className="input input-bordered" required />
			<div className="flex w-full justify-end max-w-xs">
				<button type="submit" className="btn btn-bordered btn-primary">Submit</button>
			</div>
		</FieldManager>
	)
}

const Context = createContext<{fields: FieldValues} | undefined>(undefined)

// seems kinda hacky
export const UpstreamFieldMonitor = () => {
	const { fields } = useContext(Context)
	const { setFields } = useFieldManager()
	useEffect(() => {
		setFields(fields)
	}, [fields])
	return null
}

/**
 * This is an experimental component where the fields might be managed upstream: in this case via context api.
 * The FieldManager component doesn't rely on the fields prop changing. Once initialized, we need to update values
 * via the useFieldManager hook.
 */
export const UpstreamChangesTest = () => {
	const [fields, setFields] = useState<FieldValues>({ name: '', email: '', phone: '' })
	useEffect(() => {
		const id = setTimeout(() => {
			setFields({ name: 'John', email: 'test@test.com', phone: '1234567890' })
		}, 250)
		return () => clearTimeout(id)
	}, [])
	return (
		<Context.Provider value={{ fields }}>
			<TestForm fields={fields} />
		</Context.Provider>
	)
}
