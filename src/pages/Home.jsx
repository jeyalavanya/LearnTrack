// Home.jsx
// Landing page showcasing popular books and category navigation.
import { Link } from 'react-router-dom';
import { dummyBooks } from '../data/dummyBooks';
import BookCard from '../components/BookCard';

// Build a unique category list and pick the first four popular books.
const categories = [...new Set(dummyBooks.map(b => b.category))];
const popular = dummyBooks.slice(0, 4);

const Home = () => (
  <div className="container">
    <section className="hero">
      <div>
        <h1>Discover your next favorite book with style.</h1>
        <p>Browse premium collections, explore top categories, and keep your library organized in a sleek modern interface.</p>
      </div>
      <div className="hero-actions">
        <Link to="/books" className="btn">Explore Books</Link>
        <Link to="/add-book" className="btn">Add New Book</Link>
      </div>
    </section>

    <div className="categories">
      <h2>Browse by Category:</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat}><Link to={`/books/${cat}`}>{cat}</Link></li>
        ))}
      </ul>
    </div>
    <div className='categories'>
      <h2>Popular Books</h2>
      <div className="popular-grid">
        {popular.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  </div>
);

export default Home;