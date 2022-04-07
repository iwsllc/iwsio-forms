import React, { HTMLProps } from "react";

export interface TextInputProps {
  error?: string;
  validationMessageComponent?: JSX.Element
}

export type TextInput = React.Component<TextInputProps & React.Component<HTMLProps<HTMLInputElement>>>;

export interface ValidatedFormProps {
  onValidSubmit: () => void;
  onReset?: () => void;
  reportValidity?: boolean
}
 
export type ValidatedForm = React.Component<ValidatedFormProps & React.HTMLProps<HTMLFormElement>>;

export type ValidatedFormForwardRef = React.ForwardRefExoticComponent<React.RefAttributes<ValidatedForm>>;

export type TextInputForwardRef = React.ForwardRefExoticComponent<React.RefAttributes<TextInputProps>>