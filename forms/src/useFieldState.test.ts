import { renderHook, act } from '@testing-library/react'
import { useFieldState } from './useFieldState'

describe('useFieldState', () => {
	test('When initializing, getting, and setting fields', () => {
		const { result } = renderHook(() => useFieldState({ firstName: '', lastName: '' }, { firstName: 'fred', lastName: 'flintstone' }))

		const { fields, fieldErrors: errors, onChange } = result.current
		expect(fields.firstName).toEqual('')
		expect(fields.lastName).toEqual('')
		expect(Object.keys(errors).length).toEqual(0)

		let updates
		act(() => {
			updates = onChange({ target: { name: 'firstName', value: '123' } } as any)
		})

		expect(updates.firstName).toEqual('123')
		expect(updates.lastName).toEqual('')

		expect(result.current.fields.firstName).toEqual('123')

		act(() => {
			result.current.setFieldError('firstName', 'failed')
		})

		expect(result.current.fieldErrors?.firstName).toEqual('failed')
	})
})
