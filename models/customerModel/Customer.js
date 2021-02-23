const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    recipient: {
        type: String
    },
    phone: {
        type: String,
    },
    birthday: {
        type: String
    },
    gender: {
        type: String
    },
    role: {
        type: String,
        default: 'customer'
    },
    status: {
        type: String,
    },
    created_at : {
        type: Date,
        default: Date.now
    },
    updated_at : {
        type: Date,
        default: null
    },
    deleted_at : {
        type: String,
        default: null
    }
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;