import { act, renderHook, waitFor } from '@testing-library/react'

import type { FieldChangeResult } from './types.js'
import { useFieldState } from './useFieldState.js'

const _validity: ValidityState = {
	valid: true,
	badInput: false,
	customError: false,
	patternMismatch: false,
	rangeOverflow: false,
	rangeUnderflow: false,
	stepMismatch: false,
	tooLong: false,
	tooShort: false,
	typeMismatch: false,
	valueMissing: false
}

describe('useFieldState', () => {
	test('When initializing, getting, and setting fields', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const { result } = renderHook(() => useFieldState(fieldValues, { defaultValues }))

		const { fields, fieldErrors, handleChange } = result.current
		expect(fields.firstName).toEqual('')
		expect(fields.lastName).toEqual('')
		expect(Object.keys(fieldErrors).length).toEqual(0)

		let updates: FieldChangeResult<HTMLInputElement> | undefined
		await act(() => {
			updates = handleChange({ target: { name: 'firstName', value: '123' } } as any)
		})

		expect(updates?.fields.firstName).toEqual('123')
		expect(updates?.fields.lastName).toEqual('')

		expect(result.current.fields.firstName).toEqual('123')

		await act(() => {
			result.current.setFieldError('firstName', 'failed')
		})

		expect(result.current.fieldErrors?.firstName).toEqual({
			message: 'failed',
			validity: { ..._validity, valid: false, customError: true }
		})

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

		const { result } = renderHook(() => useFieldState(fieldValues, { defaultValues }))

		const { fieldErrors, setFieldError, setFieldErrors } = result.current
		expect(Object.keys(fieldErrors).length).toEqual(0)

		await act(() => {
			setFieldError('firstName', 'input is invalid.')
		})

		expect(result.current.fieldErrors.firstName).toEqual({
			message: 'input is invalid.',
			validity: { ..._validity, valid: false, customError: true }
		})

		await act(() => {
			setFieldErrors({ general: { message: 'test' } })
		})

		expect(result.current.fieldErrors.firstName).toEqual(undefined)
		expect(result.current.fieldErrors.general).toEqual({ message: 'test' })
	})

	test('init values with defaults; rerendering with new initial props (should not change values), and updating state from within, (should change values)', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

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

		const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

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

		act(() => {
			result.current.reset()
		})

		await waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred2')
			expect(result.current.fields.lastName).toEqual('flintstone2')
		})
	})

	test('When changing one field', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

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

	test('When using change handler', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

		const { result } = hook
		expect(result.current.fields.firstName).toEqual('')
		expect(result.current.fields.lastName).toEqual('')

		// biome-ignore lint/suspicious/noImplicitAnyLet: type is inferred from the assignment below
		let returnValue
		act(() => {
			returnValue = result.current.handleChange({ target: { name: 'firstName', value: 'fred2' } } as any)
		})

		await waitFor(() => {
			expect(result.current.fields.firstName).toEqual('fred2')
			expect(returnValue).to.deep.equal({
				fields: { firstName: 'fred2', lastName: '' },
				target: { name: 'firstName', value: 'fred2' }
			})
		})
	})

	test('When changing many fields at once (all fields)', async () => {
		const fieldValues = { firstName: '', lastName: '' }
		const defaultValues = { firstName: 'fred', lastName: 'flintstone' }

		const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

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

		const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

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

			const { result } = renderHook(() => useFieldState(fieldValues, { defaultValues }))

			expect(result.current.fields.firstName).toEqual('')
			expect(result.current.fields.lastName).toEqual('')

			act(() => {
				result.current.setFieldError('firstName', 'This field is required')
			})
			expect(result.current.fieldErrors.firstName).toEqual({
				message: 'This field is required',
				validity: { ..._validity, valid: false, customError: true }
			})

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

			const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

			const { result } = hook
			expect(result.current.fields.firstName).toEqual('')
			expect(result.current.fields.lastName).toEqual('')

			act(() => {
				result.current.setFieldError('firstName', 'This field is required')
				result.current.setFieldError('lastName', 'This field is required')
			})
			expect(result.current.fieldErrors.firstName).toEqual({
				message: 'This field is required',
				validity: { ..._validity, valid: false, customError: true }
			})
			expect(result.current.fieldErrors.lastName).toEqual({
				message: 'This field is required',
				validity: { ..._validity, valid: false, customError: true }
			})

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

			const hook = renderHook(() => useFieldState(fieldValues, { defaultValues }))

			const { result } = hook
			expect(result.current.fields.firstName).toEqual('')
			expect(result.current.fields.lastName).toEqual('')

			act(() => {
				result.current.setFieldError('firstName', 'This field is required')
				result.current.setFieldError('lastName', 'This field is required')
			})
			expect(result.current.fieldErrors.firstName).toEqual({
				message: 'This field is required',
				validity: { ..._validity, valid: false, customError: true }
			})
			expect(result.current.fieldErrors.lastName).toEqual({
				message: 'This field is required',
				validity: { ..._validity, valid: false, customError: true }
			})

			act(() => {
				result.current.setFields({ firstName: 'fred2' })
			})

			expect(result.current.fieldErrors.firstName).not.to.be.ok
			expect(result.current.fieldErrors.lastName).toEqual({
				message: 'This field is required',
				validity: { ..._validity, valid: false, customError: true }
			})

			await waitFor(() => {
				expect(result.current.fields.firstName).toEqual('fred2')
				expect(result.current.fields.lastName).toEqual('')
			})
		})
	})

	describe('resetKey', () => {
		test('When omitted, later field values are ignored (construct-once)', async () => {
			const hook = renderHook(({ fields }) => useFieldState(fields), {
				initialProps: { fields: { firstName: 'fred' } }
			})

			expect(hook.result.current.fields.firstName).toEqual('fred')

			hook.rerender({ fields: { firstName: 'barney' } })

			expect(hook.result.current.fields.firstName).toEqual('fred')
		})

		test('When unchanged, later field values are ignored', async () => {
			const hook = renderHook(({ fields }) => useFieldState(fields, { resetKey: 'a' }), {
				initialProps: { fields: { firstName: 'fred' } }
			})

			hook.rerender({ fields: { firstName: 'barney' } })

			expect(hook.result.current.fields.firstName).toEqual('fred')
		})

		test('When changed, values are reseeded', async () => {
			const hook = renderHook(({ fields, resetKey }) => useFieldState(fields, { resetKey }), {
				initialProps: { fields: { firstName: 'fred' }, resetKey: 'a' }
			})

			expect(hook.result.current.fields.firstName).toEqual('fred')

			hook.rerender({ fields: { firstName: 'barney' }, resetKey: 'b' })

			await waitFor(() => {
				expect(hook.result.current.fields.firstName).toEqual('barney')
			})
		})

		test('When changed, user edits are discarded in favour of the new values', async () => {
			const hook = renderHook(({ fields, resetKey }) => useFieldState(fields, { resetKey }), {
				initialProps: { fields: { firstName: 'fred' }, resetKey: 'a' }
			})

			act(() => {
				hook.result.current.setField('firstName', 'typed-by-user')
			})
			expect(hook.result.current.fields.firstName).toEqual('typed-by-user')

			hook.rerender({ fields: { firstName: 'barney' }, resetKey: 'b' })

			await waitFor(() => {
				expect(hook.result.current.fields.firstName).toEqual('barney')
			})
		})

		test('When changed, errors and reported validation are cleared', async () => {
			const hook = renderHook(({ fields, resetKey }) => useFieldState(fields, { resetKey }), {
				initialProps: { fields: { firstName: 'fred' }, resetKey: 'a' }
			})

			act(() => {
				hook.result.current.setFieldError('firstName', 'This field is required')
				hook.result.current.setReportValidation(true)
			})
			expect(hook.result.current.fieldErrors.firstName).to.be.ok
			expect(hook.result.current.reportValidation).toEqual(true)

			hook.rerender({ fields: { firstName: 'barney' }, resetKey: 'b' })

			await waitFor(() => {
				expect(hook.result.current.fieldErrors.firstName).not.to.be.ok
				expect(hook.result.current.reportValidation).toEqual(false)
			})
		})

		test('When changed, reset() falls back to the reseeded values', async () => {
			const hook = renderHook(({ fields, resetKey }) => useFieldState(fields, { resetKey }), {
				initialProps: { fields: { firstName: 'fred' }, resetKey: 'a' }
			})

			hook.rerender({ fields: { firstName: 'barney' }, resetKey: 'b' })

			act(() => {
				hook.result.current.setField('firstName', 'typed-by-user')
			})

			act(() => {
				hook.result.current.reset()
			})

			await waitFor(() => {
				expect(hook.result.current.fields.firstName).toEqual('barney')
			})
		})
	})
})
