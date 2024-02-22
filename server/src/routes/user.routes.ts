import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.post("/signup", userController.createUser); // Ruta para crear nuevos usuarios
router.post("/login", userController.loginUser); // Ruta para usuarios existentes

export default router;
