import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDataStore } from '../store/dataStore';
import Sidebar from './Sidebar';
import TableOfContents from './TableOfContents';
import { SlugTracker } from '../utils/slugify';

function DocPage() {
    const { docsetSlug, groupSlug, docSlug } = useParams();
    const { data, loading, error } = useDataStore();

    // Create a slug tracker for heading IDs
    // This must be recreated for each render to match TOC
    const slugTracker = new SlugTracker();

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-full mt-6"></div>
                    <div className="h-4 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-4/5"></div>
                    <div className="h-32 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-full mt-6"></div>
                    <div className="h-4 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-full"></div>
                    <div className="h-4 bg-slate-900 dark:bg-slate-50 opacity-20 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    if (error) return <div className="p-8 max-w-4xl mx-auto"><p className="text-orange-600">Error: {error}</p></div>;
    if (!data) return <div className="p-8 max-w-4xl mx-auto"><p className="text-slate-900 dark:text-slate-50">No data available</p></div>;

    const docset = data.getDocSetBySlug(docsetSlug);
    if (!docset) return <div className="p-8 max-w-4xl mx-auto"><p className="text-slate-900 dark:text-slate-50">Docset not found</p></div>;

    const docGroups = data.getDocGroupsByDocSetId(docset.id);
    const docGroup = data.getDocGroupBySlugAndDocSetId(groupSlug, docset.id);
    if (!docGroup) return <div className="p-8 max-w-4xl mx-auto"><p className="text-slate-900 dark:text-slate-50">Doc group not found</p></div>;

    const allDocs = docGroups.flatMap(group => data.getDocsByDocGroupId(group.id));
    const doc = data.getDocBySlugAndDocGroupId(docSlug, docGroup.id);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar docset={docset} docGroups={docGroups} allDocs={allDocs} data={data} />

            <main className="flex-1 overflow-y-auto overflow-x-hidden">
                {doc?.content ? (
                    <div className="flex gap-8 p-8">
                        <div className="prose flex-1 min-w-0">
                            {doc.title && <h1 className="break-words">{doc.title}</h1>}
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h2: ({ node, children }) => {
                                        const id = slugTracker.getUniqueSlug(children);
                                        console.log('[DocPage] h2 ID:', id, 'for text:', children);
                                        return <h2 id={id} className="break-words">{children}</h2>;
                                    },
                                    h3: ({ node, children }) => {
                                        const id = slugTracker.getUniqueSlug(children);
                                        return <h3 id={id} className="break-words">{children}</h3>;
                                    },
                                    h4: ({ node, children }) => {
                                        const id = slugTracker.getUniqueSlug(children);
                                        return <h4 id={id} className="break-words">{children}</h4>;
                                    },
                                    h5: ({ node, children }) => {
                                        const id = slugTracker.getUniqueSlug(children);
                                        return <h5 id={id} className="break-words">{children}</h5>;
                                    },
                                    h6: ({ node, children }) => {
                                        const id = slugTracker.getUniqueSlug(children);
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

                        <aside className="w-64 flex-shrink-0">
                            <TableOfContents content={doc.content} />
                        </aside>
                    </div>
                ) : (
                    <p className="text-slate-900 dark:text-slate-50 p-8">No content available</p>
                )}
            </main>
        </div>
    );
}

export default DocPage;
