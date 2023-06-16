import { renderHook, act, waitFor } from '@testing-library/react'
import { useFieldState } from './useFieldState'
import defaults from 'lodash.defaults'
import omitBy from 'lodash.omitby'

describe('useFieldState', () => {
	test('When initializing, getting, and setting fields', async() => {
		const { result } = renderHook(() => useFieldState({ firstName: '', lastName: '' }, { firstName: 'fred', lastName: 'flintstone' }))

		const { fields, fieldErrors, handleChange } = result.current
		expect(fields.firstName).toEqual('')
		expect(fields.lastName).toEqual('')
		expect(Object.keys(fieldErrors).length).toEqual(0)

		let updates
		act(() => {
			updates = handleChange({ target: { name: 'firstName', value: '123' } } as any)
		})

		expect(updates.firstName).toEqual('123')
		expect(updates.lastName).toEqual('')

		expect(result.current.fields.firstName).toEqual('123')

		act(() => {
			result.current.setFieldError('firstName', 'failed')
		})

		expect(result.current.fieldErrors?.firstName).toEqual('failed')

		act(() => {
			result.current.reset()
		})

		await waitFor(() => {
			expect(result.current.fieldErrors?.firstName).not.to.be.ok
			expect(result.current.fields.firstName).toEqual('fred')
			expect(result.current.fields.lastName).toEqual('flintstone')
		})
	})

	test('Set all errors', () => {
		const { result } = renderHook(() => useFieldState({ firstName: '', lastName: '' }, { firstName: 'fred', lastName: 'flintstone' }))

		const { fieldErrors, setFieldError, setFieldErrors } = result.current
		expect(Object.keys(fieldErrors).length).toEqual(0)

		act(() => {
			setFieldError('firstName', 'input is invalid.')
		})

		expect(result.current.fieldErrors.firstName).toEqual('input is invalid.')

		act(() => {
			setFieldErrors({ general: 'test', firstName: '' })
		})

		expect(result.current.fieldErrors.firstName).toEqual('')
		expect(result.current.fieldErrors.general).toEqual('test')
	})

	test('init values with defaults; testing expression', () => {
		const initValues = { field: '', field2: '' }
		const defaultValues = { field: 'field', field2: 'field2' }
		const result = defaults(omitBy(initValues, (v) => v == null || v === ''), defaultValues)
		expect(result).to.eql({ field: 'field', field2: 'field2' })
	})
})
