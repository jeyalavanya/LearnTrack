import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="container" style={{textAlign: 'center', paddingTop: '4rem'}}>
      <h1 style={{fontSize: '3rem', color: '#dc2626'}}>404 - Page Not Found</h1>
      <p style={{fontSize: '1.2rem', margin: '1rem 0'}}>Invalid route: {location.pathname}</p>
      <Link to="/" className="btn">Go to Home</Link>
    </div>
  );
};

export default NotFound;