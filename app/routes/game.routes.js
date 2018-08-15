module.exports = (app) => {
    const games = require('../controllers/game.controller.js');

    // Create a new game with a specific deck size
    app.get('/game/:size', games.create);

    // Join to a created Game
    app.get('/game/join/:joinId', games.join);

    // Pass turn info
    app.get('/game/turn/:clientType/:clientId', games.startTurn);

    // Check Game state
    app.get('/game/refresh/:clientType/:clientId', games.refresh);
}