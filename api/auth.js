const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const dotenv = require('dotenv');
const emailService = require('../services/email-service')
const emailTemplate = require('../templates/email-templates')
dotenv.load();

module.exports = app => {
    const {isSetOrError, isNotsetOrError, isEqualsOrError} = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const signin = async (req, res, next) => {
        const userToAuth = {...req.body}
        try {
            isSetOrError(userToAuth.email, 'Informe o e-mail de acesso')
            isSetOrError(userToAuth.password, 'Informe a senha de acesso')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        try {
            const user = await app.db('users')
                .where({ email: userToAuth.email })
                .first()

            if (!user) return res.status(400).send('Usuário não encontrado!')

            const isMatch = bcrypt.compareSync(userToAuth.password, user.password)
            if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

            const now = Math.floor(Date.now() / 1000)

            delete user.password
            delete user.createdAt
            const payload = {
                ...user,
                iat: now,
                exp: now + parseInt(process.env.EXPIRE_AUTH_TOKEN)
            }

            res.status(200).send({
                ...payload,
                token: jwt.sign(payload, process.env.AUTH_SECRET)
            })

        } catch (err) {
            res.status(500).send(err)
        }
    }

    const validateToken = async (req, res, next) => {
        const userData = req.body || null

        try {
            if (userData) {
                const token = jwt.decode(userData.token, process.env.AUTH_SECRET)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.status(200).send(true)
                }
            }
        } catch (err) {
            res.status(400).send(false)
        }
    }

    const forgotPassword = async (req, res, next) => {
        const emailUser = req.body.email
        try {
            isSetOrError(emailUser, 'Informe o e-mail de acesso')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        try {
            const user = await app.db('users')
                .where({ email: emailUser })
                .first()

            if (!user) return res.status(400).send('Usuário não encontrado!')

            const now = Math.floor(Date.now() / 1000)

            delete user.password
            delete user.createdAt
            const payload = {
                ...user,
                iat: now,
                exp: now + parseInt(process.env.EXPIRE_FORGOT_PASSWORD_TOKEN)
            }

            const jwtToken = jwt.sign(payload, process.env.AUTH_SECRET)

            let template = await emailTemplate.rememberPassword()
            template = template
                .replace('[name]', payload.name)
                .replace('[token]', jwtToken)
            
            emailService.send({
                to: emailUser,
                subject: 'Recuperação de senha',
                html: template,
              })

            res.status(204).send()

        } catch (err) {
            res.status(500).send(err)
        }
    }

    const resetPassword = async (req, res, next) => {
        let userPayload = null

        try {
            isSetOrError(req.body.password, 'Informe sua nova senha de acesso')
            isSetOrError(req.body.confirmPassword, 'Confirme sua nova senha de acesso')
            isSetOrError(req.body.token, 'Informe o token para alteração de senha')
            isEqualsOrError(req.body.password, req.body.confirmPassword, 'Senhas não conferem')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        try {
            userPayload = await jwt.verify(req.body.token, process.env.AUTH_SECRET)
        } catch (err) {
            return res.status(400).send('Esta solicitação é inválida ou já expirou')
        }

        try {
            await app.db('users')
                .update({password: encryptPassword(req.body.password)})
                .where({id: userPayload.id})
            
            let template = await emailTemplate.alteredPassword()
            template = template
                .replace('[name]', userPayload.name)
            
            emailService.send({
                to: userPayload.email,
                subject: 'Sua senha foi alterada',
                html: template,
            })
            
            res.status(204).send()
        } catch (err) {
            res.status(500).send(err)
        }
    }

    return { signin, validateToken, forgotPassword, resetPassword }
}