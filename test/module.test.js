jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
process.env.PORT = process.env.PORT || 5060

const { Nuxt, Builder, Generator } = require('nuxt')
const request = require('request-promise-native')
const fs = require('fs')

describe('Module', () => {
  const nuxtConfig = require('./fixture/nuxt.config')
  let nuxtBuild = async () => {
    let nuxt = new Nuxt(nuxtConfig)
    let builder = new Builder(nuxt)
    await builder.build()
    return nuxt
  }

  let nuxtGenerate = async () => {
    let nuxt = new Nuxt(nuxtConfig)
    let builder = new Builder(nuxt)
    let generator = new Generator(nuxt, builder)
    await generator.generate()
    return nuxt
  }

  let nuxt

  beforeAll(async () => {
    await nuxtGenerate()
    nuxt = await nuxtBuild()
    await nuxt.listen(process.env.PORT)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  let describeUrl = (path, asserter) => {
    it('builds correctly', async () => {
      let html = await request(`http://localhost:${process.env.PORT}${path}`)
      asserter(html)
    })
    it('generates correctly', async () => {
      let html = fs.readFileSync(`${__dirname}/tmp/nuxt-generate/${path}/index.html`, 'utf8')
      asserter(html)
    })
  }

  describe('/de/foo', () => {
    describeUrl('/de/foo', html => {
      expect(html).toContain('Foo page')
      expect(html).toContain('Hallo Welt!')
      expect(html).toMatch(/<a href="\/de\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/de\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>'))
    })
  })

  describe('/en/foo', () => {
    describeUrl('/en/foo', html => {
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
      expect(html).toMatch(/<a href="\/en\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/en\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>'))
    })
  })

  describe('/foo', () => {
    describeUrl('/foo', html => {
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
      expect(html).toMatch(/<a href="\/en\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/en\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>'))

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

  describe('/de/dynamic/44', () => {
    describeUrl('/de/dynamic/44', html => {
      expect(html).toContain('Dynamic page: 44')
      expect(html).toContain('Hallo Welt!')
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/dynamic/44" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/dynamic/44" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(
        new RegExp('<link [^>]*href="/dynamic/44" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>')
      )
    })
  })
})
