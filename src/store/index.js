import { configureStore } from '@reduxjs/toolkit';
import sliceLogin from '../slices/sliceLogin';

export const store = configureStore({
  reducer: {
    login: sliceLogin,
  },
});
