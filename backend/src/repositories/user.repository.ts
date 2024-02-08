import User from "../models/user.model.sql";

class UserRepository {
  async createUser(name: string) {
    //Si no se proporciona nombre, avisar que no es válido
    if (!name) {
      throw new Error("Proporcione un nombre para el usuario");
    }

    const userName = name.trim();

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
