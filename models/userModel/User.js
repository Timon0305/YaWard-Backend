const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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

const User = mongoose.model('User', UserSchema);

module.exports = User;