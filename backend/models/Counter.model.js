import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true
    }, 
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    }, 
    seq: { 
        type: Number, 
        default: 1000 
    } 
});

// Ensures one sequence tracker per owner, per ID type
counterSchema.index({ id: 1, ownerId: 1 }, { unique: true });

export default mongoose.model('Counter', counterSchema);