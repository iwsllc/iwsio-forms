import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'

import { Nav } from './common/Nav.js'

export function Layout() {
	const location = useLocation()
	useEffect(() => {
		const input = document.querySelector('.drawer-toggle') as HTMLInputElement
		input.checked = false
	}, [location])
	return (
		<>
			<div className="drawer drawer-mobile lg:drawer-open">
				<input id="my-drawer" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content flex flex-col">
					{/* <!-- Page content here --> */}
					<div className="navbar bg-base-200 text-base-content w-full">
						<label htmlFor="my-drawer" aria-label="Toggle drawer" className="btn btn-ghost cursor-pointer lg:hidden"><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block size-5 stroke-current md:size-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></label>
						<span className="lg:hidden">
							<Link to="/" className="btn btn-ghost text-neutral font-mono text-lg font-bold">@iwsio/forms</Link>
							<span className="text-mono text-neutral text-sm">{import.meta.env.VERSION}</span>
						</span>
					</div>
					<main className="prose max-w-none grow p-10">
						<Outlet />
					</main>
					<footer className="flex-0 footer footer-center bg-base-300 text-base-content p-4">
						<div>
							<p>Created by the Integrated Web Systems, LLC &middot; &copy; 2023</p>
						</div>
					</footer>
				</div>
				<div className="drawer-side">
					<label htmlFor="my-drawer" aria-label="Toggle drawer" className="drawer-overlay" />
					<aside className="bg-base-300 min-h-screen w-60">
						<p className="hidden flex-row items-center gap-4 p-2 lg:flex">
							<Link to="/" className="btn btn-ghost text-neutral font-mono text-lg font-bold">@iwsio/forms</Link>
							<span className="text-mono text-neutral text-sm">{import.meta.env.VERSION}</span>
						</p>
						{/* <!-- Sidebar content here --> */}
						<Nav />
					</aside>
				</div>
			</div>
		</>
	)
}
