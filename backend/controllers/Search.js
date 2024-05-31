import express from "express";
import { Op } from "sequelize";
import Clients from "../models/ClientModel.js";
import Orders from "../models/OrderModel.js";


export const getSearch = async (req, res) => {
    const { query } = req.query;

  try {
    // поиск пользователей по имени 
    const results = await Clients.findAll({
      where: {
        [Op.or]: [
          { Surname: { [Op.like]: `%${query}%` } },
          { Name: { [Op.like]: `%${query}%` } }
        ],
      },
      attributes: ['name', 'surname', 'patronomic'],
      include: [{
        model: Orders,
        as: 'orders', 
        required: false, // Если у клиента нет заказов, он все равно будет включен в результаты
      }],
    });

    res.json(results);
  } catch (error) {
    console.error('Ошибка при выполнении поиска:', error);
    res.status(500).json({ error: 'Произошла ошибка при выполнении поиска' });
  }
}