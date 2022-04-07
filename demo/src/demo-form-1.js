import React, { useState } from 'react'
import { ValidatedForm, TextInput } from '@iwsio/forms'

const DemoForm1 = () => {
  const [name, setName] = useState('')
  const [number1, setNumber1] = useState('0')
  const [number2, setNumber2] = useState('0')
  const [number2Error, setNumber2Error] = useState()
  const [number1Error, setNumber1Error] = useState()

  const handleSubmit = () => {
    alert('submitted')
  }

  function handleNumber2Change(e) {
    setNumber2Error(undefined)
    const value = e.target.value
    setNumber2(value) // always set the text
    const nValue = +value
    
    if (nValue < 0) return setNumber2Error('Value must be greater than 0.')
    if (nValue > 1) return setNumber2Error('Value must be less than 1.')
    console.log(`made it! ${value}; nValue: ${nValue}`)
  }

  return (
    <ValidatedForm onValidSubmit={handleSubmit}>
      <div className="col">
        <label className="form-label" htmlFor='name'>Name</label>
        <TextInput className="form-control" id="name" name="name" error={number1Error} value={name} onChange={(e) => { setName(e.target.value); if (e.target.value === '12') setNumber1Error('custom error') }} required validationMessageComponent={<div className="form-text invalid-feedback" />} />

        <label className="form-label" htmlFor="number1">Number</label>
        <TextInput className="form-control" type="number" step="0.1" min="0" max="1" id="number1" name="number1" value={number1} onChange={(e) => { setNumber1(e.target.value) }}  validationMessageComponent={<div className="form-text invalid-feedback" />} />


        <label className="form-label" htmlFor="number2">Number (as Text) (&gt; 0, &gt;= 1)</label>
        <TextInput className="form-control" error={number2Error} id="number2" name="number2" value={number2} onChange={handleNumber2Change} pattern="^[\d.]*$"  validationMessageComponent={<div className="form-text invalid-feedback" />} />
      </div>
      <div className="col">
        <button type="submit">Submit</button>
      </div>
    </ValidatedForm>
  )
}

export default DemoForm1