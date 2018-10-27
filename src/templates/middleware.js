import middleware from './middleware'

middleware['i18n'] = function ({isHMR, app, store, route, params, error, redirect}) {
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) {
    return
  }

  let lang = params.lang
  if (lang && options.languagesExplicit.indexOf(lang) === -1) {
    return error({message: 'This page could not be found.', statusCode: 404})
  }
  store.commit('i18n/setLanguage', lang || options.defaultLanguage)
}

const options = JSON.parse('<%= serialize(options) %>')
