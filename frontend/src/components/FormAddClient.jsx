import React, { useState }  from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";


const FormAddClient = () => {

    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [patronomic, setPatronomic] = useState("");
    const [adress, setAdress] = useState("");
    const [phone, setPhone] = useState("");
    const [passport, setPassport] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    

    const saveClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/clients", {
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
        <h2 className='subtitle'>Добавить нового клиента</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={saveClient}>
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
                                Сохранить
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

export default FormAddClient