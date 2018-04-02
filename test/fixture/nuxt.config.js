module.exports = {
  srcDir: __dirname,
  dev: false,
  modules: [
    ['@@', {
      languages: ['en', 'de']
    }]
  ],
  generate: {
    routes: [
      "/dynamic/44"
    ]
  }
}
