import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDataStore } from '../store/dataStore';
import Sidebar from './Sidebar';
import TableOfContents from './TableOfContents';

function DocPage() {
    const { docsetSlug, groupSlug, docSlug } = useParams();
    const { data, loading, error } = useDataStore();

    // Helper function to create heading IDs - using a simple counter approach
    let headingIdCounter = 0;
    const usedSlugs = {};

    const createHeadingId = (text) => {
        const baseSlug = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        // Check if this slug has been used before
        if (!usedSlugs[baseSlug]) {
            usedSlugs[baseSlug] = 0;
            return baseSlug;
        } else {
            // Increment counter for duplicate headings
            usedSlugs[baseSlug]++;
            return `${baseSlug}-${usedSlugs[baseSlug]}`;
        }
    };

    if (loading) {
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
    if (!data) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">No data available</p></div>;

    const docset = data.getDocSetBySlug(docsetSlug);
    if (!docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Docset not found</p></div>;

    const docGroups = data.getDocGroupsByDocSetId(docset.id);
    const docGroup = data.getDocGroupBySlugAndDocSetId(groupSlug, docset.id);
    if (!docGroup) return <div className="p-8 max-w-4xl mx-auto"><p className="text-gray-500">Doc group not found</p></div>;

    const allDocs = docGroups.flatMap(group => data.getDocsByDocGroupId(group.id));
    const doc = data.getDocBySlugAndDocGroupId(docSlug, docGroup.id);

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar docset={docset} docGroups={docGroups} allDocs={allDocs} data={data} />

            <main className="flex-1 p-8 min-w-0 overflow-x-hidden">
                {doc?.content ? (
                    <div className="flex gap-8">
                        <div className="prose flex-1 min-w-0 overflow-hidden">
                            {doc.title && <h1 className="break-words">{doc.title}</h1>}
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h2: ({ node, children }) => {
                                        const text = String(children);
                                        const id = createHeadingId(text);
                                        return <h2 id={id} className="break-words">{children}</h2>;
                                    },
                                    h3: ({ node, children }) => {
                                        const text = String(children);
                                        const id = createHeadingId(text);
                                        return <h3 id={id} className="break-words">{children}</h3>;
                                    },
                                    h4: ({ node, children }) => {
                                        const text = String(children);
                                        const id = createHeadingId(text);
                                        return <h4 id={id} className="break-words">{children}</h4>;
                                    },
                                    h5: ({ node, children }) => {
                                        const text = String(children);
                                        const id = createHeadingId(text);
                                        return <h5 id={id} className="break-words">{children}</h5>;
                                    },
                                    h6: ({ node, children }) => {
                                        const text = String(children);
                                        const id = createHeadingId(text);
                                        return <h6 id={id} className="break-words">{children}</h6>;
                                    },
                                    p: ({ node, children }) => {
                                        return <p className="break-words">{children}</p>;
                                    },
                                    pre: ({ node, children }) => {
                                        return <pre className="overflow-x-auto">{children}</pre>;
                                    },
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="overflow-x-auto">
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className={`${className} break-all`} {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {doc.content}
                            </ReactMarkdown>
                        </div>

                        <aside className="w-64 flex-shrink-0 hidden lg:block">
                            <TableOfContents content={doc.content} />
                        </aside>
                    </div>
                ) : (
                    <p className="text-gray-500">No content available</p>
                )}
            </main>
        </div>
    );
}

export default DocPage;
