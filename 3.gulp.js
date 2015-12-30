'use strict'

var vfs = require('vinyl-fs')
	, fs = require('fs')
	, assert = require('assert')
	, del = require('del')
	, util = require('util')
	, through = require('through2')
	, File = require('vinyl')
	, observableDiff = require('deep-diff').diff
	, cloneDeep = require('lodash').cloneDeep
	, tap = require('tap-stream')
	, vss =  require('vinyl-source-stream')

require('mocha')

describe('vinyl-fs', function () {

	before(function (done) {
		del('./temp/*').then(function () {
			done()
		})
	})


})

// it('cocat all files with the same extension')
