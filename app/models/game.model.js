const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
	pictures: [{
		type: String
	}],
	token: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', GameSchema);