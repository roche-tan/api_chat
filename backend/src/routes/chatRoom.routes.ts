import { Router } from "express";
// import chatRoomController

const router = Router();

router.post("/login", chatRoomController.createChatRoom);
router.get("/", chatRoomController.chatRoomMessages);
router.get("/:id/messages", chatRoomController.chatRoomMessages);
