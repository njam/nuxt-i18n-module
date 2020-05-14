const Fixture = require('./Fixture')

describe('Fixture "singlelang"', () => {
  let fixture = new Fixture('nuxt.config-singlelang', 5062)

  beforeAll(async () => {
    await fixture.setUp()
  })

  afterAll(async () => {
    await fixture.tearDown()
  })

  describe('/en/foo', () => {
    fixture.testUrl('/en/foo', html => {
      expect(html).toMatch(/<html [^>]*lang="en"/)
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
      expect(html).toMatch(/<a href="\/en\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/en\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>'))
    })
  })

  describe('/foo', () => {
    fixture.testUrl('/foo', html => {
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
    })
  })
})
