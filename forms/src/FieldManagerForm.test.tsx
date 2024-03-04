import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldManagerForm } from './FieldManagerForm'
import * as useFieldManager from './useFieldManager'

vi.mock('./useFieldManager')

describe('FieldManagerForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should render children, handle report validation on submit, call onValidSubmit with fields in valid state', async () => {
		const spyOnValidSubmit = vi.fn()
		const spySetReportValidation = vi.fn()
		const spyToggleFormBusy = vi.fn()
		vi.spyOn(useFieldManager, 'useFieldManager').mockReturnValue({
			fields: { field: '123' },
			setReportValidation: spySetReportValidation,
			toggleFormBusy: spyToggleFormBusy
		} as any)
		render(<FieldManagerForm onValidSubmit={spyOnValidSubmit}><button type="submit" data-testid="submit">test</button></FieldManagerForm>)

		await userEvent.click(screen.getByTestId('submit'))

		expect(spySetReportValidation).toHaveBeenCalledWith(true)
		expect(spyToggleFormBusy).toHaveBeenCalledWith(true)
		expect(spyOnValidSubmit).toHaveBeenCalledWith({ field: '123' })
		expect(spyToggleFormBusy).toHaveBeenCalledWith(false) // clears after submit
	})

	it('should render children, handle report validation on submit, call onValidSubmit with fields in valid state AND NOT clear busy', async () => {
		const spyOnValidSubmit = vi.fn()
		const spySetReportValidation = vi.fn()
		const spyToggleFormBusy = vi.fn()
		vi.spyOn(useFieldManager, 'useFieldManager').mockReturnValue({
			fields: { field: '123' },
			setReportValidation: spySetReportValidation,
			toggleFormBusy: spyToggleFormBusy
		} as any)
		render(<FieldManagerForm onValidSubmit={spyOnValidSubmit} holdBusyAfterSubmit><button type="submit" data-testid="submit">test</button></FieldManagerForm>)

		await userEvent.click(screen.getByTestId('submit'))

		expect(spySetReportValidation).toHaveBeenCalledWith(true)
		expect(spyToggleFormBusy).toHaveBeenCalledWith(true)
		expect(spyOnValidSubmit).toHaveBeenCalledWith({ field: '123' })
		expect(spyToggleFormBusy).not.toHaveBeenCalledWith(false) // not clear after submit
	})
})
