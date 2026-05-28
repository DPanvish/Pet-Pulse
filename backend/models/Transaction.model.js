import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    type: {
        type: String,
        enum: ["inflow", "outflow"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    previousStock: {
        type: Number,
        required: true,
        min: 0,
    },
    newStock: {
        type: Number,
        required: true,
        min: 0,
    },
    notes: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

export default mongoose.model("Transaction", transactionSchema);