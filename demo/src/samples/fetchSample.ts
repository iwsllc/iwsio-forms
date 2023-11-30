export const fetchMovies = async () => {
	return (await fetch('/movies.json')).json() // just a quick example
}
