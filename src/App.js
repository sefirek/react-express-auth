import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './slices/sliceLogin';
import { useState } from 'react';

function App() {
  const isLogged = useSelector((state) => state.login.isLogged);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');

  if (isLogged)
    return (
      <div>
        Zalogowano
        <button onClick={() => dispatch(logout())}>Wyloguj</button>
      </div>
    );

  return (
    <div>
      <label>Użytkownik Rafał</label>
      <input
        type='text'
        onInput={(event) => setUsername(event.target.value)}
        required
      />
      <button onClick={() => dispatch(login(username))}>Zaloguj</button>
    </div>
  );
}

export default App;
