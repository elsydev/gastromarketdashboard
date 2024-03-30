import express from "express"
import checkAuth from "../middleware/checkAuth.js";
import {obtenerRestaurantes,
    nuevoRestaurante,
    obtenerRestaurante,
    editarRestaurante,
    eliminarRestaurante,
    agregarColaborador,
    obtenerColaboradores,
    eliminarColaborador} from "../controllers/restaurantControllers.js";
    import { agregarProducto } from "../controllers/productoControllers.js";

const router=express.Router();

router.use(express.json());

router.route('/').get(checkAuth,obtenerRestaurantes).post(checkAuth,nuevoRestaurante);
router.route('/:id').get(checkAuth,obtenerRestaurante).put(checkAuth,editarRestaurante).delete(checkAuth,eliminarRestaurante);

router.post('/colaboradores/:id',checkAuth,agregarColaborador);
router.post('/colaboradores',checkAuth,obtenerColaboradores);
router.post('/colaboradores/eliminar-colaborador/:id',checkAuth,eliminarColaborador);
router.post('/:restaurantId/:categoriaId/productos',checkAuth,agregarProducto)
//rutas para productos
router.post("/:restaurantId/productos",checkAuth,agregarProducto)
export default router;
