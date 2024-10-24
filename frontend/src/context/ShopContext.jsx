// ShopContext.js
import { createContext, useEffect, useState } from "react";
import axios from "axios"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();
    const delivery_fee=20000;
    const [sizes, setSizes] = useState([]); 
    const [sizeMap, setSizeMap] = useState({}); 
    useEffect(() => {
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

        fetchProducts();
        fetchSizes();
    }, []);

    const addToCart = (itemId, size) => {
        if (!size) {
            toast.error('Vui lòng chọn kích thước cho sản phẩm');
            return;
        }

        // Clone existing cartItems to avoid mutating state directly
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1; // Increase quantity if already in cart
            } else {
                cartData[itemId][size] = 1; // Add new size with quantity 1
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1; // First item added
        }
        setCartItems(cartData);
        toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
    };

    const updateQuantity = (itemId, size, quantity) => {
        if (quantity <= 0) {
            // Remove item if quantity is zero
            const updatedCart = { ...cartItems };
            delete updatedCart[itemId][size];
            if (Object.keys(updatedCart[itemId]).length === 0) {
                delete updatedCart[itemId];
            }
            setCartItems(updatedCart);
        } else {
            // Update quantity if greater than zero
            const updatedCart = { ...cartItems };
            if (updatedCart[itemId]) {
                updatedCart[itemId][size] = quantity;
                setCartItems(updatedCart);
            }
        }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((count, item) => {
            return count + Object.values(item).reduce((itemCount, quantity) => itemCount + quantity, 0);
        }, 0);
    };

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const product = products.find(product => product._id === itemId);
            if (product) {
                total += Object.entries(sizes).reduce((sum, [size, quantity]) => {
                    return sum + (product.new_price * quantity);
                }, 0);
            }
            return total;
        }, 0);
    };

    const value = {
        products,
        sizes,
        sizeMap, 
        delivery_fee,
        cartItems,
        addToCart,
        updateQuantity,
        getCartCount,
        getCartAmount,
        navigate
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
