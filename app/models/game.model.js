const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
	token: String,
	deckSize: Number,
	client_1: String,
	client_2: String,
	currentClient: String,
	pictures: [{
		type: String
	}],
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', GameSchema);