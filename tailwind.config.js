module.exports = {
    prefix: '',
    content: [
      './src/**/*.{html,ts}',
    ],
    darkMode: 'class',
    theme: {
      colors: {
        'primary': '#525fe1',
        'secondary': '#ffa41b',
        'tertiary': '#f86f03',
        'success': '#16a34a',
        'warning': '#f0ce06',
        'danger': '#dc2626',
        'medium': '#c5c5c5',
        'light': '#dedede'
      },
      extend: {
        backgroundImage: {
          'pattern': "url('assets/img/pattern-online-gray.png')",
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
        require('@tailwindcss/typography')
    ],
};