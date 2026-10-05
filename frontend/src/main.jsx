import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import api from "./services/api";

api.get("/health").catch(() => {
  // Backend warm-up is best-effort only.
});

createRoot(document.getElementById('root')).render(
      <BrowserRouter><App /></BrowserRouter>
)
