// App.jsx
// Main router wrapper for page navigation.
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import BrowseBooks from './pages/BrowseBooks';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';

const AppContent = () => {
  const location = useLocation();
  // Do not render the navbar on the unmatched route fallback.
  const showNav = location.pathname !== '*';
  return (
    <>
      {showNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BrowseBooks />} />
        <Route path="/books/:category" element={<BrowseBooks />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;