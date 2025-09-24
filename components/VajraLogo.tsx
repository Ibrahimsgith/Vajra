import React from 'react';

export const VajraLogo: React.FC = () => {
    // Using SVG for the logo ensures it is always sharp and clear, unlike a raster image (like JPEG)
    // which can become blurry when resized. This provides a more professional and high-quality look.
    return (
        <svg
            className="h-8 w-auto text-amber-900" // Control size and color with Tailwind classes
            viewBox="0 0 150 40" // Adjust viewBox to fit the text snugly
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Vajra Logo"
        >
            <text
                x="0"
                y="32"
                fontFamily="Cormorant Garamond, serif" // Using the elegant brand font
                fontSize="40"
                fontWeight="500"
                fill="currentColor" // Inherits color from parent element
            >
                Vajra
            </text>
        </svg>
    );
};
