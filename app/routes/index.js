const thingsRoutes = require('./thingsRoutes');

exports.routes = function (app) {

    // Things
    app.use('/things', thingsRoutes)

};