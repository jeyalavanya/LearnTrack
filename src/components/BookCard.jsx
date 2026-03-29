// BookCard.jsx
// Displays a single book item with title, author, category, and rating.
import { Link } from 'react-router-dom';

// BookCard renders a single clickable book preview card.
const BookCard = ({ book }) => (
  <Link to={`/book/${book.id}`} className="card">
    <h3>{book.title}</h3>
    <p><strong>{book.author}</strong> - {book.category}</p>
    <p>Rating: {book.rating}/5</p>
  </Link>
);

export default BookCard;