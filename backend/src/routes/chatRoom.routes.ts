import { Router } from "express";
import chatRoomController from "../controllers/chatRoom.controller";

const router = Router();

router.post("/", chatRoomController.createChatRoom);
router.get("/", chatRoomController.showListChatRooms);
router.get("/:name", chatRoomController.showChatRoomByName);
router.get("/:name/messages", chatRoomController.showMessagesList);

export default router;
