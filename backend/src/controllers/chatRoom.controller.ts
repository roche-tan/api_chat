import { Request, Response } from "express";
import ChatRoomRepository from "../repositories/chatRoom.repository";

class ChatRoomController {
  private chatRoomRepository: ChatRoomRepository;

  constructor() {
    this.chatRoomRepository = new ChatRoomRepository();
    this.createChatRoom = this.createChatRoom.bind(this);
    this.showListChatRooms = this.showListChatRooms.bind(this);
    this.showChatRoomByName = this.showChatRoomByName.bind(this);
  }

  // POST /chatroom: crea una sala.
  public async createChatRoom(req: Request, res: Response): Promise<void> {
    console.log("create chatroom");
    try {
      if (!this.chatRoomRepository) {
        throw new Error("Chat Room repository is not initialized");
      }

      const { name } = req.body;
      console.log("roomName", name);

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

  async showChatRoomByName(req: Request, res: Response): Promise<void> {
    try {
      if (!this.chatRoomRepository) {
        throw new Error("Chat room repository is not initialized");
      }

      const { name } = req.params;

      const showChatRoomById = await this.chatRoomRepository.showChatRoomByName(
        name
      );
      res.status(200).json(showChatRoomById);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // POST /chatroom/:id/message: añade un mensaje a la sala de chat.
  // public async addMessageToChatRoom(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   console.log("addMessageToChatRoom controller");
  //   try {
  //     const chatRoomId = parseInt(req.params.id, 10);
  //     const { message, userId } = req.body;

  //     // Añadir mensaje a la sala
  //     const updatedChatRoom =
  //       // await this.chatRoomRepository.addMessageToChatRoomById(
  //       await this.chatRoomRepository.addMessageToChatRoomByName(
  //         // chatRoomId,
  //         name,
  //         message,
  //         userId
  //       );

  //     res.status(200).json(updatedChatRoom);
  //   } catch (error) {
  //     // Manejo de errores
  //     if (error instanceof Error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   }
  // }
}

export default new ChatRoomController();
