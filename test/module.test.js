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

  test('render-foo-de', async () => {
    let html = await get('/de/foo')
    expect(html).toContain('Foo page')
    expect(html).toContain('Hallo Welt!')
    expect(html).toMatch(/<a href="\/de\/foo".*?>foo<\/a>/)
    expect(html).toMatch(/<a href="\/de\/bar".*?>bar<\/a>/)
    expect(html).toMatch(/<link.*?rel="alternate" hreflang="en" href="\/en\/foo"\/>/)
    expect(html).toMatch(/<link.*?rel="alternate" hreflang="de" href="\/de\/foo"\/>/)
    expect(html).toMatch(/<link.*?rel="alternate" hreflang="x-default" href="\/foo"\/>/)
  })

  test('render-foo-en', async () => {
    let html = await get('/en/foo')
    expect(html).toContain('Foo page')
    expect(html).toContain('Hello World!')
    expect(html).toMatch(/<a href="\/en\/foo".*?>foo<\/a>/)
    expect(html).toMatch(/<a href="\/en\/bar".*?>bar<\/a>/)
    expect(html).toMatch(/<link.*?rel="alternate" hreflang="en" href="\/en\/foo"\/>/)
    expect(html).toMatch(/<link.*?rel="alternate" hreflang="de" href="\/de\/foo"\/>/)
    expect(html).toMatch(/<link.*?rel="alternate" hreflang="x-default" href="\/foo"\/>/)
  })

  test('render-foo-default', async () => {
    let html = await get('/foo')
    expect(html).toContain('Foo page')
    expect(html).toContain('Hello World!')

    /**
     * @todo
     * We should check the JS-based redirect to the navigator's language here.
     * Probably we can use "jsdom" for that, but it doesn't currently work because of
     * https://github.com/eddyerburgh/avoriaz/issues/77
     *
     * Something like this:
     * const window = await nuxt.renderAndGetWindow(url('/foo'))
     */
  })
})
