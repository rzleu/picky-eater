import React from 'react';
import LoginForm from './components/session/Login';
import Lobby from './components/lobby';
import './index.css';

function App() {
  return (
    <div>
      <LoginForm />
      <Lobby />
    </div>
  );
}

export default App;
