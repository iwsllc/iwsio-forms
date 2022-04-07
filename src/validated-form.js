import React, { forwardRef, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'

/** @type { import("./types").ValidatedFormForwardRef } */
const ValidatedForm = forwardRef(({ children, onValidSubmit, className, reportValidity, ...props }, ref) => {
  const backupRef = useRef()
  const refForm = useMemo(() => {
    if (!ref) return backupRef
    return ref
  }, [ref])

  const [validatedClassName, setValidatedClassName] = useState('needs-validation')

  const consolidatedClassName = useMemo(() => `${className != null ? className : ''} ${validatedClassName}`, [className, validatedClassName])

  function onSubmit(event) {
    setValidatedClassName('needs-validation')
    event.preventDefault()
    event.stopPropagation()
    const form = refForm.current
    setValidatedClassName('was-validated')
    if (form.checkValidity()) {
      if (onValidSubmit) onValidSubmit()
    }
    if (reportValidity) refForm.current.reportValidity()
  }

  function onReset() {
    setValidatedClassName('needs-validation')
  }

  return (
    <form ref={refForm} onSubmit={onSubmit} onReset={onReset} className={consolidatedClassName} noValidate {...props}>
      {children}
    </form>
  )
})

ValidatedForm.propTypes = {
  onValidSubmit: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  onReset: PropTypes.func,
  reportValidity: PropTypes.bool
}

ValidatedForm.defaultProps = {
  reportValidity: false,
  className: ''
}

export default ValidatedForm
