
exports.up = function(knex, Promise) {
    return knex.schema.createTable('companies', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('site').notNull().unique()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('companies')
};
