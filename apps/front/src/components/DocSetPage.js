import { useParams } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import Sidebar from './Sidebar';
import DocGroupsList from './DocGroupsList';

function DocSetPage() {
    const { docsetSlug } = useParams();
    const { data, loading, error } = useDataStore();

    if (loading) return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
                <div className="h-10 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-3/4"></div>
                <div className="h-4 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-1/2"></div>
                <div className="space-y-3 mt-8">
                    <div className="h-20 bg-slate-900 dark:bg-slate-50 opacity-20 rounded"></div>
                    <div className="h-20 bg-slate-900 dark:bg-slate-50 opacity-20 rounded"></div>
                    <div className="h-20 bg-slate-900 dark:bg-slate-50 opacity-20 rounded"></div>
                </div>
            </div>
        </div>
    );
    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-orange-600">Error: {error}</p></div>;
    if (!data) return <div className="p-8 max-w-4xl mx-auto"><p className="text-slate-900 dark:text-slate-50">No data available</p></div>;

    const docset = data.getDocSetBySlug(docsetSlug);
    if (!docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-slate-900 dark:text-slate-50">Docset not found</p></div>;

    const docGroups = data.getDocGroupsByDocSetId(docset.id);
    const allDocs = docGroups.flatMap(group => data.getDocsByDocGroupId(group.id));

    return (
        <div className="flex min-h-screen">
            <Sidebar docset={docset} docGroups={docGroups} allDocs={allDocs} data={data} />

            <main className="flex-1 p-8 max-w-4xl">
                <h1 className="text-4xl font-black font-lexend text-slate-900 dark:text-slate-50 mb-2">{docset.name}</h1>
                {docset.description && <p className="text-slate-900 dark:text-slate-50 mb-6">{docset.description}</p>}

                <div className="mt-6">
                    <h2 className="text-2xl font-extrabold font-lexend text-slate-900 dark:text-slate-50 mb-4">Doc Groups</h2>
                    <DocGroupsList groups={docGroups} docsetSlug={docsetSlug} />
                </div>
            </main>
        </div>
    );
}

export default DocSetPage;
