/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          bg: '#0c0a09',       // Deep wood/charcoal
          paper: '#1c1917',    // Aged paper dark
          ink: '#292524',      // Slightly lighter for cards
          gold: '#c7a34c',     // Faded gold leaf
          crimson: '#7f1d1d',  // Old book spine red
          sage: '#3f4f3a',     // Vintage green
          cream: '#e7e5e4',    // Text color
          muted: '#a8a29e',    // Secondary text
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],      // For headings (Medieval/Renaissance)
        display: ['Cormorant Garamond', 'serif'], // Elegant body
        mono: ['Courier Prime', 'monospace'], // For that typewriter/manuscript feel
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
      }
    },
  },
  plugins: [],
}