exports.up = function(knex) {
    return knex.schema.createTable('viagens', function(table) {
        table.increments('viaId').primary();
        table.string('viaDatSol').notNullable();
        table.string('viaHorSol').notNullable();
        table.string('viaDatAce').notNullable();
        table.string('viaHorAce').notNullable();
        table.string('viaDatIni').notNullable();
        table.string('viaHorIni').notNullable();
        table.string('viaDatFin').notNullable();
        table.string('viaHorFin').notNullable();
        table.string('viaOriLat').notNullable();
        table.string('viaOriLon').notNullable();
        table.string('viaDesLat').notNullable();
        table.string('viaDesLon').notNullable();
        table.interger('viaDistancia').notNullable();
        table.interger('viaAvaliacao').notNullable();
        table.string('viaStatus').notNullable();
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('viagens');
};
 