import React, { useState, useEffect } from 'react';
import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { ExportToExcel } from '../components/ExportToExcel';
import SalesTable from './SaleTable';
const Main = ({ token }) => {
    const fileName = 'BaoCaoDoanhThu';
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [dailyProfit, setDailyProfit] = useState(0);
    const [annualProfit, setAnnualProfit] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]);
    const [orderCount, setOrderCount] = useState(0);

    const formatToVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:4000/orderList/allorders');
                const data = response.data;
                setOrderCount(data.length);

                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const today = currentDate.toISOString().split('T')[0];

                const monthlyRevenueCurrentYear = Array(12).fill(0);
                const monthlyRevenuePreviousYear = Array(12).fill(0);
                let dailyRevenue = 0;
                let annualRevenue = 0;
                let totalRevenueAllTime = 0;

                data.forEach(order => {
                    const orderDate = new Date(order.dateCreate);
                    const month = orderDate.getMonth();
                    const year = orderDate.getFullYear();
                    const totalPrice = order.guestInfo ? order.guestInfo.totalMoney : 0;

                    if (orderDate.toISOString().split('T')[0] === today) {
                        dailyRevenue += totalPrice;
                    }

                    if (year === currentYear) {
                        monthlyRevenueCurrentYear[month] += totalPrice;
                        annualRevenue += totalPrice;
                    } else if (year === currentYear - 1) {
                        monthlyRevenuePreviousYear[month] += totalPrice;
                    }

                    totalRevenueAllTime += totalPrice;
                });

                const chartData = Array.from({ length: 12 }, (_, i) => ({
                    month: new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(currentYear, i)),
                    currentYear: monthlyRevenueCurrentYear[i],
                    previousYear: monthlyRevenuePreviousYear[i],
                }));

                setDailyProfit(dailyRevenue);
                setAnnualProfit(annualRevenue);
                setTotalRevenue(totalRevenueAllTime);
                setMonthlyData(chartData);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className='px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]'>
            <div className='flex items-center justify-between'>
                <h1 className='text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer'>Trang Chủ</h1>
                <ExportToExcel apiData={monthlyData} fileName={fileName} />
            </div>
            <div className='grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]'>
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#2e2e2e] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold'>LỢI NHUẬN HÔM NAY</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatToVND(dailyProfit)}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>LỢI NHUẬN (THEO NĂM)</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatToVND(annualProfit)}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#36B9CC] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>TỔNG DOANH THU</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatToVND(totalRevenue)}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>TRÊN TỔNG SỐ ĐƠN</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{orderCount}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
            </div>
            <div className='flex mt-[22px] w-full gap-[30px] mb-4'>
                <div className='basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#2e2e2e] text-[16px] leading-[19px] font-bold'>LỢI NHUẬN TỔNG QUAN</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>

                    <div className="w-full">
                        <LineChart
                            width={1220}
                            height={500}
                            data={monthlyData}
                            margin={{
                                top: 5,
                                right: 40,
                                left: 40,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={tick => formatToVND(tick)} />
                            <Tooltip formatter={(value) => [formatToVND(value), 'Doanh thu']} />
                            <Legend />
                            <Line type="monotone" dataKey="currentYear" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh thu năm hiện tại" />
                            <Line type="monotone" dataKey="previousYear" stroke="#82ca9d" name="Doanh thu năm trước" />
                        </LineChart>
                    </div>
                </div>
            </div>
            <SalesTable/>
        </div>
    );
};

export default Main;
