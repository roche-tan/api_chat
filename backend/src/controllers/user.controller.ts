import { Request, Response } from "express";
import UserRepository from "../repositories/user.repository";

class UserController {
  private userRepository?: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.createUser = this.createUser.bind(this);
  }
  // POST /users: crea un usuario.
  public async createUser(req: Request, res: Response): Promise<void> {
    console.log("create user controller 1");

    try {
      console.log("create user controller");
      if (!this.userRepository) {
        throw new Error("User repository is not initialized");
      }

      const { name, password } = req.body;

      if(!name || !password){
        throw new Error("Nombre y contraseña requeridos")
      }

      // Crear usuario
      const newUser = await this.userRepository.createUser(name, password);
      console.log("create user controller", newUser);
      //pasar datos del usuario
      res.status(200).json({ name: newUser.name, userId: newUser.id });
    } catch (error) {
      //comprobar si hay error
      if (error instanceof Error) {
        if (error.message === "Usuario ya creado") {
          console.log("Error al iniciar sesión: ", error.message);
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: error.message }); // Esta línea estaba incompleta en tu código
        }
      }
    }
  }
}

// Exportamos la instancia del controlador

export default new UserController();
