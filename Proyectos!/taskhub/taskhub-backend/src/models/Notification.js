import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      requesterId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      taskId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("ASSIGNEE_REQUEST", "DELETE_REQUEST","RESPONSE_INFO"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
    }
  );

  return Notification;
};