import { Link } from 'react-router-dom';

function DocsList({ docs, docsetSlug, groupSlug }) {
    if (docs.length === 0) {
        return <p className="text-gray-500">No docs found.</p>;
    }

    return (
        <ul className="space-y-2">
            {docs.map((doc) => (
                <li key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition">
                    <Link to={`/${docsetSlug}/${groupSlug}/${doc.slug}`}>
                        <h3 className="font-semibold text-blue-600 hover:text-blue-800">{doc.title || 'Untitled'}</h3>
                        {doc.content && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {doc.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                        )}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default DocsList;
