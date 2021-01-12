module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.scss',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'display': ['Roboto', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      },
      fontSize: {
        'nav': '0.9rem'
      },
      height: {
        0.12: '0.03125rem',
        0.25: '0.0625rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
