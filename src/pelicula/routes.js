import express from 'express';
import peliculaController from './peliculaController.js';

const peliculaRoutes = express.Router()

peliculaRoutes.post('/pelicula', peliculaController.handleInsertPeliculaRequest)
peliculaRoutes.get('/peliculas', peliculaController.handleGetPeliculasRequest)
peliculaRoutes.get('/pelicula/:id', peliculaController.handleGetPeliculaRequest)
peliculaRoutes.put('/pelicula/:id', peliculaController.handleUpdatePeliculaRequest)
peliculaRoutes.delete('/pelicula/:id', peliculaController.handleDeletePeliculaRequest)
peliculaRoutes.post('/pelicula/search', peliculaController.handleSearchPeliculaRequest)

export default peliculaRoutes;