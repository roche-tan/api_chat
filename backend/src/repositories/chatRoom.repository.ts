import ChatRoom from "../models/chatRoom.model.sql";

class ChatRoomRepository {
  // crear chatRoom
  async createChatRoom(name: string) {
    // Verificar si existe la sala de chat
    const existingRoom = await ChatRoom.findOne({ where: { roomName: name } });
    if (existingRoom) {
      throw new Error(`La sala ${name} ya está creada`);
    }

    // crear sala si no existe
    const newChatRoom = await ChatRoom.create({
      roomName: name,
      messageList: [], //iniciar messageList como array vacío
    });

    if (!newChatRoom) {
      throw new Error("No se pudo crear la sala de chat");
    }

    return newChatRoom;
  }

  // mostrar lista de todas las salas
  async showChatRoomList() {
    const allRooms = await ChatRoom.findAll();
    return allRooms;
  }

  async showChatRoomById(id: number) {
    const chatRoom = await ChatRoom.findByPk(id);
    return chatRoom;
  }
}

export default ChatRoomRepository;
