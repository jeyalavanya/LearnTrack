// BookDetails.jsx
// Displays details for a single selected book.
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BookDetails = () => {
  const { id } = useParams();
  // Look up the selected book by id from Redux state.
  const book = useSelector(state => state.books.list.find(b => b.id === id));

  // If there is no matching book, show a simple error page.
  if (!book) return <div className="container"><h1>Book not found</h1></div>;

  return (
    <div className="container">
      <section className="book-details">
        <article className="details-panel">
          <h1>{book.title}</h1>
          <div className="book-meta">
            <span><strong>Author : </strong> {book.author}</span>
            <span><strong>Category : </strong> {book.category}</span>
          </div>
          <p className="book-description">{book.description}</p>
          <div>⭐ {book.rating}/5</div>
          <Link to="/books" className="btn">Back to Browse</Link>
        </article>
      </section>
    </div>
  );
};

export default BookDetails;