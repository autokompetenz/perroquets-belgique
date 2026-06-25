export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C9762E', dark: '#A85F22', light: '#E0954C' },
        secondary: { DEFAULT: '#E8B84A', dark: '#D49D2E' },
        dark:   { DEFAULT: '#1A1410', 2: '#18181A', 3: '#222224' },
        chrome: { DEFAULT: '#F0ECE6', dim: '#9A8A7A' },
        surface:'#2A2A2D',
      },
      fontFamily: {
        sans:  ['Nunito', 'Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
