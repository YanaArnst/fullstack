import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditClient = () => {

    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [patronomic, setPatronomic] = useState("");
    const [adress, setAdress] = useState("");
    const [phone, setPhone] = useState("");
    const [passport, setPassport] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const {id} = useParams()

    useEffect(() => {
        const getClientById = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/clients/${id}`
            );
            setSurname(response.data.surname)
            setName(response.data.name);
            setPatronomic(response.data.patronomic);
            setAdress(response.data.adress);
            setPhone(response.data.phone);
            setPassport(response.data.passport);
          } catch (error) {
            if (error.response) {
              setMsg(error.response.data.msg);
            }
          }
        };
        getClientById();
      }, [id]);
    
      const updateClient = async (e) => {
        e.preventDefault();
        try {
          await axios.patch(`http://localhost:4000/clients/${id}`, {
            surname: surname,
            name: name,
            patronomic: patronomic,
            adress: adress,
            phone: phone,
            passport: passport
          });
          navigate("/clients");
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          }
        }
      };


  return (
    <div>
        <h1 className='title'>Клиенты</h1>
        <h2 className='subtitle'>Редактировать клиента</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateClient}>
                    <p className="has-text-centered">{msg}</p>
                    <div className="field">
                        <label className="label">Фамилия</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input" 
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Фамилия" />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Имя</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Имя" />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Отчество</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input"
                            value={patronomic}
                            onChange={(e) => setPatronomic(e.target.value)} 
                            placeholder='Отчество' />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Адрес</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input"
                            value={adress}
                            onChange={(e) => setAdress(e.target.value)}
                            placeholder='Адрес' />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Телефон</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}   
                            placeholder='8-***-***-****' />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Паспорт</label>
                        <div className="control">
                            <input 
                            type="text" 
                            className="input" 
                            value={passport}
                            onChange={(e) => setPassport(e.target.value)}  
                            placeholder='**** ******' />
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

export default FormEditClient
                 