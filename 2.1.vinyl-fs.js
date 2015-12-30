'use strict'

require('mocha')
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
	, browserify = require('browserify')


describe('vinyl-fs', function () {

	before(function (done) {
		del('./temp/*').then(function () {
			done()
		})
	})

	it('simply copying a file', function (done) {

		let stream = vfs.src('./fixtures/src.md')
		stream.pipe(vfs.dest('./temp/simple'))
		.on('finish', function () {
			assert(fs.statSync('./temp/simple/src.md').isFile())
			done()
		})
	})

	it('difference in end event timestamps from src and dest streams', function (done) {

		//execute ddone the second time its called.
		function* ddone(){
			yield function () {}
			yield function () { done() }
		}

		let dd = ddone()
		let startTime = process.hrtime()

		let readableStream = vfs.src('./fixtures/src.md')
		.on('end', function () {
			let endTime = process.hrtime()
			console.log('end: ', endTime[0]===startTime[0] ? endTime[1] - startTime[1] + 'ns': 'changed second')
			dd.next().value()
		})
		.pipe(vfs.dest('./temp/timestamp'))
		.on('finish', function () {
			let endTime = process.hrtime()
			console.log('finish: ', endTime[0]===startTime[0] ? endTime[1] - startTime[1] + 'ns': 'changed second')
			dd.next().value()
		})

	})

	it('using the passthrough argument in src', function (done) {
		//Allows .src to be used in the middle of a pipeline (using a duplex stream)
		//which passes through all objects received and adds all files globbed to the stream.

		//  the original stream     ------x======= the final destination (with both streams)
		//                               /
		//______________________________/ the one using passthrough (secondaryStream)

		let originalStream = vfs.src('./fixtures/src.md')
		let secondaryStream = vfs.src('./fixtures/src2.md', {passthrough: true})

		originalStream.pipe(secondaryStream).pipe(vfs.dest('./temp/pasthrough')
		.on('finish', function() {
			assert(fs.statSync('./temp/pasthrough/src.md').isFile())
			assert(fs.statSync('./temp/pasthrough/src2.md').isFile())
			done()
		}))

	})

	describe('concatenate all the files', function (done) {
		//if declared inside the beforeEach block wouldnt be accessible outside.
		let readStream, writeStream

		beforeEach(function (done) {
			readStream = vfs.src('./fixtures/*.md')
			writeStream = fs.createWriteStream('./temp/concat.md')
			done()
		})

		it('using a Buffer.toString() cast', function (done) {
			readStream.on('data', function (file) {
				writeStream.write(file.contents.toString())
			})
			.on('finish', function() { done() })
		})

		it('simply pipin\'', function (done) {
			readStream.on('data', function (file) {
				writeStream = fs.createWriteStream('./temp/concat.md', {flags: 'a'})
				file.pipe(writeStream)
			}).on('finish', function () {
				done()
			})
		})

	})

	describe ('copying the first line of each file to a new file using split', function (done) {
		let readStream, writeStream

		beforeEach(function (done) {
			readStream = vfs.src('./fixtures/*.md')
			writeStream = fs.createWriteStream('./temp/firstLiner.md')
			done()
		})

		it('split by hand', function (done) {

			readStream.on('data', function(file) {
				file.pipe(through(function (chunk, enc, cb) {
					this.push(chunk.toString().split('\n')[0] + '\n')
				})).pipe(writeStream)
			}).on('end', function () { done() })

		})
	})

	describe ('whats the difference between vinyl-source-stream and vinyl-fs source?' , function (done) {

		let vinylSourceStream = vss('pre.vss.bundled.js')

		browserify('./fixtures/index.js').bundle().pipe(vinylSourceStream).pipe(vfs.dest('temp/vss'))
		// this doesnt work
		//browserify('./fixtures/index.js').bundle().pipe(vfs.dest('temp/vfs'))
	})

})

// it('cocat all files with the same extension')
