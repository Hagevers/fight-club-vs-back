const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourcesTemple = new Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Gold: {
        type: String,
        required: true
    },
    Solfour: {
        type: String,
        required: true
    },
    Marble: {
        type: String,
        required: true
    },
    Food: {
        type: String,
        required: true
    }
}, {versionKey: false});
const Resources = mongoose.model('Resources', ResourcesTemple);
module.exports = Resources;