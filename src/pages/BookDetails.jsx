import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BookDetails = () => {
  const { id } = useParams();
  const book = useSelector(state => state.books.list.find(b => b.id === id));

  if (!book) return <div className="container"><h1>Book not found</h1></div>;

  return (
    <div>
      <div className="container">
        <h1>{book.title}</h1>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Category:</strong> {book.category}</p>
        <p><strong>Description:</strong> {book.description}</p>
        <p><strong>Rating:</strong> ⭐ {book.rating}/5</p>
        <Link to="/books" className="btn">Back to Browse</Link>
      </div>
    </div>
  );
};

export default BookDetails;