const {resolve} = require('path')
const pathToRegexp = require('path-to-regexp')

module.exports = function (moduleOptions) {
  moduleOptions = parseModuleOptions(moduleOptions)
  let router = this.options.router

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

  this.addTemplate({
    src: resolve(__dirname, './templates/components/NuxtI18nLink.vue'),
    fileName: 'components/i18n.NuxtI18nLink.vue',
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
      routesToGenerate.push(...interpolateLangInRoute(routeWithLang, route.payload))
    })

    /*
     * Routes from the router with dynamic parameters are not 'generated' by nuxt.
     * We take those that have only a single parameter called `:lang`, interpolate the language
     * and add them for 'generation'.
     */
    let routesRouter = flatRoutes(router.routes)
    routesRouter = routesRouter.filter(route => {
      let tokens = pathToRegexp.parse(route)
      let params = tokens.filter(token => typeof token === 'object')
      return params.length === 1 && params[0].name === 'lang'
    })
    routesRouter.forEach(routeWithLang => {
      routesToGenerate.push(...interpolateLangInRoute(routeWithLang))
    })

    // Replace elements in `routes` with elements from `routesToGenerate`
    routes.splice(0, routes.length, ...routesToGenerate)
  })

  /**
   * @param {Object} options
   * @returns {Object}
   */
  function parseModuleOptions (options) {
    const defaults1 = {
      languages: ['en'],
      redirectDefaultLang: true,
    }
    const defaults2 = {
      defaultLanguage: options.languages[0],
    }

    options = Object.assign(defaults1, moduleOptions)
    if (options.languages.length === 0) {
      throw new Error('No languages are defined.')
    }
    options = Object.assign(defaults2, options)
    if (options.languages.indexOf(options.defaultLanguage) === -1) {
      throw new Error(`Default language (${options.defaultLanguage}) not present in list of languages.`)
    }
    return options
  }

  /**
   * @param {string} path
   * @returns {string}
   */
  function addLangParamToRoute (path) {
    return `/:lang([\\w-]{2,5})?${path}`
  }

  /**
   * @param {string} path
   * @param {object} [payload]
   * @returns {{route:string, payload:object}[]}
   */
  function interpolateLangInRoute (path, payload) {
    let toPath = pathToRegexp.compile(path)
    let languageParamList = moduleOptions.languages.concat(null)
    return languageParamList.map(languageParam => {
      return {
        route: toPath({lang: languageParam}),
        payload: Object.assign({lang: languageParam}, payload)
      }
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
