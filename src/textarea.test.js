import React, { useState } from 'react'
import { render, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextArea from './textarea'

describe('TextArea', function() {
  const InputContainer = ({ changeSpy, init, formClass, initError, fakeErrorValue, validationMessageComponent, ...props }) => {
    const [value, setValue] = useState(init ?? 'test')
    const [error, setError] = useState(initError)
    return (
      <form className={formClass}>
        <TextArea
          name="test"
          data-testid="test"
          value={value}
          error={error}
          onChange={(e) => {
            changeSpy(e.target.value)
            setValue(e.target.value)
            if (e.target.value === fakeErrorValue) setError('upstream error')
          }}
          validationMessageComponent={validationMessageComponent}
          {...props}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }

  it('should handle input correctly', async() => {
    const handleSpy = jest.fn()
    const { getByTestId } = render(<InputContainer changeSpy={handleSpy} init="" required fakeErrorValue="12" validationMessageComponent={<span />} />)

    const input = getByTestId('test')

    // browser validation; jsdom works with required
    expect(input.value).toEqual('')

    act(() => {
      input.checkValidity()
    })
    // await userEvent.type(input, '{tab}{enter}')
    expect(input.validationMessage).toEqual('Constraints not satisfied')

    // upstream validation (i.e. error prop is passed with a value); here: we're tricking it with a test value
    await userEvent.type(input, '12')
    expect(handleSpy).toHaveBeenCalledTimes(2)
    expect(input.value).toEqual('12')
    expect(input.validationMessage).toEqual('upstream error')

    // no errors, should clear validation state on the dom.
    await userEvent.type(input, '3')
    expect(input.value).toEqual('123')
    expect(input.validationMessage).toEqual('')
  })

  it('should show validation if manual error provided', async function() {
    const handleSpy = jest.fn()
    const { getByTestId } = render(<InputContainer changeSpy={handleSpy} init="" required initError="custom error" validationMessageComponent={<span />} />)
    expect(getByTestId('textarea-test-child-0')).toHaveTextContent('custom error')
  })

  it('should always show validation child DOM if provided', async function() {
    const handleSpy = jest.fn()
    const { queryByTestId } = render(<InputContainer changeSpy={handleSpy} init="" validationMessageComponent={<span />} />)
    const input = queryByTestId('textarea-test-child-0')
    expect(input).toBeInTheDocument()
  })

  it('should not show validation message if no component provided and invalid.', async function() {
    const handleSpy = jest.fn()
    const { queryByTestId } = render(<InputContainer formClass="was-validated" changeSpy={handleSpy} init="" required initError="custom error" />)
    expect(queryByTestId('textarea-test-child-0')).toBeFalsy()
  })
})
