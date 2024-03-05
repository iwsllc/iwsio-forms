import { Link } from 'react-router-dom'

export const Nav = () => (
	<ul className="menu p-2 text-sm">
		<li className="menu-title">
			<span>Getting Started</span>
		</li>
		<li><Link to="/">Overview</Link></li>
		<li><Link to="/install">Installing</Link></li>
		<li><Link to="/examples">Input Examples</Link></li>
		<li><Link to="/input">Input Details</Link></li>
		<li><Link to="/invalid-feedback">Styled Feedback</Link></li>
		<li><Link to="/upstream-test">Async Init</Link></li>
	</ul>
)
