import React from 'react'
import { RawSampleField } from './RawSampleField'
import { InputField, SelectField, TextAreaField } from '@iwsio/forms'

export function RawExamples() {
	return (
		<div className="prose">
			<h3>Showing field types <code>&lt;input&nbsp;/&gt;</code>, <code>&lt;select&nbsp;/&gt;</code>, and <code>&lt;textarea&nbsp;/&gt;</code></h3>
			<hr className="my-5" />

			{/* <FormManager form={form}> */}
			<RawSampleField
				title="Text and patterns"
				label="Required, word chars:"
				help={<>Try <code>abc123</code>, <code>*</code>, or blank</>}
			>
				<InputField pattern="^\w+$" name="field" required placeholder="Type here" className="input input-bordered grow" />
			</RawSampleField>

			<RawSampleField
				title="Numeric fields"
				label="Step: 1, min: 1, max: 10"
				help={<>Try <code>abc123</code>, <code>*</code>, or blank</>}
			>
				<InputField type="number" required placeholder="Enter number" min={1} max={10} step={1} className="input input-bordered grow" name="field" />
			</RawSampleField>

			<RawSampleField
				title="Checkbox"
				label="On/Off"
				help={<>Try unchecked</>}
			>
				<InputField type="checkbox" required value="yes" className="checkbox" name="field" />
			</RawSampleField>

			<RawSampleField
				title="Radios"
				label="Select an option"
				help={<>Try unchecked</>}
			>
				<div className="flex flex-col gap-3">
					<label className="label-text cursor-pointer flex flex-row items-center gap-2">A: <InputField type="radio" required className="radio" value="A" radioGroup="field" name="field" /></label>
					<label className="label-text cursor-pointer flex flex-row items-center gap-2">B: <InputField type="radio" required className="radio" value="B" radioGroup="field" name="field" /></label>
					<label className="label-text cursor-pointer flex flex-row items-center gap-2">C: <InputField type="radio" required className="radio" value="C" radioGroup="field" name="field" /></label>
				</div>
			</RawSampleField>

			<RawSampleField
				title="Select"
				label="Options"
				help={<>Try unselected</>}
			>
				<SelectField required className="select select-bordered" name="field">
					<option />
					<option>A</option>
					<option>B</option>
					<option>C</option>
				</SelectField>
			</RawSampleField>

			<RawSampleField
				title="TextArea"
				label="Memo"
				help={<>Try blank</>}
			>
				<TextAreaField required className="textarea textarea-bordered grow" name="field" maxLength={10} />
			</RawSampleField>
		</div>
	)
}
