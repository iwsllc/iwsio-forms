import { useContext } from 'react'
import { FieldManagerContext } from './FieldManagerContext'
import { UseFieldStateResult } from './types'

/**
 * Retrieves the field manager context
 */
export const useFieldManager = (): UseFieldStateResult => {
	const context = useContext(FieldManagerContext)
	if (context == null) throw new Error('Must be used within a FieldManager')
	return context
}
