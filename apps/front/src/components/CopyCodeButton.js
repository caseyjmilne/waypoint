import { useState } from '@wordpress/element';

/**
 * CopyCodeButton Component
 *
 * Self-contained button for copying code to clipboard.
 * Designed to be easily extracted into a shared package.
 *
 * @param {Object} props
 * @param {string} props.code - The code text to copy
 * @param {string} [props.className] - Optional additional CSS classes
 */
function CopyCodeButton({ code, className = '' }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
                absolute top-2 right-2
                px-3 py-1.5
                text-xs font-medium
                bg-slate-700 hover:bg-slate-600
                text-slate-100
                rounded
                transition-all duration-200
                border border-slate-600
                ${copied ? 'bg-green-700 hover:bg-green-700' : ''}
                ${className}
            `.trim()}
            aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
            {copied ? (
                <span className="flex items-center gap-1.5">
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Copied!
                </span>
            ) : (
                <span className="flex items-center gap-1.5">
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    Copy
                </span>
            )}
        </button>
    );
}

export default CopyCodeButton;
