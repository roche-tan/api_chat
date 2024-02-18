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

  async addMessageToChatRoomByName(
    roomName: string,
    message: string,
    userName: string
  ) {
    const chatRoom = await ChatRoom.findOne({ where: { roomName } });
    if (!chatRoom) {
      throw new Error("La sala no existe");
    }
    let messageList = Array.isArray(chatRoom.messageList)
      ? chatRoom.messageList
      : [];

    // let messageList: IMessage[];
    // // Verificar si messageList ya es un objeto JavaScript (un arreglo en este caso)
    // if (chatRoom.messageList && Array.isArray(chatRoom.messageList)) {
    //   // Convertir la cadena JSON a un objeto de JavaScript
    //   messageList = chatRoom.messageList as IMessage[];
    // } else {
    //   // Inicializar como un arreglo vacío si no hay datos previos
    //   messageList = [];
    // }

    const newMessage = {
      userName,
      message,
      timestamp: new Date().toISOString(),
    };

    console.log(messageList, "message list repo");
    console.log(newMessage, "new message list repo");
    messageList.push(newMessage);
    console.log(messageList, "message list");

    // Usar setDataValue para indicar a Sequelize que el campo 'messageList' ha sido modificado
    // chatRoom.setDataValue("messageList", messageList);
    // console.log(messageList, "message list push");
    chatRoom.changed("messageList", true); // decir a sequelize que messageList ha cambiado
    await chatRoom.update({ messageList: messageList });
    // await chatRoom.update({ messageList: JSON.stringify(messageList) });

    // Guardar los cambios en la base de datos
    // await chatRoom.save();
  }
}

export default ChatRoomRepository;
