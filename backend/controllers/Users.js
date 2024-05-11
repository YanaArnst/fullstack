import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) => {
    try {
        const response = await User.findAll({
            attributes:['id','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}


export const getUserById = async(req, res) => {
    try {
        const response = await User.findOne({
            attributes:['id','name','email','role'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
    
}

export const createUser =async(req, res) => {
    const {name, email, password, confPassword, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Пароли не совпадают"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "Пользователь создан"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async(req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "Пользователь не найден"});
    const {name, email, password, confPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){ //если пароль равен пустой строке или нулю
        hashPassword = user.password //то берем пароль пользователя из бд
    }else{
        hashPassword = await argon2.hash(password); //если отправляет тогда хэшируем
    }
    if(password !== confPassword) return res.status(400).json({msg: "Пароли не совпадают"});
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "Пользователь обновлен"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

        
export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "Пользователь не найден"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "Пользователь удален"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}