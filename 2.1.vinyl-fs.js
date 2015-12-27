'use strict'

var vfs = require('vinyl-fs')
var fs = require('fs')
var assert = require('assert')
var del = require('del')
var split = require('split')
var util = require('util')
var through = require('through2')
var File = require('vinyl')

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

	it('copying the first line of each file to a new file', function (done) {
		let readStream = vfs.src('./fixtures/*.md')
		let writeStream = fs.createWriteStream('./temp/lineSplitter.md')


		readStream.on('data', function (file) {
		// 	console.log(File.isVinyl(file))
		//
		// 	// // console.log(file.contents)
			file.pipe(split())
			.on('data', function(line){
				// writeStream.push('lol')
				console.log('lol',line)
		// 		writeStream.write(line)
			})
		// 	// util.inspect(chunk)
		})

		// //this works
		// let manualReadStream = fs.createReadStream('./fixtures/src.md')
		// manualReadStream.pipe(split()).on('data', function(line) {
		// 	console.log(line)
		// })
		// fs.createReadStream('./fixtures/src.md')
	    //   .pipe(split())
	    //   .on('data', function (line) {
	    //     console.log(line)
	    //   })



	})
})

// it('cocat all files with the same extension')
