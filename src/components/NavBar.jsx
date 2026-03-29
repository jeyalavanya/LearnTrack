// NavBar.jsx
// Renders the top navigation menu and marks the active route.
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  // Use the current route to highlight the active navigation item.
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/books" className={location.pathname.startsWith('/books') && location.pathname !== '/add-book' ? 'active' : ''}>Browse Books</Link>
        <Link to="/add-book" className={location.pathname === '/add-book' ? 'active' : ''}>Add Book</Link>
      </div>
    </nav>
  );
};

export default NavBar;