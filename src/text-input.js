import React, { forwardRef, useEffect, useRef, useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

/**
 * @type import('./types').TextInputProps
 */
export const TextInput = forwardRef(({ error, name, onChange, value, type, validationMessageComponent, ...other }, ref) => {
  const backupRef = useRef()
  const localRef = useMemo(() => {
    if (!ref) return backupRef
    return ref
  }, [ref])

  const [localError, setLocalError] = useState(error)

  function localOnChange(e) {
    e.target.setCustomValidity('')
    setLocalError(undefined)
    onChange(e)
    e.target.checkValidity()
  }

  const handleInvalid = useCallback((e) => {
    setLocalError(localRef.current.validationMessage)
  }, [localRef])

  useEffect(() => {
    const textInputRef = localRef.current // local ref for use during destruction.
    textInputRef.addEventListener('invalid', handleInvalid)
    return () => {
      textInputRef.removeEventListener('invalid', handleInvalid)
    }
  }, [handleInvalid, localRef])

  useEffect(() => {
    if (error == null) return localRef.current?.setCustomValidity('')
    localRef.current.setCustomValidity(error)
  }, [localRef, error])

  return (
    <>
      <input
        ref={localRef}
        name={name}
        type={type}
        value={value}
        onChange={localOnChange}
        {...other}
      />
      {validationMessageComponent
        ? React.Children.map(validationMessageComponent, (child, cx) => (
          // NOTE: child.props should override this custom data-testid
          React.cloneElement(child, { 'data-testid': `text-input-${name}-child-${cx}`, ...child.props }, localError || error)
        ))
        : null}
    </>
  )
})

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  validationMessageComponent: PropTypes.element
}

TextInput.defaultProps = {
  type: 'text'
}

export default TextInput
