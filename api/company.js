
module.exports = app => {

    const {isSetOrError} = app.api.validation

    const vinculateUserToCompany = async (userId, companyId, isAdmin) => {
        await app.db('usersCompany')
            .insert({ userId, companyId, isAdmin })
    }

    const create = async (req, res, next) => {
        const { userId, name, site } = req.body
        try {
            isSetOrError(userId, 'Informe o indentificador do usuário')
            isSetOrError(name, 'Informe o nome da empresa')
            isSetOrError(site, 'Informe o site da empresa')

            const company = await app.db('companies')
                .where({site})
                .first()
            
            if (company) throw 'Empresa já existe'
        } catch(msg) {
            return res.status(400).send(msg)
        }  

        try {
            const companyId = await app.db('companies')
                .insert({name, site})

            await vinculateUserToCompany(userId, companyId[0], true)
            res.status(201).send()
        } catch(err) {
            res.status(500).send(err)
        }
    }

    const update = async (req, res, next) => {
        const { id, name, site } = req.body
        try {
            isSetOrError(id, 'Informe o identificador da empresa')
            isSetOrError(name, 'Informe o nome da empresa')
            isSetOrError(site, 'Informe o site da empresa')
        } catch(msg) {
            res.status(200).send(msg)
        }  

        app.db('companies')
            .update({name, site})
            .where({ id })
            .then(_ => res.status(201).send())
            .catch(err => res.status(500).send())
    }

    const remove = async (req, res, next) => {
        const id = req.params.id
        try {
            isSetOrError(id, 'Informe o identificador da empresa')
        } catch(msg) {
            res.status(200).send(msg)
        }  

        app.db('companies')
            .delete({ id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send())
    }

    const get = async (req, res, next) => {
        app.db('companies')
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res, next) => {
        const id = req.params.id
        app.db('companies')
            .where({ id })
            .first()
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err))
    }

    return { create, update, remove, get, getById }
}