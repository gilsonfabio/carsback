exports.up = function(knex) {
    return knex.schema.createTable('cars', function(table) {
        table.increments('carId').primary();
        table.interger('carMarId').notNullable();
        table.interger('carModId').notNullable();
        table.string('carCaracter').notNullable();
        table.string('carPlaca').notNullable();
        table.interger('carAno').notNullable();
        table.interger('carCorId').notNullable();
        table.interger('carKmAtual').notNullable();
        table.string('carStatus').notNullable();
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('cars');
};
