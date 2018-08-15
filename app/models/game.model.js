const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
	token: String,
	deckSize: Number,
	pictures: [{
		type: String
	}],
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', GameSchema);