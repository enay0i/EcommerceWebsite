// ShopContext.js
import { createContext, useEffect, useState } from "react";
import axios from "axios"; 
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
export const ShopContext = createContext();
import { jwtDecode } from "jwt-decode";
const ShopContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();
    const delivery_fee=20000;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [sizes, setSizes] = useState([]); 
    const [sizeMap, setSizeMap] = useState({}); 
    const[discount,setDiscount]=useState(0);
    const[priceDiscount,setPriceDiscount]=useState(0);
    const[price,setPrice]= useState(0);
    const[voucherIDD,setVoucherID]=useState(null);
    const[token,setToken]=useState('');
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/productList/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    const fetchSizes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/productList/sizes');
            setSizes(response.data);
            const map = {};
            response.data.forEach(size => {
                map[size._id] = size.sizeName; 
            });
            setSizeMap(map);
        } catch (error) {
            console.error("Error fetching sizes:", error);
        }
    };
    useEffect(() => {

        fetchProducts();
        fetchSizes();
    }, []);

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.id;
        }
        return null;
    };
    const addToCart = async (itemId, size) => {
        console.log(size.sizeID+" adu")
        if (!size) {
          toast.error('Vui lòng chọn kích thước cho sản phẩm');
          return;
        }
        
        if (!token) {
          navigate("/login");
          toast.error("Vui lòng đăng nhập trước");
          return;
        }
      
        const cartData = structuredClone(cartItems);
        cartData[itemId] = cartData[itemId] || {};
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
      
        setCartItems(cartData);
        toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
      
        try {
          await axios.post("http://localhost:4000/api/cart/add", { itemId, size }, { headers: { token } });
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      };
    

    // const updateQuantity = (itemId, size, quantity) => {
    //     if (quantity <= 0) {
    //         const updatedCart = { ...cartItems };
    //         delete updatedCart[itemId][size];
    //         if (Object.keys(updatedCart[itemId]).length === 0) {
    //             delete updatedCart[itemId];
    //         }
    //         setCartItems(updatedCart);
    //     } else {
    //         // Update quantity if greater than zero
    //         const updatedCart = { ...cartItems };
    //         if (updatedCart[itemId]) {
    //             updatedCart[itemId][size] = quantity;
    //             setCartItems(updatedCart);
    //         }
    //     }

    // };
    const updateQuantity = async (itemId, size, quantity) => {
        const productData = products.find((product) => product._id === itemId);
        
        if (!productData) {
          toast.error("Sản phẩm không tìm thấy.");
          return;
        }
        const selectedSize = productData.size.find(a => a.sizeID._id === size);
        console.log(selectedSize, "chan qua di");
        if (!selectedSize || quantity > selectedSize.quantity) {
          toast.error(`Sản phẩm này trong kho chỉ còn lại: ${selectedSize ? selectedSize.quantity : 0}`);
          return;
        }
        const updatedCart = { 
          ...cartItems, 
          [itemId]: { 
            ...cartItems[itemId], 
            [size]: quantity 
          } 
        };
        setCartItems(updatedCart);
        if (token) {
          try {
            await axios.post("http://localhost:4000/api/cart/update", { itemId, size, quantity }, { headers: { token } });
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }
      };
      
    
      

const getUserCart=async(token)=>{
    try {
        const response =await axios.post('http://localhost:4000/api/cart/get',{},{headers:{token}})
        if(response.data.success)
        {
            setCartItems(response.data.cartData)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}
    const getCartCount = () => {
        return Object.values(cartItems).reduce((count, item) => {
            return count + Object.values(item).reduce((itemCount, quantity) => itemCount + quantity, 0);
        }, 0);
    };

    const getCartAmount = () => {
        let total = Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const product = products.find(product => product._id === itemId);
            if (product) {
                total += Object.entries(sizes).reduce((sum, [size, quantity]) => {
                    return sum + (product.new_price * quantity);
                }, 0);
            }
            return total;
        }, 0);
        setPrice(total);
        let finalPrice = total;
        if (discount !== 0) {
            const discountAmount = total * discount; 
            setPriceDiscount(discountAmount);
            finalPrice = total - discountAmount; 
        }
        return finalPrice + delivery_fee;
    };
    
useEffect(()=>
{
    if(!token&&localStorage.getItem('token')){
setToken(localStorage.getItem('token'));
getUserCart(localStorage.getItem('token'))
    }
},[])
    const value = {
        products,
        sizes,
        sizeMap, 
        delivery_fee,
        cartItems,
        discount,
        priceDiscount,
        price,
        voucherIDD,
        setVoucherID,
        addToCart,
        updateQuantity,
        getCartCount,
        getCartAmount,
        navigate,
        setCartItems,
        setDiscount,
        setToken,token,
        getUserCart,
        showSearch,         
        setShowSearch,
        search,
        setSearch,
        getUserIdFromToken,
        fetchProducts,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
