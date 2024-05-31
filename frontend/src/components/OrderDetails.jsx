import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetails = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Ошибка при получении подробной информации о заказе:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return <div>Загрузка...</div>;
  }

  // Преобразуем строку в объект Date
  const dateIssue = new Date(orderDetails.dateIssue);

  // Форматируем дату
  const formattedDate = dateIssue.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <p>Инструмент: {orderDetails.tool.name}</p>
      <p>Дата выдачи: {formattedDate}</p>
      <p>Статус заказа: {orderDetails.status ? 'Активный' : 'Завершенный'}</p>
      {/* Добавьте другие поля заказа, если они есть */}
    </div>
  );
};

export default OrderDetails;