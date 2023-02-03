module.exports = {
    prefix: '',
    content: [
      './src/**/*.{html,ts}',
    ],
    darkMode: 'class',
    theme: {
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