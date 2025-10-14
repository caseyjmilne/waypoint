import { useState, useEffect } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import api from '../api';
import Sidebar from './Sidebar';
import DocGroupsList from './DocGroupsList';

function DocSetPage() {
    const { docsetSlug } = useParams();
    const [docset, setDocset] = useState(null);
    const [docGroups, setDocGroups] = useState([]);
    const [allDocs, setAllDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocSet = async () => {
            try {
                setLoading(true);

                // Fetch docsets and find the one with matching slug
                const docsetsResponse = await api.get('doc_sets');
                const docsets = docsetsResponse?.data?.data?.items || [];
                const foundDocset = docsets.find(d => d.slug === docsetSlug);

                if (!foundDocset) {
                    setError('Docset not found');
                    setLoading(false);
                    return;
                }

                setDocset(foundDocset);

                // Fetch doc groups by filtering on doc_set_id
                const docGroupsResponse = await api.get('doc_groups', {
                    params: {
                        filter: { doc_set_id: foundDocset.id },
                        per_page: 100
                    }
                });
                const fetchedGroups = docGroupsResponse?.data?.data?.items || [];
                setDocGroups(fetchedGroups);

                // Fetch all docs for the sidebar by filtering on doc_group_id for each group
                if (fetchedGroups.length > 0) {
                    const docPromises = fetchedGroups.map(group =>
                        api.get('docs', {
                            params: {
                                filter: { doc_group_id: group.id },
                                per_page: 100
                            }
                        })
                    );
                    const docResponses = await Promise.all(docPromises);
                    const fetchedDocs = docResponses
                        .flatMap(response => response?.data?.data?.items || []);
                    setAllDocs(fetchedDocs);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching docset:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocSet();
    }, [docsetSlug]);

    if (loading) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Loading...</p></div>;
    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-red-600">Error: {error}</p></div>;
    if (!docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Docset not found</p></div>;

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
