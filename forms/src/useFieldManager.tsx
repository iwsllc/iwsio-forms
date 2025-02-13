import { useContext } from 'react'

import { FieldManagerContext } from './FieldManagerContext.js'
import { UseFieldStateResult } from './types.js'

/**
 * Retrieves the field manager context
 */
export const useFieldManager = (): UseFieldStateResult => {
	const context = useContext(FieldManagerContext)
	if (context == null) throw new Error('Must be used within a FieldManager')
	return context
}
