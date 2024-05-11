import React, { useState, useEffect }  from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const ClientList = () => {
  const [clients, setClients] = useState ([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const { user } = useSelector((state) => state.auth);

  useEffect(() =>{
    getClients();
  }, []);

  const getClients = async () => {
    const response = await axios.get("http://localhost:4000/clients");
    setClients(response.data);
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const paginatedClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(clients.length / clientsPerPage); i++) {
    pageNumbers.push(i);
  }


  const deleteClient = async (id) => {
    
    await axios.delete(`http://localhost:4000/clients/${id}`);
    getClients();
  };

 
  return (
    <div>
      <h1 className="title">Клиенты</h1>
      <h2 className="subtitle">Список клиентов</h2>
      <Link to="/clients/add" className="button is-primary mb-3">
        Добавить
      </Link>
    <table className="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th>№</th>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>Адрес</th>
        <th>Телефон</th>
        <th>Паспорт</th>
        <th>Создан</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
    {paginatedClients.map((client,index) => (
        <tr key={client.id}>
        <td>{indexOfFirstClient + index + 1}</td>
        <td>{client.surname}</td>
        <td>{client.name}</td>
        <td>{client.patronomic}</td>
        <td>{client.adress}</td>
        <td>{client.phone}</td>
        <td>{client.passport}</td>
        <td>{client.user.name}</td>

        <td style={{ width: '200px' }}>
          <Link
              to={`/clients/edit/${client.id}`}
              className="button is-small is-info"
            >
              Редактировать
            </Link>
          </td>

        {user && user.role === "admin" && (
        <td >
            <button
              onClick={() => deleteClient(client.id)}
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

export default ClientList;