const app = require('express')()
const consign = require('consign')
require('dotenv').config()

const kenexConfig = require('./knexfile.js')
const knex = require('knex')(kenexConfig.development)
app.db = knex

consign()
    .include('./middlewares/passport.js')
    .then('./middlewares/bodyparser-cors.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./routes')
    .into(app)

app.listen(3000, () => {
    console.log('Backend executando')
})