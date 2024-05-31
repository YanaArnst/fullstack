import Order from "../models/OrderModel.js";
import Tool from "../models/ToolModel.js";
import Client from "../models/ClientModel.js";
import User from "../models/UserModel.js";
import fs from "fs";
import Docxtemplater from 'docxtemplater';
import {Op} from "sequelize";


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


export const getRentalTemplate = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        
        // Получаем данные о заказе
        const order = await Order.findOne({
            where: {
                id: orderId
            },
            include: [{
                model: Client,
                attributes: ['surname', 'name', 'patronomic']
            },
            {
                model: Tool,
                attributes: ['name']
            }]
        });

        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

      // Читаем шаблон аренды из файла
      let templatePath = 'rental_template.docx'; // Путь к файлу шаблона аренды
      let template;
        try {
            template = fs.readFileSync(templatePath);
        } catch (err) {
            console.error("Ошибка при чтении файла шаблона аренды:", err);
            return res.status(500).json({ message: 'Ошибка при чтении файла шаблона аренды' });
        }

      // Заменяем заполнители в шаблоне аренды на данные о заказе
      let rentalAgreement = fillRentalTemplate(template, order);

      // Отправляем файл обратно на фронтенд
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=rental_agreement.docx');
      res.send(rentalAgreement);
  } catch (error) {
      res.status(500).json({ msg: error.message });
  }
};
export const fillRentalTemplate = (template, order) => {
    // Инициализируем docxtemplater с содержимым шаблона
    const doc = new Docxtemplater();
    doc.loadZip(template);

    // Проверяем наличие данных заказа и клиента
    if (!order || !order.client || !order.tool) {
        console.error("Данные заказа некорректны или отсутствуют.");
        return null; // Вернуть null, чтобы показать, что данные заказа некорректны
    }

    // Заменяем заполнители в шаблоне на данные о заказе
    doc.setData({
        clientName: `${order.client.surname} ${order.client.name} ${order.client.patronomic}`,
        toolName: order.tool.name,
        // Другие данные заказа, если нужно
    });

    // Рендерим шаблон
    doc.render();

    // Получаем бинарные данные отрендеренного документа
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    return buffer;
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