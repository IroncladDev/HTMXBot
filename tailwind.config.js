/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  purge: [
    './static/**/*.html',
    './static/**/*.js',
    './static/**/*.css',
  ],
  content: [],
  theme: {
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

