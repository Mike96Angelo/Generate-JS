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
 * Returns true if 'obj' is an object containing only get and set functions, false otherwise.
 * @param  {Any} obj Value to be tested.
 * @return {Boolean} true or false.
 */
function isGetSet(obj) {
    var keys, length;
    if (obj instanceof Object) {
        keys = Object.getOwnPropertyNames(obj).sort();
        length = keys.length;

        if ((length === 1 && (keys[0] === 'get' && obj.get instanceof Function ||
                              keys[0] === 'set' && obj.set instanceof Function)) ||
            (length === 2 && (keys[0] === 'get' && obj.get instanceof Function &&
                              keys[1] === 'set' && obj.set instanceof Function))) {
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
        length;

    if (!descriptor || !(descriptor instanceof Object)) {
        descriptor = {};
    }

    if (!properties || !(properties instanceof Object)) {
        properties = descriptor;
        descriptor = {};
    }

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

    defineObjectProperties(
        properties,
        {
            configurable: false,
            enumerable: false,
            writable: false
        },
        {
            proto: ParentGenerator.proto.prototypeProperties,
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
            __create: create,
            __init: init
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
            var newObj = Object.create(this.proto.prototypeProperties);

            newObj.defineProperties(
                {
                    configurable: false,
                    enumerable: false,
                    writable: false
                },
                {
                    proto: this.proto.prototypeProperties
                }
            );

            this.init(newObj);

            this.__create.apply(newObj, Array.prototype.slice.call(arguments));
            return newObj;
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
         * Inits any data stores on 'obj' needed by prototypal methods.
         * @param  {Object} obj A Generator instance.
         * @return {undefined}  undefined.
         */
        init: function init(obj) {
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
        },
        __init: function() {},
        /**
         * Returns true if 'generator' was generated by this Generator.
         * @param  {Generator} generator A Generator.
         * @return {Boolean}             true or false.
         */
        isGeneration: function isGeneration(generator) {
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
        },
        /**
         * Returns true if 'object' was created by this Generator.
         * @param  {Object} object An Object.
         * @return {Boolean}       true or false.
         */
        isCreation: function isCreation(object) {
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
        },
        /**
         * Defines methods on this' prototype.
         * @param  {Array} methods An array of named methods.
         * @return {Generator}     This Generator.
         */
        definePrototypeMethods: function definePrototypeMethods(descriptor, methods) {
            var setMethods = {},
                i;
            if (!methods || !(methods instanceof Object)) {
                methods = descriptor;
                descriptor = {};
            }

            if (!descriptor || !(descriptor instanceof Object)) {
                descriptor = {};
            }

            if (methods instanceof Array) {
                for (i = 0; i < methods.length; i++) {
                    if (typeof methods[i] === 'function') {
                        setMethods[getFunctionName(methods[i])] = methods[i];
                    }
                }

            }
            this.definePrototype(descriptor, setMethods);
            console.warn('Generator.definePrototypeMethods is deprecated, please use \'definePrototype\' instead.');
            return this;
        },
        /**
         * Defines shared properties for all instances of this.
         * @param  {Object} properties Object keys => descriptors.
         * @return {Generator}         This Generator.
         */
        definePrototypeProperties: function definePrototypeProperties(descriptor, properties) {
            this.definePrototype(descriptor, properties);
            console.warn('Generator.definePrototypeProperties is deprecated, please use \'definePrototype\' instead.');
            return this;
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
        }
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
        proto:       GeneratorProto,
        generate:    GeneratorProto.generate,
        isGenerator: GeneratorProto.isGeneration
    }
);

// Exports
module.exports = Generator;
