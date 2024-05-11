import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const ToolList = () => {
  const [tools, setTools] = useState ([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toolsPerPage] = useState(10);
  const { user } = useSelector((state) => state.auth);

  useEffect(() =>{
    getTools();
  }, []);

  const getTools = async () => {
    const response = await axios.get("http://localhost:4000/tools");
    setTools(response.data);
  };

  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const paginatedTools = tools.slice(indexOfFirstTool, indexOfLastTool);

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(tools.length / toolsPerPage); i++) {
    pageNumbers.push(i);
  }


  const deleteTool = async (id) => {
    
    await axios.delete(`http://localhost:4000/tools/${id}`);
    getTools();
  };

  return (
    <div>
      <h1 className="title">Инструменты</h1>
      <h2 className="subtitle">Список инструментов</h2>
      <Link to="/tools/add" className="button is-primary mb-3">
        Добавить
      </Link>
    <table className="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th>№</th>
        <th>Наименование</th>
        <th>Стоимость</th>
        <th>Залог</th>
        <th>Цена за сутки</th>
        <th>Описание</th>
        <th>Создан</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
    {paginatedTools.map((tool,index) => (
        <tr key={tool.id}>
        <td>{indexOfFirstTool + index + 1}</td>
        <td>{tool.name}</td>
        <td>{tool.price}</td>
        <td>{tool.deposit}</td>
        <td>{tool.costPerDay}</td>
        <td>{tool.description}</td>
        <td>{tool.user.name}</td>

        <td style={{ width: '200px' }}>
          <Link
              to={`/tools/edit/${tool.id}`}
              className="button is-small is-info"
            >
              Редактировать
            </Link>
          </td>

        {user && user.role === "admin" && (
        <td>
            <button
              onClick={() => deleteTool(tool.id)}
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

export default ToolList;