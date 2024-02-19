import { Router } from "express";
import chatRoomController from "../controllers/chatRoom.controller";

const router = Router();

router.post("/", chatRoomController.createChatRoom);
router.get("/", chatRoomController.showListChatRooms);
router.get("/:room", chatRoomController.showMessagesList);

export default router;
