import Order from "../models/OrderModel.js";
import Tool from "../models/ToolModel.js";
import Client from "../models/ClientModel.js";
import User from "../models/UserModel.js";
import fs from "fs";
import path  from "path";
import officegen from "officegen";
import Docxtemplater from 'docxtemplater';
import {Op} from "sequelize";
import { createDocument } from "./createDocument.js";


export const getOrders = async (req, res) => {
    try {
        const response = await Order.findAll({
            attributes:['id','clientId','toolId', 'dateIssue', 'deposit', 'amountDay', 'costPerDay', 'overdueDay', 'cost', 'status' ],
            include:[{
                model: User,
                attributes:['name','email']
            },
            {
                model: Client,
                attributes:['surname', 'name', 'patronomic']
            },
            {
                model: Tool,
                attributes:['name']
            }
        ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }

}



export const getOrderById = async (req, res) => {

    try {
        const order = await Order.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!order) return res.status(404).json({msg: "Заказ не найден"});
        const response = await Order.findOne({
            attributes:['id','clientId','toolId', 'dateIssue', 'deposit', 'amountDay', 'costPerDay', 'overdueDay', 'cost', 'status' ],
            where: {
                id: order.id
            },
            include:[{
                model: User,
                attributes:['name','email']
            },
            {
                model: Client,
                attributes:['surname', 'name', 'patronomic']
            },
            {
                model: Tool,
                attributes:['name']
            }
        ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
    
}



export const createOrder = async (req, res) => {

    try {
        // Получаем данные из запроса
        const { clientId, toolId, dateIssue, deposit, amountDay, costPerDay, overdueDay, status } = req.body;
    
        // Получаем информацию об инструменте
        const tool = await Tool.findByPk(toolId);
        if (!tool) {
          return res.status(404).json({ message: 'Инструмент не найден' });
        }
    
        // Вычисляем стоимость
        const cost = calculateCost(amountDay, tool.costPerDay, overdueDay, tool.deposit);

        await Order.create({
            clientId: clientId,
            toolId: toolId,
            dateIssue: dateIssue,
            deposit: tool.deposit,
            amountDay: amountDay,
            costPerDay: tool.costPerDay,
            overdueDay: overdueDay,
            cost:  calculateCost(amountDay, tool.costPerDay, overdueDay, tool.deposit), 
            status : status,
            userId: req.userId
        });
        res.status(201).json({msg: "Заказ успешно создан"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
    
}

function calculateCost(amountDay, costPerDay, overdueDay, deposit) {
    const totalCost = (amountDay + overdueDay) * costPerDay + deposit;
    return totalCost > 0 ? totalCost : 0;
  }


export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!order) return res.status(404).json({msg: "Заказ не найден"});

        const {clientId, toolId, dateIssue, deposit, amountDay, costPerDay, overdueDay, status} = req.body;
        
        
        // Получаем информацию об инструменте
        const tool = await Tool.findByPk(toolId);
        if (!tool) {
          return res.status(404).json({ message: 'Tool not found' });
        }

          // Вычисляем новую стоимость
        const newCost = calculateCost(amountDay, tool.costPerDay, overdueDay, tool.deposit);


        await Order.update({clientId, toolId, dateIssue, deposit:tool.deposit, amountDay, costPerDay:tool.costPerDay, overdueDay, cost: newCost, status}, {
            where: {
                id: order.id
            }
        });
        res.status(200).json({msg: "Заказ успешно обновлен"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}



export const getClientSurname = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Client,
                required: true,
                attributes: ['surname']
            }]
        });

        if (!order) {
            return res.status(404).json({ msg: "Заказ не найден" });
        }

        const surname = order.client.surname;
        res.json({ surname });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getRentalTemplate = async (req, res) => {
    try {
        
        const order = await Order.findOne({
            where:{
                id: req.params.id
            },
            include: [{
                model: Client,
                required: true, // Убедитесь, что клиент должен быть включен
                attributes: ['surname', 'name', 'patronomic']
            },
            {
                model: Tool,
                attributes: ['name']
            }]
        });

        if (!order) {
            return res.status(404).json({ msg: "Заказ не найден" });
          }
        

    const docx = createDocument(order);

          
   // Сохраняем документ в файл
    const filename = `Договор_аренды_${order.client.surname}.docx`;
    const outputStream = fs.createWriteStream(filename);
    docx.generate(outputStream);


    // Отправляем .docx файл клиенту
    outputStream.on('finish', () => {
        res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');    
        const fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
        fileStream.on('end', () => {
        fs.unlinkSync(filename); // Удаляем файл после отправки
        });
    });

    // Обработка ошибок при создании документа
    outputStream.on('error', (err) => {
    res.status(500).json({ message: err.message });
    });

    } catch (error) {
    // Обрабатываем ошибки, которые могут возникнуть в блоке try
    res.status(500).json({ message: error.message });
    }
    };




//удалять может только админ
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!order) return res.status(404).json({msg: "Заказ не найден"});
        const {clientId, toolId, dateIssue, amountDay, overdueDay, cost, status} = req.body;
        if(req.role === "admin"){
            await Order.destroy({
                where:{
                    id: order.id
                }
            });
        }else{
            return res.status(403).json({msg: "Доступ запрещен"});
        }
        res.status(200).json({msg: "Заказ успешно удален"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}