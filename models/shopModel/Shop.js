const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    address: {
        type: String
    },
    status: {
        type: String,
        default: 'Closed'
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
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

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;