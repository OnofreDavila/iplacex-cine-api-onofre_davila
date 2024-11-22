import express from 'express';
import actorController from './actorController.js';
import peliculaController from '../pelicula/peliculaController.js';

const actorRoutes = express.Router()

actorRoutes.post('/actor/', actorController.handleInsertActorRequest)
actorRoutes.get('/actores', actorController.handleGetActoresRequest)
actorRoutes.get('/actor/:id', actorController.handleGetActorByIdRequest)
actorRoutes.get('/actor/pelicula/:idPelicula', actorController.handleGetActoresByPeliculaIdRequest)

export default actorRoutes;