import { useParams } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import Sidebar from './Sidebar';
import DocsList from './DocsList';

function DocGroupPage() {
    const { docsetSlug, groupSlug } = useParams();
    const { data, loading, error } = useDataStore();

    if (loading) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Loading...</p></div>;
    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-red-600">Error: {error}</p></div>;
    if (!data) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">No data available</p></div>;

    const docset = data.getDocSetBySlug(docsetSlug);
    if (!docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Docset not found</p></div>;

    const docGroups = data.getDocGroupsByDocSetId(docset.id);
    const docGroup = data.getDocGroupBySlugAndDocSetId(groupSlug, docset.id);
    if (!docGroup) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Doc group not found</p></div>;

    const docs = data.getDocsByDocGroupId(docGroup.id);
    const allDocs = docGroups.flatMap(group => data.getDocsByDocGroupId(group.id));

    return (
        <div className="flex min-h-screen">
            <Sidebar docset={docset} docGroups={docGroups} allDocs={allDocs} data={data} />

            <main className="flex-1 p-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-blue-800 mb-2">{docGroup.title}</h1>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Docs</h2>
                    <DocsList docs={docs} docsetSlug={docsetSlug} groupSlug={groupSlug} />
                </div>
            </main>
        </div>
    );
}

export default DocGroupPage;
