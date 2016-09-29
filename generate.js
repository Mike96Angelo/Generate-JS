/**
 * @name generate.js
 * @author Michaelangelo Jong
 */

(function GeneratorScope() {

    // Variables
    var Creation = {},
        Generation = {},
        Generator = {};

    // Helper Methods

    /**
     * Assert Error function.
     * @param  {Boolean} condition Whether or not to throw error.
     * @param  {String} message    Error message.
     */
    function assertError(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    /**
     * Assert TypeError function.
     * @param  {Boolean} condition Whether or not to throw error.
     * @param  {String} message    Error message.
     */
    function assertTypeError(test, type) {
        if (typeof test !== type) {
            throw new TypeError('Expected \'' + type +
                '\' but instead found \'' + typeof test + '\'');
        }
    }

    /**
     * Returns the name of function 'func'.
     * @param  {Function} func Any function.
     * @return {String}        Name of 'func'.
     */
    function getFunctionName(func) {
        if (func.name !== void(0)) {
            return func.name;
        }
        // Else use IE Shim
        var funcNameMatch = func.toString()
            .match(/function\s*([^\s]*)\s*\(/);
        func.name = (funcNameMatch && funcNameMatch[1]) || '';
        return func.name;
    }

    /**
     * Returns true if 'obj' is an object containing only get and set functions, false otherwise.
     * @param  {Any} obj Value to be tested.
     * @return {Boolean} true or false.
     */
    function isGetSet(obj) {
        var keys, length;
        if (obj && typeof obj === 'object') {
            keys = Object.getOwnPropertyNames(obj)
                .sort();
            length = keys.length;

            if ((length === 1 && (keys[0] === 'get' && typeof obj.get ===
                    'function' ||
                    keys[0] === 'set' && typeof obj.set === 'function'
                )) ||
                (length === 2 && (keys[0] === 'get' && typeof obj.get ===
                    'function' &&
                    keys[1] === 'set' && typeof obj.set === 'function'
                ))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Defines properties on 'obj'.
     * @param  {Object} obj        An object that 'properties' will be attached to.
     * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties on 'properties'.
     * @param  {Object} properties An object who's properties will be attached to 'obj'.
     * @return {Generator}         'obj'.
     */
    function defineObjectProperties(obj, descriptor, properties) {
        var setProperties = {},
            i,
            keys,
            length,

            p = properties || descriptor,
            d = properties && descriptor;

        properties = (p && typeof p === 'object') ? p : {};
        descriptor = (d && typeof d === 'object') ? d : {};

        keys = Object.getOwnPropertyNames(properties);
        length = keys.length;

        for (i = 0; i < length; i++) {
            if (isGetSet(properties[keys[i]])) {
                setProperties[keys[i]] = {
                    configurable: !!descriptor.configurable,
                    enumerable: !!descriptor.enumerable,
                    get: properties[keys[i]].get,
                    set: properties[keys[i]].set
                };
            } else {
                setProperties[keys[i]] = {
                    configurable: !!descriptor.configurable,
                    enumerable: !!descriptor.enumerable,
                    writable: !!descriptor.writable,
                    value: properties[keys[i]]
                };
            }
        }
        Object.defineProperties(obj, setProperties);
        return obj;
    }

    // Creation Class
    defineObjectProperties(
        Creation, {
            configurable: false,
            enumerable: false,
            writable: false
        }, {
            /**
             * Defines properties on this object.
             * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
             * @param  {Object} properties An object who's properties will be attached to this object.
             * @return {Object}            This object.
             */
            defineProperties: function defineProperties(descriptor,
                properties) {
                defineObjectProperties(this, descriptor,
                    properties);
                return this;
            },

            /**
             * returns the prototype of `this` Creation.
             * @return {Object} Prototype of `this` Creation.
             */
            getProto: function getProto() {
                return Object.getPrototypeOf(this);
            },

            /**
             * returns the prototype of `this` super Creation.
             * @return {Object} Prototype of `this` super Creation.
             */
            getSuper: function getSuper() {
                return Object.getPrototypeOf(this.generator)
                    .proto;
                // return Object.getPrototypeOf(Object.getPrototypeOf(this));
            }
        }
    );

    // Generation Class
    defineObjectProperties(
        Generation, {
            configurable: false,
            enumerable: false,
            writable: false
        }, {
            name: 'Generation',

            proto: Creation,

            /**
             * Creates a new instance of this Generator.
             * @return {Generator} Instance of this Generator.
             */
            create: function create() {
                var _ = this,
                    newObj = Object.create(_.proto);

                _.__supercreate(newObj, arguments);

                return newObj;
            },

            __supercreate: function __supercreate(newObj, args) {
                var _ = this,
                    superGenerator = Object.getPrototypeOf(_),
                    supercreateCalled = false;

                newObj.supercreate = function supercreate() {

                    supercreateCalled = true;

                    if (Generation.isGeneration(superGenerator)) {
                        superGenerator.__supercreate(newObj,
                            arguments);
                    }
                };

                _.__create.apply(newObj, args);

                if (!supercreateCalled) {
                    newObj.supercreate();
                }

                delete newObj.supercreate;
            },

            __create: function () {},

            /**
             * Generates a new generator that inherits from `this` generator.
             * @param {Generator} ParentGenerator Generator to inherit from.
             * @param {Function} create           Create method that gets called when creating a new instance of new generator.
             * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
             */
            generate: function generate(create) {
                var _ = this;

                assertError(Generation.isGeneration(_) || _ ===
                    Generation,
                    'Cannot call method \'generate\' on non-Generations.'
                );
                assertTypeError(create, 'function');

                var newGenerator = Object.create(_),
                    newProto = Object.create(_.proto);

                defineObjectProperties(
                    newProto, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    }, {
                        generator: newGenerator
                    }
                );

                defineObjectProperties(
                    newGenerator, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    }, {
                        name: getFunctionName(create),
                        proto: newProto,
                        __create: create
                    }
                );

                return newGenerator;
            },

            /**
             * Returns true if 'generator' was generated by this Generator.
             * @param  {Generator} generator A Generator.
             * @return {Boolean}             true or false.
             */
            isGeneration: function isGeneration(generator) {
                var _ = this;
                return _.isPrototypeOf(generator);
            },

            /**
             * Returns true if 'object' was created by this Generator.
             * @param  {Object} object An Object.
             * @return {Boolean}       true or false.
             */
            isCreation: function isCreation(object) {
                var _ = this;
                return _.proto.isPrototypeOf(object);
            },

            /**
             * Defines shared properties for all objects created by this generator.
             * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
             * @param  {Object} properties An object who's properties will be attached to this generator's prototype.
             * @return {Generator}         This generator.
             */
            definePrototype: function definePrototype(descriptor,
                properties) {
                defineObjectProperties(this.proto, descriptor,
                    properties);
                return this;
            },

            /**
             * Generator.toString method.
             * @return {String} A string representation of this generator.
             */
            toString: function toString() {
                return '[' + (this.name || 'generation') +
                    ' Generator]';
            }
        }
    );

    // Generator Class Methods
    defineObjectProperties(
        Generator, {
            configurable: false,
            enumerable: false,
            writable: false
        }, {
            /**
             * Generates a new generator that inherits from `this` generator.
             * @param {Generator} ParentGenerator Generator to inherit from.
             * @param {Function} create           Create method that gets called when creating a new instance of new generator.
             * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
             */
            generate: function generate(create) {
                return Generation.generate(create);
            },

            /**
             * Returns true if 'generator' was generated by this Generator.
             * @param  {Generator} generator A Generator.
             * @return {Boolean}             true or false.
             */
            isGenerator: function isGenerator(generator) {
                return Generation.isGeneration(generator);
            },

            /**
             * [toGenerator description]
             * @param  {Function} constructor A constructor function.
             * @return {Generator}            A new generator who's create method is `constructor` and inherits from `constructor.prototype`.
             */
            toGenerator: function toGenerator(constructor) {

                assertTypeError(constructor, 'function');

                var newGenerator = Object.create(Generation),
                    newProto = Object.create(constructor.prototype);

                defineObjectProperties(
                    newProto, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    }, {
                        generator: newGenerator
                    }
                );

                defineObjectProperties(
                    newProto, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    },
                    Creation
                );

                defineObjectProperties(
                    newGenerator, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    }, {
                        name: getFunctionName(constructor),
                        proto: newProto,
                        __create: constructor
                    }
                );

                return newGenerator;
            }
        }
    );

    Object.freeze(Creation);
    Object.freeze(Generation);
    Object.freeze(Generator);

    // Exports
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(function () {
            return Generator;
        });
    } else if (typeof module === 'object' && typeof exports === 'object') {
        // Node/CommonJS
        module.exports = Generator;
    } else {
        // Browser global
        window.Generator = Generator;
    }

}());
