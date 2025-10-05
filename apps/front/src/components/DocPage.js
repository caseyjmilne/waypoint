import { useState, useEffect } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../api';
import Sidebar from './Sidebar';

function DocPage() {
    const { docsetSlug, groupSlug, docSlug } = useParams();
    const [docset, setDocset] = useState(null);
    const [docGroups, setDocGroups] = useState([]);
    const [doc, setDoc] = useState(null);
    const [allDocs, setAllDocs] = useState([]);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [docLoading, setDocLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load sidebar data once
    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                setSidebarLoading(true);

                // Fetch docset
                const docsetsResponse = await api.get('doc_sets');
                const docsets = docsetsResponse?.data?.data?.items || [];
                const foundDocset = docsets.find(d => d.slug === docsetSlug);

                if (!foundDocset) {
                    setError('Docset not found');
                    setSidebarLoading(false);
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

                // Fetch all docs
                const allDocIds = fetchedGroups.flatMap(g => g.doc_ids || []);
                if (allDocIds.length > 0) {
                    const docPromises = allDocIds.map(id => api.get(`docs/${id}`));
                    const docResponses = await Promise.all(docPromises);
                    const fetchedDocs = docResponses
                        .map(response => response?.data?.data)
                        .filter(doc => doc !== null && doc !== undefined);
                    setAllDocs(fetchedDocs);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching sidebar data:', err);
                setError(err.message);
            } finally {
                setSidebarLoading(false);
            }
        };

        fetchSidebarData();
    }, [docsetSlug]);

    // Load individual doc when slug changes
    useEffect(() => {
        if (allDocs.length === 0) return;

        setDocLoading(true);
        const foundDoc = allDocs.find(d => d.slug === docSlug);

        if (!foundDoc) {
            setError('Doc not found');
            setDocLoading(false);
            return;
        }

        setDoc(foundDoc);
        setError(null);
        setDocLoading(false);
    }, [docSlug, allDocs]);

    if (sidebarLoading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-red-600">Error: {error}</p></div>;
    if (!docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Docset not found</p></div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar docset={docset} docGroups={docGroups} allDocs={allDocs} />

            <main className="flex-1 p-8 max-w-4xl">
                {docLoading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-8 bg-gray-200 rounded w-2/3 mt-8"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                ) : doc?.content ? (
                    <div className="prose max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSanitize]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {doc.content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-gray-500">No content available</p>
                )}
            </main>
        </div>
    );
}

export default DocPage;
