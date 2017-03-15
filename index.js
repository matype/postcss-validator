var postcss = require('postcss')
var validator = require('csstree-validator')
var chalk = require('chalk')
var knownProperties = require('known-css-properties')

module.exports = postcss.plugin('postcss-validator', function (opts) {
  opts = opts || {}

  var validateString = validator.validateString
  var reporter = validator.reporters.json

  return function (root) {
    checkNestedRules(root)
    checkUnknownProperties(root)

    console.log(chalk.green('SUCCESS to build valid CSS'))

    return root
  }
})

function error () {
  console.error(chalk.red('Built to invalid CSS'))
}

function checkNestedRules (root) {
  root.walkRules(function (rule) {
    rule.walkRules(function (r) {
      error()
      throw r.error('Nested rules [' + r.selector + ']')
    })
  })
}

function checkUnknownProperties (root) {
  var knownPropertiesMap = {}
  knownProperties.all.forEach(function (knownProperty) {
    knownPropertiesMap[knownProperty] = true
  })

  root.walkDecls(function (decl) {
    if (!knownPropertiesMap[decl.prop]) {
      error()
      throw decl.error('Unknown property [' + decl.prop + '] is used')
    }
  })
}
