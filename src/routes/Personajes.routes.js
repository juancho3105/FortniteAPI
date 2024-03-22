import { Router } from "express";
import { getPersonajes, addPersonaje, editPersonaje, deletePersonaje } from "../controllers/PersonajeController.js";
import { uploadImg } from "../middleware/storage.js";

const router = Router();

router.get('/api/v1/personajes', getPersonajes);
router.get('/api/v1/personajes/:id', getPersonajes);
router.post('/api/v1/personajes', uploadImg.single('img'), addPersonaje);
router.put('/api/v1/personajes/:id', uploadImg.single('img'), editPersonaje);
router.delete('/api/v1/personajes/:id', deletePersonaje);

export default router;


