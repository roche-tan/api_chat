import { Sequelize, DataTypes } from "sequelize";
import UserRepository from "../repositories/user.repository";
import User from "../models/user.model.sql";
import bcrypt from "bcrypt";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:", {
      logging: false,
    });

    // Asegúrate de que User se inicialice correctamente con sequelize
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, { sequelize, modelName: "User", tableName: "users" });

    await sequelize.sync({ force: true });
    userRepository = new UserRepository();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("isNameInUse returns true if name is already in use", async () => {
    const name = "testUser";
    const password = await bcrypt.hash("password", 10);
    await User.create({ name, password });

    const isNameInUse = await userRepository.isNameInUse(name);
    expect(isNameInUse).toBe(true);
  });

  test("createUser creates a new user", async () => {
    const name = "newUser";
    const password = "newPassword";

    const user = await userRepository.createUser(name, password);
    expect(user).not.toBeNull();
    expect(user.name).toEqual(name);

    // Verificar que la contraseña se haya hasheado
    const isValidPassword = await bcrypt.compare(password, user.password);
    expect(isValidPassword).toBe(true);
  });

  test("findUserById finds a user by id", async () => {
    const name = "findUserTest";
    const password = "testPassword";
    const newUser = await User.create({ name, password: await bcrypt.hash(password, 10) });

    const foundUser = await userRepository.findUserById(newUser.id.toString());
    expect(foundUser).not.toBeNull();
    expect(foundUser?.name).toEqual(name);
  });
});
