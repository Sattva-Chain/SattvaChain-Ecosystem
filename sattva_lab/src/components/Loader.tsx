// src/components/ButtonLoader.tsx

import React from 'react';

// Define the component's props for customization
interface ButtonLoaderProps {
  /** The size of the loader icon in pixels. Defaults to 20. */
  size?: number;
  /** The color of the loader. Defaults to 'currentColor', which inherits the button's text color. */
  color?: string;
}

/**
 * A simple, elegant SVG spinner for buttons.
 */
const ButtonLoader = ({ size = 20, color = 'currentColor' }: ButtonLoaderProps) => {
  const style = {
    // CSS animation for the spinning effect
    animation: 'spin 1s linear infinite',
  };

  // Define the keyframes animation directly in the component for portability
  const keyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
      >
        {/* This SVG path creates the spinning arc */}
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </>
  );
};

export default ButtonLoader;