import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DocSetPage from './components/DocSetPage';
import DocGroupPage from './components/DocGroupPage';

function App() {
    return (
        <Router basename="/docs">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:docsetSlug" element={<DocSetPage />} />
                <Route path="/:docsetSlug/:groupSlug" element={<DocGroupPage />} />
            </Routes>
        </Router>
    );
}

export default App;
