import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const OrderList = () => {

  const [orders, setOrders] = useState ([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const { user } = useSelector((state) => state.auth);

  useEffect(() =>{
    getOrders();
  }, []);

  const getOrders = async () => {
    const response = await axios.get("http://localhost:4000/orders");
    setOrders(response.data);
  };

  const deleteOrder = async (orderId) => {
    
    await axios.delete(`http://localhost:4000/clients/${orderId}`);
    getOrders();
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


  return (
    <div>
      <h1 className="title">Заказы</h1>
      <h2 className="subtitle">Список заказов</h2>
      <Link to="/orders/add" className="button is-primary mb-3">
        Добавить
      </Link>
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
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
    {paginatedOrders.map((order,index) => (
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

        {user && user.role === "admin" && (
        <td>
            <button
              onClick={() => deleteOrder(order.id)}
              className="button is-small is-danger"
              style={{ marginLeft: "-80px" }}
            >
              Удалить
            </button>
          </td>
        )}
        </tr>
      ))}
        </tbody>
      </table>

      <nav className="pagination" role="navigation" aria-label="pagination">
        <ul className="pagination-list">
          {pageNumbers.map(number => (
            <li key={number}>
              <a onClick={() => handleChangePage(number)} className={`pagination-link ${currentPage === number ? 'is-current' : ''}`}>
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>

    </div>
  )
}

export default OrderList;