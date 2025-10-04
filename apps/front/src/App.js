import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from '@wordpress/element';
import api from './api';

function DocSetsList({ docsets }) {
    if (docsets.length === 0) {
        return <p className="text-gray-500">No docsets found.</p>;
    }

    return (
        <ul className="space-y-2">
            {docsets.map((docset) => (
                <li key={docset.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition">
                    <Link to={`/${docset.slug}`}>
                        <h3 className="font-semibold text-blue-600 hover:text-blue-800">{docset.name || 'Untitled'}</h3>
                        {docset.description && <p className="text-sm text-gray-600 mt-1">{docset.description}</p>}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function DocGroupsList({ groups, docsetSlug }) {
    if (groups.length === 0) {
        return <p className="text-gray-500">No doc groups found.</p>;
    }

    return (
        <ul className="space-y-2">
            {groups.map((group) => (
                <li key={group.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition">
                    <Link to={`/${docsetSlug}/${group.slug}`}>
                        <h3 className="font-semibold text-blue-600 hover:text-blue-800">{group.title || 'Untitled'}</h3>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function DocsList({ docs }) {
    if (docs.length === 0) {
        return <p className="text-gray-500">No docs found.</p>;
    }

    return (
        <ul className="space-y-2">
            {docs.map((doc) => (
                <li key={doc.id} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold">{doc.title || 'Untitled'}</h3>
                    {doc.content && <p className="text-sm text-gray-600 mt-1">{doc.content}</p>}
                </li>
            ))}
        </ul>
    );
}

function Home() {
    const [docsets, setDocsets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const docsetsResponse = await api.get('doc_sets');

                const docsetsItems = docsetsResponse?.data?.data?.items;
                setDocsets(Array.isArray(docsetsItems) ? docsetsItems : []);

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Waypoint</h1>
            <p className="text-gray-600 mb-6">Multi-set documentation management for WordPress</p>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Documentation Sets</h2>
                    <DocSetsList docsets={docsets} />
                </div>
            )}
        </div>
    );
}

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

function App() {
    return (
        <Router basename="/docs">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:docsetSlug" element={<DocSetPage />} />
                <Route path="/:docsetSlug/:groupSlug" element={<DocGroupPage />} />
            </Routes>
        </Router>
    );
}

export default App;
