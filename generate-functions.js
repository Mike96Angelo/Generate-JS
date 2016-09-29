/**
 * @name generate.js
 * @author Michaelangelo Jong
 */

(function GeneratorScope() {

    function Generator() {}

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
                '\' but instead found \'' +
                typeof test + '\'');
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

    var Creation = {
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
            return Object.getPrototypeOf(this.constructor.prototype);
        }
    };

    defineObjectProperties(
        Generator, {
            configurable: false,
            enumerable: false,
            writable: false
        }, {
            prototype: Generator.prototype
        }
    );

    defineObjectProperties(
        Generator.prototype, {
            configurable: false,
            enumerable: false,
            writable: false
        },
        Creation
    );

    defineObjectProperties(
        Generator.prototype, {
            configurable: false,
            enumerable: false,
            writable: true
        }, {
            supercreate: function () {}
        }
    );

    defineObjectProperties(
        Generator, {
            configurable: false,
            enumerable: false,
            writable: false
        }, {
            __create: function () {},
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

                function Generator() {}

                Extend(Generator);

                defineObjectProperties(
                    Generator, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    }, {
                        __create: constructor,
                        prototype: Object.create(constructor.prototype),
                    }
                );

                defineObjectProperties(
                    Generator.prototype, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    },
                    Creation
                );

                defineObjectProperties(
                    Generator.prototype, {
                        configurable: false,
                        enumerable: false,
                        writable: false
                    }, {
                        /**
                         * Creates a new instance of this Generator.
                         * @return {Generator} Instance of this Generator.
                         */
                        constructor: Generator
                    }
                );

                return Generator;
            }
        }
    );

    function Extend(generator) {
        defineObjectProperties(
            generator, {
                configurable: false,
                enumerable: false,
                writable: false
            }, {
                /**
                 * Creates a new instance of this Generator.
                 * @return {Generator} Instance of this Generator.
                 */
                create: function create() {
                    var _ = this,
                        newObj = new _();

                    _.__supercreate(newObj, arguments);

                    return newObj;
                },

                __supercreate: function __supercreate(newObj, args) {
                    var _ = this,
                        superGenerator = _.__super;

                    newObj.supercreate = function supercreate() {

                        if (superGenerator && superGenerator.__supercreate) {
                            superGenerator.__supercreate(
                                newObj,
                                arguments);
                        }
                    };

                    _.__create.apply(newObj, args);

                    delete newObj.supercreate;
                },

                /**
                 * Generates a new generator that inherits from `this` generator.
                 * @param {Generator} ParentGenerator Generator to inherit from.
                 * @param {Function} create           Create method that gets called when creating a new instance of new generator.
                 * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
                 */
                generate: function generate(create) {
                    var _ = this;
                    assertError(_.prototype.defineProperties ===
                        Creation.defineProperties,
                        'Cannot call method \'generate\' on non-Generations.'
                    );
                    assertTypeError(create, 'function');

                    function Generator() {}

                    Extend(Generator);

                    defineObjectProperties(
                        Generator, {
                            configurable: false,
                            enumerable: false,
                            writable: false
                        }, {
                            /**
                             * Creates a new instance of this Generator.
                             * @return {Generator} Instance of this Generator.
                             */
                            __create: create,
                            __super: _,
                            prototype: Object.create(_.prototype),
                        }
                    );

                    return Generator;
                },

                /**
                 * Returns true if 'generator' was generated by this Generator.
                 * @param  {Generator} generator A Generator.
                 * @return {Boolean}             true or false.
                 */
                isGeneration: function isGeneration(generator) {
                    assertTypeError(generator, 'function');

                    var _ = this;

                    return _.prototype.isPrototypeOf(generator.prototype);
                },

                /**
                 * Returns true if 'object' was created by this Generator.
                 * @param  {Object} object An Object.
                 * @return {Boolean}       true or false.
                 */
                isCreation: function isCreation(object) {
                    var _ = this;
                    return object instanceof _;
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
    }

    Extend(Generator);

    Object.freeze(Generator);
    Object.freeze(Generator.prototype);

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
        window.GeneratorF = Generator;
    }

}());
