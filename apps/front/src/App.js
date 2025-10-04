import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Waypoint</h1>
            <p className="text-gray-600">Multi-set documentation management for WordPress</p>
        </div>
    );
}

function Test() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-green-800 mb-4">Test Page</h1>
            <p className="text-gray-600">This is a test route at /docs/test</p>
        </div>
    );
}

function App() {
    return (
        <Router basename="/docs">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<Test />} />
            </Routes>
        </Router>
    );
}

export default App;
