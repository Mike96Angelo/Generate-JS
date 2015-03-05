// generator.js
// Author: Michaelangelo Jong

(function GeneratorScope() {

// Variables
var Generator = {},
    GeneratorMethods = {},
    GeneratorProto = {};

// Helper Methods

function toString() {
    return '[' + (this.name || 'generator') + ' Generator]';
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
    var funcNameMatch = func.toString().match(/function\s*([^\s]*)\s*\(/);
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
    if (typeof obj === 'object') {
        keys = Object.getOwnPropertyNames(obj).sort();
        length = keys.length;

        if ((length === 1 && (keys[0] === 'get' && typeof obj.get === 'function' ||
                              keys[0] === 'set' && typeof obj.set === 'function')) ||
            (length === 2 && (keys[0] === 'get' && typeof obj.get === 'function' &&
                              keys[1] === 'set' && typeof obj.set === 'function'))) {
            return true;
        }
    }
    return false;
}

/**
 * Returns a descriptor that describes an inserting property based on key naming conventions.
 * @param  {String} key An object key to be parsed.
 * @return {Object}     A descriptor.
 */
function parseDescriptor(key) {
    var descriptor;

    switch (true) {
    case /^__.*__$/.test(key):
        descriptor = {
            configurable: false,
            enumerable: false,
            writable: false
        };
        break;
    case /^_.*_$/.test(key):
        descriptor = {
            configurable: false,
            enumerable: true,
            writable: false
        };
        break;
    case /^__/.test(key):
        descriptor = {
            configurable: false,
            enumerable: false,
            writable: true
        };
        break;
    case /^_/.test(key):
        descriptor = {
            configurable: false,
            enumerable: true,
            writable: true
        };
        break;
    case /__$/.test(key):
        descriptor = {
            configurable: true,
            enumerable: false,
            writable: false
        };
        break;
    case /_$/.test(key):
        descriptor = {
            configurable: true,
            enumerable: true,
            writable: false
        };
        break;
    default:
        descriptor = {
            configurable: true,
            enumerable: true,
            writable: true
        };
    }

    return descriptor;
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
        setDescriptor,
        descriptorParse = false,
        i,
        keys,
        length;

    if (!descriptor || typeof descriptor !== 'object') {
        return obj;
    }

    if (!properties || typeof properties !== 'object') {
        if (!descriptor || typeof descriptor !== 'object') {
            return obj;
        } else {
            properties = descriptor;
            descriptor = {};
            descriptorParse = true;
        }
    }

    keys = Object.getOwnPropertyNames(properties);
    length = keys.length;

    for (i = 0; i < length; i++) {
        setDescriptor = descriptorParse ? parseDescriptor(keys[i]) : descriptor;
        if (isGetSet(properties[keys[i]])) {
            setProperties[keys[i]] = {
                configurable: !!setDescriptor.configurable,
                enumerable: !!setDescriptor.enumerable,
                get: properties[keys[i]].get,
                set: properties[keys[i]].set
            };
        } else {
            setProperties[keys[i]] = {
                configurable: !!setDescriptor.configurable,
                enumerable: !!setDescriptor.enumerable,
                writable: !!setDescriptor.writable,
                value: properties[keys[i]]
            };
        }
    }

    Object.defineProperties(obj, setProperties);

    return obj;
}

/**
 * Generates a new generator that inherits from 'ParentGenerator'.
 * @param {Generator} ParentGenerator Generator to inherit from.
 * @param {Function} create           Create method that gets called when creating a new instance of new generator.
 * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
 */
function GeneratorFunc(ParentGenerator, create) {
    ParentGenerator = Generator.isGenerator(ParentGenerator) ? ParentGenerator : Generator;
    var proto       = Object.create(ParentGenerator.proto),
        properties  = Object.create(ParentGenerator.proto.prototypeProperties),
        generator   = Object.create(proto);

    create = typeof create === 'function' ? create : Generator.proto.__create;

    defineObjectProperties(
        properties,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        {
            generator: generator
        }
    );

    defineObjectProperties(
        proto,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        {
            proto: ParentGenerator.proto,
            prototypeProperties: properties,
            __parentGenerator: ParentGenerator,
            __create: create,
        }
    );

    defineObjectProperties(
        generator,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        {
            name: getFunctionName(create),
            proto: proto
        }
    );

    return generator;
}

/**
 * Generates a new generator that inherits from the 'constructor' class.
 * @param  {Function} constructor A constructor to be generatorized, constructor will be used as the Create method.
 * @return {Generator}            New Generator that inherits from 'ParentGenerator'.
 */
function toGenerator(constructor) {
    var proto       = Object.create(Generator.proto),
        properties  = Object.create(constructor.prototype),
        generator   = Object.create(proto);

    defineObjectProperties(
        properties,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        {
            generator: generator
        }
    );

    defineObjectProperties(
        properties,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        Generator.proto.prototypeProperties
    );

    defineObjectProperties(
        proto,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        {
            proto: Generator.proto,
            prototypeProperties: properties,
            __parentGenerator: Generator,
            __create: constructor,
        }
    );

    defineObjectProperties(
        generator,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        {
            name: getFunctionName(constructor),
            proto: proto
        }
    );

    return generator;
}

// Generator Instance Inheritance
defineObjectProperties(
    GeneratorMethods,
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        /**
         * Defines properties on this object.
         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
         * @param  {Object} properties An object who's properties will be attached to this object.
         * @return {Object}            This object.
         */
        defineProperties: function defineProperties(descriptor, properties) {
            if(GeneratorMethods === this) {
                throw new Error('defineProperties CANNOT be called on this object.');
            }
            defineObjectProperties(this, descriptor, properties);
            return this;
        }
    }
);

// Generator Base Inheritance
defineObjectProperties(
    GeneratorProto,
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        prototypeProperties: GeneratorMethods,
        /**
         * Creates a new instance of this Generator.
         * @return {Generator} Instance of this Generator.
         */
        create: function create() {
            var _ = this,
                args = Array.prototype.slice.call(arguments),
                newObj = Object.create(_.proto.prototypeProperties);

            _.__supercreate.apply(newObj, [_].concat(args));

            return newObj;
        },
        __supercreate: function __supercreate(generator) {
            var _ = this,
                args = Array.prototype.slice.call(arguments).slice(1),
                parentGenerator = generator.__parentGenerator,
                supercreateCalled = false;

            _.supercreate = function supercreate() {
                supercreateCalled = true;

                if (Generator.isGenerator(parentGenerator)){
                    parentGenerator.__supercreate.apply(_, [parentGenerator].concat(args));
                }
            };

            generator.__create.apply(_, args);

            if (!supercreateCalled) {
                _.supercreate();
            }

            delete _.supercreate;
        },
        __create: function () {},
        /**
         * Returns a new Generator that inherits from this Generator.
         * @param {Function} create Create method that gets called when creating a new instance of new generator.
         * @param {Function} init   Inits any data stores needed by prototypal methods.
         * @return {Generator}      New generator that inherits from this Generator.
         */
        generate:function generate(create, init) {
            return GeneratorFunc(this, create, init);
        },
        /**
         * Returns true if 'generator' was generated by this Generator.
         * @param  {Generator} generator A Generator.
         * @return {Boolean}             true or false.
         */
        isGeneration: function isGeneration(generator) {
            var _ = this;
            if (typeof generator === 'object' && _ !== generator) {
                while (typeof generator.__parentGenerator === 'object') {
                    generator = generator.__parentGenerator;
                    if (_ === generator) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * Returns true if 'object' was created by this Generator.
         * @param  {Object} object An Object.
         * @return {Boolean}       true or false.
         */
        isCreation: function isCreation(object) {
            var _ = this;

            if (typeof object === 'object' && Generator.isGenerator(object.generator)) {
                return _ === object.generator || _.isGeneration(object.generator);
            }
            return false;
        },
        /**
         * Defines shared properties for all objects created by this generator.
         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
         * @param  {Object} properties An object who's properties will be attached to this generator's prototype.
         * @return {Generator}         This generator.
         */
        definePrototype: function definePrototype(descriptor, properties) {
            defineObjectProperties(this.proto.prototypeProperties, descriptor, properties);
            return this;
        },
        toString: toString
    }
);

// Generator Class Methods
defineObjectProperties(
    Generator,
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        name:        'Generator',
        proto:       GeneratorProto,
        prototypeProperties: GeneratorMethods,
        generate:    GeneratorProto.generate,
        isGenerator: GeneratorProto.isGeneration,
        toGenerator: toGenerator,
        toString:    toString
    }
);

// Exports
if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
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
