exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('usrId').primary();
        table.string('usrNome').notNullable();
        table.string('usrEmail').notNullable();
        table.string('usrCpf').notNullable();
        table.string('usrCelular').notNullable();
        table.string('usrNascimento').notNullable();
        table.string('usrPassword').notNullable();
        table.string('usrToken').notNullable();
        table.string('usrStatus').notNullable();      
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};