import { Link } from 'react-router-dom';

const BookCard = ({ book }) => (
  <Link to={`/book/${book.id}`} className="card">
    <h3>{book.title}</h3>
    <p><strong>{book.author}</strong> - {book.category}</p>
    <p>⭐ {book.rating}/5</p>
  </Link>
);

export default BookCard;