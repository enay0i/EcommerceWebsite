const DB = require("../../model/product.model");


const deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id; 

    const detail = await DB.OrderDetail.findOne({ productID: productID}); 
    if (detail) {
      return res.status(400).json({
        message: "Product has already been ordered",
        data: detail,
      });
    }

    const deletedProduct = await DB.Product.findByIdAndDelete(productID);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete product:", error);
    return res.status(500).json({ message: error.message });
  }
};

const mongoose = require('mongoose'); 

const updateProduct = async (req, res) => {
  const {id,
    name,
    categoryID,
    new_price,
    old_price,
    number,
    describe,
    sizeID,
    mainImage,
    additionalImages
  } = req.body;

  try {
  
    if (!id||!name || !categoryID || !new_price || !old_price || !number || !describe || !sizeID || !mainImage) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const productID = req.params.id;
    const product = await DB.Product.findById(productID);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name;
    product.categoryID = categoryID;
    product.new_price = new_price;
    product.old_price = old_price;
    product.number = number;
    product.describe = describe;
    product.sizeID = sizeID;
    product.mainImage = mainImage;
    product.additionalImages = additionalImages;

    await product.save(); 

    return res.status(200).json({
      status: "OK",
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return res.status(500).json({ message: error.message });
  }
};




module.exports = {
  deleteProduct,
  updateProduct
};
