import ioClient from "socket.io-client";
import Server from "../models/server";

describe("socket.io create room event", () => {
  let server: Server;
  let clientSocket: ReturnType<typeof ioClient>;

  beforeAll(async () => {
    server = new Server();
    await server.init();
  });

  afterAll(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  test("should create a room and receive room list", (done) => {
    clientSocket = ioClient(`http://localhost:3001`, {
      // Asegúrate de usar el puerto correcto
      transports: ["websocket"],
      forceNew: true,
    });

    clientSocket.on("connect", () => {
      clientSocket.emit("create_room", "testRoom");
    });

    clientSocket.on("room_list", (rooms) => {
      expect(rooms).toContain("testRoom");
      clientSocket.disconnect(); // Desconectar después de recibir la lista de salas
      done();
    });

    clientSocket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
});
