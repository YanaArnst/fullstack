import React from 'react';
import fon from "../fon.png";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
        <h1 className='title' style={{ fontSize: '2rem' }}>
          Здравствуйте, {user && user.name}
          </h1>
          <img 
          src={fon} 
          alt="fon"
          style={{ maxWidth: '100%' }} />
    </div>
  );
};

export default Welcome;
