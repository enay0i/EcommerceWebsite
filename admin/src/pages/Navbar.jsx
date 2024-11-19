import React, { useContext, useState } from "react";
 import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
 import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";


const DashboardView = ({setToken}) => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

 
  const showProfile = () => {
    setOpen(!open);
  };
 

  return (
    <div className="">
      <div className="flex items-center justify-between h-[70px] shadow-lg px-[25px] ">
        <div className="flex items-center rounded-[5px]">
          <input
            type="text"
            className=" bg-[#F8F9FC] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
            placeholder="Tìm kiếm"
          />
          <div className="bg-[#2e2e2e] h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]">
            { <FaSearch color="white" /> }
          </div>
        </div>
        <div className="flex items-center gap-[20px]">
          <div className="flex items-center gap-[25px] border-r-[1px] pr-[25px]">
             <FaRegBell />
            <FaEnvelope /> 
          </div>
          <div
            className="flex items-center gap-[15px] relative"
            onClick={showProfile}
          >
            <p className="pt-[10px]"></p>
            <div className="h-[50px] w-[50px] bg-[#2e2e2e] cursor-pointer flex items-center justify-center relative z-40">
              <img src={logo} alt="" />
            </div>

            {open && (
              <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[10px]  space-y-[10px]">
                <p className="cursor-pointer hover:text-[gray] font-semibold">
                  Thông Tin
                </p>
                <p className="cursor-pointer hover:text-[gray] font-semibold">
                  Cài Đặt
                </p>
                <p onClick={()=>setToken('')}className="cursor-pointer hover:text-[gray] font-semibold" >
                  Đăng xuất
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
