import { FC, PropsWithChildren } from 'react'
import { FieldManager } from '../FieldManager'

export const FieldManagerWrapper: FC<PropsWithChildren> = ({ children }) => (
	<FieldManager fields={{ field: '' }}>
		{children}
	</FieldManager>
)
