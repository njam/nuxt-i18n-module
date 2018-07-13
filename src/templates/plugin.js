import Vue from 'vue'
import VueI18n from 'vue-i18n'
import './i18n.middleware'
import I18nSwitcher from './components/i18n-switcher.vue'

Vue.use(VueI18n)

export default ({app, store}) => {
  registerStoreModule(store, 'i18n', {
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
    }
  })

  let messages = {}
  options.languages.forEach((lang) => {
    messages[lang] = require('~/assets/locale/' + lang + '.json')
  })
  app.i18n = new VueI18n({
    locale: store.state['i18n'].language,
    fallbackLocale: options.defaultLanguage,
    messages: messages,
    silentTranslationWarn: true
  })

  Vue.use({
    install (app) {
      app.mixin({
        methods: {
          localePath (url) {
            let lang = this.$i18n.locale
            if (lang) {
              url = '/' + lang + url
            }
            return url
          },
          detectLanguage () {
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
          }
        },
        beforeMount () {
          let isRoot = !this.$options.parent
          if (isRoot && !this.$route.params.lang) {
            this.$router.replace({params: {lang: this.detectLanguage()}})
          }
        },
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
          let languageParamList = options.languages.concat(null)
          let alternateLinks = languageParamList.map((languageParam) => {
            let hreflang = (languageParam ? languageParam : 'x-default')
            return {
              href: this.$router.resolve({params: {lang: languageParam}}).href,
              rel: 'alternate',
              hreflang: hreflang,
              hid: 'alternate-lang-' + hreflang
            }
          })
          return {
            link: alternateLinks
          }
        }
      })
    }
  })

  Vue.component('i18n-switcher', I18nSwitcher)
}

function registerStoreModule (store, name, definition) {
  // See https://github.com/vuejs/vuex/issues/789#issuecomment-305241136
  if (store.state[name]) {
    const currentState = store.state[name]
    const moduleState = definition.state
    definition.state = () => {
      definition.state = moduleState
      return currentState
    }
  }
  store.registerModule(name, definition)
}

const options = <%= serialize(options) %>
