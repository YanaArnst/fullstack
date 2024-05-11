import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Tools from "./ToolModel.js";
import Clients from "./ClientModel.js";

const {DataTypes} = Sequelize;

const Orders = db.define('order',{
    
    clientId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },

    toolId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },

    deposit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
    },

    dateIssue: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
    },

    amountDay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 1, // минимальное количество дней
        },
    },

    costPerDay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
    },

    overdueDay: {
        type: DataTypes.INTEGER,
        allowNull: true, // может быть просрочено на несколько дней или не быть просрочено вообще
        validate: {
          min: 0, // просрочка не может быть отрицательной
        },
    },

    cost: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        validate: { 
            notEmpty: true 
        } 
    },

    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // по умолчанию заказ считается незавершенным
        allowNull: false,
    },

    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
    
},{
    freezeTableName: true
});


Users.hasMany(Orders);
Orders.belongsTo(Users, { foreignKey: "userId" });

Tools.hasMany(Orders);
Orders.belongsTo(Tools, { foreignKey: "toolId" });

Clients.hasMany(Orders);
Orders.belongsTo(Clients, { foreignKey: "clientId" });


export default Orders;