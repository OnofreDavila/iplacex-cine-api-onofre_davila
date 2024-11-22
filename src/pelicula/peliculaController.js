import { ObjectId } from "mongodb";
import client from '../common/db.js';
import { Pelicula } from "./pelicula.js";

//constante general que contiene la informacion de cual es la base de  datos y la coleccion con la que vamos a trabajar
const peliculaCollection = client.db('cine-db').collection('peliculas');

//function insertar una pelicula en la coleccion peliculas
async function handleInsertPeliculaRequest(req,res){
    let data = req.body;
    let pelicula = Pelicula;

    pelicula.nombre = data.nombre;
    pelicula.generos = data.generos;
    pelicula.anioEstreno = data.anioEstreno;

    await peliculaCollection.insertOne(pelicula)
    .then((data) => {
        if(data==null) return res.status(400).send('Error al guardar registro')
        return res.status(201).send(data)
    })
    .catch((e) => {return res.status(500).send({ error:e})})
}

//funcion para obtener todos los registros de la coleccion
async function handleGetPeliculasRequest(req,res){
    await peliculaCollection.find({}).toArray()
    .then((data) => {return res.status(200).send(data)})
    .catch((e) => { return res.status(500).send({error: e})})
}

//funcion para obtener una pelicula en base a su ID
async function handleGetPeliculaRequest(req, res){
    // ha que obtener el filtro de busqueda "id" mediante los parametros de la URL 
    //se obtiene el id como un string
    let id = req.params.id;

    //utilizamos try catch para atrapar las excesiones en caso de que venga mal formado o equis motivo
    //para poder hacer una busqueda mediante el id, debemos transformar el string "id" a un objetID
    try{
        //oid: object id
        let oid = ObjectId.createFromHexString(id)

        //pasamos el oid a la coleccion como objeto es decir con las {}
        await peliculaCollection.findOne({ _id : oid })
        .then((data) => {
            if(data ==null)return res.status(404).send(data)
            return res.status(200).send(data)
        })
        .catch((e) => {
            return res.status(500).send({ error: e.code })
        })
    }catch(e) {
        return res.status(400).send('Id mal formado')
    }
}

//funcion para actualizar un registro en base a su ID
async function handleUpdatePeliculaRequest(req,res){
    let id = req.params.id
    let pelicula = req.body

    try{
        let oid = ObjectId.createFromHexString(id)

        let query = { $set:  pelicula }

        await peliculaCollection.updateOne({ _id: oid}, query)
        .then((data) => { return res.status(200).send(data)})
        .cath((e) => {return res.status(500).send({code: e.code})})
    }
    catch(e){
        return res.status(400).send('Id mal formado')
    }
}

//funcion para eliminar un registro en la colecion
async function handleDeletePeliculaRequest(req,res){
    let id = req.params.id
    try{
        let oid = ObjectId.createFromHexString(id)
        await peliculaCollection.deleteOne({ _id: oid })
        .then((data) => { return res.status(200).send(data)})
        .catch((e) => { return res.status(500).send({code: e.code}) })
    } catch(e){
        return res.status(400).send('Id mal formado')
    }
}

//funcion para busqueda avanzada
async function handleSearchPeliculaRequest(req,res){
    let query = req.body

    await peliculaCollectionfind(query).toArray()
    .then((data) => { return res.status(200).send(data) })
    .catch( (e) => { return res.status(500).send({ code: e.code }) })
}

//exportamos todas las funciones
export default {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaRequest,
    handleUpdatePeliculaRequest,
    handleDeletePeliculaRequest,
    handleSearchPeliculaRequest
}