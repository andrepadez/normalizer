Normalizer
========

Simple string normalizer to use with Mongoose models or directly with Mongo; helps with filtering and sorting strings with non-english UTF8 characters.   
I have built it to fit my current needs for the project i'm working on;   
this is an open invitation for you to fork it and adapt it to your needs or contribute to make it more general-purpose;
First contribution i need, is to complete the charMap object with the characters i left out.

<h3>you should use it because:</h3>
<ul>
    <li>Designed for Mongoose, but works just as easily with MongoDB</li>
    <li>Not a Plugin!!!</li>
    <li>Simple to use</li>
    <li>Little or no overhead</li>
    <li>4 methods to rule them all</li>
    <li>All methods run synchronously</li>
    <li>uses node-unit for testing</li>
</ul>

<h3>you should look away if:</h3>
<ul>
    <li>you already work with a plugin that solves your problem well</li>
    <li>you are working with big data - this uses RegExp engine, can clog your queries</li>
    <li>potato</li>
</ul>

Usage
-----

As always you have to require it:

    var normalizer = require('normalizer');

You can use it directly to normalize a string:

    var originalString = 'André Alçada Padez';
    var normalizedString = normalizer.normalize(originalString);
    //normalizedString => 'andre alcada padez'
    
Here is an example insert:

    var doc = req.body;
    doc = normalizer.normalizeSearchFields(doc, Person);
    var person = new Person(doc);
    person.save();

Using with Mongo:

    //you just have to pass an object, containing the fields to be normalized:
    var schema = {
        normalized: {
            name: String,
            ....
        }
    };
    var doc = req.body;
    doc = normalizer.normalizeSearchFields(doc, schema);
    var person = new Person(doc);
    person.save();
    
and for filtering and sorting:
    
    var filter = {nome: 'André'};
    normalizer.treatFilter(filter);
    var sort = {nome: 1};
    normalizer.treatSort(sort);
    Person.find(filter).sort(sort).exec(function(err, people){....});
    //you can expect the correct results here


Detailed Instructions
-----
<br>
<b>Installation</b>
    
    npm install normalizer
and, wherever you need it
    
    var normalizer = require('normalizer');

<br>
<b>Implementation</b>

First, you need to "pimp" your Model's Schema, create a top-level property called normalized, containing the properties you want to normalize:

and for filtering and sorting:
    
   
    var schema = {
        name: String,
        address: {
            city: String,
            county: String,
            localAddress: {
                streetName: String,
                building: String,
                apartment: String
            }
        },
        email: String,
        phone: String,
        normalized: {
            name: String, 
            address: {
                city: String,
                county: String,
                localAddress: {
                    streetName: String,
                }
            }
        }
    };
    
    var schema = new mongoose.Schema(exports.schema);
    var Person = mongoose.model('Person', schema);

Right before upserting the document to the DB, you need to run normalizeSearchFields(), for example:
    
    var doc = req.body;
    normalizer.normalizeSearchFields(doc, Person);
    doc.save(function(){...});


That's it!, the result will be a Person instance, with the added <code>normalized</code> field, containing the transformation you would expect from the original document:

    //this:
    {
        name: 'André Alçada',
        address: {
            city: 'Olhão',
            county: 'Algés',
            localAddress: {
                streetName: 'Calçada de São Julião',
                building: '13',
                apartment: 'A'
            }
        },
        email: 'andre.padez@gmail.com',
        phone: 912345678,
    };
    //becomes:
    var body = {
        name: 'André Alçada',
        address: {
            city: 'Olhão',
            county: 'Algés',
            localAddress: {
                streetName: 'Calçada de São Julião',
                building: '13',
                apartment: 'A'
            }
        },
        email: 'andre.padez@gmail.com',
        phone: 912345678,
        normalized: {
            name: 'andre alcada',
            address: {
                city: 'olhao',
                county: 'alges',
                localAddress: {
                    streetName: 'calcada de sao juliao' 
                }
            } 
        }
    };

Be careful for every time you run <code>normalizeSearchFields</code>, the normalized object is always rewritten so, you have to pass at least all the original fields that will be expected or you will lose the other ones. (side note: this is a question opened for discussion, if i get enough feedback, i will rewrite it to protect the fields).


API
-----
<br>
<code>normalizer.normalize()</code>

    exports.normalize(String string[, Boolean keepCase]){
        //if keepCase == false -> returned string will be lowercased 
        return String
    }
    
    var string = 'André Alçada Padez'; 
    var normString = normalizer.normalize(string);
    //normString = 'andre alcada padez';
    //or
    var normString = normalizer.normalize(string, true);
    //normString = 'Andre Alcada Padez';
<br>
<code>normalizer.normalizeSearchFields()</code>

    exports.normalizeSearchFields = function(Object doc, Mongoose.Model|Object model[, Boolean keepCase]){
        //does not return, only updates the doc object
    }
    
    var doc = req.body;
    normalizer.normalizeSearchFields(doc, Person);
    var person = new Person(doc);
    person.save();
    //see normalizer.normalize for keepCase
    
<br>
<code>normalizer.normalizeFilter()</code>

    exports.normalizeFilter = function(Object filter, Mongoose.Model|Object model[, Boolean wholeString][, Boolean keepCase){
        //returns normalized filter object
        //if wholeString == false -> a regExp is used ( /text/i ), ideal for fuzzy search or 'like' functionality 
    }
    
    var filter = {name: 'André', email: 'andre'};
    filter = normalize.normalizeFilter(filter, Person); filter => {'normalized.name': 'andre', email: 'andre'}
    //or, using keepCase:
    filter = normalize.normalizeFilter(filter, Person, true); filter => {'normalized.name': 'Andre', email: 'andre'}
<br>
<code>normalizer.normalizeSort()</code>

    exports.normalizeSort = function(Object sort, Mongoose.Model|Object model[, Boolean wholeString]){
        //returns normalized sort object
    }
    
    var sort = {name: 1, email: -1};
    sort = normalize.normalizeSort(sort); // sort => {'normalized.name': 1, email: -1}

Road Map
-----

<ul>
    <li>add more characters to the charMap - that will be up to you (: </li>
</ul>

Feel free to use, fork and please contribute reporting bugs and with pull requests
