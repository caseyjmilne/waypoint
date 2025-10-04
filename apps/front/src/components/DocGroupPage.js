import { useState, useEffect } from '@wordpress/element';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import DocsList from './DocsList';

function DocGroupPage() {
    const { docsetSlug, groupSlug } = useParams();
    const [docGroup, setDocGroup] = useState(null);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocGroup = async () => {
            try {
                setLoading(true);

                // Fetch doc groups and find the one with matching slug
                const groupsResponse = await api.get('doc_groups');
                const groups = groupsResponse?.data?.data?.items || [];
                const group = groups.find(g => g.slug === groupSlug);

                if (!group) {
                    setError('Doc group not found');
                    setLoading(false);
                    return;
                }

                setDocGroup(group);

                // Fetch docs using doc_ids from the group
                const docIds = group.doc_ids || [];

                if (docIds.length === 0) {
                    setDocs([]);
                    setError(null);
                    setLoading(false);
                    return;
                }

                // Fetch each doc by ID
                const docPromises = docIds.map(id => api.get(`docs/${id}`));
                const docResponses = await Promise.all(docPromises);

                const fetchedDocs = docResponses
                    .map(response => response?.data?.data)
                    .filter(doc => doc !== null && doc !== undefined);

                setDocs(fetchedDocs);
                setError(null);
            } catch (err) {
                console.error('Error fetching doc group:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocGroup();
    }, [groupSlug]);

    if (loading) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Loading...</p></div>;
    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-red-600">Error: {error}</p></div>;
    if (!docGroup) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Doc group not found</p></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link to={`/${docsetSlug}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to {docsetSlug}</Link>
            <h1 className="text-4xl font-bold text-blue-800 mb-2">{docGroup.title}</h1>

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Docs</h2>
                <DocsList docs={docs} />
            </div>
        </div>
    );
}

export default DocGroupPage;
