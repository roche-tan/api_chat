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

  async addMessageToChatRoom(
    chatRoomId: number,
    message: string,
    userId: number
  ) {
    const chatRoom = await ChatRoom.findByPk(chatRoomId);

    // Buscar la sala de chat por su ID
    if (!chatRoom) {
      throw new Error("La sala no existe");
    }

    // Construir el nuevo mensaje
    const newMessage = { message, userId, date: new Date().toISOString() };

    // Añadir el nuevo mensaje al messageList existente
    // Si el messageList está vacío, inicializarlo como un arreglo vacío
    const messageList = chatRoom.messageList || [];
    messageList.push(newMessage);

    // Guardar los cambios en la base de datos
    chatRoom.messageList = messageList;
    await chatRoom.save();

    return chatRoom;
  }
}

export default ChatRoomRepository;
