import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";

// Asegúrate de que la URL coincida con el endpoint de tu servidor Socket.IO
const socket = io("http://localhost:3001");

const App = () => {
  const [messages, setMessages] = useState<
    { userName: string; message: string }[]
  >([]); // Define explícitamente el tipo del array
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rooms, setRooms] = useState<string[]>([]);

  console.log("REACT_APP_CLIENT_ID:", process.env.REACT_APP_CLIENT_ID);

  const handleLogin = (userNameFromLogin: string) => {
    setIsLoggedIn(true);
    setUserName(userNameFromLogin); // Asegurarse de actualizar el estado userName con el valor recibido
  };

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  useEffect(() => {
    socket.emit("request_room_list"); // Solicitar la lista de salas al servidor

    const handleRoomList = (roomList: string[]) => {
      setRooms(roomList); // Actualizar el estado con la lista de salas recibida
    };

    socket.on("room_list", handleRoomList);

    // Función de limpieza para evitar múltiples listeners
    return () => {
      socket.off("room_list", handleRoomList);
    };
  }, []);

  const handleCreateRoom = () => {
    const roomName = prompt("Enter room name:"); // Solicitar el nombre de la sala al usuario
    if (roomName) {
      socket.emit("create_room", roomName); // Enviar al servidor la solicitud para crear una nueva sala
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/chatrooms" />
            )
          }
        />
        <Route
          path="/chatrooms"
          element={
            <ChatList
              rooms={rooms}
              handleCreateRoom={handleCreateRoom}
              userName={userName}
            />
          }
        />
        <Route
          path="/chatrooms/:id"
          element={<ChatRoom socket={socket} userName={userName} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
