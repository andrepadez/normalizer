var Person = require('./model').model;
var normalizer = require('../index');

exports.normalize = function(test){
	test.expect(1);
	var origString = '';
	var desiredResult = '';
	for(var idx in normalizer.charMap){
		origString += idx + normalizer.charMap[idx].join('');
		for(var i = 0; i <= normalizer.charMap[idx].length; i++){
			desiredResult += idx;
		}		
	}
	var result = normalizer.normalize(origString);
	test.equal(result, desiredResult, "the two strings should be the same");
	test.done();
};

exports.normalizeFilter = function(test){
	test.expect(2);
	var origFilter = {
		name: 'André',
		email: 'andre',
		address: {
			city: 'Olhão'
		}
	};
	var desiredFilterRegExp = {
		"normalized.name": new RegExp('andre', 'i'),
		"normalized.address.city": new RegExp('olhao', 'i'),
		email: new RegExp('andre', 'i')
	};
	var desiredFilterWholeString = {
		"normalized.name": 'andre', 
		"normalized.address.city": 'olhao',
		email: 'andre'
	};
	var resultFilter = normalizer.normalizeFilter(origFilter, Person);
	test.deepEqual(resultFilter, desiredFilterRegExp, "Testing with RegExp - the two filter objects should be the same");

	resultFilter = normalizer.normalizeFilter(origFilter, Person, true);
	test.deepEqual(resultFilter, desiredFilterWholeString, "Testing with WholeString - the two filter objects should be the same");
	test.done();
};

exports.normalizeSort = function(test){
	test.expect(1);
	var origSort = {
		name: 1,
		email: -1, 
		address: {
			city: 1
		}
	};
	var desiredSort = {
		"normalized.name": 1, 
		"normalized.address.city": 1,
		email: -1
	};
	var resultSort = normalizer.normalizeSort(origSort, Person);
	test.deepEqual(resultSort, desiredSort, "the two sort objects should be the same");
	test.done();
};

exports.normalizedSearchFields = function(test){
	var doc = {
		name: 'André Alçada',
		email: 'andre.padez@gmail.com',
		phone: 912345678,
		address: {
			city: 'Olhão',
			county: 'Algés',
			localAddress: {
				streetName: 'Calçada de São Julião',
				building: '13',
				apartment: 'A'
			}
		}
	};

	var requiredResult = {
		name: 'André Alçada',
		email: 'andre.padez@gmail.com',
		phone: 912345678,
		address: {
			city: 'Olhão',
			county: 'Algés',
			localAddress: {
				streetName: 'Calçada de São Julião',
				building: '13',
				apartment: 'A'
			}
		},
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
	test.expect(1);
	var newDoc = normalizer.normalizeSearchFields(doc, Person);
	test.deepEqual(newDoc, requiredResult, "newDoc.normalized should render to the requiredResult");
	test.done();
};




