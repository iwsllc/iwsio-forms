import React, { forwardRef, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const CheckboxInput = forwardRef(({ name, error, checked, onChange, ...more }, ref) => {
  let localRef = ref
  if (!ref) localRef = useRef()

  function localOnChange(e) {
    e.target.setCustomValidity('')
    onChange(e)
  }

  useEffect(() => {
    if (error) localRef.current.setCustomValidity(error)
    else localRef.current.setCustomValidity('')
  }, [error])

  return (
    <input type="checkbox" ref={ref} name={name} id={name} checked={checked} onChange={localOnChange} {...more} />
  )
})

CheckboxInput.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string
}

CheckboxInput.defaultProps = {
  className: 'checkbox'
}

export default CheckboxInput
