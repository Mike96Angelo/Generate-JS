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

// Generator Instance Methods
Object.defineProperties(GeneratorMethods, {
    instanceOf: {
        value:
        /**
         * Returns true if this instance inherits from 'generator'.
         * @param  {Generator} generator A Generator.
         * @return {Boolean}             true or false.
         */
        function instanceOf(generator) {
            var _ = this;
            if (typeof generator === 'object') {
                while (typeof _.proto === 'object') {
                    _ = _.proto;
                    if (_.generator === generator) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
});

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
    generatedBy: {
        value:
        /**
         * Returns true if this Generator inherits from 'generator'.
         * @param  {Generator} generator A Generator.
         * @return {Boolean}             true or false.
         */
        function generatedBy(generator) {
            var _ = this;
            if (typeof generator === 'object') {
                while (typeof _.proto === 'object') {
                    _ = _.proto;
                    if (_ === generator.proto) {
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
        function definePrototypeMethods(methods) {
            var prototypeProperties = {},
                i,
                key;
            if (methods instanceof Array) {
                for (i = 0; i < methods.length; i++) {
                    if (typeof methods[i] === 'function') {
                        prototypeProperties[getFunctionName(methods[i])] = {value: methods[i]};
                    }
                }
                Object.defineProperties(this.proto.prototypeProperties, prototypeProperties);
            } else if (methods instanceof Function) {
                methods = Array.prototype.slice.call(arguments);
                for (i = 0; i < methods.length; i++) {
                    if (typeof methods[i] === 'function') {
                        prototypeProperties[getFunctionName(methods[i])] = {value: methods[i]};
                    }
                }
            } else if (methods instanceof Object) {
                for (key in methods) {
                    if (methods.hasOwnProperty(key)) {
                        if (typeof methods[key] === 'function') {
                            prototypeProperties[getFunctionName(methods[key])] = {value: methods[key]};
                        }
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
        value:
        /**
         * Returns true if 'generator' is a Generator.
         * @param  {Object} generator An object to be tested.
         * @return {Boolean}          true or false.
         */
        function isGenerator(generator) {
            if (typeof generator === 'object') {
                while (typeof generator.proto === 'object') {
                    generator = generator.proto;
                }
                return generator === Generator.proto;
            }
            return false;
        }
    }
});

// Exports
module.exports = Generator;
