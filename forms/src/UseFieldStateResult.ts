import React, { ChangeEvent } from 'react'

export type UseFieldStateResult = {
	reset: () => void;
	fields: Record<string, string>;
	setField: (key: string, value: string) => void;
	fieldErrors: Record<string, string>;
	setFieldError: (key: string, message?: string) => void;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Record<string, string>;
};
