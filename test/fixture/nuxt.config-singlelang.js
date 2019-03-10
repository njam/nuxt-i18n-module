module.exports = {
  srcDir: __dirname,
  dev: false,
  modules: [
    [
      '@@',
      {
        languages: ['en'],
      }
    ]
  ],
  generate: {
    routes: ['/dynamic/44']
  }
}
