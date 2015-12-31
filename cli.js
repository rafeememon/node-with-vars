#!/usr/bin/env node

'use strict'

var yargs = require('yargs')
var withVars = require('./')

withVars(yargs.argv).on('end', process.exit)
