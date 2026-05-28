import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        sellingPriceAtTimeOfSale: {
            type: Number,
            required: true,
            min: 0,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    tax: {
        type: Number,
        default: 0,
        min: 0,
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card", "Upi"],
        required: true,
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

export default mongoose.model("Sale", saleSchema);