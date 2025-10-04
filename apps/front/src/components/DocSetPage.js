import { useState, useEffect } from '@wordpress/element';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import DocGroupsList from './DocGroupsList';

function DocSetPage() {
    const { docsetSlug } = useParams();
    const [docset, setDocset] = useState(null);
    const [docGroups, setDocGroups] = useState([]);
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

                // Fetch doc groups using doc_group_ids from the docset
                const docGroupIds = foundDocset.doc_group_ids || [];

                if (docGroupIds.length === 0) {
                    setDocGroups([]);
                    setError(null);
                    setLoading(false);
                    return;
                }

                // Fetch each doc group by ID
                const groupPromises = docGroupIds.map(id => api.get(`doc_groups/${id}`));
                const groupResponses = await Promise.all(groupPromises);

                const fetchedGroups = groupResponses
                    .map(response => response?.data?.data)
                    .filter(group => group !== null && group !== undefined);

                setDocGroups(fetchedGroups);
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
        <div className="p-8 max-w-4xl mx-auto">
            <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to Home</Link>
            <h1 className="text-4xl font-bold text-blue-800 mb-2">{docset.name}</h1>
            {docset.description && <p className="text-gray-600 mb-6">{docset.description}</p>}

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Doc Groups</h2>
                <DocGroupsList groups={docGroups} docsetSlug={docsetSlug} />
            </div>
        </div>
    );
}

export default DocSetPage;
