import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarID.js'
import generarJWT from '../helpers/generarJWT.js'


const registrar=async (req,res)=>{
    const {email}=req.body;
    const existeUsuario =await Usuario.findOne({email})
    if(existeUsuario){
        res.status(404).json({msg:'El usuario ya existe'})
    }
    try {
        const usuario =new Usuario(req.body)
        usuario.token=generarId();
        const usuarioAlmacenado=await usuario.save();
        res.json(usuarioAlmacenado);
    } catch (error) {
        console.log(error)
    }
}
const autenticar=async (req,res)=>{

    const {email,password}=req.body; 
    
  

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      const error = new Error("El Usuario no existe");
      return res.status(404).json({ msg: error.message });
    }
  
    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
      const error = new Error("Tu Cuenta no ha sido confirmada");
      return res.status(403).json({ msg: error.message });
    }

    //Comprobar su password

    //Aqui vamos a trabajar con metodos en el modelo, al llamr un metodo aqui, la ejecucion se va  al modelo y busca ese metodo y lo ejecuta y luego trae aui la respuesta parara seguir con la ejecucion

/*     if(await usuario.comprobarPassword(password)){
        res.json({
            _id:usuario._id,
            nombre:usuario.nombre,
            email:usuario.email,
            token:generarId()
        });
    }else{
        const error=new Error('El password es incorrecto');
        return res.status(403).json({msg:error.message});
    } */

    if (await usuario.comprobarPassword(password)) {
/*         usuario.token=generarJWT(usuario._id);
        await usuario.save(); */
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
      } else {
        const error = new Error("El Password es Incorrecto");
        return res.status(403).json({ msg: error.message });
      }

   
    
    
}

const confirmar =async (req,res)=>{
    const token= req.params.token;
    const usuarioConfirmar=await Usuario.findOne({token});

    if (!usuarioConfirmar){
        const error=new Error('Token no valido');
        return res.status(403).json({msg:error.message});
    }try{
        usuarioConfirmar.confirmado=true;
        usuarioConfirmar.token='';
        await usuarioConfirmar.save();
        res.json({msg:'Usuario Confirmado Correctamente'})
    }catch(error){
        console.log(error)
    }
}
const olvidoPassword=async (req,res)=>{
    const {email}=req.body;
    const usuario=await Usuario.findOne({email});
    if(!usuario){
        const error=new Error('El usuario no existe');
        return res.status(404).json({msg:error.message});
    }
    try{
        usuario.token=generarId();
        await usuario.save();
        res.json({msg:'Hemos enviado un email con las instrucciones'})
    }catch(error){
        console.log(error)
    }
}
const comprobarToken=async(req,res)=>{
    const{token}=req.params;
    const tokenValido=Usuario.findOne({token});
    if(tokenValido){
        res.json({msg:'token valido y el usuario existe'});
    }else{
        const error=new Error('token no valido');
        return res.status(404).json({msg:error.message});
    }

}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    const usuario = await Usuario.findOne({ token });
  
    if (usuario) {
      usuario.password = password;
      usuario.token = "";
      try {
        await usuario.save();
        res.json({ msg: "Password Modificado Correctamente" });
      } catch (error) {
        console.log(error);
      }
    } else {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
  };
const perfil=async(req,res)=>{
    const {usuario}=req;
    res.json(usuario)
    
}

export{
    registrar,
    autenticar,
    confirmar,
    olvidoPassword,
    comprobarToken,
    nuevoPassword,
    perfil
}