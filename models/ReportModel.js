const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportModel = new Schema({
    Attacker: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Defender: {
        type: String,
        required: true
    },
    HaveWon: {
        type: Boolean,
        required: true
    },
    Gold: {
        type: Number
    },
    Marble: {
        type: Number
    },
    Solfour: {
        type: Number
    },
    Food: {
        type: Number
    },
    SoldiersDied: {
        type: Number
    },
    Alliance: {
        type: String
    }

}, {versionKey: false});
const Resources = mongoose.model('Reports', ReportModel);
module.exports = Resources;