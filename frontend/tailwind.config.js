/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#f0f7ff",
          100: "#d9ecff",
          200: "#baddff",
          300: "#8bc3ff",
          400: "#5aa6ff",
          500: "#2a84ff",
          600: "#1b67d6",
          700: "#144ea6",
          800: "#103f85",
          900: "#0e356d"
        }
      },
      borderRadius: { '2xl': '1.25rem' }
    }
  },
  plugins: []
}
