import {BSONType, ObjectId} from 'mongodb';

export const Actor = {
    _id : ObjectId,
    idPelicula : BSONType.string, //nombre de la pelicula
    nombre : BSONType.string,
    edad : BSONType.number,
    estaRetirado : BSONType.bool,
    premios : BSONType.array
}