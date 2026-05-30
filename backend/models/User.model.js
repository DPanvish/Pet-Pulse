import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    address: { 
        type: String, 
        required: true 
    },
    shopName: { 
        type: String, 
        required: true 
    },
    avatar: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    loginHistory: [{
        loginTime: {
            type: Date,
            default: Date.now,
        },
        ipAddress: String,
    }]
}, {timestamps: true});

export default mongoose.model("User", userSchema);