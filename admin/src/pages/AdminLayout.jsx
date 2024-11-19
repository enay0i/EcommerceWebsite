import React from 'react';
import Sidebar from '../pages/Sidebar';
import Navbar from '../pages/Navbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({setToken}) => {
  return (
    <div className="flex">
      <div className="basis-[16%] h-[100vh]">
        <Sidebar />
      </div>
      <div className="basis-[100%]  overflow-scroll h-[100vh]">
        <Navbar setToken={setToken}/>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
