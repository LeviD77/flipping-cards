module.exports = (app) => {
    const scores = require('../controllers/score.controller.js');

    // Create a new Score record
    app.post('/score', scores.create);

    // Retrieve all Scores
    app.get('/score', scores.findAll);
}