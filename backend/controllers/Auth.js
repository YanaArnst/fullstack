import User from "../models/UserModel.js";
import argon2 from "argon2";

//для входа
export const Login = async(req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email //вход по электронной почте
        }
    });
    if(!user) return res.status(404).json({msg: "Пользователь не найден"}); //ошибка пользователь не найден если нет email
    const match = await argon2.verify(user.password, req.body.password); //если найден проверяем пароль из бд с паролем отправленным пользователем
    if(!match) return res.status(400).json({msg: "Неправильный пароль"}); //если не совпадают, то сообщение об ошибке
    req.session.userId = user.id; //при совпадении начинаем сеанс
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({ name, email, role});
}

//проверка подлинности пользователя и получение информации о пользователе
export const Me = async (req, res) =>{
    if(!req.session.userId){ //существует ли идентификатор пользователя (userId) в сессии
        return res.status(401).json({msg: "Пожалуйста, войдите в ваш аккаунт"}); //ошибка, если id отсутсвует (пользователь не авторизирован)
    }
    const user = await User.findOne({ //поиск пользователя в бд, если id существует
        attributes:['name','email','role'],
        where: {
            id: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "Пользователь не найден"}); //Проверка существования пользователя
    res.status(200).json(user); 
}

//для выхода
export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Выход невозможен"}); //на случай ошибки
        res.status(200).json({msg: "Вы вышли из системы"}); //успешный выход
    });
}