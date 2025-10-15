import { useState, useEffect } from '@wordpress/element';

function TableOfContents({ content }) {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        // Parse markdown content to extract headings
        const lines = content.split('\n');
        const extractedHeadings = [];
        const usedSlugs = new Map();

        lines.forEach((line) => {
            // Match markdown headings (## to ######)
            const match = line.match(/^(#{2,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length; // Number of # symbols
                const text = match[2].trim();
                // Create slug from heading text
                const baseSlug = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');

                // Handle duplicates
                let slug;
                if (!usedSlugs.has(baseSlug)) {
                    usedSlugs.set(baseSlug, 0);
                    slug = baseSlug;
                } else {
                    const count = usedSlugs.get(baseSlug) + 1;
                    usedSlugs.set(baseSlug, count);
                    slug = `${baseSlug}-${count}`;
                }

                extractedHeadings.push({
                    level,
                    text,
                    id: slug
                });
            }
        });

        setHeadings(extractedHeadings);
    }, [content]);

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className="toc bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Table of Contents
            </h3>
            <ul className="space-y-1 text-sm pr-2">
                {headings.map((heading) => {
                    // Calculate indentation based on heading level (h2 = 0, h3 = 1, etc.)
                    const indent = (heading.level - 2) * 12;

                    return (
                        <li key={heading.id} style={{ marginLeft: `${indent}px` }}>
                            <a
                                href={`#${heading.id}`}
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-150 block py-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(heading.id);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        // Update URL hash
                                        window.history.pushState(null, '', `#${heading.id}`);
                                    }
                                }}
                            >
                                {heading.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default TableOfContents;
