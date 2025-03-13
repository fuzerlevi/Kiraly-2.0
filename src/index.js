import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import './assets/index.css';
import App from './App';
import { GameProvider } from './components/GameContext'; // Import the GameProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameProvider> {/* Wrap your App component with GameProvider */}
      <App />
    </GameProvider>
  </React.StrictMode>
);
