import { Router } from "express";
import { getPersonajes, addPersonaje } from "../controllers/PersonajeController.js";
import { uploadImg } from "../middleware/storage.js";

const router = Router();

router.get('/api/v1/personajes', getPersonajes);
router.get('/api/v1/personajes/:id', getPersonajes);
router.post('/api/v1/personajes', uploadImg.single('img'), addPersonaje);

export default router;


