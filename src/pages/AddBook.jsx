import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../redux/bookSlice';
import NavBar from '../components/NavBar';
import { dummyBooks } from '../data/dummyBooks'; // Reuse from dummy

const categoriesSet = [...new Set(dummyBooks.map(b => b.category))];

const AddBook = () => {
  const [formData, setFormData] = useState({ title: '', author: '', category: '', description: '', rating: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating 1-5 required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(addBook(formData));
      navigate('/books');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="form-container">
        <h1 style={{textAlign: 'center', marginBottom: '2rem'}}>Add New Book</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label>Author</label>
            <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            {errors.author && <span className="error">{errors.author}</span>}
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="">Select...</option>
              {categoriesSet.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <span className="error">{errors.category}</span>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label>Rating (1-5)</label>
            <input type="number" min="1" max="5" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
            {errors.rating && <span className="error">{errors.rating}</span>}
          </div>
          <button type="submit" className="btn">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;