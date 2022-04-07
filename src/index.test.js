import Default, { TextInput, TextArea, CheckboxInput, ValidatedForm } from '../dist'

describe('Module Exports', () => {
  describe('Defaults', () => {
    it('should include TextArea', () => expect(Default.TextArea).toBeTruthy())
    it('should include TextInput', () => expect(Default.TextInput).toBeTruthy())
    it('should include CheckboxInput', () => expect(Default.CheckboxInput).toBeTruthy())
    it('should include ValidatedForm', () => expect(Default.ValidatedForm).toBeTruthy())
  })
  describe('Named Exports', () => {
    it('should include TextArea', () => expect(TextArea).toBeTruthy())
    it('should include TextInput', () => expect(TextInput).toBeTruthy())
    it('should include CheckboxInput', () => expect(CheckboxInput).toBeTruthy())
    it('should include ValidatedForm', () => expect(ValidatedForm).toBeTruthy())
  })
})
