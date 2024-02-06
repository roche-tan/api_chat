import express, { Application } from 'express';
import { createServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import cors from 'cors';
import config from '../config';
import { connectDbMysql } from '../infrastructure/database/sql_db';

const logger = (req: any, _res: any, next: any) => {
  console.log(`
  ${req.method}
  ${req.url}
  ${req.ip}
  `);
};

class Server {
  private app: Application;
  private httpServer: ReturnType<typeof createServer>;
  private io: IOServer;
  private port: string | number;
  private rooms: Record<string, { members: string[] }> = {};

  constructor() {
    this.app = express();
    this.port = config.port;
    this.httpServer = createServer(this.app);
    this.io = new IOServer(this.httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    this.configureSocket();
  }

  async dbConnect() {
    await connectDbMysql();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(logger);
  }

  configureSocket() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Un usuario se ha conectado');

      socket.on('create_room', (roomName) => {
        this.rooms[roomName] = { members: [] }; // Crear una nueva sala con un array de miembros
        socket.join(roomName); //Unir creador a la sala
        this.io.emit('room_list', Object.keys(this.rooms)); //Emite la lista actualizada de salas a todos los clientes
      });

      socket.on('request_room_list', () => {
        socket.emit('room_list', Object.keys(this.rooms)); // Emitir la lista de salas al solicitante
      });

      //Unirse a la sala
      socket.on('join_room', (room: string) => {
        if (!this.rooms[room]) {
          socket.emit('error', `La sala ${room} no existe`);
          return;
        }
        socket.join(room);
        console.log('Usuario se ha unido a la sala ', room);
      });

      //Manejo mensajes en la sala
      socket.on('chat_message', ({ room, message, userName }) => {
        if (this.rooms[room]) {
          this.io.to(room).emit('chat_message', { userName, message });
        } else {
          socket.emit('error', `La sala ${room} no existe`);
        }
      });

      socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
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
    this.configureSocket();
    this.listen();
  }
}

export default Server;
