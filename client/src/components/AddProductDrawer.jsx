import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Package } from 'lucide-react';
import { useCreateProduct } from '../hooks/useProducts';

const AddProductDrawer = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({name: '', category: 'Food', currentQuantity: '', minStockLevel: '',purchasePrice: '', sellingPrice: '', supplier: '', description: ''});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { mutate: createProduct, isPending, isError, error } = useCreateProduct();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Show preview instantly
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Because of the image, we must construct a FormData object (not standard JSON)
        const submitData = new FormData();
        Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
        if (imageFile) submitData.append('images', imageFile);

        createProduct(submitData, {
            onSuccess: () => {
                setFormData({ name: '', category: 'Food', currentQuantity: '', minStockLevel: '', purchasePrice: '', sellingPrice: '', supplier: '', description: '' });
                setImageFile(null);
                setImagePreview(null);
                onClose();
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    />

                    {/* Sliding Drawer */}
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-panel border-l border-border shadow-2xl z-50 flex flex-col backdrop-blur-2xl"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground flex items-center">
                                <Package className="mr-2 text-brand-500" size={20} />
                                Add New Product
                            </h2>
                            <button onClick={onClose} className="p-2 text-muted hover:text-foreground hover:bg-input rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            
                            {isError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                                    {error.response?.data?.msg || error.response?.data?.message || 'Failed to add product'}
                                </div>
                            )}

                            <form id="addProductForm" onSubmit={handleSubmit} className="space-y-5">
                                {/* Image Upload Area */}
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-2">Product Image</label>
                                    <div className="relative h-40 w-full rounded-xl border-2 border-dashed border-border hover:border-brand-500 bg-input/50 flex flex-col items-center justify-center transition-colors overflow-hidden group cursor-pointer">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="text-muted group-hover:text-brand-500 mb-2 transition-colors" size={24} />
                                                <span className="text-sm text-muted group-hover:text-foreground transition-colors">Click to upload image</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Product Name</label>
                                        <input required name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="e.g. Premium Dog Kibble" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Category</label>
                                        <select required name="category" value={formData.category} onChange={handleChange} className="input-field appearance-none">
                                            <option value="Food">Food & Treats</option>
                                            <option value="Toys">Toys & Accessories</option>
                                            <option value="Medicine">Health & Medicine</option>
                                            <option value="Grooming">Grooming</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Cost (₹)</label>
                                            <input required type="number" min="0" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="input-field" placeholder="0" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Price (₹)</label>
                                            <input required type="number" min="0" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="input-field" placeholder="0" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Initial Stock</label>
                                            <input required type="number" min="0" name="currentQuantity" value={formData.currentQuantity} onChange={handleChange} className="input-field" placeholder="0" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Min Stock Alert</label>
                                            <input required type="number" min="0" name="minStockLevel" value={formData.minStockLevel} onChange={handleChange} className="input-field" placeholder="5" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Supplier Name</label>
                                        <input required name="supplier" value={formData.supplier} onChange={handleChange} className="input-field" placeholder="Supplier Company Ltd." />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Description (Optional)</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none h-24" placeholder="Product details..." />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Fixed Footer */}
                        <div className="p-6 border-t border-border bg-panel">
                            <button 
                                type="submit" 
                                form="addProductForm" 
                                disabled={isPending}
                                className="btn-primary inner-highlight"
                            >
                                {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Save Product'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddProductDrawer;