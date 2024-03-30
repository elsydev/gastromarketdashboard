import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const usuarioSchema= mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        required:true,
        trim:true
    },
    direccion:{
        type: String,
        required:true,
        trim:true
    },
    userRole: {
        type: String,
        required: true,
        trim: true,
        default:'online'
    },
    token:{
        type: String,
    },
    confirmado:{
        type:Boolean,
        default:false
    },
    super:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

//encriptar password, aqui save es la funcion llamda en el controlador, cuando regresa a este archivo ejecuta esta funcion antes de ejecutar save
usuarioSchema.pre('save', async function(next){

    //esta condicion va a revisar que el password no haya sido cambiado, esto lo que dice es si no esta modificando el passwordpasa a la siguiente insrtruccion ,para eso es next()
    if(!this.isModified('password')){
        next();
    }
    const salt= await bcrypt.genSalt(10); //Esta linea genera el salt o las rondas de hasheo
    this.password= await bcrypt.hash(this.password, salt); //aqui this se refiere al objeto del usuario que viene de la solicitud post en el controlador
    
})
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
  };

const Usuario=mongoose.model('Usuario',usuarioSchema);
export default Usuario