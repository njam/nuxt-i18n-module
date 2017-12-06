import Vue from 'vue'
import VueI18n from 'vue-i18n'
import NuxtI18nLink from '~/modules/nuxt-i18n-module/src/components/NuxtI18nLink.vue'
import './i18n.middleware'

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
    fallbackLocale: options.defaultLanguage || options.languages[0],
    messages: messages,
    silentTranslationWarn: true
  })

  Vue.availableLanguages = Object.keys(messages)
  Vue.use({
    install (app) {
      app.mixin({
        methods: {
          localePath (url) {
            return '/' + store.state['i18n'].language + url
          },
          detectLanguage () {
            let languageList = []
            if (typeof navigator !== 'undefined') {
              if (navigator.languages) navigator.languages.forEach((lang) => languageList.unshift(lang.substring(0, 2)))
              if (navigator.language) languageList.unshift(navigator.language.substring(0, 2))
              if (navigator.userLanguage) languageList.unshift(navigator.userLanguage.substring(0, 2))

              // Clean duplicate entries
              languageList = Array.from(new Set(languageList))
            }
            let language = languageList.find((language) => {
              return (options.languages.indexOf(language) !== -1)
            })
            return language || options.defaultLanguage || options.languages[0]
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
              hid: 'alternate-lang-' + hreflang,
              rel: 'alternate',
              hreflang: hreflang,
              href: this.$router.resolve({params: {lang: languageParam}}).href
            }
          })
          return {
            link: alternateLinks
          }
        }
      })

      app.component('NuxtI18nLink', NuxtI18nLink)
    }
  })
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

// eslint-disable-next-line
const options = <%= serialize(options) %>
