module.exports = (app) => {
    const games = require('../controllers/game.controller.js');

    // Create a new game with a specific deck size
    app.get('/game/:size', games.create);
}