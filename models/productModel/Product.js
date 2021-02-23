const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    vendor_id : {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    slug: {
        type: String
    },
    sku: {
        type: String
    },
    regular_price : {
        type: String
    },
    discount_price : {
        type: String
    },
    quantity: {
        type: String
    },
    status: {
        type: String
    },
    image: {
        type: String
    },
    categoryName: {
        type: String
    },
    occasionName: {
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
        type: Date,
        default: null
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;