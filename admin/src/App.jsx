import { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './pages/AdminLayout';
import DashboardView from './pages/DashboardView';
import ProductAdmin from './pages/Products/ProductAdmin';
import OrderAdmin from './pages/Orders/OrderAdmin';
import Login from './pages/Login';
import CustomersList from './pages/Customer/CustomerList';
import VoucherTable from './pages/Vouchers/Voucher';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
    console.log("Token la:", localStorage.getItem('token')); 
  }, [token]);

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          {token === "" ? (
            <Route path="*" element={<Navigate to="/login" replace />} />
          ) : (
            <Route
              path="/"
              element={<AdminLayout setToken={setToken} />}
            >
              <Route index element={<DashboardView token={token} />} />
              <Route path="product" element={<ProductAdmin token={token} />} />
              <Route path="order" element={<OrderAdmin token={token}/>} />
              <Route path='customer' element={<CustomersList token={token}/>}/>
              <Route path='voucher' element={<VoucherTable token={token}/>}/>
            </Route>
          )}
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
