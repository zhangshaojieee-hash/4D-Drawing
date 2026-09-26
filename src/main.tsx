import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TouchStudio } from './pages/TouchStudio';
import './styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><TouchStudio /></StrictMode>);
