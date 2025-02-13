import { ForwardedRef, useImperativeHandle, useRef } from 'react'

export const useForwardRef = <T>(
	ref: ForwardedRef<T>
) => {
	const innerRef = useRef<T>(null)
	useImperativeHandle(ref, () => innerRef.current!)

	return innerRef
}
