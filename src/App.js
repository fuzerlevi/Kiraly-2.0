import './assets/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateGameForm from './components/CreateGameForm';
import Game from './components/Game';
import WaitingPage from './components/WaitingPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={< CreateGameForm />} />
          <Route path="/waiting/:roomID" element={< WaitingPage />} />
          <Route path="/game/:roomID" element={< Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
