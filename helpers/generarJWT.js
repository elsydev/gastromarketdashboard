import jwt from 'jsonwebtoken';
const generarJWT=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'}); //Este es un metodo que nos permite generar un Json Web Token, toma como parametros un objeto y una clave o palabra secreta, y el tiempo en que expira este token
}
export default generarJWT