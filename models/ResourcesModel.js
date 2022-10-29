const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourcesTemple = new Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Available_Workers:{
        type: Number,
        required: true
    },
    Gold: {
        type: Number,
        required: true
    },
    Solfour: {
        type: Number,
        required: true
    },
    Marble: {
        type: Number,
        required: true
    },
    Food: {
        type: Number,
        required: true
    },
    Vault_Gold: {
        type: Number,
        required: true
    },
    Vault_Solfour: {
        type: Number,
        required: true
    },
    Vault_Marble: {
        type: Number,
        required: true
    },
    Vault_Food: {
        type: Number,
        required: true
    }
}, {versionKey: false});
const Resources = mongoose.model('Resources', ResourcesTemple);
module.exports = Resources;