# JSJS

> Talk to the material, ignite a conversation, let it show its limits; its strengths and weaknesses.

Exercises to learn javascript exploring freely.


## 1. Generators
This example should be run as: `npm run generators`

> Generators are functions which can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances. []

__Los generadores son funciones que pueden _retornar_ y volver a entrar.__
Es decir, es una función que conserva un estado interno.
Llamar un generador no ejecuta su código inmediatamente, en vez devuelve un iterador.

Cada vez que se llama el método `next` del iterador se ejecuta la función hasta que encuentra el próximo `yield`.


Examples of:

- [x] The most basic generator
- [x] Natural numbers without a loop _Incorrect Hypothesis_
- [x] Natural numbers
- [x] Range function implementation
- [x] Destructuring
- [x] Implement a once function
- [ ] Async calls using the await form
- [ ] Using the value for which `yield` is replaced Ex: `a = yield`

## 2. Vinyl
[vinyl-fs](https://github.com/gulpjs/vinyl-fs)

> Vinyl is a metadata object which describes a file: path and content. Not necessarily in your filesystem (S3, FTP, WebTorrent (?:!!!))

Un Vinyl es un objeto de metadatos que describe un archivo, tanto su _path_ como su contenido. El archivo puede estar en cualquier lugar, no necesariamente en el sistema de archivos local.

This variety of sources creates the need for vinyl adapters. Which act as the interface.

A vinyl adapter exposes:

```
	src(globs)::ReadableStream #produces vinyl objects
	dest(folder)::WriteableStream #consumes vinyl objects
	watch(globs, fn) #executes the fn each time any of the files on the glob changes
```

__Note:__ The globs pattern are evaluated in order so any subtraction `(!*.do_not_include.js)` should come last.

Other methods can be exposed if needed.

### Vinyl-FS
Had to use mocha for the tests. The need to wait on a listener to be called proved difficult in tape.

Is the adapter for the local filesystem. And provides several interesting options.

`npm run vinyl-fs`

Examples of:

- [x] simply copying a file
- [x] difference in end event timestamps from src and dest streams _The difference is invisible using console.time (a millisecond measure) and must be measured using `process.hrtime()`. The difference is about 1M ns which is about 1ms_

- [x] using the passthrough argument in `src` _This allow to mingle different streams of origin into one dest, think lib and vendor_
- [x] concatenate all the files
	- [x] using a Buffer.toString() cast
	- [x] simply pipin'
- [x] copying the first line of each file to a new file
- [ ] concat all files with the same extension using a single glob
- [ ] autoindex a markdown file
- [ ] use the since option on the src

#What's the difference between vinyl-fs and vinyl-source-stream

Whats the difference in the output stream in both? None.

The thing is vfs.dest expects a stream of Vinyl Files.

Vinyl Source Stream takes a String Stream and turns it into a single Vinyl File which can be piped to the vfs.dest

For example the browserify output can't be passed directly yo vfs.dest because is a string stream.

## Streams
Got here from the vinyl exercises.

```coffeescript
	vinylStream.onData (file) ->
		file.pipe split()
```
### file system

ReadableStreams have an `end` event, while WriteableStreams have a `finish` event.

__Stream inside a stream__ Vinyl src produces a stream of vinyl files, and each can be opened using
`fs.createWriteStream` to get a stream of its contents.

`fs.createWriteStream` produces by default a file descriptor with `w` mode, if you wish to append content instead of replace it use `fs.createWriteStream({flags: 'a'})`

Notice it also allows random write access to the file via the `start` flag.

Streams are abstract interfaces. They can be writeable, readable or both.



### Duplexify
https://github.com/mafintosh/duplexify
Got here from the vinyl exercises.

## . Spread operator [Requires EC2015]

## . Rest arguments [Requires EC2015]


## To Study

[Orchestrator](https://github.com/orchestrator/orchestrator)
>Orchestrator provides an easy way to define tasks, task dependencies, and run tasks with maximum concurrency while respecting the dependency tree.
