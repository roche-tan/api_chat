import express, { Application } from "express";
import { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import cors from "cors";
import { connectDbMysql } from "../db/config.sql";
import config from "../config";

import routerUser from "../routes/user.routes";
import routerChatRoom from "../routes/chatRoom.routes";
import ChatRoomRepository from "../repositories/chatRoom.repository";

const logger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`
      ${req.method} 
      ${req.url} 
      ${req.ip}`);
  next();
};

class Server {
  private app: Application;
  private httpServer: ReturnType<typeof createServer>;
  private io: IOServer;
  private port: string | number;
  private chatRoomRepository: ChatRoomRepository;
  private path = {
    users: "/users",
    chatRooms: "/chatrooms",
  };
  private rooms: Record<string, { members: string[] }> = {};

  constructor() {
    this.app = express();
    // this.port = config.port || 5001;
    this.port = config.port;
    this.httpServer = createServer(this.app);
    this.io = new IOServer(this.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    this.rooms = {};
    // this.configureSocket();
    this.chatRoomRepository = new ChatRoomRepository();
  }

  async dbConnect() {
    await connectDbMysql();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: "*" }));
    this.app.use(logger);
  }

  routes() {
    console.log("llamando rutas");
    this.app.use(this.path.users, routerUser);
    this.app.use(this.path.chatRooms, routerChatRoom);
    console.log("rutas ok");
  }

  configureSocket() {
    this.io.on("connection", (socket: Socket) => {
      console.log("Un usuario se ha conectado");
      socket.on("create_room", async (roomName) => {
        try {
          console.log("create room socket", roomName);

          await this.chatRoomRepository.createChatRoom(roomName);
          this.rooms[roomName] = { members: [] }; // Crear una nueva sala con un array de miembros
          socket.join(roomName); // Unir al creador a la sala
          this.io.emit("room_list", Object.keys(this.rooms)); // Emitir la lista actualizada de salas a todos los clientes
        } catch (error) {
          if (error instanceof Error) {
            socket.emit("error", error.message);
          } else {
            // Manejar el caso en que error no sea una instancia de Error
            socket.emit("error", "Ocurrió un error desconocido");
          }
        }
      });

      socket.on("request_room_list", async () => {
        try {
          const roomList = await this.chatRoomRepository.showChatRoomList();
          const roomNames = roomList.map((room) => room.roomName); //itera en las salas para luego mostarlas
          socket.emit("room_list", roomNames); // Emitir la lista de salas al solicitante
        } catch (error) {
          if (error instanceof Error) {
            socket.emit("error", error.message);
          } else {
            // Manejar el caso en que error no sea una instancia de Error
            socket.emit("error", "No se puede mostrar la lista");
          }
        }
      });

      // Unirse a una sala de chat
      socket.on("join_room", async (room: string) => {
        console.log("join_room server");
        const chatRoom = await this.chatRoomRepository.showChatRoomByName(room);
        if (!chatRoom) {
          socket.emit("room_error", "La sala no existe");
          return;
        }
        socket.join(room);
        console.log(`Usuario se ha unido a la sala ${room}`);

        // Recupero y emito los mensajes existentes de la sala
        const messagesList =
          await await this.chatRoomRepository.showMessagesList(room);
        socket.emit("existing_messages", messagesList);
      });

      // Manejo de mensajes en una sala de chat
      socket.on("chat_message", async ({ room, message, userName }) => {
        try {
          await this.chatRoomRepository.addMessageToChatRoomByName(
            room,
            message,
            userName
          );
          this.io.to(room).emit("chat_message", { userName, message });
        } catch (error) {
          console.error(
            "Error al guardar el mensaje en la base de datos:",
            error
          );
        }
      });

      socket.on("disconnect", () => {
        console.log("Un usuario se ha desconectado");
      });
    });
  }

  listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public async init() {
    await this.dbConnect();
    this.middlewares();
    this.routes();
    this.configureSocket();
    this.listen();
  }
}

export default Server;
