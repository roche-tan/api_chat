import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.sql";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;  // Agregado para Google Auth
  public password!: string;
  public avatar?: string; // Opcional, para usuarios de Google
  public isGoogleUser?: boolean; // Indicar si el usuario se autenticó a través de Google
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,  // Podría ser nulo para usuarios que no se registren con Google
      unique: true,     // Asegurarse de que el correo electrónico sea único
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,  // Permitir nulo para usuarios que se registran con Google
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,  // Opcional
    },
    isGoogleUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  },
  { sequelize, modelName: "User", tableName: "user", timestamps: true }
);

export default User;
