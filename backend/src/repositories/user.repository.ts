import userController from "../controllers/user.controller";
import User from "../models/user.model.sql";

class UserRepository {
  async isNameInUse(name: string) {
    const existingPlayer = await User.findOne({ where: { name } });
    return !!existingPlayer; // Convertir a booleano: true si existingPlayer no es null/undefined, false de lo contrario
  }

  async createUser(name: string) {
    console.log("repo user", name);
    //Si no se proporciona nombre, avisar que no es válido
    if (!name) {
      throw new Error("Proporcione un nombre para el usuario");
    }

    const userName = name.trim();

    // Verificar si el nombre ya está en uso
    const isNameInUse = await this.isNameInUse(userName);
    if (isNameInUse) {
      throw new Error("Usuario ya creado");
    }

    // Crear nuevo usuario
    const newUser = await User.create({ name: userName });
    return newUser;
  }

  // Encontrar un usuario por id
  async findUserById(id: string) {
    const user = await User.findByPk(id);
    return user;
  }
}

export default UserRepository;
