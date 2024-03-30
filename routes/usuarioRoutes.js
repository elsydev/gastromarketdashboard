import express from 'express';
import {registrar,autenticar,confirmar,olvidoPassword,comprobarToken,nuevoPassword,perfil} from '../controllers/usuarioControllers.js';
const router=express.Router();
import checkAuth from '../middleware/checkAuth.js';


router.post('/',registrar);
router.post('/login',autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password',olvidoPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
router.get('/perfil',checkAuth,perfil)
export default router;