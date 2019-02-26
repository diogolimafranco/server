module.exports = app => {
    app.post('/sign-up', app.api.user.create)
    app.post('/sign-in', app.api.auth.signin)
    app.post('/forgot-password', app.api.auth.forgotPassword)
    app.post('/reset-password', app.api.auth.resetPassword)
    app.post('/validate-token', app.api.auth.validateToken)

    app.route('/users')
        .all(app.middlewares.passport.authenticate())
        .post(app.api.user.create)
        .get(app.api.user.get)

    app.route('/users/:id')
        .all(app.middlewares.passport.authenticate())
        .put(app.api.user.update)
        .get(app.api.user.getById)
        .delete(app.api.user.remove)
    
}