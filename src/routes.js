const express = require('express');
const routes = express.Router();

const UsersController = require('./controllers/UsersController');
const CarsController = require('./controllers/CarsController');
const CoresController = require('./controllers/CoresController');
const MarcasController = require('./controllers/MarcasController');
const ModelosController = require('./controllers/ModelosController');
const MotoristasController = require('./controllers/MotoristasController');
const ViagensController = require('./controllers/ViagensController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Motors 2.02!',
    });
});

routes.post('/signIn', UsersController.signIn);
routes.post('/newuser', UsersController.newuser);
routes.put('/atuToken', UsersController.atuToken);

routes.get('/cars', CarsController.index);
routes.post('/newcar', CarsController.create);

routes.get('/cores', CoresController.index);
routes.post('/newcor', CoresController.create);

routes.get('/marcas', MarcasController.index);
routes.post('/newmarca', MarcasController.create);

routes.get('/modelos', ModelosController.index);
routes.post('/newmodelo', ModelosController.create);

routes.get('/motoristas', MotoristasController.index);
routes.post('/newmotorista', MotoristasController.create);
routes.post('/motSignIn', MotoristasController.signIn);
routes.put('/atuMotToken', MotoristasController.atuToken);
routes.get('/searchDriver', MotoristasController.searchDriver);

routes.get('/viagens', ViagensController.index);
routes.post('/newtravel', ViagensController.create);

module.exports = routes;
