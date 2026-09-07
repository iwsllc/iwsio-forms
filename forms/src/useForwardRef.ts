import { type ForwardedRef, useImperativeHandle, useRef } from 'react'

export const useForwardRef = <T>(ref: ForwardedRef<T>) => {
	const innerRef = useRef<T>(null)
	// biome-ignore lint/style/noNonNullAssertion: forwarding the whole ref object by design
	useImperativeHandle(ref, () => innerRef.current!)

	return innerRef
}
