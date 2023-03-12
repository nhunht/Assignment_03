const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    career: {
        type: String
    },
    position: {
        type: String,
        require: true
    },
    goals: {
        type: Number,
        require: true,
        default: 0
    },
    nationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nations",
        require: true
    },
    isCaptain: { type: Boolean, default: false }
}, {
    timestamps: true
});

var Players = mongoose.model('players', playerSchema);

module.exports = Players;
