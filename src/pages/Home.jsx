import { Link } from 'react-router-dom';
import { dummyBooks } from '../data/dummyBooks';
import BookCard from '../components/BookCard';

const categories = [...new Set(dummyBooks.map(b => b.category))];
const popular = dummyBooks.slice(0, 4);

const Home = () => (
  <div className="container">
    <h1>Welcome to Online Library</h1>
    <div className="categories">
      <h2>Browse by Category:</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat}><Link to={`/books/${cat}`}>{cat}</Link></li>
        ))}
      </ul>
    </div>
    <div>
      <h2>Popular Books</h2>
      <div className="popular-grid">
        {popular.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  </div>
);

export default Home;