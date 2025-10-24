import { Link } from 'react-router-dom';

function DocSetsList({ docsets }) {
    if (docsets.length === 0) {
        return <p className="text-slate-900 dark:text-slate-50">No docsets found.</p>;
    }

    return (
        <ul className="space-y-2">
            {docsets.map((docset) => (
                <li key={docset.id} className="border border-slate-900 dark:border-slate-50 rounded-lg hover:border-orange-600 transition">
                    <Link to={`/${docset.slug}`} className="block p-4">
                        <h3 className="font-semibold text-orange-600 hover:opacity-70">{docset.name || 'Untitled'}</h3>
                        {docset.description && <p className="text-sm text-slate-900 dark:text-slate-50 mt-1">{docset.description}</p>}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default DocSetsList;
