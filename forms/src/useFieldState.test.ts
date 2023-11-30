import { renderHook, act, waitFor } from '@testing-library/react'
import { useFieldState } from './useFieldState'

describe('useFieldState', () => {
	test('When initializing, getting, and setting fields', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const { result } = renderHook(() => useFieldState(fieldValues, defaultValues))

		const { fields, fieldErrors, handleChange } = result.current
		expect(fields.firstName).toEqual('')
		expect(fields.lastName).toEqual('')
		expect(Object.keys(fieldErrors).length).toEqual(0)

		let updates
		await act(() => {
			updates = handleChange({ target: { name: 'firstName', value: '123' } } as any)
		})

		expect(updates.firstName).toEqual('123')
		expect(updates.lastName).toEqual('')

		expect(result.current.fields.firstName).toEqual('123')

		await act(() => {
			result.current.setFieldError('firstName', 'failed')
		})

		expect(result.current.fieldErrors?.firstName).toEqual('failed')

		await act(() => {
			result.current.reset()
		})

		await waitFor(() => {
			expect(result.current.fieldErrors?.firstName).not.to.be.ok
			expect(result.current.fields.firstName).toEqual('fred')
			expect(result.current.fields.lastName).toEqual('flintstone')
		})
	})

	test('Set all errors', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const { result } = renderHook(() => useFieldState(fieldValues, defaultValues))

		const { fieldErrors, setFieldError, setFieldErrors } = result.current
		expect(Object.keys(fieldErrors).length).toEqual(0)

		await act(() => {
			setFieldError('firstName', 'input is invalid.')
		})

		expect(result.current.fieldErrors.firstName).toEqual('input is invalid.')

		await act(() => {
			setFieldErrors({ general: 'test', firstName: '' })
		})

		expect(result.current.fieldErrors.firstName).toEqual('')
		expect(result.current.fieldErrors.general).toEqual('test')
	})

	test('init values with defaults; rerendering with new initial props (should not change values), and updating state from within, (should change values)', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

		const { result, rerender } = hook
		expect(result.current.fields.firstName).toEqual('')
		expect(result.current.fields.lastName).toEqual('')
		expect(Object.keys(result.current.fieldErrors).length).toEqual(0)

		act(() => {
			result.current.reset()
		})

		expect(result.current.fields.firstName).toEqual('fred')
		expect(result.current.fields.lastName).toEqual('flintstone')

		fieldValues.firstName = 'fred2'
		fieldValues.firstName = 'flintstone2'

		rerender()

		waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred')
			expect(result.current.fields.lastName).toEqual('flintstone')
		})

		act(() => {
			result.current.setField('firstName', 'fred2')
			result.current.setField('lastName', 'flintstone2')
		})

		waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred2')
			expect(result.current.fields.lastName).toEqual('flintstone2')
		})
	})

	test('Changing defaults will allow reset to use the new defaults.', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

		const { result } = hook
		expect(result.current.fields.firstName).toEqual('')
		expect(result.current.fields.lastName).toEqual('')

		act(() => {
			result.current.reset()
		})

		expect(result.current.fields.firstName).toEqual('fred')
		expect(result.current.fields.lastName).toEqual('flintstone')

		act(() => {
			result.current.setDefaultValues({ firstName: 'fred2', lastName: 'flintstone2' })
		})

		act(() => { result.current.reset() })

		await waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred2')
			expect(result.current.fields.lastName).toEqual('flintstone2')
		})
	})

	test('When changing one field', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

		const { result } = hook
		expect(result.current.fields.firstName).toEqual('')
		expect(result.current.fields.lastName).toEqual('')

		act(() => {
			result.current.setField('firstName', 'fred2')
		})

		await waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred2')
		})
	})

	test('When changing many fields at once (all fields)', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

		const { result } = hook
		expect(result.current.fields.firstName).toEqual('')
		expect(result.current.fields.lastName).toEqual('')

		act(() => {
			result.current.setFields({ firstName: 'fred2', lastName: 'flintstone2' })
		})

		await waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred2')
			expect(result.current.fields.lastName).toEqual('flintstone2')
		})
	})

	test('When changing many fields at once (some fields)', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

		const { result } = hook
		expect(result.current.fields.firstName).toEqual('')
		expect(result.current.fields.lastName).toEqual('')

		act(() => {
			result.current.setFields({ firstName: 'fred2' })
		})

		await waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred2')
			expect(result.current.fields.lastName).toEqual('')
		})
	})

	describe('Changing fields with existing errors', () => {
		test('When changing one field', async () => {
			const fieldValues = { firstName: '', lastName: '' }
			const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

			const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

			const { result } = hook
			expect(result.current.fields.firstName).toEqual('')
			expect(result.current.fields.lastName).toEqual('')

			act(() => {
				result.current.setFieldError('firstName', 'This field is required')
			})
			expect(result.current.fieldErrors.firstName).toEqual('This field is required')

			act(() => {
				result.current.setField('firstName', 'fred2')
			})
			expect(result.current.fieldErrors.firstName).to.not.be.ok

			await waitFor(() => {
				expect(result.current.fields.firstName).toEqual('fred2')
			})
		})

		test('When changing many fields at once (all fields)', async () => {
			const fieldValues = { firstName: '', lastName: '' }
			const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

			const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

			const { result } = hook
			expect(result.current.fields.firstName).toEqual('')
			expect(result.current.fields.lastName).toEqual('')

			act(() => {
				result.current.setFieldError('firstName', 'This field is required')
				result.current.setFieldError('lastName', 'This field is required')
			})
			expect(result.current.fieldErrors.firstName).toEqual('This field is required')
			expect(result.current.fieldErrors.lastName).toEqual('This field is required')

			act(() => {
				result.current.setFields({ firstName: 'fred2', lastName: 'flintstone2' })
			})

			expect(result.current.fieldErrors.firstName).not.to.be.ok
			expect(result.current.fieldErrors.lastName).not.to.be.ok

			await waitFor(() => {
				expect(result.current.fields.firstName).toEqual('fred2')
				expect(result.current.fields.lastName).toEqual('flintstone2')
			})
		})

		test('When changing many fields at once (some fields)', async () => {
			const fieldValues = { firstName: '', lastName: '' }
			const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

			const hook = renderHook(() => useFieldState(fieldValues, defaultValues))

			const { result } = hook
			expect(result.current.fields.firstName).toEqual('')
			expect(result.current.fields.lastName).toEqual('')

			act(() => {
				result.current.setFieldError('firstName', 'This field is required')
				result.current.setFieldError('lastName', 'This field is required')
			})
			expect(result.current.fieldErrors.firstName).toEqual('This field is required')
			expect(result.current.fieldErrors.lastName).toEqual('This field is required')

			act(() => {
				result.current.setFields({ firstName: 'fred2' })
			})

			expect(result.current.fieldErrors.firstName).not.to.be.ok
			expect(result.current.fieldErrors.lastName).toEqual('This field is required')

			await waitFor(() => {
				expect(result.current.fields.firstName).toEqual('fred2')
				expect(result.current.fields.lastName).toEqual('')
			})
		})
	})
})
