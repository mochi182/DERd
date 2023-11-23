const thingsRoutes = require('./thingsRoutes');
const indexController = require('../controllers/indexController.js');

exports.routes = function (app) {

    app.get('/', (req, res) => {
        indexController.readAll(req, res)
    });

    // Upload
    app.post('/upload', (req, res) => {
        indexController.upload(req, res);
    });

    // Things
    app.use('/things', thingsRoutes)

};