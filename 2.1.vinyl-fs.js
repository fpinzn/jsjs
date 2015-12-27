'use strict'

var vfs = require('vinyl-fs')
var fs = require('fs')
var assert = require('assert')
var del = require('del')
var split = require('split')
var util = require('util')
var through = require('through2')
var File = require('vinyl')
var observableDiff = require('deep-diff').diff
var cloneDeep = require('lodash').cloneDeep

require('mocha')

describe('vinyl-fs', function () {

	beforeEach(function (done) {
		del('./temp/*').then(function () {
			done()
		})
	})

	it('simply copying a file', function (done) {

		let stream = vfs.src('./fixtures/src.md')
		stream.pipe(vfs.dest('./temp'))
		.on('finish', function () {
			assert(fs.statSync('./temp/src.md').isFile())
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
		.pipe(vfs.dest('./temp/'))
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

		originalStream.pipe(secondaryStream).pipe(vfs.dest('./temp')
		.on('finish', function() {
			assert(fs.statSync('./temp/src.md').isFile())
			assert(fs.statSync('./temp/src2.md').isFile())
			done()
		}))

	})

	describe('concatenate all the files', function (done) {
		//if declared inside the beforeEach block wouldnt be accessible outside.
		let readStream, writeStream

		beforeEach(function (done) {
			readStream = vfs.src('./fixtures/*.md')
			writeStream = fs.createWriteStream('./temp/lineSplitter.md')
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
				file.pipe(writeStream)
				.on('close', function () {
					// the first time writeStream is defined as in the beforeEach block ('w' access flag)
					// the following times is defined with 'r+' (append access)
					writeStream = fs.createWriteStream('./temp/lineSplitter.md', {flags: 'a'})
				})
			}).on('finish', function () { done() })
		})

	})
})

// it('copying the first line of each file to a new file', function (done) {
// it('cocat all files with the same extension')
