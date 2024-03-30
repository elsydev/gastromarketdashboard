import mongoose from "mongoose";
import Producto from "./Producto.js";
const categoriaSchema= new mongoose.Schema({
    nombre:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        unique:true
    },
    
    fechaAgregado:{
        type:Date,
        default:Date.now
    },
    creador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    },
    productos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Producto"
    }]
},{
    timestamps:true
})

categoriaSchema.pre('remove', async function (next) {
    // Remove all products associated with the category before removing it
    await Producto.deleteMany({ categoria: this._id });
    next();
  });
  
const Categoria=mongoose.model("Categoria",categoriaSchema)

export default Categoria