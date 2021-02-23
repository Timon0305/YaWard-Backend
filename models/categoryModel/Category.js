const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    slug : {
        type: String
    },
    description: {
        type: String
    },
    status: {
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
        default : null
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;