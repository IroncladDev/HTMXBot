/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  purge: [
    './public/**/*.html',
    './public/**/*.css',
    './src/hypermedia/**/*.ts'
  ],
  content: [],
  theme: {
    fontFamily: {
      'code': ['"Menlo"', '"Monaco"', '"Lucida Console"', '"Liberation Mono"', '"DejaVu Sans Mono"', '"Bitstream Vera Sans Mono"', '"Courier New"', 'monospace']
    },
    extend: {
      colors: {
        border: "rgb(var(--border))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: "rgb(var(--accent))",
      },
    }
  },
  plugins: [],
}

