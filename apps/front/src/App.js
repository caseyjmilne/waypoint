import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Waypoint</h1>
            <p className="text-gray-600">Multi-set documentation management for WordPress</p>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/docs" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
