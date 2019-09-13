module.exports = {
  srcDir: __dirname,
  dev: false,
  modules: [
    [
      '@@',
      {
        languages: ['en', 'de'],
        rootUrl: 'http://example.com'
      }
    ]
  ],
  generate: {
    routes: ['/dynamic/44']
  }
}
