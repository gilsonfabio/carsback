exports.up = function(knex) {
    return knex.schema.createTable('modelos', function(table) {
        table.increments('modId').primary();
        table.string('modDescricao').notNullable();
        table.interger('modMarId').notNullable();
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('modelos');
};