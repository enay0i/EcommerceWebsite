import React, { useEffect, useState } from 'react';
import { useGet } from "../hook/hook";
import { Table, Spin, Alert, Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {Modal} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';

const ModalDelete = ({ open, onClose, onConfirm,header }) => {
  return (
    <Modal open={open} className="justify-center items-center" footer={null}  closable={false}>
    <div className="text-center">
  
      <div className="mx-auto my-4 w-48">
        <h3 className="text-lg font-black text-gray-600">Xóa {header}</h3>
        <p className="text-sm text-gray-500">
          Bạn có chắc là muốn xóa {header} này chứ ?
        </p>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <button className="btn btn-danger  w-1/4 h-full items-center bg-red-600 text-white hover:bg-red-300 rounded-full"  onClick={onConfirm}>Xóa</button>
        <button
          className="btn btn-light w-1/4 h-full items-center bg-black text-white hover:bg-gray-500 rounded-full"
          onClick={onClose}
        >
          Hủy
        </button>
      </div>
    </div>
  </Modal>
  );
};


export default ModalDelete;
