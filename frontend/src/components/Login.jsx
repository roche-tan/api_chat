// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./alert";

const Login = ({ onLogin }) => {
  const [userName, setUserName] = useState(""); // estado para el userName
  const [password, setPassword] = useState(""); // estado para contraseña
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error
  const navigate = useNavigate();

  const createUser = async (userName, password) => {
    console.log(userName);
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName, password }),
      });

      if (!response.ok) {
        throw new Error("No se ha podido crear usuario");
      }

      console.log("usuario creado");
    } catch (error) {
      console.error("Error al crear usuario");
      setError("Error al crear el usuario. Inténtalo de nuevo.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!userName.trim() || !password.trim()) {
      setError("Por favor, rellena todos los campos."); // Establecer el mensaje de error
      return;
    }

    await createUser(userName, password);
    if (!error) {
      onLogin(userName);
      navigate("/chatrooms");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <Alert message={error} />
      </form>
    </div>
  );
};

export default Login;
