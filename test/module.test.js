jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
process.env.PORT = process.env.PORT || 5060
process.env.NODE_ENV = 'production'

const {Nuxt, Builder} = require('nuxt')
const request = require('request-promise-native')

const url = path => `http://localhost:${process.env.PORT}${path}`
const get = path => request(url(path))

describe('Module', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(require('./fixture/nuxt.config'))
    await new Builder(nuxt).build()
    await nuxt.listen(process.env.PORT)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    let html = await get('/')
    expect(html).toContain('Works!')
  })
})
