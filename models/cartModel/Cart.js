const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user_id : {
        type: String,
    },
    order_id : {
        type: String
    },
    total_amount : {
        type: String
    },
    items: {
        type: String
    },
    status: {
        type: String,
        default: 'pending'
    }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;