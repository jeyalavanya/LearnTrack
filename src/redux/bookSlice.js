import { createSlice, nanoid } from '@reduxjs/toolkit';
import { dummyBooks } from '../data/dummyBooks';

const bookSlice = createSlice({
  name: 'books',
  initialState: { list: dummyBooks },
  reducers: {
    addBook: (state, action) => {
      state.list.unshift({ id: nanoid(), ...action.payload });
    }
  }
});

export const { addBook } = bookSlice.actions;
export default bookSlice.reducer;