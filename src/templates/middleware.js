import middleware from './middleware'

middleware['i18n'] = function ({ isHMR, app, store, route, params, error, redirect }) {
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) {
    return
  }

  if (
    params.lang &&
    options.languages
      .filter(lang => (options.redirectDefaultLang ? true : lang !== options.defaultLanguage))
      .indexOf(params.lang) === -1
  ) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
  store.commit('i18n/setLanguage', params.lang || options.defaultLanguage)
}

const options = JSON.parse('<%= serialize(options) %>')
