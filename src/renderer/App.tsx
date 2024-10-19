import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [crawlerResult, setCrawlerResult] = useState('');
  const [url, setUrl] = useState('');

  const runCrawler = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('run-crawler', url);
      setCrawlerResult(result);
    } catch (error) {
      console.error('Error running crawler:', error);
      setCrawlerResult('Error: ' + error.message);
    }
  };

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
 
        <button onClick={runCrawler}>Run Crawler</button>
      </div>
      <div>
        <h2>Crawler Result:</h2>
        <pre>{crawlerResult}</pre>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
