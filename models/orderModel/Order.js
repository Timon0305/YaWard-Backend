const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customer_id : {
        type: String
    },
    amount: {
        type : String
    },
    discount_amount : {
        type: String
    },
    status : {
        type: String
    },
    vendor_id : {
        type : String
    },
    coupon : {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    },
    deleted_at : {
        type: Date,
        default: null
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;