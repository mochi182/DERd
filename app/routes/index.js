const thingsRoutes = require('./thingsRoutes');
const indexController = require('../controllers/indexController.js');

exports.routes = function (app) {

    app.use('/', (req, res) => {
        indexController.readAll(req, res)
    });

    // Things
    app.use('/things', thingsRoutes)

};