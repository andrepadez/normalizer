var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.schema = {
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

exports.model = mongoose.model('Person', schema);