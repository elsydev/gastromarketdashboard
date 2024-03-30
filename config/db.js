import mongoose from 'mongoose';

const conectarDB=async ()=>{
    console.log(process.env.MONGO_URI);
     try {
        const connection=await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        });
        const url=`${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    } 
}
export default conectarDB;