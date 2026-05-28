import Product from "../models/product.model.js";

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try{
        const {name, category, currentQuantity, purchasePrice, sellingPrice, minStockLevel, supplier, description} = req.body;

        // Auto-generate a unique SKU (e.g., PET-DOG-123456)
        const prefix = category.substring(0, 3).toUpperCase();
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const SKU = `${prefix}-${randomNum}`;

        const product = await Product.create({
            name,
            category,
            SKU,
            currentQuantity,
            purchasePrice,
            sellingPrice,
            minStockLevel,
            supplier,
            description
        })

        res.status(201).json(product);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async(req, res) => {
    try{
        const products = await Product.find({}).sort({created: -1});
        res.status(200).json(products);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Get items with low stock
// @route   GET /api/products/low-stock
export const getLowStockProducts = async(req, res) => {
    try {
        const lowStockItems = await Product.find({
            $expr: {$lte: ["$currentQuantity", "$minStockLevel"]}
        });

        res.status(200).json(lowStockItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async(req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200).json(product);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async(req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200).json({message: "Product deleted successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};