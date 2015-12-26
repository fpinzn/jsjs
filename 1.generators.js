'use strict'

var test = require('tape')

var LL = console.log


function* basic () {
	yield 1
	yield 2
	yield 3
}

test('yield 1 2 3', function (t) {
	let gg = basic()

	t.plan(3)
	t.equal(1, gg.next().value)
	t.equal(2, gg.next().value)
	t.equal(3, gg.next().value)
})

// NUMBERS
// Hypothesis, this should be infinite. Returning the next number each time.
test('natural numbers without loops', function (t) {

	function* numbers () {
		var i = 0
		yield i++
	}

	let nn = numbers()

	t.plan(2)
	t.equal(0, nn.next().value)
	t.equal(undefined, nn.next().value)

	t.comment('----- Wrong Hypothesis')
})

test('natural numbers using while', function (t) {
	function* numbers2 () {
		var i = 0
		while (true) {
			yield i++
		}
	}

	let nn2 = numbers2()

	t.plan(5)
	t.equal(0, nn2.next().value)
	t.equal(1, nn2.next().value)
	t.equal(2, nn2.next().value)
	t.equal(3, nn2.next().value)
	t.equal(4, nn2.next().value)

	t.comment('---------Correct Hypothesis')
})

test('Implement a Range Function', function (t) {
	function* range(limit) {
		let i = 0
		while (i <= limit) {
			yield i++
		}
	}

	let rr = range(5)

	t.plan(5)
	t.equal(0, rr.next().value)
	t.equal(1, rr.next().value)
	t.equal(2, rr.next().value)
	t.equal(3, rr.next().value)
	t.equal(4, rr.next().value)
})

test('Use generators for destructuring', function (t) {
	let [a, b, c] = basic()

	t.plan(3)
	t.equal(a, 1)
	t.equal(b, 2)
	t.equal(c, 3)
})

test('Implement a once function', function (t) {
	function* once (daFunction) {
		yield daFunction
		while (true) {
			yield function () {}
		}
	}

	let count = 0
	let onced = once(function () { count++ })

	t.plan(3)
	t.equal(0, count)

	onced.next().value()

	t.equal(1, count)

	onced.next().value()

	t.equal(1, count)

	t.comment('-- the syntax may not be the best but the function is actually called only once')
})

// test('Using the splat operator over finite iterators', function (t) {
// 	let splat = [...basic()]
// 	t.plan(1)
// 	t.equal([1, 2, 3], splat)
// })
// 
// test('using generators as promises', function (t) {
// 	// function* asyncDude () {
// 	// 	setTimeout(function () {
// 	// 		yield 10
// 	// 	}, 10)
// 	// }
// 	function* echo(text, delay = 0)
// 		const caller = yield
// 		setTimeout(function () { caller.success(text) }, delay)
// 	}
//
// 	run(function* echoes() {
// 		console.log(yield echo('this'));
// 		console.log(yield echo('is'));
// 		console.log(yield echo('a test'));
// 	})
//
// })

// // use in a for, -let a of genFunc...
//
