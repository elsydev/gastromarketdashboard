import mongoose from "mongoose";
import Producto from "./Producto.js";
const restaurantSchema =mongoose.Schema(
    {
        nombre:{
            type:String,
            trim:true,
            required:true
        },        
        direccion:{
            type:String,
            trim:true,
            required:true
        },
        descripcion:{
            type:String,
            trim:true,
            required:true
        },
        fechaAgregado:{
            type:Date,
            default:Date.now,
            required:true
        },

        imagen:{
            type:String,
            trim:true
        },
        administrador:{
            type:mongoose.Schema.Types.ObjectId,  //Crea un campo de referencia a
            ref:"Usuario"
        },
        colaboradores: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Usuario",
            },
          ],
          productos:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Producto"
            }
          ]
    },{
        timestamps:true,
    }
);
restaurantSchema.pre('remove', async function (next) {
    // Remove all products associated with the restaurant before removing it
    await Producto.deleteMany({ restaurant: this._id });
    next();
  });
  

const Restaurant =mongoose.model("Restaurant",restaurantSchema);
export default Restaurant