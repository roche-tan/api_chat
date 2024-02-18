import { Router } from "express";
import chatRoomController from "../controllers/chatRoom.controller";

const router = Router();

router.post("/", chatRoomController.createChatRoom);
router.get("/", chatRoomController.showListChatRooms);
router.get("/:roomName", chatRoomController.showChatRoomByName);
router.post('/:roomName/messages', chatRoomController.addMessageToChatRoom);

export default router;