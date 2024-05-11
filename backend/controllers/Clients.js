import Client from "../models/ClientModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getClients = async (req, res) => {
    try {
        const response = await Client.findAll({
            attributes:['id','surname','name','patronomic','adress','phone', 'passport'],
            include:[{
                model: User,
                attributes:['name','email']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }

}

export const getClientById = async (req, res) => {
    try {
        const response = await Client.findOne({
            attributes:['id','surname','name','patronomic','adress','phone', 'passport'],
            where:{
                id: req.params.id
            },
            include:[{
                model: User,
                attributes:['name','email']
            }]
        });
        if(!Client) return res.status(404).json({msg: "Клиент не найден"});
    
        res.status(200).json(response);
    } catch (error) {
         console.log(error.message);
    }

}


export const createClient = async (req, res) => {
    const {surname, name, patronomic, adress, phone, passport} = req.body;
    try {
        await Client.create({
            surname: surname,
            name: name,
            patronomic: patronomic,
            adress: adress,
            phone: phone,
            passport: passport,
            userId: req.userId
        });
        res.status(201).json({msg: "Клиент успешно создан"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateClient = async (req, res) => {
    try {

        await Client.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Клиент успешно обновлен"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}


//удалять может только админ
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!client) return res.status(404).json({msg: "Клиент не найден"});
        const {surname, name, patronomic, adress, phone, passport} = req.body;
        if(req.role === "admin"){
            await Client.destroy({
                where:{
                    id: client.id
                }
            });
        }else{
            return res.status(403).json({msg: "Доступ запрещен"});
        }
        res.status(200).json({msg: "Клиент успешно удален"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}