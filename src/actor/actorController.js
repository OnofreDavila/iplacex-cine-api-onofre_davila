import { ObjectId } from "mongodb";
import client from '../common/db.js';
import { Actor } from "./actor.js";

//constante general que contiene la informacion de cual es la base de  datos y la coleccion con la que vamos a trabajar
const actorCollection = client.db('cine-db').collection('actores');
const peliculaCollection = client.db('cine-db').collection('peliculas');

//function insertar un actor en la coleccion actores
async function handleInsertActorRequest(req,res){
    let data = req.body;
    let actor = Actor;
    console.log(req);
    //let idPeli = req.params.idPelicula

    try{
        //let oidPeli = ObjectId.createFromHexString(idPeli)

        const pelicula = await peliculaCollection.findOne({nombre: data.idPelicula})

        if(!pelicula){
            return res.status(404).send('la pelicula no existe')
        }

        actor.idPelicula = data.idPelicula
        actor.nombre = data.nombre;
        actor.edad = data.edad;
        actor.estaRetirado = data.estaRetirdo;
        actor.premios = data.premios;

        await actorCollection.insertOne(actor)
        .then((data) => {
        if(data==null) return res.status(400).send('Error al guardar registro')
        return res.status(201).send(data)
        })
        .catch((e) => {return res.status(500).send({ error:e})})
    }
    catch(e){
        return res.status(400).send('Id mal formado')
    }  
}

//funcion para obtener todos los registros de la coleccion
async function handleGetActoresRequest(req,res){
    await actorCollection.find({}).toArray()
    .then((data) => {return res.status(200).send(data)})
    .catch((e) => { return res.status(500).send({error: e})})
}

//funcion para obtener una pelicula en base a su ID
async function handleGetActorByIdRequest(req, res){
    // ha que obtener el filtro de busqueda "id" mediante los parametros de la URL 
    //se obtiene el id como un string
    let id = req.params.id;

    //utilizamos try catch para atrapar las excesiones en caso de que venga mal formado o equis motivo
    //para poder hacer una busqueda mediante el id, debemos transformar el string "id" a un objetID
    try{
        //oid: object id
        let oid = ObjectId.createFromHexString(id)

        //pasamos el oid a la coleccion como objeto es decir con las {}
        await actorCollection.findOne({ _id : oid })
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

//funcion desde controlador de actor 
//para obtener todos los actores de una película en base al _id de la película

async function handleGetActoresByPeliculaIdRequest(req,res){
    //obtendo el _id (id de pelicula desde el URL)
    let id = req.params.idPelicula;
    

    //inicio un try catch para capturar el dato y comprobar si existe un error al introducir ID
    try{
        // transformo el string del _id del URL a ObjetcId
        let oid = ObjectId.createFromHexString(id);

        //filtro por todas las peliculas con el id del req
        let pelicula =  await peliculaCollection.findOne({_id: oid});
        
        //verificacion de si existe la pelicula
        if(!pelicula){
            return res.status(404).send("Pelicula no encontrada");
        }

        //aplico la promesa con find y traer con el get los actores que tengan
        //el nombre de la pelicula en el idPelicula desde el controlador de la clase actor.
        let actores = await actorCollection.find({idPelicula:pelicula.nombre}).toArray();
        return res.status(200).send(actores);
        //.catch((e) => { return res.status(500).send({error: e})})
    }catch(e){

        if(e instanceof TypeError){
            return res.status(400).send('Id mal formado');
        }
        return res.status(500).send({error:e.mensaje});
    }
}
//exportamos todas las funciones
export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
}