import React, { useEffect, useState } from 'react';
import { Spin, Alert } from 'antd';
import { useGet } from "../hook/hook"; // Adjust path as necessary
import ProductItem from './ProductItem';
import Title from './Title';
import { Link } from 'react-router-dom';
const RelatedProducts = ({ category }) => {
    const { data: products, error: producterror, loading: productload } = useGet("http://localhost:4000/productList/products");
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0 && category) {
            const filteredProducts = products.filter((item) =>
                item.categoryID?.includes(category)
            );
            setRelated(filteredProducts.slice(0, 5)); 
        }
    }, [products, category]);

    if (productload) {
        return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
    }

    if (producterror) {
        return (
            <Alert
                message="Error"
                description="Failed to load related products."
                type="error"
                showIcon
            />
        );
    }

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1={'SẢN PHẨM'} text2={'LIÊN QUAN'} />
            </div>
          
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {related.length > 0 ? (
                    related.map((item, index) => (
                      <Link to={`/product/${item._id}`}>
                        <ProductItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            price={item.new_price}
                            image={item.mainImage}
                        />
                        </Link>
                    ))
                ) : (
                    <p>No related products found.</p>
                )}
            </div>
        </div>
    );
};

export default RelatedProducts;
