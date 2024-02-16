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

  async showChatRoomByName(name: string) {
    const chatRoom = await ChatRoom.findOne({ where: { roomName: name } });
    return chatRoom;
  }

  // async addMessageToChatRoomById(
  //   chatRoomId: number,
  //   message: string,
  //   userName: string
  // ) {
  //   const chatRoom = await ChatRoom.findByPk(chatRoomId);

  //   if (!chatRoom) {
  //     throw new Error("La sala no existe");
  //   }

  //   const messageList = chatRoom.messageList || [];
  //   const newMessage = {
  //     userName,
  //     message,
  //     timestamp: new Date().toDateString(),
  //   };

  //   messageList.push(newMessage);

  //   await chatRoom.update({ messageList });
  // }

  async addMessageToChatRoomByName(
    roomName: string,
    message: string,
    userName: string
  ) {
    const chatRoom = await ChatRoom.findOne({ where: { roomName } });

    if (!chatRoom) {
      throw new Error("La sala no existe");
    }

    const messageList = chatRoom.messageList || [];
    const newMessage = {
      userName,
      message,
      timestamp: new Date().toISOString(),
    };
    console.log(messageList, "message list repo");
    console.log(newMessage, "new message list repo");
    messageList.push(newMessage);
    console.log(messageList, "message list push");
    await chatRoom.update({ messageList });
  }
}

export default ChatRoomRepository;
