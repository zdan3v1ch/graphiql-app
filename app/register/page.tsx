'use client';

import { useState } from 'react';
import './page.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const register = async () => {
    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  };

  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="register__btn"
          onClick={() => {
            void (async () => {
              await register();
            })();
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
export default Register;
