# Release v3.1.2

# v3.0.0 has *BREAKING* changes and is not compatible for inheirtance with *ANY* v2.\*.\* Generators.

## Table of Contents

* [ Generator ](#generator)
	* [ Generator.generate(create) ](#generate)
	* [ Generator.isGenerator(test) ](#is-generator)
	* [ Generator.generateFrom(constructor, create) ](#generate-from)
	* [ Class: Generation ](#class-generation)
		* [ new Generation() ](#generation-create)
		* [ Generation.definePrototype([descriptor,] properties) ](#generation-define-prototype)
		* [ Generation.generate(create) ](#generation-generate)
		* [ Generation.isCreation(test) ](#generation-is-creation)
		* [ Generation.isGeneration(test) ](#generation-is-generation)
	* [ Class: Creation ](#class-creation)
		* [ Creation.defineProperties([descriptor,] properties) ](#creation-define-properties)
		* [ Creation.getProto() ](#creation-get-proto)
		* [ Creation.getSuper() ](#creation-get-super)


<a name="generator"></a>
# Generator

An easy to use prototypal inheritance model.

### Install:
```
$ npm install generate-js
```

<a name="generate"></a>
## Generator.generate(create)

* *create* `Function` Constructor that with inherit form [Generation](#class-generation).
* *return*: `Constructor` The inputed `create` function.

Returns a new [Generation](#class-generation) that inherits from [Generation](#class-generation).

Example:
```javascript
var Generator = require('generate-js');

var Person = Generator.generate(
	/* create method */
	function Person(name, age, sex) {
		this.name = name || 'no-name';
		this.age = age	 || 0;
		this.sex = sex	 || 'unknown';
	}
);
```

<a name="is-generator"></a>
## Generator.isGenerator(test)

* *test* `Object` An Object to be tested.
* *return*: `Boolean` `true` or `false`.

Returns `true` if *test* object inherits from [Generation](#class-generation), `false` otherwise.

<a name="generate-from"></a>
## Generator.generateFrom(constructor, create)

* *constructor* `Function` An constructor to be generatorized.
* *create* `Function` Constructor that with inherit form [Generation](#class-generation) and *constructor*.
* *return*: `Constructor` The inputed `create` function.

Returns a new [Generation](#class-generation) that inherits from [Generation](#class-generation) and *constructor*.

*NOTE*: Some native constructors can *NOT* be generatorized.

Example:
```javascript
// generatorize NodeJS' EventEmitter
var Generator = require('generate-js'),
	events	  = require('events');

var EventEmitter = Generator.generateFrom(events.EventEmitter, function EventEmitter() {
  events.EventEmitter.call(this); //call the super constructor
});

// new EventEmitter() same as new events.EventEmitter();

// new generators can inherit all the abilities of EventEmitter like so.
var MyNewGenerator = EventEmitter.generate(
	/* create method */
	function MyNewGenerator() {
    EventEmitter.call(this); //call the super constructor

    // your code
  }
);

```

<a name="class-generation"></a>
## Class: Generation

A new Generation that inherits from the Generation that generated it using the [Generation.generate(create)](#generation-generate) method.

<a name="generation-create"></a>
## new Generation()

* *return*: `Creation` A new [Creation](#class-creation) that is an instance of *this* [Generation](#generation).

Creates a new [Creation](#class-creation) that is an instance of *this* [Generation](#generation).

Example:
```javascript
var jim = new Person('Jim', 10, 'male');

jim.name // 'Jim'
jim.age  // 10
jim.sex  // 'male'

jim.sayHello(); // prints out: 'Hello, my name is Jim.  What is yours?'
jim.sayBye();	// prints out: 'Goodbye.'

```

<a name="generation-define-prototype"></a>
## Generation.definePrototype([descriptor,] properties)

* *descriptor* `Object` Optional object descriptor that will be applied to all attaching properties.
	* *configurable* `Boolean` States weather or not properties will be *configurable*, defaults to `false`.
	* *enumerable* `Boolean` States weather or not properties will be *enumerable*, defaults to `false`.
	* *writable* `Boolean` States weather or not properties will be *writable*, defaults to `false`.
* *properties* `Object` An object who's properties will be attached to *this* [Generation.prototype](#generation).
* *return*: `Generation` *This* [Generation](#class-generation).

Defines shared properties for all [Creations](#class-creation) created by *this* [Generation](#class-generation).

Example:
```javascript
/*
 * Defining prototype properties that can be overwritten by Creations using the `=` sign.
 */
Person.definePrototype(
	{
		writable: true
	},
	{
		sayHello: function() {
			console.log('Hello, my name is ' + this.name + '.  What is yours?');
		}
	}
);

/*
 * Defining prototype properties that can NOT be overwritten by Creations using the `=` sign.
 */
Person.definePrototype(
	{
		writable: false
	},
	{
		sayBye: function() {
			console.log('Goodbye.');
		}
	}
);

/*
 * Defining prototype properties that use getters and setters.
 * NOTE: getter/setter prototype properties can NOT be overwritten by Creations using the `=` sign.
 */
(function(){
	var something = 'something';

	Person.definePrototype({
		something: {
			get: function() {
				return something;
			},
			set: function (newSomething) {
				something = newSomething;
				return something;
			}
		}
	});
}());

```

<a name="generation-generate"></a>
## Generation.generate(create)

* *create* `Function` Constructor that with inherit form [Generation](#class-generation).
* *return*: `Constructor` The inputed `create` function.

Returns a new [Generation](#class-generation) that inherits from *this* [Generation](#class-generation).

Example:
```javascript
var Student = Person.generate(
	/* create method */
	function Student(name, age, sex, studentId) {
		Person.call(this, name, age, sex);
		this.studentId = studentId || 'A0000000000';
	}
);

Student.definePrototype(
	{
		writable: true
	},
	{
		sayHello: function () {
			console.log('Sup? My student ID is: ' + this.studentId + '.');
		}
	}
);

var sarah = new Student('Sarah', 17, 'female', 'A0123456789');

sarah.name		  // 'Sarah'
sarah.age		  // 17
sarah.sex		  // 'female'
sarah.studentId   // 'A0123456789'

sarah.sayHello(); // prints out: 'Sup? My student ID is: A0123456789'
sarah.sayBye();   // prints out: 'Goodbye.'

```

<a name="generation-is-generation"></a>
## Generation.isGeneration(test)

* *test* `Object` An Object to be tested.
* *return*: `Boolean` `true` or `false`.

Returns `true` if *test* inherits from *this* [Generation](#class-generation), `false` otherwise.

<a name="generation-is-creation"></a>
## Generation.isCreation(test)

* *test* `Object` An Object to be tested.
* *return*: `Boolean` `true` or `false`.

Returns `true` if *test* is an instance of *this* [Generation](#generation), `false` otherwise.

<a name="class-creation"></a>
## Class: Creation

A instance [Generation](#generation) that created it using the [new Generation()](#generation-create).

<a name="creation-define-properties"></a>
## Creation.defineProperties([descriptor,] properties)

* *descriptor* `Object` Optional object descriptor that will be applied to all attaching properties.
	* *configurable* `Boolean` States weather or not properties will be *configurable*, defaults to `false`.
	* *enumerable* `Boolean` States weather or not properties will be *enumerable*, defaults to `false`.
	* *writable* `Boolean` States weather or not properties will be *writable*, defaults to `false`.
* *properties* `Object` An object who's properties will be attached to *this* [Creation](#class-creation).
* *return*: `Creation` *This* [Creation](#class-creation).

Defines properties on *this* [Creation](#class-creation).

Example:
```javascript
/*
 * Jim is stubborn and blue will always be his favorite color.
 */
jim.defineProperties(
	{
		writable: false
	},
	{
		favoriteColor: 'blue'
	}
);

/*
 * Sarah is indecisive and pink may not be her favorite color tomorrow.
 */
sarah.defineProperties(
	{
		writable: true
	},
	{
		favoriteColor: 'pink'
	}
);

```

<a name="creation-get-proto"></a>
## Creation.getProto()

* *return*: `Object` Prototype of *this* [Creation](#class-creation).

Returns the prototype of *this* [Creation](#class-creation).

<a name="creation-get-super"></a>
## Creation.getSuper()

* *return*: `Object` Super prototype of *this* [Creation](#class-creation).

Returns the super prototype of *this* [Creation](#class-creation).

## Author:
	Michaelangelo Jong

## License:
	The MIT License (MIT)

	Copyright (c) 2014-2016 Michaelangelo Jong

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
