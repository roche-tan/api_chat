import { Sequelize, DataTypes } from "sequelize";
import ChatRoom from "../models/chatRoom.model.sql";
import ChatRoomRepository from "../repositories/chatRoom.repository";

describe("ChatRoomRepository", () => {
  let chatRoomRepository: ChatRoomRepository;
  let sequelize: Sequelize;
  let createdChatRoom: ChatRoom | null = null;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:", {
      logging: false, // Desactiva la salida SQL en la consola
    });

    // ChatRoom se inicialice correctamente con sequelize
    ChatRoom.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        roomName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        messageList: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        createdAt: {
          field: "created_at",
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          field: "updated_at",
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      { sequelize, modelName: "ChatRoom", tableName: "chatroom" }
    );

    await sequelize.sync({ force: true }); // Esto crea las tablas en la base de datos en memoria
    chatRoomRepository = new ChatRoomRepository();

    // crear salas para el test
    await ChatRoom.create({ roomName: "Room 1", messageList: [] });
    await ChatRoom.create({ roomName: "Room 2", messageList: [] });

    createdChatRoom = await ChatRoom.create({
      roomName: "Test Room",
      messageList: [],
    });
    const chatRoom = await chatRoomRepository.showChatRoomById(
      createdChatRoom.id
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("createChatRoom crea una nueva sala de chat", async () => {
    const roomName = "Test Room1";
    const chatRoom = await chatRoomRepository.createChatRoom(roomName);
    expect(chatRoom.roomName).toEqual(roomName);
  });

  test("createChatRoom error si la sala ya existe", async () => {
    const roomName = "Room 1"; // Usa el nombre de una sala que ya has creado antes
    await expect(chatRoomRepository.createChatRoom(roomName)).rejects.toThrow(
      `La sala ${roomName} ya está creada`
    );
  });

  test("showChatRoomList devuelve todas las salas de chat que existen", async () => {
    const rooms = await chatRoomRepository.showChatRoomList();
    expect(rooms.length).toBeGreaterThanOrEqual(2);
    expect(rooms.some((room) => room.roomName === "Room 1")).toBeTruthy();
    expect(rooms.some((room) => room.roomName === "Room 2")).toBeTruthy();
  });

  test("showChatRoomById devuelve la sala de chat correcta por su ID", async () => {
    const chatRoom = await chatRoomRepository.showChatRoomById(
      createdChatRoom!.id
    );
    expect(chatRoom).not.toBeNull;
    expect(chatRoom?.id).toEqual(createdChatRoom!.id);
    expect(chatRoom?.roomName).toEqual("Test Room");
  });

  test("showChatRoomById retorna null si la sala de chat no existe", async () => {
    // Asumiendo que el ID 9999 no existe
    const chatRoom = await chatRoomRepository.showChatRoomById(9999);
    expect(chatRoom).toBeNull();
  });
});
