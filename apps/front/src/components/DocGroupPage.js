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
                const docGroupsResponse = await api.get('doc_groups', {
                    params: {
                        filter: { doc_set_id: foundDocset.id },
                        per_page: 100
                    }
                });
                const fetchedGroups = docGroupsResponse?.data?.data?.items || [];
                setDocGroups(fetchedGroups);

                // Find the current group
                const group = fetchedGroups.find(g => g.slug === groupSlug);

                if (!group) {
                    setError('Doc group not found');
                    setLoading(false);
                    return;
                }

                setDocGroup(group);

                // Fetch all docs for the sidebar by filtering on doc_group_id for each group
                if (fetchedGroups.length > 0) {
                    const docPromises = fetchedGroups.map(g =>
                        api.get('docs', {
                            params: {
                                filter: { doc_group_id: g.id },
                                per_page: 100
                            }
                        })
                    );
                    const docResponses = await Promise.all(docPromises);
                    const fetchedDocs = docResponses
                        .flatMap(response => response?.data?.data?.items || []);
                    setAllDocs(fetchedDocs);

                    // Set current group's docs
                    const currentDocs = fetchedDocs.filter(doc => doc.doc_group_id === group.id);
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
