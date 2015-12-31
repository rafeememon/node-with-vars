/* eslint-env mocha */
var withVars = require('..')
var expect = require('chai').expect
var path = require('path')

describe('getParams', function () {
  var getParams = withVars.getParams

  it('should return the correct parameters with no variables', function () {
    expect(getParams({
      '_': ['node', 'app.js'],
      '$0': 'script.js'
    })).to.deep.equal({
      command: 'node',
      args: ['app.js'],
      env: {}
    })
  })

  it('should return the correct parameters with a variable', function () {
    expect(getParams({
      'NODE_ENV': 'production',
      '_': ['node', 'app.js'],
      '$0': 'script.js'
    })).to.deep.equal({
      command: 'node',
      args: ['app.js'],
      env: {'NODE_ENV': 'production'}
    })
  })
})

describe('runParams', function () {
  var runParams = withVars.runParams

  it('should set an environment variable', function (done) {
    var env = {'TEST_VARIABLE': 'TEST_VALUE'}
    var proc = runParams({
      command: 'node',
      args: [path.join(__dirname, 'fixtures', 'script.js')],
      env: env
    }, 'pipe')

    var output = ''
    proc.stdout.on('data', function (buffer) {
      output += buffer.toString('utf8')
    })
    proc.stderr.on('data', function (buffer) {
      throw new Error(buffer.toString('utf8'))
    })

    proc.on('close', function (code) {
      if (code !== 0) {
        throw new Error('exit code ' + code)
      }
      var data = JSON.parse(output)
      Object.keys(env).forEach(function (key) {
        expect(data).to.have.property(key, env[key])
      })
      done()
    })
  })
})
