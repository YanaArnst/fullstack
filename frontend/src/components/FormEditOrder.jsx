import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const FormEditOrder = () => {

    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState("");
    const [tools, setTools] = useState([]);
    const [toolId, setToolId] = useState("");
    const [dateIssue, setDateIssue] = useState("");
    const [deposit, setDeposit] = useState(0); 
    const [amountDay, setAmountDay] = useState(0);
    const [costPerDay, setCostPerDay] = useState(0);
    const [overdueDay, setOverdueDay] = useState(0);
    const [cost, setCost] = useState(0);
    const [status, setStatus] = useState(false);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const {id} = useParams()

    const calculateCost = (amountDay, costPerDay, overdueDay, deposit) => {
      if (amountDay === null || costPerDay === null || deposit === null) {
        throw new Error('Не все параметры заданы для расчета стоимости');
      }
      const totalCost = (amountDay + overdueDay) * costPerDay - deposit;
      return totalCost > 0 ? totalCost : 0; // Стоимость не может быть отрицательной
    };

    useEffect(() => {
        const getOrderById = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/orders/${id}`);
            setClientId(response.data.clientId)
            setToolId(response.data.toolId);
            setDateIssue(response.data.dateIssue);
            setDeposit(response.data.deposit); // Обновление залога при загрузке заказа
            setAmountDay(response.data.amountDay);
            setCostPerDay(response.data.costPerDay)
            setOverdueDay(response.data.overdueDay);
            setCost(calculateCost(amountDay, costPerDay, overdueDay, deposit));
            setStatus(response.data.status);
          } catch (error) {
            if (error.response) {
              setMsg(error.response.data.msg);
            }
          }
        };
        getOrderById();
      }, [id]);

      const getClients = async () => {
        try {
          const response = await axios.get('http://localhost:4000/clients');
          setClients(response.data);
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          }
        }
      };
      getClients();


      const getTools = async () => {
        try {
          const response = await axios.get('http://localhost:4000/tools');
          setTools(response.data);
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          }
        }
      };
      getTools();


 
      
    const updateOrder = async (e) => {
        e.preventDefault();
        try {
          
            // Вычисление стоимости перед обновлением заказа
            const calculatedCost = calculateCost(amountDay, costPerDay, overdueDay, deposit);
            if (calculatedCost === null || cost === undefined) {
              throw new Error('Стоимость не может быть равна null или undefined');
            }
            setCost(calculatedCost);

          await axios.patch(`http://localhost:4000/orders/${id}`, {
            clientId: clientId,
            toolId: toolId,
            dateIssue: dateIssue,
            deposit: deposit,
            amountDay: amountDay,
            costPerDay: costPerDay,
            overdueDay: overdueDay,
            cost: calculatedCost,
            status: status 
          });
          navigate("/orders");
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          } else {
            console.error(error);
          }
        }
      };


  return (
    <div>
    <h1 className='title'>Заказы</h1>
    <h2 className='subtitle'>Редактировать заказ</h2>
    <div className="card is-shadowless">
        <div className="card-content">
            <div className="content">
            <form onSubmit={updateOrder}>
                <p className="has-text-centered">{msg}</p>
                <div className="field">
                    <label className="label">Клиент</label>
                    <div className="control">
                        <select
                        className="input" 
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}>
                          <option value="">Выберите клиента</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>{`${client.surname} ${client.name} ${client.patronomic}`}</option>
                        ))}
                      </select>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Инструмент</label>
                    <div className="control">
                        <select
                        className="input" 
                        value={toolId}
                        onChange={(e) => setToolId(e.target.value)}>
                          <option value="">Выберите инструмент</option>
                        {tools.map((tool) => (
                          <option key={tool.id} value={tool.id}>{`${tool.name}`}</option>
                        ))}
                      </select>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Дата выдачи</label>
                    <div className="control">
                        <input 
                        type="date" 
                        className="input"
                        value={dateIssue}
                        onChange={(e) => setDateIssue(e.target.value)} 
                        placeholder='Дата выдачи' />
                    </div>
                </div>


                <div className="field">
                    <label className="label">Количество дней</label>
                    <div className="control">
                        <input 
                        type="number" 
                        className="input"
                        value={amountDay}
                        onChange={(e) => setAmountDay(e.target.valueAsNumber)}
                        placeholder='Количество дней' />
                    </div>
                </div>



                <div className="field">
                    <label className="label">Просрочено дней</label>
                    <div className="control">
                        <input 
                        type="number" 
                        className="input"
                        value={overdueDay}
                        onChange={(e) => setOverdueDay(e.target.valueAsNumber)}   
                        placeholder='Просрочено дней' />
                    </div>
                </div>

              

                <div className="field">
                    <label className="label">Статус</label>
                    <div className="control">
                    <div className="select">
                    <select
                      value={status ? 'active' : 'completed'} 
                      onChange={(e) => setStatus(e.target.value === 'active')} // Преобразование строки в булево значение при изменении
                    >
                      <option value="completed">Завершенный</option>
                      <option value="active">Активный</option>
                    </select>
                      </div>
                    </div>
                </div>
               
               
                <div className="field">
                    <div className="control">
                    <button type="submit" className="button is-success">
                        Обновить
                    </button>
                    </div>
                
                </div>   
            </form>
            </div>
        </div>
    </div>
</div>
  )
}

export default FormEditOrder