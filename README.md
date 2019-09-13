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
- **/foo**: This page will detect the user's language on the *client side* and redirect to the appropriate language-URL if `redirectDefaultLang` is set to **true**.

Those routes will also be generated when rendering in SSR mode.


Installation & Configuration
----------------------------

### Setup
1: Add `nuxt-i18n-module` dependency to your project using yarn or npm.

2: Add `nuxt-i18n-module` to the `modules` section of `nuxt.config.js` and configure as desired:
```js
{
  modules: [
    ['nuxt-i18n-module', {
      languages: ['en', 'de']
    }]
  ]
}
```
The available options are:

| Name                  | Type      | Default           | Description       |
| ----                  | ---       | ---               | ---               |
| languages             | string[]  | `["en"]`          | List of languages |
| defaultLanguage       | string    | First language    | Default language  |
| dateTimeFormats       | Object    | `{}`              | Date time formats, see [vue-i18n](https://kazupon.github.io/vue-i18n/api/#datetimeformats) |
| numberFormats         | Object    | `{}`              | Number formats, see [vue-i18n](https://kazupon.github.io/vue-i18n/api/#numberformats) |
| redirectDefaultLang   | boolean   | `true`            | Redirect default lang to localized url (eg: redirect `/` to `/en` when `en` is your default language) |
| rootUrl               | ?string   | `null`            | Root URL to prepend to alternate links. [Required by Google](https://support.google.com/webmasters/answer/189077). |

3: Create files `assets/locale/en.json` and `assets/locale/de.json` with your global translation phrases.
For example:
```json
{
  "hello-world": "Hallo Welt!"
}
```

### Usage

#### Localized Links (`localePath()`)
URLs within the application need to be localized.
To link to a URL in the current language, use `localePath()`:
```html
<nuxt-link :to="localePath('/foo')">Foo</nuxt-link>
```

#### Translate Phrases (`$t()`)
To translate a phrase, use [vue-i18n's `$t()`](https://kazupon.github.io/vue-i18n/api/#t):
```html
<h1>{{ $t('hello-world') }}</h1>
```

#### Language Switcher (`i18n-switcher`)
The _language switcher_ prints a list of links leading to translations of the current page in other languages:
```html
<i18n-switcher/>
```

#### Vuex Store
This module registers a Vuex store module with the name `i18n`.
It exposes the following functionality:
- Mutation `setLanguage(lang)`
- Getter `getLanguage()`

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

1. Bump the version in `package.json`
2. Commit, tag and push to master:
```
git commit -am 'version <version>'
git tag --annotate v<version>
git push --follow-tags
```
3. Travis will deploy to NPM
