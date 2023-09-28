import { FC, useContext } from 'react'
import { FieldManagerContext } from './FieldManagerContext'
import { ChildrenProp } from './types'
import { UseFieldStateResult } from './UseFieldStateResult'

export const FieldManager: FC<ChildrenProp & { fieldState: UseFieldStateResult }> = ({ children, fieldState }) => {
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
