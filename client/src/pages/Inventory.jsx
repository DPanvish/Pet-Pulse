import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MoreVertical, AlertCircle, PackageOpen, Loader2, ChevronDown, Check } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import AddProductDrawer from '../components/AddProductDrawer';


const Inventory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const { data: products, isLoading, isError } = useProducts(searchQuery, categoryFilter);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
    };

    const displayCategories = useMemo(() => {
        const defaults = [
            'Pet Food', 'Fish & Aquatics', 'Birds & Supplies', 
            'Dogs & Cats', 'Small Pets (Hamsters/Rabbits)',
            'Toys & Accessories', 'Health & Grooming'
        ];
        if (!products) return defaults;
        const existing = [...new Set(products.map(p => p.category))];
        return [...new Set([...defaults, ...existing])];
    }, [products]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Inventory</h1>
                    <p className="text-muted mt-1">Manage your store's products, pricing, and stock levels.</p>
                </div>
                <button 
                    onClick={() => setIsDrawerOpen(true)} // Added onClick!
                    className="btn-primary w-auto px-6 whitespace-nowrap"
                >
                    <Plus size={18} className="mr-2" />
                    Add Product
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by product name or SKU..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field"
                    />
                </div>
                
                <div className="relative min-w-[220px]">
                    <button 
                        type="button" 
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="input-field flex justify-between items-center text-left w-full pl-10"
                    >
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <span className={categoryFilter ? "text-foreground" : "text-muted"}>
                            {categoryFilter || "All Categories"}
                        </span>
                        <ChevronDown size={16} className={`text-muted transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar overflow-hidden"
                            >
                                {/* Option to clear the filter */}
                                <li 
                                    onClick={() => {
                                        setCategoryFilter('');
                                        setIsCategoryOpen(false);
                                    }} 
                                    className="px-4 py-3 hover:bg-input cursor-pointer text-sm text-foreground flex items-center justify-between transition-colors border-b border-white/5"
                                >
                                    All Categories
                                    {categoryFilter === '' && <Check size={16} className="text-brand-500" />}
                                </li>
                                
                                {/* Dynamic Categories */}
                                {displayCategories.map(cat => (
                                    <li 
                                        key={cat} 
                                        onClick={() => {
                                            setCategoryFilter(cat);
                                            setIsCategoryOpen(false);
                                        }} 
                                        className="px-4 py-3 hover:bg-input cursor-pointer text-sm text-foreground flex items-center justify-between transition-colors border-b border-white/5 last:border-0"
                                    >
                                        {cat}
                                        {categoryFilter === cat && <Check size={16} className="text-brand-500" />}
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass-panel inner-highlight rounded-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-input/50">
                                <th className="py-4 px-6 text-sm font-semibold text-muted">Product</th>
                                <th className="py-4 px-6 text-sm font-semibold text-muted">Category</th>
                                <th className="py-4 px-6 text-sm font-semibold text-muted">Stock Level</th>
                                <th className="py-4 px-6 text-sm font-semibold text-muted">Price</th>
                                <th className="py-4 px-6 text-sm font-semibold text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <Loader2 className="animate-spin mx-auto text-brand-500 mb-2" size={32} />
                                        <p className="text-muted text-sm">Loading inventory...</p>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-red-500">
                                        Failed to load products. Please check your connection.
                                    </td>
                                </tr>
                            ) : products?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center">
                                        <PackageOpen className="mx-auto text-muted mb-4 opacity-50" size={48} />
                                        <h3 className="text-lg font-medium text-foreground">No products found</h3>
                                        <p className="text-muted text-sm mt-1">Adjust your search or add a new product.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        key={product._id} 
                                        className="border-b border-border hover:bg-input/50 transition-colors group"
                                    >
                                        {/* Product Image & Details */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-background rounded-lg border border-border overflow-hidden flex items-center justify-center">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <PackageOpen size={20} className="text-muted" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-foreground group-hover:text-brand-500 transition-colors">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-muted">{product.SKU}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Category */}
                                        <td className="py-4 px-6 text-sm text-foreground">
                                            <span className="bg-background border border-border px-2.5 py-1 rounded-md text-xs font-medium">
                                                {product.category}
                                            </span>
                                        </td>
                                        
                                        {/* Stock (With Low Stock Warning) */}
                                        <td className="py-4 px-6 text-sm">
                                            <div className="flex items-center">
                                                <span className={`font-medium ${product.currentQuantity <= product.minStockLevel ? 'text-red-500' : 'text-foreground'}`}>
                                                    {product.currentQuantity} units
                                                </span>
                                                {product.currentQuantity <= product.minStockLevel && (
                                                    <AlertCircle size={14} className="text-red-500 ml-2" title="Low Stock Warning" />
                                                )}
                                            </div>
                                        </td>
                                        
                                        {/* Price */}
                                        <td className="py-4 px-6 text-sm text-foreground font-medium">
                                            {formatCurrency(product.sellingPrice)}
                                        </td>
                                        
                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right">
                                            <button className="p-2 text-muted hover:text-foreground hover:bg-background rounded-lg transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddProductDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
};

export default Inventory;