const { Nuxt, Builder, Generator } = require('nuxt')
const request = require('request-promise-native')
const fs = require('fs')

class Fixture {
  /**
   * @param {String} configName
   * @param {Number} port
   */
  constructor (configName, port) {
    this.tmpDir = `${__dirname}/tmp/${configName}`
    this.buildDir = this.tmpDir + '/nuxt-build'
    this.generateDir = this.tmpDir + '/nuxt-generate'

    let config = require('./fixture/' + configName)
    config['buildDir'] = this.buildDir
    config['generate']['dir'] = this.generateDir

    this.nuxt = new Nuxt(config)
    this.port = port
  }

  async setUp () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

    let builder = new Builder(this.nuxt)
    let generator = new Generator(this.nuxt, builder)
    await builder.build()
    await generator.generate()

    await this.nuxt.listen(this.port)
  }

  async tearDown () {
    await this.nuxt.close()
  }

  /**
   * @param {String} path
   * @param {Function} asserter
   */
  testUrl (path, asserter) {
    it('builds correctly', async () => {
      let html = await this._loadPathBuilt(path)
      asserter(html)
    })
    it('generates correctly', async () => {
      let html = await this._loadPathGenerated(path)
      asserter(html)
    })
  }

  /**
   * @param {String} path
   */
  testUrl404 (path) {
    it('builds correctly', async () => {
      await expect(this._loadPathBuilt(path)).rejects.toThrow(/404/)
    })
    it('generates correctly', async () => {
      await expect(this._loadPathGenerated(path)).rejects.toThrow(/ENOENT: no such file or directory/)
    })
  }

  /**
   * @param {String} path
   * @returns {Promise<String>}
   * @private
   */
  async _loadPathBuilt (path) {
    return request(`http://localhost:${this.port}${path}`)
  }

  /**
   * @param {String} path
   * @returns {Promise<String>}
   * @private
   */
  async _loadPathGenerated (path) {
    return fs.readFileSync(`${this.generateDir}/${path}/index.html`, 'utf8')
  }
}

module.exports = Fixture
