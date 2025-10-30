import { useState } from '@wordpress/element';
import { Link, useParams } from 'react-router-dom';

/**
 * Mobile Sidebar Navigation with Hamburger Menu
 * Shows as button on mobile, opens full-screen overlay when clicked
 */
function MobileSidebar({ docset, docGroups, data }) {
    const [isOpen, setIsOpen] = useState(false);
    const { docsetSlug, groupSlug, docSlug } = useParams();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden flex items-center gap-3 w-full px-4 py-3 mb-3 bg-slate-900 dark:bg-slate-800 text-slate-50 rounded-lg hover:opacity-90 transition-opacity"
                aria-label="Toggle Navigation Menu"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                <span className="font-semibold">Navigation</span>
                <span className="ml-auto text-xs font-bold">{docset.name}</span>
            </button>

            {/* Full-Screen Overlay */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-slate-900 overflow-y-auto">
                    {/* Header with Close Button */}
                    <div className="sticky top-0 bg-slate-900 dark:bg-slate-800 text-slate-50 p-4 border-b border-slate-700 flex items-center justify-between">
                        <h2 className="text-lg font-bold">{docset.name}</h2>
                        <button
                            onClick={toggleMenu}
                            className="p-2 hover:bg-slate-700 rounded transition-colors"
                            aria-label="Close Navigation Menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Content */}
                    <nav className="p-6">
                        {docGroups.map((group) => {
                            const docs = data.getDocsByDocGroupId(group.id);
                            const isActiveGroup = group.slug === groupSlug;

                            return (
                                <div key={group.id} className="mb-6">
                                    <Link
                                        to={`/${docsetSlug}/${group.slug}`}
                                        onClick={closeMenu}
                                        className={`block text-lg font-semibold mb-3 ${
                                            isActiveGroup
                                                ? 'text-orange-600'
                                                : 'text-slate-900 dark:text-slate-50 hover:text-orange-600'
                                        }`}
                                    >
                                        {group.title}
                                    </Link>

                                    {docs.length > 0 && (
                                        <ul className="ml-4 space-y-2">
                                            {docs.map((doc) => {
                                                const isActiveDoc = doc.slug === docSlug;

                                                return (
                                                    <li key={doc.id}>
                                                        <Link
                                                            to={`/${docsetSlug}/${group.slug}/${doc.slug}`}
                                                            onClick={closeMenu}
                                                            className={`block text-base py-1.5 ${
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

                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="text-orange-600 hover:opacity-70 text-base mt-8 inline-block"
                        >
                            &larr; All Documentation
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}

export default MobileSidebar;
