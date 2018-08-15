const Game = require('../models/game.model.js');

// Create a new game with a specific deck size
exports.create = (req, res) => {

	var deckSize = parseInt(req.params.size);
	
	// Validate if size variable is a number
	if(!deckSize || deckSize < 3)
	{
		return res.status(400).send({
	                message: "You must specify a deck size (whole number, 4 or bigger)!"
	            });
	}

	// Validate if deckSize is even
	if(Math.abs(deckSize % 2) == 1)
	{
		return res.status(400).send({
	                message: "You must specify an even deck size!"
	            });
	}

	// Assemble images for the Game
	var pictures = [];

	for (var i = (deckSize / 2) - 1; i >= 0; i--)
	{
		pictures[i] = "https://picsum.photos/200/" + (300 + i).toString();
	}

	// Create a Game
    const game = new Game({
        token: 'SC_' + Math.random().toString(36).substr(2, 9),
        pictures: pictures,
        deckSize: deckSize,
    });

    // Save Game in the database
    game.save()
	    .then(data => {
	        // Success return for new Game created
			res.status(200).send({
                message: game
            });
	    }).catch(err => {
	        res.status(500).send({
	            message: err.message || "Some error occurred while creating the Game."
	        });
	    });
};