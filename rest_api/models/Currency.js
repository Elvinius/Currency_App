const mongoose = require("mongoose");

//to create a schema for our currencies
const CurrencySchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    rate: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('currencies', CurrencySchema); //we give the Currencies the schema to use 