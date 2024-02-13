import { ControlledFieldManager, FieldValues, InputField, useFieldState } from '@iwsio/forms'
import { useEffect, useState } from 'react'
import { fetchMovies } from './fetchSample'
import { useQuery } from '@tanstack/react-query'

export const UpstreamChangesPage = () => {
	const { data, refetch, isFetching, isSuccess } = useQuery({ queryKey: ['/movies.json'], queryFn: () => fetchMovies() })
	const [success, setSuccess] = useState(false)
	const handleValidSubmit = (_values: FieldValues) => {
		setSuccess(true)
	}
	const fieldState = useFieldState({ title: '', year: '', director: '' }, undefined, handleValidSubmit)
	const { setFields, reset } = fieldState

	useEffect(() => {
		if (!isSuccess || isFetching) return
		if (data == null || data.length === 0) return
		const { title, year, director } = data[0]
		setFields({ title, year, director })
	}, [isFetching, isSuccess])

	return (
		<ControlledFieldManager fieldState={fieldState} className="flex flex-col gap-2 w-1/2" nativeValidation>
			<InputField placeholder="Title" name="title" type="text" className="input input-bordered" required />
			<InputField placeholder="Year" name="year" type="number" pattern="^\d+$" className="input input-bordered" required />
			<InputField placeholder="Director" name="director" type="text" className="input input-bordered" required />
			<div className="flex gap-2">
				<button type="reset" className="btn btn-info" onClick={() => refetch()}>Re-fetch</button>
				<button type="reset" className="btn" onClick={() => { reset(); setSuccess(false) }}>Reset</button>
				<button type="submit" className={`btn ${success ? 'btn-success' : 'btn-primary'}`}>
					Submit
				</button>
			</div>
			<p>
				Try clicking <strong>Reset</strong> to reset the form. Then <strong>Submit</strong> will show validation errors. Then try clicking the <strong>Re-fetch</strong> button to fetch new data from the server and reset the field validation.
			</p>
		</ControlledFieldManager>
	)
}
