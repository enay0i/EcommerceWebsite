import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaRegSun,
  FaCalendar,
  FaChevronRight,
  FaCartPlus,
FaListAlt 
} from "react-icons/fa";
import "../App.css";
import { FaHand } from "react-icons/fa6";

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
  <Link
    to={to}
    className={`no-underline flex items-center justify-between pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
      active ? "bg-white text-[#EE6B6B]" : "text-white"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-[10px] my-3">
      <Icon color={active ? "#EE6B6B" : "white"} />
      <p className="text-[14px] leading-[20px] font-normal">{label}</p>
    </div>
    <FaChevronRight className="pr-2" color={active ? "#EE6B6B" : "white"} />
  </Link>
);

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const manageItems = [
    { label: "Sản Phẩm", to: "product", icon: FaCartPlus },
    { label: "Danh Mục", to: "category", icon: FaListAlt },
    { label: "Khách Hàng", to: "", icon: FaUser },
    { label: "Voucher", to: "", icon: FaUser },
    { label: "Kích Thuớc", to: "", icon: FaUser },
  ];

  const addonItems = [
    { label: "Calendar", to: "", icon: FaCalendar },
    { label: "Settings", to: "", icon: FaRegSun },
  ];

  return (
    <div className="bg-[#EE6B6B] h-full">
      <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
        <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
          SHOPPER
        </h1>
      </div>
      <SidebarItem
        label="Dashboard"
        to=""
        icon={FaTachometerAlt}
        active={activeItem === "Dashboard"}
        onClick={() => handleItemClick("Dashboard")}
      />
      <div className="pt-[15px] border-t-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">MANAGE</p>
      </div>

      {manageItems.map((item) => (
        <SidebarItem
          key={item.label}
          {...item}
          active={activeItem === item.label}
          onClick={() => handleItemClick(item.label)}
        />
      ))}
      <div className="pt-[5px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">ADDONS</p>
      </div>

      {addonItems.map((item) => (
        <SidebarItem
          key={item.label}
          {...item}
          active={activeItem === item.label}
          onClick={() => handleItemClick(item.label)}
        />
      ))}
    </div>
  );
};

export default Sidebar;
