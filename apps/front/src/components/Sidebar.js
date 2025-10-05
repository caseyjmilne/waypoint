import { Link, useParams } from 'react-router-dom';

function Sidebar({ docset, docGroups, allDocs }) {
    const { docsetSlug, groupSlug, docSlug } = useParams();

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{docset.name}</h2>

            <nav>
                {docGroups.map((group) => {
                    const groupDocs = group.doc_ids || [];
                    const docs = groupDocs
                        .map(id => allDocs.find(d => d.id === id))
                        .filter(doc => doc !== undefined);

                    const isActiveGroup = group.slug === groupSlug;

                    return (
                        <div key={group.id} className="mb-4">
                            <Link
                                to={`/${docsetSlug}/${group.slug}`}
                                className={`block text-base font-semibold mb-2 ${
                                    isActiveGroup ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                }`}
                            >
                                {group.title}
                            </Link>

                            {docs.length > 0 && (
                                <ul className="ml-3 space-y-1">
                                    {docs.map((doc) => {
                                        const isActiveDoc = doc.slug === docSlug;

                                        return (
                                            <li key={doc.id}>
                                                <Link
                                                    to={`/${docsetSlug}/${group.slug}/${doc.slug}`}
                                                    className={`block text-sm py-1 ${
                                                        isActiveDoc
                                                            ? 'text-blue-600 font-medium'
                                                            : 'text-gray-600 hover:text-blue-600'
                                                    }`}
                                                >
                                                    {doc.title}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </nav>

            <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm mt-8 inline-block">
                &larr; All Documentation
            </Link>
        </aside>
    );
}

export default Sidebar;
