const mongoose = require('mongoose');

const MyOccasionSchema = new mongoose.Schema({
    customer_id: {
        type: String
    },
    title: {
        type: String
    },
    occasionType: {
        type: String
    },
    occasionDate: {
        type: String
    },
    occasionRemain: {
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

const MyOccasion = mongoose.model('MyOccasion', MyOccasionSchema);

module.exports = MyOccasion;