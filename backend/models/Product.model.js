import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    },
    purchasePrice: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    minStockLevel: {
        type: Number,
        required: true,
        default: 5,
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