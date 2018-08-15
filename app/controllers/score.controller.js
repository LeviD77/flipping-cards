const Score = require('../models/score.model.js');
const Game = require('../models/game.model.js');

// Create a new score record
exports.create = (req, res) => {

	// Parse integers
	req.body.steps = parseInt(req.body.steps);
	req.body.seconds = parseInt(req.body.seconds);

	// Validate steps
	if(req.body.steps < 2)
	{
		return res.status(400).send({
			message: "Sorry, we don't believe that you could do it without any steps..."
		});
	}

	// Validate time
	if(req.body.seconds < 1)
	{
		return res.status(400).send({
			message: "We know you're quick, but not this quick!"
		});
	}

	// Validate request body
	if(!req.body.steps || !req.body.seconds || !req.body.name || !req.body.token)
	{
		return res.status(400).send({
			message: "The request is invalid, it must contain the steps, seconds, name and the token."
		});
	}

	// Get Game by token
	Game.findOne({ token: req.body.token })
		.then(game => {
			
			if(!game) {
				res.status(404).send({
					message: "Game not found!"
				});
			}
			else
			{
				// Validate if someone already submitted a score record for this game
				Score.findOne({ token: req.body.token })
						.then(score => {
							
							if(score)
							{
								res.status(400).send({
									message: "This is unfortunate, someone already submitted the score points for this game!"
								});
							}
							else
							{
								// Assemble Score entity
								const score = new Score({
									steps: 		req.body.steps,
									seconds: 	req.body.seconds,
									name: 		req.body.name,
									token: 		req.body.token,
									score: 		(req.body.steps * game.deckSize * 100) / req.body.seconds
								});

								// Save Score in the database
								score.save()
										.then(data => {

											// Get position ranking for score
											Score.find().sort({ score: -1 })
													.then(scores => {

														const position = scores.map(e => e.token).indexOf(req.body.token) + 1;

														// Success return for new Score record
														res.status(200).send({
															message: 'Successful Score save!',
															position: position
														});
													}).catch(err => {
														
														res.status(500).send({
															message: err.message || "Some error occurred while retrieving scores."
														});
													});
										}).catch(err => {
											
											res.status(500).send({
												message: err.message || "Some error occurred while creating the Score record."
											});
										});
							}

						}).catch(err => {
							
							res.status(500).send({
								message: err.message || "Some error occurred while retrieving this Score record."
							});
						});
			}

		}).catch(err => {
			
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving this game."
			});
		});
};

// Retrieve and return all scores from the database
exports.findAll = (req, res) => {
	
	Score.find().sort({ score: -1 })
			.then(scores => {

				res.send(scores);
			}).catch(err => {
				
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving scores."
				});
			});
};