/* eslint-disable jsx-a11y/label-has-associated-control */
import { InputField, SelectField, TextAreaField } from '@iwsio/forms'

import { RawSampleField } from './RawSampleField.js'

export function RawExamples() {
	return (
		<div className="prose">
			<h3>
				Showing field types
				<code>&lt;input&nbsp;/&gt;</code>
				,
				<code>&lt;select&nbsp;/&gt;</code>
				, and
				<code>&lt;textarea&nbsp;/&gt;</code>
			</h3>
			<hr className="my-5" />

			<RawSampleField
				title="Text and patterns"
				label="Required, word chars:"
				help={(
					<>
						Try
						<code>abc123</code>
						,
						<code>*</code>
						, or blank
					</>
				)}
			>
				<InputField pattern="^\w+$" name="field" required placeholder="Type here" className="input input-bordered w-full sm:w-auto" />
			</RawSampleField>

			<RawSampleField
				title="Numeric fields"
				label="Step: 1, min: 1, max: 10"
				help={(
					<>
						Try
						<code>1</code>
						,
						<code>11</code>
						, or blank
					</>
				)}
			>
				<InputField type="number" required placeholder="Enter number" min={1} max={10} step={1} className="input input-bordered w-full sm:w-auto" name="field" />
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
					<label className="label-text flex cursor-pointer flex-row items-center gap-2">
						A:
						<InputField type="radio" required className="radio" value="A" radioGroup="field" name="field" />
					</label>
					<label className="label-text flex cursor-pointer flex-row items-center gap-2">
						B:
						<InputField type="radio" required className="radio" value="B" radioGroup="field" name="field" />
					</label>
					<label className="label-text flex cursor-pointer flex-row items-center gap-2">
						C:
						<InputField type="radio" required className="radio" value="C" radioGroup="field" name="field" />
					</label>
				</div>
			</RawSampleField>

			<RawSampleField
				title="Select"
				label="Options"
				help={<>Try unselected</>}
			>
				<SelectField required className="select select-bordered w-full sm:w-auto" name="field">
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
				<TextAreaField required className="textarea textarea-bordered w-full sm:w-auto" name="field" maxLength={10} />
			</RawSampleField>
		</div>
	)
}
