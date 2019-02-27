const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const {isSetOrError, isNotsetOrError, isEqualsOrError} = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const create = async (req, res, next) => {
        const newUser = { ...req.body }

        try {
            isSetOrError(newUser.name, 'Nome não informado')
            isSetOrError(newUser.email, 'E-mail não informado')
            isSetOrError(newUser.password, 'Senha não informada')
            isSetOrError(newUser.confirmPassword, 'Confirmação de senha não informada')
            isEqualsOrError(newUser.password, newUser.confirmPassword, 'Senhas não conferem')

            const user = await app.db('users')
                .where({email: newUser.email}).first()
            isNotsetOrError(user, 'Usuário já cadastrado')
        } catch(msg) {
            return res.status(400).send(msg)
        }
        
        newUser.password = encryptPassword(newUser.password)
        delete newUser.confirmPassword

        app.db('users')
            .insert(newUser)
            .then(_=>res.status(201).send())
            .catch(err => res.status(500).send(err))
    }

    const update = async (req, res, next) => {
        const user = { ...req.body }
        user.id = req.params.id
        try {
            isSetOrError(user.id, 'Identificador do usuário não informado')
            isSetOrError(user.name, 'Nome não informado')
            isSetOrError(user.email, 'E-mail não informado')
            isSetOrError(user.password, 'Senha não informada')
            isSetOrError(user.confirmPassword, 'Confirmação de senha não informada')
            isEqualsOrError(user.password, user.confirmPassword, 'Senhas não conferem')
        } catch(msg) {
            return res.status(400).send(msg)
        }
        
        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        try {
            const data = await app.db('users')
                .select('password')
                .where({ id: user.id})
                .first()

            await app.db('users')
                .update(user)
                .where({ id: user.id })

            if (data.password) {
                await app.db('oldPasswords')
                    .insert({
                        oldPassword: data.password,
                        userId: user.id
                    })
            }
            
        } catch (err) {
            res.status(500).send(err)
        }

        res.status(201).send()
    }

    const remove = async (req, res, next) => {
        const id = req.params.id

        try {
            isSetOrError(id, 'Identificador do usuário não informado')
        } catch (msg) {
            res.status(400).send(msg)
        }

        app.db('users')
            .delete({ id })
            .then(_ => {
                res.status(204).send()
            })
            .catch(err => {
                res.status(500).send(err)
            })
    }

    const get = async (req, res, next) => {
        let users = await app.db('users')
            .select('id', 'name', 'email', 'createdAt')
        res.status(200).send(users)
    }

    const getById = async (req, res, next) => {
        const id = req.params.id

        try {
            isSetOrError(id, 'Parametro indentificador não informado')
        } catch (msg) {
            res.status(400).send(msg)
        }

        app.db('users')
            .select('id', 'name', 'email', 'createdAt')
            .where({ id })
            .first()
            .then(users => {
                res.status(200).send(res.json(users))
            })
            .catch(err => {
                res.status(500).send(err)
            })
        
    }

    const getCompaniesFromUser = async (req, res, next) => {
        const userId = req.params.id
        try {
            app.db('users')
                .select('companies.id', 'companies.name', 'companies.site')
                .innerJoin('usersCompany', 'users.id', 'usersCompany.userId')
                .innerJoin('companies', 'companies.id', 'usersCompany.companyId')
                .where('users.id', '=', userId)
                .then(data => res.status(200).send(data))
                .catch(err => res.status(500).send(data))
        } catch (err) {
            return res.status(500).send(err)
        }
        
    }

    return { create, update, remove, get, getById, getCompaniesFromUser }
}