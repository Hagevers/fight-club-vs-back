const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportModel = new Schema({
    Attacker: {
        type: String,
        required: true
    },
    Defender: {
        type: String,
        required: true
    },
    Defender_Id: {
        type: mongoose.Schema.Types.ObjectId,
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