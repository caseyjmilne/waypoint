import { Link } from 'react-router-dom';

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

export default DocGroupsList;
