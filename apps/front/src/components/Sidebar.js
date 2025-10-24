import { Link, useParams } from 'react-router-dom';

function Sidebar({ docset, docGroups, allDocs, data }) {
    const { docsetSlug, groupSlug, docSlug } = useParams();

    return (
        <aside className="w-64 border-r border-slate-300 dark:border-slate-700 p-6 sticky top-0 h-screen overflow-y-auto">
            <h2 className="text-xl font-bold font-lexend text-slate-900 dark:text-slate-50 mb-4">{docset.name}</h2>

            <nav>
                {docGroups.map((group) => {
                    const docs = data.getDocsByDocGroupId(group.id);

                    const isActiveGroup = group.slug === groupSlug;

                    return (
                        <div key={group.id} className="mb-4">
                            <Link
                                to={`/${docsetSlug}/${group.slug}`}
                                className={`block text-base font-semibold mb-2 ${
                                    isActiveGroup ? 'text-orange-600' : 'text-slate-900 dark:text-slate-50 hover:text-orange-600'
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
                                                            ? 'text-orange-600 font-medium'
                                                            : 'text-slate-900 dark:text-slate-50 hover:text-orange-600'
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

            <Link to="/" className="text-orange-600 hover:opacity-70 text-sm mt-8 inline-block">
                &larr; All Documentation
            </Link>
        </aside>
    );
}

export default Sidebar;
