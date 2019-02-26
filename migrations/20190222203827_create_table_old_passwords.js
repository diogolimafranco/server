
exports.up = function(knex, Promise) {
    return knex.schema.createTable('oldPasswords', table => {
        table.increments('id').primary()
        table.string('oldPassword').notNull()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.integer('userId').notNull()
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('oldPasswords')
};
