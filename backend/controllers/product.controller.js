import Product from "../models/Product.model.js";

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try{
        const {name, category, currentQuantity, purchasePrice, sellingPrice, minStockLevel, supplier, description} = req.body;

        // Auto-generate a unique SKU (e.g., PET-DOG-123456)
        const prefix = category.substring(0, 3).toUpperCase();
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const SKU = `${prefix}-${randomNum}`;

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        }

        const product = await Product.create({
            name,
            category,
            SKU,
            currentQuantity,
            purchasePrice,
            sellingPrice,
            minStockLevel,
            supplier,
            description,
            images: imageUrls
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
        const { search, category } = req.query;
        let queryObj = {},

        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: 'i' } },
                { SKU: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            queryObj.category = category;
        }

        const products = await Product.find(queryObj).sort({createdAt: -1});
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
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        let existingImages = [];
        if (req.body.existingImages) {
            existingImages = Array.isArray(req.body.existingImages) 
                ? req.body.existingImages 
                : [req.body.existingImages];
        }

        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => file.path); 
        }

        let finalImages = product.images; 

        if (req.body.existingImages !== undefined || newImages.length > 0) {
            finalImages = [...existingImages, ...newImages];
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                ...req.body,      
                images: finalImages 
            }, 
            { 
                new: true,        
                runValidators: true 
            }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
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