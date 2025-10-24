import { Link } from 'react-router-dom';

function DocGroupsList({ groups, docsetSlug }) {
    if (groups.length === 0) {
        return <p className="text-slate-900 dark:text-slate-50">No doc groups found.</p>;
    }

    return (
        <ul className="space-y-2">
            {groups.map((group) => (
                <li key={group.id} className="border border-slate-900 dark:border-slate-50 rounded-lg hover:border-orange-600 transition">
                    <Link to={`/${docsetSlug}/${group.slug}`} className="block p-4">
                        <h3 className="font-semibold text-orange-600 hover:opacity-70">{group.title || 'Untitled'}</h3>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default DocGroupsList;
