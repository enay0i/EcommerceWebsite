import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user/admin', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <ToastContainer />
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className="text-sm font-medium text-gray-700 mb-2 text-left">Địa chỉ email:</p>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none" 
              type='email' 
              placeholder='youremail@gmail.com' 
              required 
            />
          </div>
          <div className='mb-3 min-w-72'>
            <p className="text-sm font-medium text-gray-700 mb-2 text-left">Mật khẩu:</p>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none" 
              type='password' 
              placeholder='Điền mật khẩu' 
              required 
            />
          </div>
          <button type='submit' className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black'>Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;