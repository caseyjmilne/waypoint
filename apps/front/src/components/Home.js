import { useDataStore } from '../store/dataStore';
import DocSetsList from './DocSetsList';

function Home() {
    const { data, loading, error } = useDataStore();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black font-lexend text-slate-900 dark:text-slate-50 mb-4">ARCWP Documentation</h1>

            {loading && (
                <div className="mt-6 space-y-4 animate-pulse">
                    <div className="h-24 bg-slate-900 dark:bg-slate-50 opacity-20 rounded-lg"></div>
                    <div className="h-24 bg-slate-900 dark:bg-slate-50 opacity-20 rounded-lg"></div>
                    <div className="h-24 bg-slate-900 dark:bg-slate-50 opacity-20 rounded-lg"></div>
                </div>
            )}
            {error && <p className="text-orange-600">Error: {error}</p>}

            {!loading && !error && data && (
                <div className="mt-6">
                    <DocSetsList docsets={data.docSets} />

                    <div className="mt-12 pt-8 text-center">
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Powered by Waypoint</p>
                        <p className="text-sm text-slate-900 dark:text-slate-50 max-w-sm mx-auto">Waypoint is a documentation engine for WordPress. It is available at no extra cost to all Gateway license holders.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
