const mongoose = require('mongoose');

const ScoreSchema = mongoose.Schema({
	steps: Number,
	seconds: Number,
	name: String,
	token: String,
	score: Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('Score', ScoreSchema);