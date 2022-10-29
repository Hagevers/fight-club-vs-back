const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkersModel = new Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ResourcesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resources',
        required: true
    },
    Workers: {
        type: Number,
        required: true
    },
    Mine: {
        type: Number,
        required: true
    },
    Farm: {
        type: Number,
        required: true
    },
    Quary: {
        type: Number,
        required: true
    },
    Mountains: {
        type: Number,
        required: true
    },
    Mine_Efficiency:{
        type: Number,
        required: true
    },
    Farm_Efficiency: {
        type: Number,
        required: true
    },
    Quary_Efficiency: {
        type: Number,
        required: true
    },
    Mountains_Efficiency: {
        type: Number,
        required: true
    }
}, {versionKey: false});
const Workers = mongoose.model('Workers', WorkersModel);
module.exports = Workers;