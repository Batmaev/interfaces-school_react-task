import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/shared/Header/Header';
import Analytics from './pages/Analytics/Analytics';
import Generate from './pages/Generate/Generate';
import History from './pages/History/History';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
