# JSJS

> Talk to the material, ignite a conversation, let it show its limits. Its strengths and weaknesses.

Exercises to learn javascript exploring freely.


## 1. Generators
This example should be run as: `node --harmony-destructuring 1.generators.js`

> Generators are functions which can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances. []

__Los generadores son funciones que pueden _retornar_ y volver a entrar.__

Es decir, es una función que conserva un estado interno.

Llamar un generador no ejecuta su código inmediatamente, en vez devuelve un iterador.

Cada vez que se llama el método `next` del iterador se ejecuta la función hasta que encuentra el próximo `yield`.


Examples of:

1. The most basic generator
2. Natural numbers without a loop _Incorrect Hypothesis_
3. Natural numbers
4. Range function implementation
5. Destructuring
6. Implement a once function

## 2. Vinyl


## . Spread operator [Requires EC2015]

## . Rest arguments [Requires EC2015]
