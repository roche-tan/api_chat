import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.sql";

class ChatRoom extends Model {
  public id!: number;
  public roomName!: string;
  public messageList!: object[];
}

ChatRoom.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messageList: {
      type: DataTypes.JSON,
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
  },
  { sequelize, modelName: "ChatRoom", tableName: "chatRoom", timestamps: true }
);

export default ChatRoom;
