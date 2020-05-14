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
      expect(html).toMatch(/<html [^>]*lang="en"/)
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
      expect(html).toMatch(/<a href="\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).not.toMatch(new RegExp('<link [^>]*hreflang="x-default"[^>]*>'))
      expect(html).toMatch(/<a href="\/foo" [^>]*class="language-switcher-link[^>]*>en<\/a>/)
      expect(html).toMatch(/<a href="\/de\/foo" [^>]*class="language-switcher-link[^>]*>de<\/a>/)
      expect(html).toContain('<div>i18n/getLanguage=en</div>')
    })
  })

  describe('/de/foo', () => {
    fixture.testUrl('/de/foo', html => {
      expect(html).toMatch(/<html [^>]*lang="de"/)
      expect(html).toContain('Foo page')
      expect(html).toContain('Hallo Welt!')
      expect(html).toMatch(/<a href="\/de\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/de\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).not.toMatch(new RegExp('<link [^>]*hreflang="x-default"[^>]*>'))
      expect(html).toMatch(/<a href="\/foo" [^>]*class="language-switcher-link[^>]*>en<\/a>/)
      expect(html).toMatch(/<a href="\/de\/foo" [^>]*class="language-switcher-link[^>]*>de<\/a>/)
      expect(html).toContain('<div>i18n/getLanguage=de</div>')
    })
  })

  describe('/en/foo', () => {
    fixture.testUrl404('/en/foo')
  })
})
