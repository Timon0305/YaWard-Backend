const mongoose = require('mongoose');

const OccasionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    slug : {
        type: String
    },
    description: {
        type: String
    },
    image: {
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

const Occasion = mongoose.model('Occasion', OccasionSchema);

module.exports = Occasion;