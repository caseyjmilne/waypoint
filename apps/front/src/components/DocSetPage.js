import { useParams } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import Sidebar from './Sidebar';
import DocGroupsList from './DocGroupsList';

function DocSetPage() {
    const { docsetSlug } = useParams();
    const { data, loading, error } = useDataStore();

    if (loading) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Loading...</p></div>;
    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-red-600">Error: {error}</p></div>;
    if (!data) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">No data available</p></div>;

    const docset = data.getDocSetBySlug(docsetSlug);
    if (!docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Docset not found</p></div>;

    const docGroups = data.getDocGroupsByDocSetId(docset.id);
    const allDocs = docGroups.flatMap(group => data.getDocsByDocGroupId(group.id));

    return (
        <div className="flex min-h-screen">
            <Sidebar docset={docset} docGroups={docGroups} allDocs={allDocs} />

            <main className="flex-1 p-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-blue-800 mb-2">{docset.name}</h1>
                {docset.description && <p className="text-gray-600 mb-6">{docset.description}</p>}

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Doc Groups</h2>
                    <DocGroupsList groups={docGroups} docsetSlug={docsetSlug} />
                </div>
            </main>
        </div>
    );
}

export default DocSetPage;
