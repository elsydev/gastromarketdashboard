import express from "express";

import checkAuth from "../middleware/checkAuth.js";
import {obtenerCategorias,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    obtenerCategoria,
    agregarProductoACategoria,
    eliminarProductoDeCategoria} from "../controllers/categoriaControllers.js";
const router=express.Router();

router.use(express.json());

router.post('/crear-categoria',checkAuth,agregarCategoria);
router.get('/',checkAuth,obtenerCategorias);

router.route('/:categoriaId').get(checkAuth,obtenerCategoria)
.put(checkAuth,actualizarCategoria)
.delete(checkAuth,eliminarCategoria);

//Agregamos un producto a una categoria
/* router.route('/:categoriaId/products/').post(checkAuth,agregarProductoACategoria).delete(checkAuth,eliminarProductoDeCategoria)
.delete(checkAuth,eliminarProductoDeCategoria); */
  
export default router;