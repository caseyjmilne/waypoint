import { useState, useEffect } from '@wordpress/element';
import { SlugTracker } from '../utils/slugify';

function TableOfContents({ content }) {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        console.log('[TOC] Processing content, length:', content?.length);

        // Parse markdown content to extract headings
        const lines = content.split('\n');
        const extractedHeadings = [];
        const slugTracker = new SlugTracker();

        lines.forEach((line) => {
            // Match markdown headings (## to ######)
            const match = line.match(/^(#{2,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length; // Number of # symbols
                const text = match[2].trim();

                // Create unique slug using shared utility
                const slug = slugTracker.getUniqueSlug(text);

                console.log('[TOC] Found heading:', { level, text, slug });

                extractedHeadings.push({
                    level,
                    text,
                    id: slug
                });
            }
        });

        console.log('[TOC] Total headings extracted:', extractedHeadings.length);
        setHeadings(extractedHeadings);
    }, [content]);

    if (headings.length === 0) {
        console.log('[TOC] No headings found, not rendering TOC');
        // Show a placeholder during development to confirm component is mounted
        if (process.env.NODE_ENV === 'development') {
            return (
                <div className="border border-orange-600 rounded-lg p-4 sticky top-4 text-sm text-orange-600">
                    TOC: No h2-h6 headings found in content
                </div>
            );
        }
        return null;
    }

    console.log('[TOC] Rendering TOC with', headings.length, 'headings');

    return (
        <nav className="toc border border-slate-900 dark:border-slate-50 rounded-lg p-4 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3 uppercase tracking-wide">
                Table of Contents
                <span className="ml-2 text-xs text-orange-600 font-normal">({headings.length} headings)</span>
            </h3>
            <ul className="space-y-1 text-sm pr-2">
                {headings.map((heading) => {
                    // Calculate indentation based on heading level (h2 = 0, h3 = 1, etc.)
                    const indent = (heading.level - 2) * 12;

                    return (
                        <li key={heading.id} style={{ marginLeft: `${indent}px` }}>
                            <a
                                href={`#${heading.id}`}
                                className="text-slate-900 dark:text-slate-50 hover:text-orange-600 transition-colors duration-150 block py-1"
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
