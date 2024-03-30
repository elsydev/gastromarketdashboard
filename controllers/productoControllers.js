import Restaurant from '../models/Restaurant.js';
import Usuario from '../models/Usuario.js';
import Producto from '../models/Producto.js';
import Categoria from '../models/Categoria.js';

const agregarProducto =async(req,res)=>{
    const {restaurantId}=req.params;
    const {categoria,nombre}=req.body;
    console.log(categoria)
    console.log(nombre)
    console.log(req.body)
    const existeProdcuto =await Producto.findOne({nombre});
    if (restaurantId.length !== 24 ) {
        const error = new Error('ID inválido');
        return res.status(400).json({ msg: error.message });
      }
    const existeRestaurant =await Restaurant.findById(restaurantId);
    if(!existeRestaurant){
        const error=new Error('Restaurante No Encontrado');
        return res.status(404).json({msg:error.message});
    }
    const existeCategoria =await Categoria.findById(categoria);
    if(!existeCategoria){
        const error=new Error('Categoría No Encontrada');
        return res.status(404).json({msg:error.message});
    }
 
    if(existeRestaurant.administrador.toString()!==req.usuario._id.toString()){
        const error=new Error('Acceso denegado');
        return res.status(403).json({msg:error.message});

    }
       if(existeProdcuto){
        const error =new Error('ya existe un producto con ese nombre');
        return res.status(409 ).json({msg:error.message});
    }
    try {
       const productoAlmacenado= await new Producto(req.body);
       productoAlmacenado.restaurante = existeRestaurant._id;
       productoAlmacenado.categoria = existeCategoria._id;
       existeCategoria.productos.push(productoAlmacenado._id); 
       existeRestaurant.productos.push(productoAlmacenado._id);

       
       await Promise.allSettled([await existeRestaurant.save(),await existeCategoria.save(),await productoAlmacenado.save()]);
       res.json(productoAlmacenado)
     
      
    } catch (error) {
        console.log(error)
    }
    
}
const obtenerProductos =async(req,res)=>{
    const {restaurantId}=req.params;
    console.log(restaurantId)
    if (restaurantId.length !== 24) {
        const error = new Error('ID inválido');
        return res.status(400).json({ msg: error.message });
      }
      const existeRestaurant =await Restaurant.findById(restaurantId);
    if(!existeRestaurant){
        const error=new Error('Restaurante No Encontrado');
        return res.status(404).json({msg:error.message});
    }

    //const productos = await Producto.find().populate('restaurante');
    const productos = await Producto.find().where("restaurante").equals(restaurantId);
    res.json(productos);
  
}
const obtenerProducto=async (req,res)=>{
    const {productoId}=req.params;

    const producto=await Producto.findById(productoId).populate("restaurante");
    if(!producto){
        const error=new Error('Producto No Encontrado');
        return res.status(404).json({msg:error.message});
    }
    if(producto.restaurante.administrador.toString() !== req.usuario._id.toString()){
        const error =new Error("Acción no válida")
        return res.status(401).json({msg:error.message})

    }
    res.json(producto)
}
const actualizarProducto =async(req,res)=>{

    const {productoId}=req.params;
    const producto = await Producto.findById(productoId);
    if (!producto){
        const error=new Error('Producto No Encontrado');
        return res.status(404).json({msg:error.message});
    }
/*     if(producto.restaurante.administrador.toString() !== req.usuario._id.toString()){
        const error =new Error("Acción no válida")
        return res.status(401).json({msg:error.message})
    } */
/*     if(!req.body.nombre || !req.body.precio ||!req.body.imagen){
        const error =new Error("Todos los campos son obligatorios")
        return res.status(400).json({msg:error.message})
    } */

/*     producto.nombre=req.body.nombre || producto.nombre;
    producto.precio=req.body.precio || producto.precio;
    producto.imagen=req.body.imagen || producto.imagen; */
    
/*      try {
        const productoActualizado = await producto.findByIdAndUpdate(req.params.productoId, req.body, { new: true });;
     } catch (error) {
        console.log(error)
     } */


   //Este codigo dejas las validaciones del lado del cliente
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.productoId, req.body, { new: true });   
  const { categoria, restaurante } = req.body;
  await productoActualizado.populate({ path: 'categoria', select: '_id' });
  await productoActualizado.populate({ path: 'restaurante', select: '_id' });
  if (categoria) {
	const newCategoria = await Categoria.findById(categoria);
	newCategoria.productos.push(productoActualizado._id);
	await newCategoria.save();
	await Producto.findByIdAndUpdate(productoActualizado._id, { categoria });
  }
  if (restaurante) {
	const newRestaurant = await Restaurant.findById(restaurante);
	newRestaurant.productos.push(productoActualizado._id);
	await newRestaurant.save();
	await Producto.findByIdAndUpdate(productoActualizado._id, { restaurante });
  }
  res.json(productoActualizado);

}
const eliminarProducto =async(req,res)=>{
    const {productoId}=req.params;
    const producto = await Producto.findById(productoId).populate('restaurante').populate('categoria');
   console.log(producto)
   
    //const {restaurante,categoria}=await Producto.findById(productoId);
    if(!producto){
        const error=new Error('Producto No Encontrado');
        return res.status(404).json({msg:error.message});
    }

    if(producto.restaurante.administrador.toString() !== req.usuario._id.toString()){
        const error =new Error("Acción no válida")
        return res.status(401).json({msg:error.message})
    }
    
    try {
        const restaurante= await Restaurant.findById(producto.restaurante);
        if (restaurante) {
            await Restaurant.findByIdAndUpdate(restaurante, { $pull: { productos: productoId } });
          }
          const categoria= await Categoria.findById(producto.categoria);
          if (categoria) {
            await Categoria.findByIdAndUpdate(categoria, { $pull: { productos: productoId } });
          }
          await Promise.allSettled([await restaurante.save, await categoria.save(),await producto.deleteOne()]);
          res.json({msg:"El producto se elminó correctamente"})
    } catch (error) {
        console.log(error)
    }
}

export{
    agregarProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}