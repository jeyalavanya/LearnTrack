import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
      <Link to="/books" className={location.pathname.startsWith('/books') && location.pathname !== '/add-book' ? 'active' : ''}>Browse Books</Link>
      <Link to="/add-book" className={location.pathname === '/add-book' ? 'active' : ''}>Add Book</Link>
    </nav>
  );
};

export default NavBar;