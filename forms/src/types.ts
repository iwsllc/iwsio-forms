import { ReactNode } from 'react'

export type ChildrenProp = { children?: ReactNode };

export type ValidationProps = {
	fieldError?: string;
	onFieldError?: (key: string, message?: string) => void;
};
