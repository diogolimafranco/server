module.exports = middleware => {
    return (req, res, next) => {
        console.log(req.user)
        if(req.user.admin) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é administrador')
        }
    }
}