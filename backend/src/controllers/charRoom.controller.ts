import { Request, Response } from "express";
import ChatRoomRepository from "../repositories/chatRoom.repository";

class ChatRoomController {
  private chatRoomRepository?: ChatRoomRepository;

  constructor() {
    this.createChatRoom = this.createChatRoom.bind(this);
    this.showListChatRooms = this.showListChatRooms.bind(this);
    this.showChatRoomById = this.showChatRoomById.bind(this);
  }

  // POST /chatroom: crea una sala.
  public async createChatRoom(req: Request, res: Response): Promise<void> {
    try {
      if (!this.chatRoomRepository) {
        throw new Error("Chat Room repository is not initialized");
      }

      const { name } = req.body;

      // crear nueva sala
      const newChatRoom = await this.chatRoomRepository.createChatRoom(name);

      res
        .status(200)
        .json({ name: newChatRoom.roomName, chatRoomId: newChatRoom.id });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Sala ya creada") {
          res.status(400).json({
            message: error.message,
          });
        } else {
          res.status(500).json({ message: "Error interno del servidor" });
        }
      }
    }
  }

  // GET /chatrooms:
  async showListChatRooms(req: Request, res: Response): Promise<void> {
    try {
      if (!this.chatRoomRepository) {
        throw new Error("Chat room repository is not initialized");
      }

      const showListChatRooms =
        await this.chatRoomRepository.showChatRoomList();

      res.status(200).json(showListChatRooms);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async showChatRoomById(req: Request, res: Response): Promise<void> {
    try {
      if (!this.chatRoomRepository) {
        throw new Error("Chat room repository is not initialized");
      }

      const id = parseInt(req.params.id, 10); // Convertir a número

      const showChatRoomById = await this.chatRoomRepository.showChatRoomById(
        id
      );
      res.status(200).json(showChatRoomById);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default new ChatRoomController();
