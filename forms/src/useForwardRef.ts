// For more details on this elegant solution, see: https://github.com/facebook/react/issues/24722#issue-1270749463
// Thank you https://github.com/lejahmie
import { ForwardedRef, useEffect, useRef } from 'react'

export const useForwardRef = <T, >(
	ref: ForwardedRef<T>,
	initialValue: any = null
) => {
	const targetRef = useRef<T>(initialValue)

	useEffect(() => {
		if (!ref) return

		if (typeof ref === 'function') {
			ref(targetRef.current)
		} else {
			ref.current = targetRef.current
		}
	}, [ref])

	return targetRef
}
