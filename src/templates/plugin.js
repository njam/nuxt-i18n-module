import Vue from 'vue'
import VueI18n from 'vue-i18n'
import './i18n.middleware'
import I18nSwitcher from './components/i18n-switcher.vue'

Vue.use(VueI18n)

export default ({app, store}) => {
  let preserveState = !!store.state['i18n']
  store.registerModule('i18n', {
    namespaced: true,
    state: () => ({
      language: null
    }),
    mutations: {
      setLanguage (state, language) {
        if (options.languages.indexOf(language) === -1) {
          throw new Error('Invalid language: ' + language)
        }
        state.language = language
        app.i18n.locale = language
      }
    },
    getters: {
      getLanguage (state) {
        return state.language
      }
    }
  }, { preserveState })

  let messages = {}
  options.languages.forEach(lang => {
    messages[lang] = require('~/assets/locale/' + lang + '.json')
  })
  app.i18n = new VueI18n({
    locale: store.state['i18n'].language,
    fallbackLocale: options.defaultLanguage,
    messages: Object.freeze(messages),
    dateTimeFormats: options.dateTimeFormats || {},
    numberFormats: options.numberFormats || {},
    silentTranslationWarn: true
  })

  let redirectDefaultLang = {}
  if (options.redirectDefaultLang) {
    redirectDefaultLang = {
      beforeMount () {
        if (!this.$options.parent && !this.$route.params.lang) {
          this.$router.replace({
            params: {lang: this.i18nDetectLanguage()},
            query: { ...this.$route.query }
          })
        }
      }
    }
  }

  Vue.use({
    install (app) {
      app.mixin({
        methods: {
          localePath (url) {
            let lang = this.$i18n.locale
            if (!options.redirectDefaultLang && lang === options.defaultLanguage) {
              return url
            }
            if (lang) {
              url = '/' + lang + url
            }
            return url
          },
          i18nDetectLanguage () {
            let languageBrowserList = []
            if (typeof navigator !== 'undefined') {
              if (navigator.userLanguage) {
                languageBrowserList.unshift(navigator.userLanguage)
              }
              if (navigator.language) {
                languageBrowserList.unshift(navigator.language)
              }
            }

            let languageMatchFull, languageMatchPartial
            for (let language of options.languages) {
              for (let languageBrowser of languageBrowserList) {
                if (languageBrowser.toLowerCase().indexOf(language.toLowerCase()) === 0) {
                  languageMatchFull = language
                }
                if (language.toLowerCase().indexOf(languageBrowser.toLowerCase()) === 0) {
                  languageMatchPartial = language
                }
              }
            }

            return languageMatchFull || languageMatchPartial || options.defaultLanguage
          },
          i18nLangParam (language) {
            if (language === options.defaultLanguage && !options.redirectDefaultLang) {
              return null
            }
            return language
          }
        },
        ...redirectDefaultLang,
        transition (to, from) {
          if (from && from['name'] === to['name']) {
            // Disable page transition when switching language
            return {duration: 0, css: false}
          }
          return {}
        },
        head () {
          if (!this.$route) {
            return
          }
          let alternateLinks = options.languages.map(lang => {
            return {
              hreflang: lang,
              param: (lang === options.defaultLanguage && !options.redirectDefaultLang) ? null : lang
            }
          })
          if (options.redirectDefaultLang) {
            alternateLinks.push({
              hreflang: 'x-default',
              param: null
            })
          }
          return {
            htmlAttrs: {
              lang: this.$i18n.locale,
            },
            link: alternateLinks.map(link => {
              let href = this.$router.resolve({params: {lang: link.param}}).href
              if (options.rootUrl !== null) {
                href = options.rootUrl + href
              }
              return {
                href: href,
                rel: 'alternate',
                hreflang: link.hreflang,
                hid: 'alternate-lang-' + link.hreflang
              }
            })
          }
        }
      })
    }
  })

  Vue.component('i18n-switcher', I18nSwitcher)
}

const options = JSON.parse('<%= serialize(options) %>')
