import { Router } from "express";
import chatRoomController from "../controllers/chatRoom.controller";

const router = Router();

router.post("/", chatRoomController.createChatRoom);
router.get("/", chatRoomController.showListChatRooms);
router.get("/:name", chatRoomController.showChatRoomByName);

export default router;
