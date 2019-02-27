
exports.up = function(knex, Promise) {
    return knex.schema.createTable('usersCompany', table => {
        table.increments('id').primary()
        table.boolean('isAdmin').defaultTo(false)
        table.integer('userId').unsigned().references('id').inTable('users')
        table.integer('companyId').unsigned().references('id').inTable('companies')
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('usersCompany')
};
