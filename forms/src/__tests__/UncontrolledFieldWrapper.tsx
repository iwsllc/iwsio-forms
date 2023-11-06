import { FC, PropsWithChildren } from 'react'
import { FieldManager } from '../FieldManager'

export const UncontrolledFieldWrapper: FC<PropsWithChildren> = ({ children }) => {
	// intentionally setting field name to a non-managed field; field2
	return <FieldManager fields={{ field: '' }}>{children}</FieldManager>
}
