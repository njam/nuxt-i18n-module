nuxt-i18n-module
================

[![Build Status](https://img.shields.io/travis/njam/nuxt-i18n-module/master.svg)](https://travis-ci.org/njam/nuxt-i18n-module)
[![npm](https://img.shields.io/npm/v/nuxt-i18n-module.svg)](https://www.npmjs.com/package/nuxt-i18n-module)


Internationalization module for Nuxt.


About
-----
Adds the [vue-i18n](https://github.com/kazupon/vue-i18n) plugin, language-specific routes and html headers.

Given a page "foo":
```
└── pages
    └── foo.vue
```
This module will dynamically generate routes for a set of languages:
- **/en/foo**: English version of the "foo" page.
- **/de/foo**: German version of the "foo" page.
- **/foo**: This page will detect the user's language on the *client side* and redirect to the appropriate language-URL.

Those routes will also be generated when rendering in SSR mode.


Installation & Configuration
----------------------------

### Setup
- Add `nuxt-i18n-module` dependency using yarn or npm to your project
- Add `nuxt-i18n-module` to `modules` section of `nuxt.config.js` and define the languages to use:
```js
{
  modules: [
    ['nuxt-i18n-module', {
      languages: ['en', 'de']
    }]
  ]
}
```
- Create files `assets/locale/en.json` and `assets/locale/de.json` with your global translation phrases.
For example:
```json
{
  "hello-world": "Hallo Welt!"
}
```

### Usage in components
To point to a URL in the currently active language, use `localePath()`:
```html
<nuxt-link :to="localePath('/foo')">Foo</nuxt-link>
```

To translate a phrase, use vue-i18n's `$t()`:
```html
<h1>{{ $t('hello-world') }}</h1>
```


Development
-----------
Install dependencies:
```
yarn install
```

Run tests:
```
yarn run test
```

Release a new version:

1. Bump the version in `package.json`, merge to *master*.
2. Push a new tag to *master*.
3. Travis will deploy to NPM.
