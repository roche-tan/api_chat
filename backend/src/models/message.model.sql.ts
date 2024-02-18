import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.sql";
import ChatRoom from "./chatRoom.model.sql";

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chatRoomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatRoom, // Esto establece la clave foránea referenciando al modelo ChatRoom
        key: "id",
      },
    },
    userName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Message", tableName: "message", timestamps: false }
);

export default Message;
