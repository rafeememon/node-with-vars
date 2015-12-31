'use strict'

var spawn = require('cross-spawn-async')
var assign = require('object-assign')

function getParams (argv) {
  var command = argv._[0]
  var args = argv._.slice(1)
  var env = {}

  Object.keys(argv).forEach(function (key) {
    if (key !== '_' && key !== '$0') {
      env[key] = argv[key]
    }
  })

  return {command: command, args: args, env: env}
}

function getEnv (env) {
  if (process.platform === 'win32') {
    return assign({}, env, {
      APPDATA: process.env.APPDATA
    })
  } else {
    return env
  }
}

function runParams (params, stdio) {
  return spawn(params.command, params.args, {
    env: getEnv(params.env),
    stdio: stdio
  })
}

function withVars (argv) {
  return runParams(getParams(argv), 'inherit')
}

withVars.getParams = getParams
withVars.runParams = runParams

module.exports = withVars
