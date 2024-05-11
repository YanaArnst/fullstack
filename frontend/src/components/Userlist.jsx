import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

const Userlist = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get("http://localhost:4000/users");
    setUsers(response.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:4000/users/${id}`);
    getUsers();
  };


  return (
    <div>
      <h1 className="title">Пользователи</h1>
      <h2 className="subtitle">Список пользователей</h2>
      <Link to="/users/add" className="button is-primary mb-2">
        Добавить
      </Link>
    <table className="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th>№</th>
        <th>Имя</th>
        <th>Email</th>
        <th>Роль</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
    {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Link
                  to={`/users/edit/${user.id}`}
                  className="button is-small is-info"
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="button is-small is-danger"
                  style={{ marginLeft: "10px" }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Userlist;