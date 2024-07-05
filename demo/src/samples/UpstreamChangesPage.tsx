import { ControlledFieldManager, FieldValues, InputField, useFieldState } from '@iwsio/forms'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { fetchMovies } from './fetchSample'

export const UpstreamChangesPage = () => {
	const { data, refetch, isFetching, isSuccess } = useQuery({ queryKey: ['/movies.json'], queryFn: () => fetchMovies() })
	const [success, setSuccess] = useState(false)
	const [doingSomething, setDoingSomething] = useState(false)

	const fieldState = useFieldState({ title: '', year: '', director: '' })
	const { setFields, reset, isFormBusy, toggleFormBusy } = fieldState

	const handleValidSubmit = useCallback((_values: FieldValues) => {
		setDoingSomething(true) // kick off async process
	}, [toggleFormBusy, setSuccess])

	useEffect(() => {
		if (!isSuccess || isFetching) return
		if (data == null || data.length === 0) return
		const { title, year, director } = data[0]
		setFields({ title, year, director })
	}, [isFetching, isSuccess])

	useEffect(() => {
		if (!doingSomething) return

		const id = setTimeout(() => {
			setDoingSomething(_old => false)

			// NOTE: just showing we can set the busy flag from anywhere (not just in the submit handler)
			setSuccess(true)
			toggleFormBusy(false)
		}, 500)

		return () => {
			clearTimeout(id)
		}
	}, [doingSomething])

	return (
		<ControlledFieldManager fieldState={fieldState} onValidSubmit={handleValidSubmit} holdBusyAfterSubmit className="flex flex-col gap-2 w-1/2" nativeValidation>
			<InputField placeholder="Title" name="title" type="text" className="input input-bordered" required />
			<InputField placeholder="Year" name="year" type="number" pattern="^\d+$" className="input input-bordered" required />
			<InputField placeholder="Director" name="director" type="text" className="input input-bordered" required />
			<div className="flex gap-2">
				<button type="reset" className="btn btn-info" onClick={() => refetch()}>Re-fetch</button>
				<button type="reset" className="btn" onClick={() => { reset(); setSuccess(false) }}>Reset</button>
				{/*
					NOTE: using holdBusyAfterSubmit on the FieldManager, which keeps the busy
					status true until manually clearing it. This allows us to use the `isFormBusy` flag
					to style the form and disable the submission button while an async process is busy.
				*/}
				<button type="submit" disabled={isFormBusy} className={`btn ${success ? 'btn-success' : 'btn-primary'} ${isFormBusy ? 'btn-disabled' : ''}`}>
					Submit
				</button>
			</div>
			<p>
				Try clicking
				{' '}
				<strong>Reset</strong>
				{' '}
				to reset the form. Then
				{' '}
				<strong>Submit</strong>
				{' '}
				will show validation errors. Then try clicking the
				{' '}
				<strong>Re-fetch</strong>
				{' '}
				button to fetch new data from the server and reset the field validation.
			</p>
		</ControlledFieldManager>
	)
}
