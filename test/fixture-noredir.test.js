const Fixture = require('./Fixture')

describe('Fixture "noredir"', () => {
  let fixture = new Fixture('nuxt.config-noredir', 5061)

  beforeAll(async () => {
    await fixture.setUp()
  })

  afterAll(async () => {
    await fixture.tearDown()
  })

  describe('/foo', () => {
    fixture.testUrl('/foo', html => {
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
      expect(html).toMatch(/<a href="\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
    })
  })

  describe('/de/foo', () => {
    fixture.testUrl('/de/foo', html => {
      expect(html).toContain('Foo page')
      expect(html).toContain('Hallo Welt!')
      expect(html).toMatch(/<a href="\/de\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/de\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
    })
  })

  describe('/en/foo', () => {
    fixture.testUrl404('/en/foo')
  })
})