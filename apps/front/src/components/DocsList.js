function DocsList({ docs }) {
    if (docs.length === 0) {
        return <p className="text-gray-500">No docs found.</p>;
    }

    return (
        <ul className="space-y-2">
            {docs.map((doc) => (
                <li key={doc.id} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold">{doc.title || 'Untitled'}</h3>
                    {doc.content && <p className="text-sm text-gray-600 mt-1">{doc.content}</p>}
                </li>
            ))}
        </ul>
    );
}

export default DocsList;
