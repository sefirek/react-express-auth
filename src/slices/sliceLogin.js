import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosPublic } from '../common/axiosPublic';

const login = createAsyncThunk('login/login', async (username, thunkAPI) => {
  const response = await axiosPublic.post('/login', { username });
  return response.data;
});

const logout = createAsyncThunk('login/logout', async () => {
  const response = await axiosPublic.post('/logout');
  return response.data;
});

const initialState = {
  isLogged: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLogged = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLogged = false;
      });
  },
});

export { login, logout };
export default loginSlice.reducer;
