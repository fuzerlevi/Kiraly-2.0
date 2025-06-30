import './assets/App.css';
import React, { useEffect } from 'react'; // ✅ import useEffect
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateGameForm from './components/CreateGameForm';
import Game from './components/Game';
import WaitingPage from './components/WaitingPage';

function App() {
  // ✅ Block context menu on long-pressing images
  useEffect(() => {
    const preventContextMenu = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

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
