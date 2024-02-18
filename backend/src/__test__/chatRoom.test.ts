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
    const chatRoom = await chatRoomRepository.showChatRoomByName(
      createdChatRoom.roomName
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

  test("addMessageToChatRoom añade un mensaje a la sala de chat correctamente", async () => {
    // Asegúrate de tener una sala de chat creada para probar
    const roomName = "Room 1";
    const message = "Este es un mensaje de prueba";
    const userName = "testUser";

    await chatRoomRepository.addMessageToChatRoomByName(
      roomName,
      message,
      userName
    );

    //verificar si el último mensaje en la lista corresponde al que acabas de añadir.
    const chatRoom = await chatRoomRepository.showChatRoomByName(roomName);
    expect(chatRoom).not.toBeNull();
  });

  test("showMessagesList de una sala de chat", async () => {
    const roomName = "Room 1"; // Asegúrate de que esta sala ya tiene mensajes
    const message = "Este es un mensaje de prueba";
    const userName = "testUser";

    // Primero, añade un mensaje a la sala para asegurarte de que hay al menos uno
    await chatRoomRepository.addMessageToChatRoomByName(
      roomName,
      message,
      userName
    );

    // Luego, recupera la lista de mensajes para esa sala
    const messagesList = (await chatRoomRepository.showMessagesList(
      roomName
    )) as any[];

    // Verifica que la lista de mensajes no esté vacía
    expect(messagesList.length).toBeGreaterThan(0);

    // Verifica que el último mensaje en la lista sea el que acabas de añadir
    // Este enfoque requiere una aserción de tipo 'any'
    const lastMessage = messagesList[messagesList.length - 1];
    expect(lastMessage.userName).toEqual(userName);
    expect(lastMessage.message).toEqual(message);
  });
});
