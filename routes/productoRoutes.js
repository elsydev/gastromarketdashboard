import express from "express"
import checkAuth from "../middleware/checkAuth.js";
import { agregarProducto,obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto } from "../controllers/productoControllers.js";
const router=express.Router();

router.use(express.json());

router.post('/:restaurantId/agregar-producto',checkAuth,agregarProducto); 

router.get('/:restaurantId/',checkAuth,obtenerProductos);
router.route('/:productoId').get(checkAuth,obtenerProducto)
.put(checkAuth,actualizarProducto)
.delete(checkAuth,eliminarProducto);
//router.get('/:productoId',checkAuth,obtenerProducto);
export default router;