import { PropsWithChildren } from 'react'

import { FieldManager } from '../FieldManager.js'

export const FieldManagerWrapper = ({ children }: PropsWithChildren) => (
	<FieldManager fields={{ field: '' }}>
		{children}
	</FieldManager>
)
