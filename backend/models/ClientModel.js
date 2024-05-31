import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const {DataTypes} = Sequelize;

const Clients = db.define('client',{
    surname:{
        type: DataTypes.STRING(20),
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 30]
        }
    },

    name:{
        type: DataTypes.STRING(20),
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [2, 30]
        }
    },

    patronomic:{
        type: DataTypes.STRING(30),
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [2, 30]
        }
    },

    adress:{
        type: DataTypes.STRING(100),
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },

    phone:{
        type: DataTypes.STRING(11),
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [10, 11]
        }
    },

    passport:{
        type: DataTypes.STRING(12),
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [10, 11]
        }
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

Users.hasMany(Clients);
Clients.belongsTo(Users, {foreignKey: 'userId'});

export default Clients;