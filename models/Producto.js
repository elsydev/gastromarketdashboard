import mongoose from "mongoose";
import Categoria from "./Categoria.js";
const productoSchema=new mongoose.Schema({
    nombre:{
        type:String,
        trim:true,
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    fechaAgregado:{
        type:Date,
        default:Date.now
    },

     imagen:{
        type:String,
        trim:true
        },
    restaurante:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant"
    },
    categoria:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Categoria"
    }

},{
    timestamps:true
})

productoSchema.pre('remove', async function (next) {
    // Remove the reference from the category before removing the product
    await Categoria.findOneAndUpdate({ _id: this.categoria }, { $pull: { productos: this._id } });
    next();
  });
  
const Producto=mongoose.model("Producto",productoSchema)

export default Producto