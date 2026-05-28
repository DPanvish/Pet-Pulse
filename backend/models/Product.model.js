import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
    },
    SKU: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    currentQuantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    purchasePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    minStockLevel: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    supplier: {
        type: String,
    },
    images: [{
        type: String,
    }],
    description: {
        type: String,
    }
}, {timestamps: true});

export default mongoose.model("Product", productSchema);