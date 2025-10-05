import { useState, useEffect } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import api from '../api';
import Sidebar from './Sidebar';
import DocsList from './DocsList';

function DocGroupPage() {
    const { docsetSlug, groupSlug } = useParams();
    const [docset, setDocset] = useState(null);
    const [docGroup, setDocGroup] = useState(null);
    const [docGroups, setDocGroups] = useState([]);
    const [docs, setDocs] = useState([]);
    const [allDocs, setAllDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocGroup = async () => {
            try {
                setLoading(true);

                // Fetch docset
                const docsetsResponse = await api.get('doc_sets');
                const docsets = docsetsResponse?.data?.data?.items || [];
                const foundDocset = docsets.find(d => d.slug === docsetSlug);

                if (!foundDocset) {
                    setError('Docset not found');
                    setLoading(false);
                    return;
                }

                setDocset(foundDocset);

                // Fetch all doc groups for the docset
                const docGroupIds = foundDocset.doc_group_ids || [];
                const groupPromises = docGroupIds.map(id => api.get(`doc_groups/${id}`));
                const groupResponses = await Promise.all(groupPromises);
                const fetchedGroups = groupResponses
                    .map(response => response?.data?.data)
                    .filter(group => group !== null && group !== undefined);

                setDocGroups(fetchedGroups);

                // Find the current group
                const group = fetchedGroups.find(g => g.slug === groupSlug);

                if (!group) {
                    setError('Doc group not found');
                    setLoading(false);
                    return;
                }

                setDocGroup(group);

                // Fetch all docs for the sidebar
                const allDocIds = fetchedGroups.flatMap(g => g.doc_ids || []);
                if (allDocIds.length > 0) {
                    const docPromises = allDocIds.map(id => api.get(`docs/${id}`));
                    const docResponses = await Promise.all(docPromises);
                    const fetchedDocs = docResponses
                        .map(response => response?.data?.data)
                        .filter(doc => doc !== null && doc !== undefined);
                    setAllDocs(fetchedDocs);

                    // Set current group's docs
                    const groupDocIds = group.doc_ids || [];
                    const currentDocs = groupDocIds
                        .map(id => fetchedDocs.find(d => d.id === id))
                        .filter(doc => doc !== undefined);
                    setDocs(currentDocs);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching doc group:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocGroup();
    }, [docsetSlug, groupSlug]);

    if (loading) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Loading...</p></div>;
    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-red-600">Error: {error}</p></div>;
    if (!docGroup || !docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Doc group not found</p></div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar docset={docset} docGroups={docGroups} allDocs={allDocs} />

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
