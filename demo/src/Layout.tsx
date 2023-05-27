import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Nav } from './common/Nav'

export function Layout() {
	return (
		<>
			<div className="drawer drawer-mobile">
				<input id="my-drawer" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content flex flex-col">
					{/* <!-- Page content here --> */}
					<div className="navbar bg-base-200 text-base-content w-full">
						<label htmlFor="my-drawer" className="cursor-pointer lg:hidden btn btn-ghost"><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></label>
						<span className="lg:hidden">
							<Link to="/" className="text-lg font-bold font-mono btn btn-ghost text-neutral">@iwsio/forms</Link>
							<span className="text-sm text-mono text-neutral">{process.env.VERSION}</span>
						</span>
					</div>
					<main className="p-10 grow prose max-w-none">
						<Outlet />
					</main>
					<footer className="flex-0 footer footer-center p-4 bg-base-300 text-base-content">
						<div>
							<p>Created by the Integrated Web Systems, LLC &middot; &copy; 2023</p>
						</div>
					</footer>
				</div>
				<div className="drawer-side">
					<label htmlFor="my-drawer" className="drawer-overlay" />
					<aside className="bg-base-300 w-60">
						<p className="p-2 flex flex-row items-center gap-4 hidden lg:flex">
							<Link to="/" className="text-lg font-bold font-mono btn btn-ghost text-neutral">@iwsio/forms</Link>
							<span className="text-sm text-mono text-neutral">{process.env.VERSION}</span>
						</p>
						{/* <!-- Sidebar content here --> */}
						<Nav />
					</aside>
				</div>
			</div>
		</>
	)
}
