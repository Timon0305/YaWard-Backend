const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    store : {
        type: String
    },
    legal: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    cr: {
        type: String
    },
    cr_image: {
        type: String
    },
    vat: {
        type: String
    },
    vat_image: {
        type: String
    },
    map: {
        type: String
    },
    bank: {
        type: String
    },
    ban: {
        type: Number
    },
    commission_rate: {
        type: Number
    },
    role: {
        type: String,
        default: 'vendor'
    },
    value: {
        type: String,
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;