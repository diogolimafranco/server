module.exports = app => {
    app.route('/companies')
        .all(app.middlewares.passport.authenticate())
        .post(app.api.company.create)
        .get(app.api.company.get)

    app.route('/companies/:id')
        .all(app.middlewares.passport.authenticate())
        .put(app.api.company.update)
        .get(app.api.company.getById)
        .delete(app.api.company.remove)
    
}