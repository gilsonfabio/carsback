exports.up = function(knex) {
    return knex.schema.createTable('cores', function(table) {
        table.increments('corId').primary();
        table.string('corDescricao').notNullable();
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('cores');
};