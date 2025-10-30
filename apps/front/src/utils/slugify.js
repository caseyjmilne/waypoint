/**
 * Extract plain text from React children (handles strings, arrays, and React elements)
 * @param {*} children - React children (string, array, or React element)
 * @returns {string} - Extracted plain text
 */
export function extractTextFromChildren(children) {
    if (!children) return '';

    // If it's a string or number, return it directly
    if (typeof children === 'string' || typeof children === 'number') {
        return String(children);
    }

    // If it's an array, recursively extract text from each child
    if (Array.isArray(children)) {
        return children.map(child => extractTextFromChildren(child)).join('');
    }

    // If it's a React element, try to extract text from its children
    if (typeof children === 'object' && children !== null) {
        // Check for props.children (React element structure)
        if (children.props && children.props.children) {
            return extractTextFromChildren(children.props.children);
        }
    }

    // Fallback: return empty string instead of [object Object]
    return '';
}

/**
 * Convert text to a URL-friendly slug
 * Handles special characters, unicode, and markdown formatting
 *
 * @param {string|*} text - The text to convert to a slug (can be React children)
 * @returns {string} - The slugified text
 */
export function createSlug(text) {
    if (!text) return '';

    // Extract plain text if we have React children
    const stringText = extractTextFromChildren(text);

    return stringText
        .toLowerCase()
        .trim()
        // Remove markdown formatting characters
        .replace(/[*_`~\[\]()]/g, '')
        // Replace common special characters with words or remove them
        .replace(/&/g, '-and-')
        .replace(/@/g, '-at-')
        .replace(/\+/g, '-plus-')
        .replace(/%/g, '-percent-')
        .replace(/[^\w\s-]/g, '') // Remove remaining non-word chars (keeps unicode letters, numbers, underscore, spaces, hyphens)
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

/**
 * Manage slug uniqueness with a counter
 */
export class SlugTracker {
    constructor() {
        this.usedSlugs = new Map();
    }

    /**
     * Get a unique slug, adding a counter if duplicate
     * @param {string} text - The text to convert to a slug
     * @returns {string} - A unique slug
     */
    getUniqueSlug(text) {
        const baseSlug = createSlug(text);

        if (!baseSlug) {
            // Fallback for empty slugs
            const count = this.usedSlugs.get('heading') || 0;
            this.usedSlugs.set('heading', count + 1);
            return count === 0 ? 'heading' : `heading-${count + 1}`;
        }

        if (!this.usedSlugs.has(baseSlug)) {
            this.usedSlugs.set(baseSlug, 0);
            return baseSlug;
        }

        const count = this.usedSlugs.get(baseSlug) + 1;
        this.usedSlugs.set(baseSlug, count);
        return `${baseSlug}-${count}`;
    }

    /**
     * Reset the tracker
     */
    reset() {
        this.usedSlugs.clear();
    }
}
