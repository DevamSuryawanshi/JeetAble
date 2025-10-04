import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accessible: {
          high: '#000000',
          medium: '#333333',
          low: '#666666',
        }
      },
      fontFamily: {
        dyslexic: ['OpenDyslexic', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config