Generate-JS
===========

A easy to use prototypal inheritance modal and generator. 

#Generator

**Functions**

* [create()](#create)
* [generate(create, init)](#generate)
 
<a name="create"></a>
#create()
Creates a new instance of this Generator.

**Returns**: `Generator` - Instance of this Generator.  
<a name="generate"></a>
#generate(create, init)
Returns a new Generator that inherits from this Generator.

**Params**

- create `function` - Create method that gets called when creating a new instance of new generator.  
- init `function` - Inits any data stores needed by prototypal methods.  

**Returns**: `Generator` - New generator that inherits from this Generator.
