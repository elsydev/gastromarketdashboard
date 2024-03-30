import Categoria from "../models/Categoria.js";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";

const agregarCategoria=async (req,res)=>{

    const{nombre}= req.body;
/*     const superUsuario= await Usuario.findById(req.usuario._id);
    if(!superUsuario.super){
        const error =new Error("No tienes permisos para realizar esta operacion");
        return res.status(403).json({msg:error.message});

    } */
    
    const existeCategoria = await Categoria.findOne({nombre});
    if(existeCategoria){
        const error =new Error("ya existe esta categoria");
        res.status(409 ).json({msg:error.message});
    }
    
    try {
        const categoria= new Categoria(req.body);
        categoria.creador=req.usuario._id;
        const categoriaAlmacenada=await categoria.save();
        res.json(categoriaAlmacenada)
    } catch (error) {
        console.log(error)
    }
}

const obtenerCategoria=async(req,res)=>{
    const {categoriaId}=req.params;
    const categoria= await Categoria.findById(categoriaId);
    if(!categoria){
        const error =new Error("La categoria no existe");
        return res.status(404).json({msg:error.message});
    }
    res.json(categoria);
}

const obtenerCategorias=async (req,res)=>{
    const categorias= await Categoria.find();
    if (!categorias) {
        const error =new Error("No hay categorias");
        return res.status(404).json({msg:error.message});
    }
    res.json(categorias);
}

const obtenerrProductosPorCategorias =async (req,res)=>{
    res.json({msg:"obtener categorias"});
}
const actualizarCategoria= async (req,res)=>{
    const {categoriaId}=req.params;
    

    const existeCategoria=await Categoria.findById(categoriaId);
    if(!existeCategoria){
        const error =new Error("La categoria no existe");
        return res.status(404).json({msg:error.message});
    }
    existeCategoria.nombre=req.body.nombre || existeCategoria.nombre;
    
    
    try {
        const categoriaAlmacenada= await existeCategoria.save();
        res.json(categoriaAlmacenada);
    } catch (error) {
        console.log(error)
    }
    
}
const eliminarCategoria=async (req,res)=>{
    const {categoriaId}=req.params;
    const existeCategoria=await Categoria.findById(categoriaId);

    if(!existeCategoria){
        const error =new Error("La categoria a eliminar no existe");
        return res.status(404).json({msg:error.message});
    }
    try {
        const categoria= await Categoria.deleteOne(categoriaId);
        res.json({msg:"Se elimino la categoria correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const agregarProductoACategoria =async(req,res)=>{
    res.json({msg:"agregar producto a categoria"});
}

const eliminarProductoDeCategoria=async (req,res)=>{
    res.json({msg:"eliminar producto de categoria"});
}

export{
    agregarCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
    agregarProductoACategoria,
    eliminarProductoDeCategoria,
    obtenerrProductosPorCategorias
}
