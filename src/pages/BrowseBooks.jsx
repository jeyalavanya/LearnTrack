import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import BookCard from '../components/BookCard';

const BrowseBooks = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const [localSearch, setLocalSearch] = useState(search);
  const books = useSelector(state => state.books.list);

  const filtered = books.filter(book => {
    const matchesCat = !category || book.category === category;
    const matchesSearch = !search && !localSearch || 
      book.title.toLowerCase().includes(localSearch.toLowerCase()) || 
      book.author.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="container">
        <h1>{category ? `${category} Books` : 'All Books'}</h1>
        <input 
          type="text" 
          placeholder="Search by title or author..." 
          className="search-input"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
        />
        {filtered.length ? (
          <div className="grid">
            {filtered.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;