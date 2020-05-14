const Fixture = require('./Fixture')

describe('Fixture "default"', () => {
  let fixture = new Fixture('nuxt.config-default', 5060)

  beforeAll(async () => {
    await fixture.setUp()
  })

  afterAll(async () => {
    await fixture.tearDown()
  })

  describe('/de/foo', () => {
    fixture.testUrl('/de/foo', html => {
      expect(html).toMatch(/<html [^>]*lang="de"/)
      expect(html).toContain('Foo page')
      expect(html).toContain('Hallo Welt!')
      expect(html).toMatch(/<a href="\/de\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/de\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>'))
      expect(html).toMatch(/<a href="\/en\/foo" [^>]*class="language-switcher-link[^>]*>en<\/a>/)
      expect(html).toMatch(/<a href="\/de\/foo" [^>]*class="language-switcher-link[^>]*>de<\/a>/)
      expect(html).toContain('<div>i18n/getLanguage=de</div>')
    })
  })

  describe('/en/foo', () => {
    fixture.testUrl('/en/foo', html => {
      expect(html).toMatch(/<html [^>]*lang="en"/)
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
      expect(html).toMatch(/<a href="\/en\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/en\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>'))
      expect(html).toMatch(/<a href="\/en\/foo" [^>]*class="language-switcher-link[^>]*>en<\/a>/)
      expect(html).toMatch(/<a href="\/de\/foo" [^>]*class="language-switcher-link[^>]*>de<\/a>/)
      expect(html).toContain('<div>i18n/getLanguage=en</div>')
    })
  })

  describe('/foo', () => {
    fixture.testUrl('/foo', html => {
      expect(html).toMatch(/<html [^>]*lang="en"/)
      expect(html).toContain('Foo page')
      expect(html).toContain('Hello World!')
      expect(html).toMatch(/<a href="\/en\/foo".*?>foo<\/a>/)
      expect(html).toMatch(/<a href="\/en\/bar".*?>bar<\/a>/)
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/foo" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/foo" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/foo" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>'))
      expect(html).toMatch(/<a href="\/en\/foo" [^>]*class="language-switcher-link[^>]*>en<\/a>/)
      expect(html).toMatch(/<a href="\/de\/foo" [^>]*class="language-switcher-link[^>]*>de<\/a>/)
      expect(html).toContain('<div>i18n/getLanguage=en</div>')

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
    fixture.testUrl('/de/dynamic/44', html => {
      expect(html).toMatch(/<html [^>]*lang="de"/)
      expect(html).toContain('Dynamic page: 44')
      expect(html).toContain('Hallo Welt!')
      expect(html).toMatch(new RegExp('<link [^>]*href="/en/dynamic/44" [^>]*rel="alternate" [^>]*hreflang="en"[^>]*>'))
      expect(html).toMatch(new RegExp('<link [^>]*href="/de/dynamic/44" [^>]*rel="alternate" [^>]*hreflang="de"[^>]*>'))
      expect(html).toMatch(
        new RegExp('<link [^>]*href="/dynamic/44" [^>]*rel="alternate" [^>]*hreflang="x-default"[^>]*>')
      )
      expect(html).toMatch(/<a href="\/en\/dynamic\/44" [^>]*class="language-switcher-link[^>]*>en<\/a>/)
      expect(html).toMatch(/<a href="\/de\/dynamic\/44" [^>]*class="language-switcher-link[^>]*>de<\/a>/)
      expect(html).toContain('<div>i18n/getLanguage=de</div>')
    })
  })
})
