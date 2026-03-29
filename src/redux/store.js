// store.js
import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './bookSlice';

// Configure the Redux store and attach the books reducer under the `books` key.
export const store = configureStore({ reducer: { books: bookReducer } });