
exports.up = function(knex, Promise) {
    return knex.schema.createTable('forgotPasswords', table => {
        table.increments('id').primary()
        table.string('payload').notNull()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.integer('userId')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('forgotPasswords')
};
