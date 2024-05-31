import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import fileDownload from "js-file-download";

const OrderList = () => {

  const [orders, setOrders] = useState ([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const { user } = useSelector((state) => state.auth);

  useEffect(() =>{
    fetchOrders();
  }, [filterStatus]);

  
  const fetchOrders = async () => {
    try {
      let url = 'http://localhost:4000/orders';
      if (filterStatus !== 'all') {
        url += `?status=${filterStatus === 'active' ? true : false}`; // Добавляем параметры фильтрации в URL
      }
      const response = await axios.get(url);
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') {
      return true; // Показываем все заказы
    } else if (filterStatus === 'active') {
      return order.status; // Показываем активные заказы (status === true)
    } else if (filterStatus === 'completed') {
      return !order.status; // Показываем завершенные заказы (status === false)
    }
    return true; // По умолчанию показываем все заказы
  });



  const deleteOrder = async (orderId) => {
    
    await axios.delete(`http://localhost:4000/orders/${orderId}`);
    fetchOrders();
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const paginatedOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const downloadRentalTemplate = async (orderId) => {
    try {
      // Отправляем запрос на сервер для генерации документа
      const response = await axios.get(`http://localhost:4000/orders/${orderId}/rental-template`, {
        responseType: 'blob', // Указываем, что мы ожидаем получить бинарные данные
      });
      fileDownload(response.data, 'rental_template.docx'); // Скачиваем файл
  } catch (error) {
    console.error('Ошибка при скачивании договора аренды:', error);
  }
};



  return (
    <div>
      <h1 className="title">Заказы</h1>
      <h2 className="subtitle">Список заказов</h2>
      <Link to="/orders/add" className="button is-primary mb-3">
        Добавить
      </Link>
      
      

      <div className="buttons">
        <button type="button" className="button is-small is-danger" onClick={handleFilterChange} value="all">Все</button>
        <button type="button" className="button is-small is-danger" onClick={handleFilterChange} value="active">Активные</button>
        <button type="button" className="button is-small is-danger" onClick={handleFilterChange} value="completed">Завершенные</button>
      </div>



    <table className="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th>№</th>
        <th>Клиент</th>
        <th>Инструмент</th>
        <th>Дата выдачи</th>
        <th>Залог</th>
        <th>Количество дней</th>
        <th>Цена за сутки</th>
        <th>Просрочено дней</th>
        <th>Итого</th>
        <th>Статус</th>
        <th>Создан</th>
        <th style={{ textAlign: 'center' }}>Действия</th>
        <th ></th>
        <th ></th>
      </tr>
    </thead>
    <tbody>
    {filteredOrders.map((order,index) => (
        <tr key={order.id}>
        <td>{indexOfFirstOrder + index + 1}</td>
        <td>{order.client ? `${order.client.surname} ${order.client.name} ${order.client.patronomic}` : 'Неизвестный клиент'}</td>
        <td>{order.tool ? `${order.tool.name}` : 'Неизвестный инструмент'}</td>
        <td>{new Date(order.dateIssue).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}</td>
        <td>{order.deposit}</td>
        <td>{order.amountDay}</td>
        <td>{order.costPerDay}</td>
        <td>{order.overdueDay}</td>
        <td>{order.cost}</td>
        <td>{order.status ? 'активный' : 'завершенный'}</td>
        <td>{order.user.name}</td>

        <td style={{ width: '200px' }}>
          <Link 
              to={`/orders/edit/${order.id}`}
              className="button is-small is-info"
            >
              Редактировать
            </Link>
          </td>
          
          <td>
            <button
             onClick={() => downloadRentalTemplate(order.id)}
            className="button is-small is-link"
              style={{ marginLeft: "-80px" }}
            >
              Скачать
            </button>
          </td>  



        {user && user.role === "admin" && (
        <td>
            <button
              onClick={() => deleteOrder(order.id)}
              className="button is-small is-danger"
              style={{ marginLeft: "-25px" }}
            >
              Удалить
            </button>
          </td>
        )}
        </tr>
      ))}
        </tbody>
      </table>

    </div>
  )
}

export default OrderList;