import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
const Verify = () => {
    const {navigate,token,setCartItems, getUserIdFromToken,getUserCart}=useContext(ShopContext)
    const [searchParams,setSearchParams]=useSearchParams()
    const success=searchParams.get('success')
    const orderId=searchParams.get('orderId')
    const cusID=getUserIdFromToken();
    const verifyPayment=async()=>{
try {
    if(!token){
        return null
    }
    const response =await axios.post(`http://localhost:4000/orderList/verifyStripe`,{success,orderId},{headers:{token}})
    if(response.data.success){
        await axios.post(`http://localhost:4000/api/cart/clear/${cusID}`);
        getUserCart(localStorage.getItem('token'));
    navigate('/orders')
    }
    else{
        navigate('/cart')
    }
} catch (error) {
    console.log(error)
    toast.error(error.message)
}
    }
    useEffect(() => {
        if (success === 'false') {
            verifyPayment();
        } else if (success === 'true') {
            verifyPayment();
        } else {
            navigate('/cart');
        }
    }, [success, orderId, token, navigate, setCartItems]);
  return (
    <div>Verify</div>
  )
}

export default Verify