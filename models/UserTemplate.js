const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signUpTemplate = new Schema({
    NickName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ''
    },
    avatar: {
        type: String
    },
    Resources: {
        Gold: {
            type: Number,
            default: 750
        },
        Marble: {
            type: Number,
            default: 750
        },
        Solfour: {
            type: Number,
            default: 750,
        },
        Food: {
            type: Number,
            default: 750
        },
        Vault: {
            Gold: {
                type: Number,
                default: 0
            },
            Marble: {
                type: Number,
                default: 0
            },
            Solfour: {
                type: Number,
                default: 0
            },
            Vault: {
                type: Number,
                default: 0
            }
        }
    },
    Power: {
        Soldiers: {
            Ammount: {
                type: Number,
                default: 20
            },
            Available: {
                type: Number,
                default: 0
            },
            Level: {
                type: Number,
                default: 1
            }
        },
        Items: [
            {item: {
                type: String
            }}
        ]
    },
    Workers: {
        Available: {
            type: Number,
            default: 20
        },
        Mine: {
            type: Number,
            default: 5,
        },
        Quary: {
            type: Number,
            default: 5,
        },
        Farm: {
            type: Number,
            default: 5,
        },
        Mountains: {
            type: Number,
            default: 5,
        },
        Efficiency: {
            Mine: {
                type: Number,
                default: 1
            },
            Quary: {
                type: Number,
                default: 1
            },
            Mountains: {
                type: Number,
                default: 1
            },
            Farm: {
                type: Number,
                default: 1
            }
        }
    }
}, {versionKey: false});
const User = mongoose.model('User', signUpTemplate);
module.exports = User;