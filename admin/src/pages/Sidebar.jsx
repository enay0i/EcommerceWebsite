import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaRegSun,
  FaCalendar,
  FaChevronRight,
  FaCartPlus,
  FaFileInvoice,
  FaTicketAlt
} from "react-icons/fa";
import "../App.css";

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
  <Link
    to={to}
    className={`no-underline flex items-center justify-between pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
      active ? "bg-white text-black" : "text-white"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-[10px] my-3">
      <Icon color={active ? "black" : "white"} />
      <p className="text-[14px] leading-[20px] font-normal">{label}</p>
    </div>
    <FaChevronRight className="pr-2" color={active ? "black" : "white"} />
  </Link>
);

const Sidebar = () => {
  const defaultActiveItem = "Trang Chủ";
  const [activeItem, setActiveItem] = useState(defaultActiveItem);

  useEffect(() => {
    const ActiveItem = localStorage.getItem("activeItem");
    if (ActiveItem) {
      setActiveItem(ActiveItem);
    }
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
    localStorage.setItem("activeItem", item); 
  };

  const manageItems = [
    { label: "Sản Phẩm", to: "product", icon: FaCartPlus },
    { label: "Khách Hàng", to: "customer", icon: FaUser },
    { label: "Voucher", to: "voucher", icon: FaTicketAlt },
    { label: "Đơn Hàng", to: "order", icon: FaFileInvoice },
  ];

  const addonItems = [
    { label: "Lịch Làm Việc", to: "", icon: FaCalendar },
    { label: "Cài Đặt", to: "", icon: FaRegSun },
  ];

  return (
    <div className="bg-[#2e2e2e] h-full">
      <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
        <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
          OIOIOI
        </h1>
      </div>
      <SidebarItem
        label="Trang Chủ"
        to=""
        icon={FaTachometerAlt}
        active={activeItem === defaultActiveItem}
        onClick={() => handleItemClick(defaultActiveItem)}
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
