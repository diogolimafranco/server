const isAdmin = require('../middlewares/admin')

module.exports = app => {
    app.route('/users')
        .all(app.middlewares.passport.authenticate())
        .post(app.api.user.create)
        .get(isAdmin(app.api.user.get))

    app.route('/users/:id')
        .all(app.middlewares.passport.authenticate())
        .put(app.api.user.update)
        .get(app.api.user.getById)
        .delete(app.api.user.remove)

    app.route('/users/:id/company')
        .get(app.api.user.getCompaniesFromUser)
}