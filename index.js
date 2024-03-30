import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import restaurantRoutes from "./routes/restaurantRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";

const app=express();
app.use(express.json());
app.use('/api/usuarios',usuarioRoutes);
app.use('/api/restaurantes',restaurantRoutes);
app.use('/api/categorias',categoriaRoutes);
app.use('/api/productos',productoRoutes);

dotenv.config();
conectarDB();


const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO,()=>{console.log(`Server is running on port ${PUERTO}`)});