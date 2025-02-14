exports.up = function(knex) {
    return knex.schema.createTable('marcas', function(table) {
        table.increments('marId').primary();
        table.string('marDescricao').notNullable();
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('marcas');
};