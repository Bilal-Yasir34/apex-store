import React from 'react';
import ReactDOM from 'react-dom/client';
// HashRouter is excellent for hosting on Render/Vercel to avoid routing errors
import { HashRouter as Router } from 'react-router-dom';
import App from './app'; // Capitalized to match your App.tsx filename
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <div className="selection:bg-[#D4AF37] selection:text-white">
          <App />
        </div>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);