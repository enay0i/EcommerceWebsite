import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (currentState === 'Login') {
      await handleLogin();
    } else {
      await handleSignUp();
    }
  };

  // Validation function (same as before)
  const validateForm = () => {
    let formErrors = {};
    if (currentState === 'Sign Up' && !formData.name.trim()) {
      formErrors.name = 'Name is required';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
    }
    if (currentState === 'Sign Up' && formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    return formErrors;
  };

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      alert('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Server error. Please try again later.');
    }
  };

  // Handle Sign Up (same as before)
  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Sign Up failed');
      }

      alert('Registration successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('Server error. Please try again later.');
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3x1'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Sign Up' && (
        <>
          <input
            type="text"
            name="name"
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-800'}`}
            placeholder='Tên'
            value={formData.name}
            onChange={onChangeHandler}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </>
      )}

      <input
        type="email"
        name="email"
        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-800'}`}
        placeholder='Email'
        value={formData.email}
        onChange={onChangeHandler}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <input
        type="password"
        name="password"
        className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-800'}`}
        placeholder='Mật khẩu'
        value={formData.password}
        onChange={onChangeHandler}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      {currentState === 'Sign Up' && (
        <input
          type="password"
          name="confirmPassword"
          className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-800'}`}
          placeholder='Xác nhận mật khẩu'
          value={formData.confirmPassword}
          onChange={onChangeHandler}
        />
      )}
      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

      <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md">
        {currentState === 'Login' ? 'Login' : 'Sign Up'}
      </button>

      <div className="mt-4">
        {currentState === 'Sign Up' ? (
          <p>
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={() => setCurrentState('Login')}>
              Login here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={() => setCurrentState('Sign Up')}>
              Sign Up here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
