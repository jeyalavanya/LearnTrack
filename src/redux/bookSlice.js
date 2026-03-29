// bookSlice.js
// Defines the books slice and handles book-related state updates.
import { createSlice, nanoid } from '@reduxjs/toolkit';
import { dummyBooks } from '../data/dummyBooks';

const bookSlice = createSlice({
  name: 'books',
  initialState: { list: dummyBooks },
  reducers: {
    // Adds a new book to the start of the list with a generated id.
    addBook: (state, action) => {
      // Use `nanoid` to create a stable unique id for the new book.
      state.list.unshift({ id: nanoid(), ...action.payload });
    }
  }
});

export const { addBook } = bookSlice.actions;
export default bookSlice.reducer;