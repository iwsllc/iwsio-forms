import { ComponentProps } from 'react'

import { FieldManagerProps } from './FieldManager.js'
import { FieldManagerContext } from './FieldManagerContext.js'
import { FieldManagerForm } from './FieldManagerForm.js'
import { UseFieldStateResult } from './types.js'

export interface ControlledFieldManagerProps extends ComponentProps<'form'>, Omit<FieldManagerProps, 'fields' | 'defaultValues'> {
	fieldState: UseFieldStateResult
}

/**
 * Use this component if you want to manage field state remotely. This is useful when you're setting up form context elsewhere and want the field values to change from outside input interactions.
 */
export const ControlledFieldManager = ({ children, fieldState, ref, ...props }: ControlledFieldManagerProps) => {
	return (
		<FieldManagerContext.Provider value={fieldState}>
			<FieldManagerForm ref={ref} {...props}>
				{children}
			</FieldManagerForm>
		</FieldManagerContext.Provider>
	)
}
