import React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldManager, Input, useFieldState } from '.'

describe('FieldManager', () => {
	test('When rendering field manager with fields; happy path', async() => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' })
			return <FieldManager fieldState={fieldState}><Input data-testid="field" name="field" /></FieldManager>
		}
		render(<Test />)

		const input = screen.getByTestId('field') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async() => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
	})

	test('When rendering field manager with no fields', async() => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' })
			return <FieldManager fieldState={fieldState} />
		}
		const { container } = render(<Test />)

		expect(container.textContent).to.eq('')
	})

	test('When rendering field manager with mismatching field state', async() => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' })
			return <FieldManager fieldState={fieldState}><Input data-testid="field2" name="field2" /></FieldManager>
		}
		render(<Test />)

		const input = screen.getByTestId('field2') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async() => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
	})
})
