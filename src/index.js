const {resolve} = require('path')
const pathToRegexp = require('path-to-regexp')

module.exports = function (moduleOptions) {
  const defaults = {
    languages: ['en'],
    defaultLanguage: 'en'
  }
  moduleOptions = Object.assign({}, defaults, moduleOptions)
  let router = this.options.router

  if(moduleOptions.languages.indexOf(moduleOptions.defaultLanguage) === -1) {
    throw new Error('The `defaultLanguage` is not in `languages`.')
  }

  // Add middleware
  this.addTemplate({
    src: resolve(__dirname, './templates/middleware.js'),
    fileName: 'i18n.middleware.js',
    options: moduleOptions
  })
  router.middleware.push('i18n')

  // Add plugin
  this.addPlugin({
    src: resolve(__dirname, './templates/plugin.js'),
    fileName: 'i18n.plugin.js',
    options: moduleOptions
  })

  // Add routes for *routing*
  this.extendRoutes(function (routes) {
    routes.sort((a, b) => {
      return b['path'].length - a['path'].length
    })
    routes.forEach(route => {
      route.path = addLangParamToRoute(route.path)
    })
    return routes
  })

  // Add routes for *generation*
  this.nuxt.hook('generate:extendRoutes', function (routes) {
    let routesToGenerate = []

    /*
     * Routes from `options.generate.routes` are assumed to be without `:lang` parameter.
     * Therefore we need to intepolate the language into those routes here.
     */
    routes.forEach(route => {
      let routeWithLang = addLangParamToRoute(route.route)
      interpolateLangInRoute(routeWithLang).forEach(path => {
        routesToGenerate.push({route: path, payload: route.payload})
      })
    })

    /*
     * Routes from the router with dynamic parameters are not 'generated' by nuxt.
     * We find those with only a single parameter called `:lang` here, interpolate the language
     * and add them for 'generation'.
     */
    let routesRouter = flatRoutes(router.routes)
    routesRouter = routesRouter.filter((route) => {
      let tokens = pathToRegexp.parse(route)
      let params = tokens.filter((token) => typeof token === 'object')
      return params.length === 1 && params[0].name === 'lang'
    })
    routesRouter.forEach(routeWithLang => {
      interpolateLangInRoute(routeWithLang).forEach(path => {
        routesToGenerate.push({route: path, payload: null})
      })
    })

    // Replace elements in `routes` with elements from `routesToGenerate`
    routes.splice(0, routes.length, ...routesToGenerate)
  })

  /**
   * @param {string} path
   * @returns {string}
   */
  function addLangParamToRoute (path) {
    return `/:lang(\\w{2})?${path}`
  }

  /**
   * @param {string} path
   * @returns {string[]}
   */
  function interpolateLangInRoute (path) {
    let toPath = pathToRegexp.compile(path)
    let languageParamList = moduleOptions.languages.concat(null)
    return languageParamList.map(languageParam => {
      return toPath({lang: languageParam})
    })
  }

  function flatRoutes (router, path = '', routes = []) {
    router.forEach(r => {
      if (r.children) {
        flatRoutes(r.children, path + r.path + '/', routes)
      } else {
        routes.push((r.path === '' && path[path.length - 1] === '/' ? path.slice(0, -1) : path) + r.path)
      }
    })
    return routes
  }

}
