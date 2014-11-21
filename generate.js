// generator.js
// Author: Michaelangelo Jong

// Variables
var Generator = {},
    GeneratorMethods = {},
    GeneratorProto = {};

// Helper Methods
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
    var funcNameMatch = func.toString().match(/function\s*([^\s]*)\s*\(/);
    func.name = (funcNameMatch && funcNameMatch[1]) || '';
    return func.name;
}

/**
 * Generates a new generator that inherits from 'ParentGenerator'.
 * @param {Generator} ParentGenerator Generator to inherit from.
 * @param {Function} create           Create method that gets called when creating a new instance of new generator.
 * @param {Function} init             Inits any data stores needed by prototypal methods.
 * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
 */
function GeneratorFunc(ParentGenerator, create, init) {
    ParentGenerator = Generator.isGenerator(ParentGenerator) ? ParentGenerator : Generator;
    var proto       = Object.create(ParentGenerator.proto),
        properties  = Object.create(ParentGenerator.proto.prototypeProperties),
        generator   = Object.create(proto);

    create = typeof create === 'function' ? create : Generator.proto.__create;
    init   = typeof init   === 'function' ? init   : Generator.proto.__init;

    Object.defineProperties(properties, {
        proto: {
            value: ParentGenerator.proto.prototypeProperties
        },
        generator: {
            value: generator
        }
    });

    Object.defineProperties(proto, {
        proto: {
            value: ParentGenerator.proto
        },
        prototypeProperties: {
            value: properties
        },
        create: {
            set: function (createFunc) {
                if (typeof createFunc === 'function') {
                    create = createFunc;
                }
                return Generator.proto.create;
            },
            get: function () {
                return Generator.proto.create;
            }
        },
        __create: {
            set: function (createFunc) {
                if (typeof createFunc === 'function') {
                    create = createFunc;
                }
                return create;
            },
            get: function () {
                return create;
            }
        },
        generate: {
            get: function () {
                return Generator.proto.generate;
            }
        },
        init: {
            set: function (initFunc) {
                if (typeof initFunc === 'function') {
                    init = initFunc;
                }
                return Generator.proto.init;
            },
            get: function () {
                return Generator.proto.init;
            }
        },
        __init: {
            set: function (initFunc) {
                if (typeof initFunc === 'function') {
                    init = initFunc;
                }
                return init;
            },
            get: function () {
                return init;
            }
        }
    });

    Object.defineProperty(generator, 'proto', {
        value: proto
    });

    return generator;
}

// Generator Base Inheritance
Object.defineProperties(GeneratorProto, {
    prototypeProperties: {
        value: GeneratorMethods
    },
    create: {
        value:
        /**
         * Creates a new instance of this Generator.
         * @return {Generator} Instance of this Generator.
         */
        function create() {
            var newObj = Object.create(this.proto.prototypeProperties);

            Object.defineProperties(newObj, {
                proto: {
                    value: this.proto.prototypeProperties
                }
            });

            this.init(newObj);

            this.__create.apply(newObj, Array.prototype.slice.call(arguments));
            return newObj;
        }
    },
    __create: {
        value: function () {}
    },
    generate: {
        value:
        /**
         * Returns a new Generator that inherits from this Generator.
         * @param {Function} create Create method that gets called when creating a new instance of new generator.
         * @param {Function} init   Inits any data stores needed by prototypal methods.
         * @return {Generator}      New generator that inherits from this Generator.
         */
        function generate(create, init) {
            return GeneratorFunc(this, create, init);
        }
    },
    init: {
        value:
        /**
         * Inits any data stores on 'obj' needed by prototypal methods.
         * @param  {Object} obj A Generator instance.
         * @return {undefined}  undefined.
         */
        function init(obj) {
            var me = this,
                inits = [],
                i;
            while (me.proto) {
                inits.push(me.proto.__init);
                me = me.proto;
            }
            for (i = inits.length - 1; i >= 0; i--) {
                inits[i].call(obj);
            }
        }
    },
    __init: {
        value: function () {}
    },
    isGeneration: {
        value:
        /**
         * Returns true if 'generator' was generated by this Generator.
         * @param  {Generator} generator A Generator.
         * @return {Boolean}             true or false.
         */
        function isGeneration(generator) {
            var _ = this;
            if (generator instanceof Object && _ !== generator) {
                while (typeof generator.proto === 'object') {
                    generator = generator.proto;
                    if (_.proto === generator) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    isCreation: {
        value:
        /**
         * Returns true if 'object' was created by this Generator.
         * @param  {Object} object An Object.
         * @return {Boolean}       true or false.
         */
        function isCreation(object) {
            var _ = this;
            if (object instanceof Object && _ !== object) {
                while (typeof object.proto === 'object') {
                    object = object.proto;
                    if (_.proto.prototypeProperties === object) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    definePrototypeMethods: {
        value:
        /**
         * Defines methods on this' prototype.
         * @param  {Array} methods An array of named methods.
         * @return {Generator}     This Generator.
         */
        function definePrototypeMethods(descriptor, methods) {
            var prototypeProperties = {},
                i;
            if (descriptor instanceof Array) {
                methods = descriptor;
                descriptor = {};
            }
            if (methods instanceof Array) {
                for (i = 0; i < methods.length; i++) {
                    if (typeof methods[i] === 'function') {
                        prototypeProperties[getFunctionName(methods[i])] = {
                            configurable: !!descriptor.configurable,
                            enumerable: !!descriptor.enumerable,
                            writable: !!descriptor.writable,
                            value: methods[i]
                        };
                    }
                }
                Object.defineProperties(this.proto.prototypeProperties, prototypeProperties);
            }
            return this;
        }
    },
    definePrototypeProperties: {
        value:
        /**
         * Defines shared properties for all instances of this.
         * @param  {Object} properties Object keys => descriptors.
         * @return {Generator}         This Generator.
         */
        function definePrototypeProperties(properties) {
            if (properties instanceof Object) {
                Object.defineProperties(this.proto.prototypeProperties, properties);
            }
            return this;
        }
    }
});

// Generator Class Methods
Object.defineProperties(Generator, {
    proto: {
        value: GeneratorProto
    },
    generate: {
        value: GeneratorProto.generate
    },
    isGenerator: {
        value: GeneratorProto.isGeneration
    }
});

// Exports
module.exports = Generator;
