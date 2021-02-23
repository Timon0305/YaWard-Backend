const mongoose = require('mongoose');

const MyWishListSchema = new mongoose.Schema({
    customer_id: {
        type: String
    },
    flower_id: {
        type: String
    },
    shop_id: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
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

const MyWishList = mongoose.model('MyWishList', MyWishListSchema);

module.exports = MyWishList;