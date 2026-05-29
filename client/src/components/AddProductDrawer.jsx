import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Package, ChevronDown, Check } from 'lucide-react';
import { useProducts, useCreateProduct } from '../hooks/useProducts';

const AddProductDrawer = ({ isOpen, onClose }) => {
    const [isNewCategory, setIsNewCategory] = useState(false);
    
    const [formData, setFormData] = useState({name: '', category: '', currentQuantity: '', minStockLevel: '', purchasePrice: '', sellingPrice: '', supplier: '', description: ''});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '', category: '', currentQuantity: '', minStockLevel: '',
                purchasePrice: '', sellingPrice: '', supplier: '', description: ''
            });
            setImageFile(null);
            setImagePreview(null);
            setIsNewCategory(false);
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

    const { data: products } = useProducts();
    const { mutate: createProduct, isPending, isError, error } = useCreateProduct();

    const displayCategories = useMemo(() => {
        const defaults = [
            'Pet Food', 
            'Fish & Aquatics', 
            'Birds & Supplies', 
            'Dogs & Cats',
            'Small Pets (Hamsters/Rabbits)',
            'Toys & Accessories', 
            'Health & Grooming'
        ];
        
        if (!products) return defaults;
        
        // Extract unique categories from the user's actual inventory
        const existing = [...new Set(products.map(p => p.category))];
        // Combine and remove duplicates
        return [...new Set([...defaults, ...existing])];
    }, [products]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = new FormData();
        Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
        if (imageFile) submitData.append('images', imageFile);

        createProduct(submitData, {
            onSuccess: () => {
                setFormData({ name: '', category: '', currentQuantity: '', minStockLevel: '', purchasePrice: '', sellingPrice: '', supplier: '', description: '' });
                setImageFile(null);
                setImagePreview(null);
                setIsNewCategory(false);
                onClose();
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    />

                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-panel border-l border-border shadow-2xl z-50 flex flex-col backdrop-blur-2xl"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground flex items-center tracking-tight">
                                <Package className="mr-2 text-brand-500" size={20} />
                                Add New Product
                            </h2>
                            <button onClick={onClose} className="p-2 text-muted hover:text-foreground hover:bg-input rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            
                            {isError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                                    {error.response?.data?.msg || error.response?.data?.message || 'Failed to add product'}
                                </div>
                            )}

                            <form id="addProductForm" onSubmit={handleSubmit} className="space-y-5">
                                {/* Image Upload */}
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
                                    
                                    {/* THE HYBRID CATEGORY TOGGLE */}
                                    {/* THE PREMIUM HYBRID CATEGORY TOGGLE */}
                                    <div className="relative">
                                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Category</label>
                                        {isNewCategory ? (
                                            <div className="flex gap-2">
                                                <input required autoFocus name="category" value={formData.category} onChange={handleChange} className="input-field" placeholder="Type new category..." />
                                                <button type="button" onClick={() => { setIsNewCategory(false); setFormData({...formData, category: ''}); }} className="px-4 bg-input border border-border rounded-xl text-muted hover:text-foreground transition-colors text-sm font-medium">
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                {/* Custom Dropdown Trigger */}
                                                <div className="relative flex-1">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="input-field flex justify-between items-center text-left w-full h-full"
                                                    >
                                                        <span className={formData.category ? "text-foreground" : "text-muted"}>
                                                            {formData.category || "Select a category"}
                                                        </span>
                                                        <ChevronDown size={16} className={`text-muted transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    
                                                    {/* Custom Dropdown Menu */}
                                                    <AnimatePresence>
                                                        {isDropdownOpen && (
                                                            <motion.ul
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar overflow-hidden"
                                                            >
                                                                {displayCategories.map(cat => (
                                                                    <li 
                                                                        key={cat} 
                                                                        onClick={() => {
                                                                            setFormData({...formData, category: cat});
                                                                            setIsDropdownOpen(false);
                                                                        }} 
                                                                        className="px-4 py-3 hover:bg-input cursor-pointer text-sm text-foreground flex items-center justify-between transition-colors border-b border-white/5 last:border-0"
                                                                    >
                                                                        {cat}
                                                                        {formData.category === cat && <Check size={16} className="text-brand-500" />}
                                                                    </li>
                                                                ))}
                                                            </motion.ul>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button type="button" onClick={() => { setIsNewCategory(true); setIsDropdownOpen(false); setFormData({...formData, category: ''}); }} className="px-4 bg-brand-500/10 border border-brand-500/20 text-brand-500 hover:bg-brand-500 hover:text-white rounded-xl transition-colors text-sm font-medium whitespace-nowrap">
                                                    + New
                                                </button>
                                            </div>
                                        )}
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
                                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Min Alert</label>
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

                        <div className="p-6 border-t border-border bg-panel">
                            <button type="submit" form="addProductForm" disabled={isPending} className="btn-primary inner-highlight">
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