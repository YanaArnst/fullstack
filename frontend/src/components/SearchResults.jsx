import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import OrderDetails from './OrderDetails';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const searchParams = new URLSearchParams(useLocation().search);
  const searchQuery = searchParams.get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/search?query=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Ошибка при получении результатов поиска:', error);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div>
      <h1 className="title">Результаты поиска</h1>
      <aside className= "background" style={{ backgroundColor: 'white' }}>
      <div className="search-results">
        {searchResults.map((client) => (
          <div key={client.id} className="client-card">
            <h2 className="subtitle">{client.surname} {client.name} {client.patronomic}</h2>
            {client.orders && client.orders.map((order) => (
              <div key={order.id} className="order-card mb-3">
                <h3 className="subtitle">Заказ №{order.id}</h3>
                <OrderDetails orderId={order.id} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
    </div>
  );
};

export default SearchResults;