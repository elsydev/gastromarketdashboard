import Restaurant from '../models/Restaurant.js';
import Usuario from '../models/Usuario.js';
import Producto from '../models/Producto.js';
const obtenerRestaurantes = async(req,res)=>{
    const {administrador}= req.usuario._id;
    const restaurantes =await Restaurant.find().where("administrador").equals(req.usuario)
    if (!restaurantes){
        const error = new Error("Restaurante no encontrado");
        return res.status(401).json({msg:error.message});
    }
    
        res.json(restaurantes)

    

}

const nuevoRestaurante=async (req,res)=>{
   const restaurant =new Restaurant(req.body);
   restaurant.administrador=req.usuario._id;//asignar el id del usuario que viene en la peticion  al restaurante creado 

    try {
        const restaurantAlmacenado=await restaurant.save();
        res.json(restaurantAlmacenado);
    } catch (error) {
        console.log(error)
        
    }
}

const obtenerRestaurante =async (req,res)=>{
    const {id}=req.params;
    if (id.length !== 24) {
        const error = new Error('ID inválido');
        return res.status(400).json({ msg: error.message });
      }
    const restaurante= await Restaurant.findById(id);
    if (!restaurante){
        const error = new Error('Restaurante no encontrado');
        return res.status(404).json({ msg: error.message });
    }
    if(restaurante.administrador.toString()!==req.usuario._id.toString()){
        const error = new Error('Acceso denegado');
        return res.status(403).json({ msg: error.message });
    }
    res.json(restaurante)
    }


const editarRestaurante =async (req,res)=>{
    const {id}=req.params;
    if (id.length !== 24) {
        const error = new Error('ID inválido');
        return res.status(400).json({ msg: error.message });
      } 
      const restaurante= await Restaurant.findById(id);
    if (!restaurante){
        const error = new Error('Restaurante no encontrado');
        return res.status(404).json({ msg: error.message });
    }
    if(restaurante.administrador.toString()!==req.usuario._id.toString()){
        const error = new Error('Acceso denegado');
        return res.status(403).json({ msg: error.message });
    }
    restaurante.nombre=req.body.nombre || restaurante.nombre;
    restaurante.direccion=req.body.direccion || restaurante.direccion;
    restaurante.descripcion=req.body.descripcion || restaurante.descripcion;
    restaurante.fechaAgregado=req.body.fechaAgregado || restaurante.fechaAgregado;
    restaurante.tipo=req.body.tipo || restaurante.tipo;
    restaurante.imagen=req.body.imagen || restaurante.imagen;

    try {
       const restauranteAlmacenado = await restaurante.save() 
       res.json(restauranteAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const eliminarRestaurante =async (req,res)=>{
    const {id}=req.params;
    if (id.length !== 24) {
        const error = new Error('ID inválido');
        return res.status(400).json({ msg: error.message });
      }
    const restaurante= await Restaurant.findById(id);
    if (!restaurante){
        const error = new Error('Restaurante no encontrado');
        return res.status(404).json({ msg: error.message });
    }
    if(restaurante.administrador.toString()!==req.usuario._id.toString()){
        const error = new Error('Acceso denegado');
        return res.status(403).json({ msg: error.message });
    }
    try {
        await restaurante.deleteOne({id});
        res.json({msg:"Se elimino el restaurante correctamente"})
    } catch (error) {
        console.log(error)
    }
}
const agregarColaborador= async (req,res)=>{
    const{id}=req.params;
    if (id.length !== 24) {
        const error = new Error('ID inválido');
        return res.status(400).json({ msg: error.message });
      }
    const restaurante= await Restaurant.findById(id);

    if(!restaurante){
        const error=new Error("Restaurante no existe");
        return res.status(404).json({msg:error.message});

    }
    if(restaurante.administrador.toString()!==req.usuario._id.toString()){
        const error=new Error("Acción no válida");
        return res.status(403).json({msg:error.message});
    }
    const {email}=req.body
    const usuario=await Usuario.findOne({email});
    if(!usuario){
        const error=new Error("El usuario no existe");
        return res.status(404).json({msg:error.message});

    }
    if(restaurante.administrador.toString()===usuario._id.toString()){
        const error =new Error("El administrador del restaurante no puede ser colaborador");
        return res.status(403).json({ msg: error.message });
    }
    if(restaurante.colaboradores.includes(usuario._id)){
        const error =new Error("El usuario ya es colaborador del restaurante");
        return res.status(403).json({ msg: error.message });

    }
    try {
        restaurante.colaboradores.push(usuario._id);
        await restaurante.save();
        res.json(restaurante);
    } catch (error) {
        console.log(error)
    }


}

const obtenerColaboradores =async(req,res)=>{
    const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(usuario);

}
const eliminarColaborador= async(req,res)=>{
    const restaurante =await Restaurant.findById(req.params.id);
    if(!restaurante){
        const error=new Error('Restaurante No Encontrado');
        return res.status(404).json({msg:error.message});

    }
    if(restaurante.administrador.toString()!==req.usuario._id.toString()){
        const error=new Error('Acceso denegado');
        return res.status(403).json({msg:error.message});
    }
    restaurante.colaboradores.pull(req.body.id);
    await restaurante.save();
    res.json({msg:"Se elimino el colaborador correctamente"})
}

 export{
     obtenerRestaurantes,
     nuevoRestaurante,
     obtenerRestaurante,
     editarRestaurante,
     eliminarRestaurante,
     agregarColaborador,
     obtenerColaboradores,
     eliminarColaborador,
 }