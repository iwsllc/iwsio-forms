import { FC, PropsWithChildren } from 'react'
import { FieldManager } from '../FieldManager'

export const FullyControlledFieldWrapper: FC<PropsWithChildren> = ({ children }) => (
	<FieldManager fields={{ field: '' }}>
		{children}
	</FieldManager>
)
