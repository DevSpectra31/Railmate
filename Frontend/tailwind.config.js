/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1e40af', // deep blue
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#f97316', // orange
                    foreground: '#ffffff',
                }
            }
        },
    },
    plugins: [],
}
