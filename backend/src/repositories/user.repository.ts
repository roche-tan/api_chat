import User from "../models/user.model.sql";
import bcrypt from "bcrypt";

class UserRepository {
  async isNameInUse(name: string) {
    const existingPlayer = await User.findOne({ where: { name } });
    return !!existingPlayer; // Convertir a booleano: true si existingPlayer no es null/undefined, false de lo contrario
  }

  async createUser(name: string, password: string) {
    console.log("repo user", name);
    //Si no se proporciona nombre, avisar que no es válido
    if (!name || !password) {
      throw new Error("Proporcione un nombre y contraseña para el usuario");
    }

    const userName = name.trim();

    // Verificar si el nombre ya está en uso
    const isNameInUse = await this.isNameInUse(userName);
    if (isNameInUse) {
      throw new Error("Usuario ya creado");
    }

    // Generar un salt y hacer hashong de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario con user name y password
    const newUser = await User.create({
      name: userName,
      password: hashedPassword,
    });
    return newUser;
  }

  // Encontrar un usuario por id
  async findUserById(id: string) {
    const user = await User.findByPk(id);
    return user;
  }
}

export default UserRepository;
