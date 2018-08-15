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
		token: 'SC_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
		client_1: 'C1_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
		client_2: null,
		pictures: pictures,
		deckSize: deckSize,
	});

	// Save Game in the database
	game.save()
		.then(data => {
			
			// Success return for new Game created
			res.status(200).send({
				message: "You have successfully created a new Game!",
				game: game
			});
		}).catch(err => {
			
			res.status(500).send({
				message: err.message || "Some error occurred while creating the Game."
			});
		});
};

// Join to a game created by another player
exports.join = (req, res) => {

	// Find Game by id
	Game.findById(req.params.joinId)
		.then((game) => {

			if(!game)
			{
				return res.status(404).send({
					message: "Game not found with id " + req.params.joinId
				});
			}

			if(game.client_2 !== null)
			{
				return res.status(400).send({
							message: "Oops! Someone already joined to this game!"
						});
			}

			game.client_2 = 'C2_' + Math.random().toString(36).substr(2, 9).toUpperCase();

			// Save 2nd client
			game.save()
				.then(data => {
					
					// Successful join
					res.status(200).send({
						message: "You have successfully joined to the Game!",
						game: game
					});
				}).catch(err => {
					
					res.status(500).send({
						message: err.message || "Some error occurred while saving the Game."
					});
				});

		}).catch(err => {
			
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Game not found with id " + req.params.joinId
				});                
			}
			
			return res.status(500).send({
				message: "Error retrieving Game with id " + req.params.joinId
			});
		});
};

// On starting a turn, we need to log the current client
exports.startTurn = (req, res) => {

	// Validate form params
	if(req.params.clientType !== "client_1" && req.params.clientType !== "client_2")
	{
		return res.status(400).send({
					message: "Invalid client type parameter!"
				});
	}

	const findParams = {};
	findParams[req.params.clientType] = req.params.clientId;

	// Find Game by client_1 or client_2
	Game.findOne(findParams)
		.then((game) => {

			if(!game) {
				return res.status(404).send({
					message: "Game not found for client " + req.params.clientId
				});
			}

			// Change user to current turn
			game.currentClient = req.params.clientId;

			// Save 2nd client
			game.save()
				.then(data => {
					
					// User change
					res.status(200).send({
						message: "Next turn is for: " + req.params.clientId,
						message: game
					});
				}).catch(err => {
					
					res.status(500).send({
						message: err.message || "Some error occurred while saving the Game."
					});
				});

		}).catch(err => {
			
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Game not found for client " + req.params.clientId
				});                
			}
			
			return res.status(500).send({
				message: "Error retrieving Game for client " + req.params.clientId
			});
		});
};

// Refresh the game by the client application every sec
exports.refresh = (req, res) => {

	// Validate url params
	if(req.params.clientType !== "client_1" && req.params.clientType !== "client_2")
	{
		return res.status(400).send({
					message: "Invalid clientType parameter!"
				});
	}

	if(!req.params.clientId)
	{
		return res.status(400).send({
					message: "Invalid clientId parameter!"
				});
	}

	// Put params into json
	const findParams = {};
	findParams[req.params.clientType] = req.params.clientId;

	// Find Game by client_1 or client_2
	Game.findOne(findParams)
		.then((game) => {

			if(!game)
			{
				return res.status(404).send({
					message: "Game not found for client " + req.params.clientId
				});
			}

			// Calculate if user started more than 10 seconds ago
			var t1 = game.updatedAt;
			var t2 = new Date();
			var dif = t1.getTime() - t2.getTime();

			var Seconds_from_T1_to_T2 = dif / 1000;
			var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);

			var activeClient = game.currentClient;

			if(Seconds_Between_Dates > 9)
			{
				if(game.client_1 == game.currentClient)
				{
					activeClient = game.client_2;
				}
				else if(game.client_2 == game.currentClient)
				{
					activeClient = game.client_1;
				}
			}

			res.status(200).send({
				message: 'Current client is: ' + activeClient,
				game: game,
				activeClient: activeClient,
			});

		}).catch(err => {
			
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Game not found for client " + req.params.clientId
				});                
			}
			
			return res.status(500).send({
				message: "Error retrieving Game for client " + req.params.clientId
			});
		});
};