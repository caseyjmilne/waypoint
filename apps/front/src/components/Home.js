import { useState, useEffect } from '@wordpress/element';
import api from '../api';
import DocSetsList from './DocSetsList';

function Home() {
    const [docsets, setDocsets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const docsetsResponse = await api.get('doc_sets');

                const docsetsItems = docsetsResponse?.data?.data?.items;
                setDocsets(Array.isArray(docsetsItems) ? docsetsItems : []);

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Waypoint</h1>
            <p className="text-gray-600 mb-6">Multi-set documentation management for WordPress</p>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Documentation Sets</h2>
                    <DocSetsList docsets={docsets} />
                </div>
            )}
        </div>
    );
}

export default Home;
