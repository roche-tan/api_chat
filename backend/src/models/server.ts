import express, { Application } from "express";
import { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import cors from "cors";
import { connectDbMysql } from "../infrastructure/database/sql_db";
import config from "../config";

import routerUser from "../routes/user.routes";
import routerChatRoom from "../routes/chatRoom.routes";

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
  private path = {
    users: "/users",
    chatRooms: "/chatrooms",
  };
  private rooms: Record<string, { members: string[] }> = {};

  constructor() {
    this.app = express();
    this.port = config.port || 5001;
    this.httpServer = createServer(this.app);
    this.io = new IOServer(this.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        // origin: "*",
        methods: ["GET", "POST"],
        // credentials: true,
        // allowedHeaders: ["my-custom-header"], // Añade esto solo si necesitas encabezados personalizados
      },
    });
    // this.rooms = {};
    // this.configureSocket();
  }

  async dbConnect() {
    await connectDbMysql();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
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

      socket.on("create_room", (roomName) => {
        this.rooms[roomName] = { members: [] }; // Crear una nueva sala con un array de miembros
        socket.join(roomName); // Unir al creador a la sala
        this.io.emit("room_list", Object.keys(this.rooms)); // Emitir la lista actualizada de salas a todos los clientes
      });

      socket.on("request_room_list", () => {
        socket.emit("room_list", Object.keys(this.rooms)); // Emitir la lista de salas al solicitante
      });

      // Unirse a una sala de chat
      socket.on("join_room", (room: string) => {
        socket.join(room);
        console.log(`Usuario se ha unido a la sala ${room}`);
      });

      // Manejo de mensajes en una sala de chat
      socket.on("chat_message", ({ room, message, userName }) => {
        this.io.to(room).emit("chat_message", { userName, message });
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
