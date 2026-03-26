/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#020812',
          surface: '#0a1628',
          elevated: '#0f2040',
        },
        accent: {
          DEFAULT: '#00f5ff',
          dim: 'rgba(0, 245, 255, 0.12)',
        },
        text: {
          primary: '#e8f4f8',
          secondary: '#7a9bb5',
          muted: '#3a5570',
        },
        danger: '#ff4757',
        warning: '#ffd700',
        success: '#2ecc71',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'accent-glow': '0 0 24px rgba(0, 245, 255, 0.35)',
      }
    },
  },
  plugins: [],
}
