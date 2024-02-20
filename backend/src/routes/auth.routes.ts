import { Router } from "express";
import chatRoomController from "../controllers/chatRoom.controller";
import { auth } from "google-auth-library";
import authController from "../controllers/auth.controller";

const router = Router();

router.post("/",authController.authenticateWithGoogle);


export default router;
