import { FC, useContext } from 'react'
import { FieldManagerContext } from './FieldManagerContext'
import { ChildrenProp } from './types'
import { UseFieldStateResult } from './UseFieldStateResult'
import { useFieldState } from './useFieldState'

export const FieldManager: FC<ChildrenProp & { fields: Record<string, any>, defaultValues?: Record<string, string> }> = ({ children, fields, defaultValues }) => {
	const fieldState = useFieldState(fields, defaultValues)
	return (
		<FieldManagerContext.Provider value={fieldState}>
			{children}
		</FieldManagerContext.Provider>
	)
}

export const useFieldManager = (): UseFieldStateResult => {
	const context = useContext(FieldManagerContext)
	if (context == null) throw new Error('Must be used within a FieldManager')
	return context
}
