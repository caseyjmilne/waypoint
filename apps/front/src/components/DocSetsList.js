import { Link } from 'react-router-dom';

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

export default DocSetsList;
