import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = ({ onLogin }) => {
  const [userName, setUserName] = useState(""); // estado para el userName
  const [password, setPassword] = useState(""); // estado para contraseña
  const [isLoginMode, setIsLoginMode] = useState(true); // Nuevo estado para alternar entre login y registro
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName.trim() || !password.trim()) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    const url = `http://localhost:3001/users/${
      isLoginMode ? "login" : "signup"
    }`; // Cambia la URL dependiendo del modo
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName, password }),
      });

      const data = await response.json(); // Obtén la respuesta del servidor
      if (!response.ok) {
        throw new Error(data.message || "Algo salió mal");
      }

      console.log(isLoginMode ? "Usuario autenticado" : "Usuario creado");
      onLogin(userName, data); // Puedes querer ajustar esto basado en la respuesta real
      navigate("/chatrooms");
    } catch (error) {
      console.error(error);
      setError(error.message || "Algo salió mal");
    }
  };

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <div className="login-container">
      <h2>{isLoginMode ? "Iniciar Sesión" : "Registrarse"}</h2>
      <form onSubmit={handleAction}>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {isLoginMode ? "Iniciar Sesión" : "Registrarse"}
        </button>
        <button type="button" onClick={toggleMode}>
          {isLoginMode ? "Quiero Registrarme" : "Ya tengo cuenta"}
        </button>
        {error && <Alert message={error} />}
      </form>
      {/* Coloca el botón de Google aquí */}
      <GoogleLoginButton />
    </div>
  );
};

export default Login;
