import { useDataStore } from '../store/dataStore';
import DocSetsList from './DocSetsList';

function Home() {
    const { data, loading, error } = useDataStore();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">ARC Suite Documentation</h1>
            <p className="text-gray-600 mb-6">ARC Suite is a collection of WordPress plugins and Javascript packages that work together to create a cohesive/scalable/modern WP powered framework that is precision engineered for the AI-era of software development.</p>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && data && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Documentation Sets</h2>
                    <DocSetsList docsets={data.docSets} />

                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-lg font-semibold text-gray-700 mb-2">Powered by Waypoint</p>
                        <p className="text-sm text-gray-500">Waypoint is an AI-powered documentation engine for WordPress.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
