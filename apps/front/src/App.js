import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from '@wordpress/element';
import api from './api';

function Home() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                setLoading(true);
                const response = await api.get('docs');
                const data = response?.data?.data;
                setDocs(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error fetching docs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Waypoint</h1>
            <p className="text-gray-600 mb-6">Multi-set documentation management for WordPress</p>

            {loading && <p className="text-gray-500">Loading docs...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Available Docs</h2>
                    {docs.length === 0 ? (
                        <p className="text-gray-500">No docs found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {docs.map((doc) => (
                                <li key={doc.id} className="p-4 border border-gray-200 rounded-lg">
                                    <h3 className="font-semibold">{doc.title || 'Untitled'}</h3>
                                    {doc.content && <p className="text-sm text-gray-600 mt-1">{doc.content}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
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
