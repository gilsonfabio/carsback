exports.up = function(knex) {
    return knex.schema.createTable('motoristas', function(table) {
        table.increments('motId').primary();
        table.string('motNome').notNullable();
        table.string('motNascimento').notNullable();
        table.string('motCpf').notNullable();
        table.string('motHabilitacao').notNullable();
        table.string('motCelular').notNullable();
        table.string('motEmail').notNullable();
        table.string('motPassword').notNullable();
        table.string('motToken').notNullable();
        table.interger('motAvaliacao').notNullable();
        table.string('motStatus').notNullable();
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('motoristas');
};
