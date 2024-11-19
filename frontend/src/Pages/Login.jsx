import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repass, setRepass] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currentState === 'Sign Up') {
      if (!name || !email || !password || !repass) {
        return toast.error('Vui lòng nhập đầy đủ thông tin');
      }
      if (password !== repass) {
        return toast.error('Mật khẩu không trùng nhau');
      }
      if(name.length>50){
        return toast.error('Vui lòng nhập tên dưới 50 ký tự');
      }
      if(password.length<6){
        return toast.error('Vui lòng nhập mật khẩu trên 6 ký tự');
      }
      try {
        const response = await axios.post('http://localhost:4000/api/user/register', { name, email, password });
        if (response.data.success) {
          toast.success(response.data.message);
          setEmail('');
          setPassword('');
          setName('');
          setRepass('');
          setCurrentState('Login')
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    } else {
      if (!email || !password) {
        return toast.error('Vui lòng nhập đầy đủ thông tin');
      }
      try {
        const response = await axios.post('http://localhost:4000/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3x1'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === 'Login' ? '' : <input type="text" onChange={(e) => setName(e.target.value)} value={name} className='w-full px-3 py-2 border border-gray-800' placeholder='Tên' />}
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-3 py-2 border border-gray-800' placeholder='Email' />
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-3 py-2 border border-gray-800' placeholder='Mật khẩu' />
      {currentState === 'Login' ? '' : <input type="password" onChange={(e) => setRepass(e.target.value)} value={repass} className='w-full px-3 py-2 border border-gray-800' placeholder='Nhập lại mật khẩu' />}
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Quên mật khẩu?</p>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-blue-500'>Tạo tài khoản</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-blue-500'>Đăng nhập</p>
        }
      </div>
      <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4 '>{currentState === 'Login' ? 'Đăng Nhập' : 'Đăng Ký'}</button>
    </form>
  );
}

export default Login;
