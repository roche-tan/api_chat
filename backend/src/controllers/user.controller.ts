import { Request, Response } from "express";
import UserRepository from "../repositories/user.repository";

class UserController {
  private userRepository?: UserRepository;

  constructor() {
    this.createUser = this.createUser.bind(this);
  }
  // POST /players: crea un jugador/a.
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      if (!this.userRepository) {
        throw new Error("User repository is not initialized");
      }

      const { name } = req.body;

      // Crear usuario
      const newUser = await this.userRepository.createUser(name);

      //pasar datos del usuario
      res.status(200).json({ name: newUser.name, userId: newUser.id });
    } catch (error) {
      //comprobar si hay error
      if (error instanceof Error) {
        if (error.message === "Usuario ya creado") {
          console.log("Error al iniciar sesión: ", error.message);
          res.status(400).json({ message: error.message });
        } else {
          ({ message: error.message });
          res.status(500).json({ message: "Error interno del servidor" });
        }
      }
    }
  }
}

// Exportamos la instancia del controlador

export default new UserController();
