import mongoose from "mongoose";
import Sale from "../models/Sale.model.js";
import Product from "../models/Product.model.js";
import Transaction from "../models/Transaction.model.js";

// @desc    Create a new sale (POS Checkout)
// @route   POST /api/sales
export const createSale = async (req, res) => {
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            const {products, discount = 0, tax = 0, paymentMethod} = req.body;

            if(!products || products.length === 0){
                return res.status(400).json({ message: "No items in the cart" });
            }

            let totalAmount = 0;
            const processedProducts = [];

            for(const item of products){
                const product = await Product.findOne({_id: item.product, ownerId: req.user._id}).session(session);

                if (!product) {
                    return res.status(404).json({ message: `Product not found or unauthorized: ${item.product}` });
                }

                if(product.currentQuantity < item.quantity){
                    return res.status(400).json({
                        msg: `Insufficient stock for ${product.name}. Only ${product.currentQuantity} left.`
                    });
                }

                const itemTotal = product.sellingPrice * item.quantity;
                totalAmount += itemTotal;

                processedProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    sellingPriceAtTimeOfSale: product.sellingPrice,
                    purchasePriceAtTimeOfSale: product.purchasePrice
                });
            }

            const finalAmount = (totalAmount - discount) + tax;
            const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

            const [sale] = await Sale.create([{
                ownerId: req.user._id, 
                invoiceNumber,
                products: processedProducts,
                totalAmount: finalAmount,
                discount,
                tax,
                paymentMethod,
                soldBy: req.user._id
            }], { session });

            for(const item of products){
                const product = await Product.findOne({_id: item.product, ownerId: req.user._id}).session(session);
                const previousStock = product.currentQuantity;
                const newStock = previousStock - item.quantity;

                const stockUpdate = await Product.updateOne(
                    { _id: product._id, currentQuantity: { $gte: item.quantity } },
                    { $inc: { currentQuantity: -item.quantity } },
                    { session }
                );

                if(stockUpdate.modifiedCount !== 1){
                    throw new Error(`Concurrent stock update failed for ${product._id}`);
                }

                await Transaction.create([{
                    ownerId: req.user._id,
                    product: product._id,
                    type: 'outflow',
                    quantity: item.quantity,
                    previousStock,
                    newStock,
                    notes: `Sold in invoice ${invoiceNumber}`,
                    createdBy: req.user._id
                }], { session });
            }
            
            await session.commitTransaction();
            res.status(201).json(sale);
        }catch (err){
            await session.abortTransaction();
            throw err;
        }finally{
            session.endSession();
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all sales history (with optional date filtering)
// @route   GET /api/sales
export const getSales = async (req, res) => {
    try{
        const sales = await Sale.find({ ownerId: req.user._id })
            .populate('products.product', 'name SKU images')
            .sort({ createdAt: -1 });

        res.status(200).json(sales);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get a single sale by ID (For printing receipts)
// @route   GET /api/sales/:id
export const getSaleById = async (req, res) => {
    try{
        const sale = await Sale.findOne({ _id: req.params.id, ownerId: req.user._id })
            .populate('products.product', 'name SKU images')
            .populate('soldBy', 'name email');

        if(!sale){
            return res.status(404).json({ message: "Sale not found or unauthorized" });
        }

        res.status(200).json(sale);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};