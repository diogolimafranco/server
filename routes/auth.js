module.exports = app => {
    app.post('/sign-up', app.api.user.create)
    app.post('/sign-in', app.api.auth.signin)
    app.post('/forgot-password', app.api.auth.forgotPassword)
    app.post('/reset-password', app.api.auth.resetPassword)
    app.post('/validate-token', app.api.auth.validateToken)
}