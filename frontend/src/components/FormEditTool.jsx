import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditTool = () => {


    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [costPerDay, setCostPerDay] = useState(0);
    const [description, setDescription] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();


    useEffect(() => {
        const getToolById = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/tools/${id}`);
            setName(response.data.name);
            setPrice(response.data.price);
            setDeposit(response.data.deposit);
            setCostPerDay(response.data.costPerDay);
            setDescription(response.data.description);
          } catch (error) {
            if (error.response) {
              setMsg(error.response.data.msg);
            }
          }
        };
        getToolById();
      }, [id]);
    
      const updateTool = async (e) => {
        e.preventDefault();
        try {
          await axios.patch(`http://localhost:4000/tools/${id}`, {
            name: name,
            price: price,
            deposit: deposit,
            costPerDay: costPerDay,
            description: description
          });
          navigate("/tools");
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          }
        }
      };



  return (
    <div>
        <h1 className='title'>Инструменты</h1>
        <h2 className='subtitle'>Редактировать инструмент</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateTool}>
                    <p className="has-text-centered">{msg}</p>
                    <div className="field">
                        <label className="label">Наименование</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Наименование" />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Цена</label>
                        <div className="control">
                            <input 
                            type="number" 
                            className="input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)} 
                            placeholder="Цена" />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Залог</label>
                        <div className="control">
                            <input 
                            type="number" 
                            className="input"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)} 
                            placeholder='Залог' />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Цена за сутки</label>
                        <div className="control">
                            <input 
                            type="number" 
                            className="input"
                            value={costPerDay}
                            onChange={(e) => setCostPerDay(e.target.value)} 
                            placeholder='Цена за сутки' />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Описание</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Описание' />
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

export default FormEditTool