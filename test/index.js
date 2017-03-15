var fs = require('fs')
var test = require('tape')
var postcss = require('postcss')
var validator = require('..')

function fixture (name) {
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf-8')
}

function run (name, options) {
  options = options || {}
  return postcss().use(validator({unknownProperty: false})).process(fixture(name)).css
}

test('valid', function (t) {
  t.doesNotThrow(function () {
    run('valid')
  })
  t.end()
})

test('nested selector', function (t) {
  t.throws(function () {
    run('nested-selector')
  },
  'ested rules [.nested]')
  t.end()
})

test('undefined property', function (t) {
  t.throws(function () {
    run('undefined-property')
  },
  'Unknown property [hoge] is used')
  t.end()
})

