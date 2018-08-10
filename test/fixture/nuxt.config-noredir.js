module.exports = {
  srcDir: __dirname,
  dev: false,
  modules: [
    ['@@', {
      languages: ['en', 'de'],
      defaultLanguage: 'en',
      redirectDefaultLang: false
    }]
  ],
  generate: {
    routes: [
      '/dynamic/44'
    ]
  }
}
