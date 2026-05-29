import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, ShoppingCart, Plus, Minus, Trash2, PackageOpen, CreditCard, Loader2, AlertCircle, Banknote, Smartphone
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCheckout } from '../hooks/useSales';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
};

const POS = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    
    // POS Override States
    const [orderDiscount, setOrderDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('UPI'); 
    
    const { data: productsData, isLoading, isError } = useProducts(searchQuery, '');
    const products = Array.isArray(productsData) ? productsData : [];

    const { mutate: checkout, isPending } = useCheckout();

    // --- Cart Logic ---
    const addToCart = (product) => {
        if (product.currentQuantity <= 0) return; // Out of stock
        
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                if (existingItem.cartQuantity >= product.currentQuantity) return prevCart;
                return prevCart.map(item => 
                    item._id === product._id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, cartQuantity: 1 }];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item._id === productId) {
                const newQuantity = item.cartQuantity + delta;
                if (newQuantity > 0 && newQuantity <= item.currentQuantity) {
                    return { ...item, cartQuantity: newQuantity };
                }
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    // --- Calculations ---
    const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.cartQuantity), 0);
    
    // Ensure discount doesn't exceed subtotal
    const validDiscount = Math.min(Number(orderDiscount) || 0, subtotal);
    const afterDiscount = subtotal - validDiscount;
    
    const taxAmount = afterDiscount * ((Number(taxRate) || 0) / 100);
    const total = afterDiscount + taxAmount;

    // --- Checkout Handler ---
    const handleCheckout = () => {
        if (cart.length === 0) return;

        const saleData = {
            products: cart.map(item => ({
                product: item._id,
                quantity: item.cartQuantity,
                sellingPrice: item.sellingPrice
            })),
            discount: validDiscount,
            tax: taxAmount,
            totalAmount: total,
            paymentMethod: paymentMethod, 
        };

        checkout(saleData, {
            onSuccess: () => {
                setCart([]); // Clear cart on success
                setOrderDiscount(0); // Reset overrides for the next customer
            }
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in pb-6 h-auto lg:h-[calc(100vh-6rem)]">
            
            {/* LEFT SCREEN: Product Grid */}
            <div className="flex-1 flex flex-col glass-panel inner-highlight rounded-2xl overflow-hidden min-h-[60vh] lg:min-h-0">
                <div className="p-6 border-b border-border bg-input/20">
                    <h2 className="text-xl font-bold text-foreground mb-4">Register</h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Scan barcode or search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field bg-background"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin text-brand-500" size={32} />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-400 text-center">
                            <AlertCircle size={48} className="mb-4 opacity-70" />
                            <p>Failed to load products. Please try again.</p>
                        </div>
                    ) : products?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted">
                            <PackageOpen size={48} className="mb-4 opacity-50" />
                            <p>No products found in inventory.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map(product => (
                                <motion.div 
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addToCart(product)}
                                    key={product._id}
                                    className={`bg-background border rounded-xl overflow-hidden cursor-pointer transition-all ${
                                        product.currentQuantity === 0 
                                            ? 'opacity-50 grayscale border-border' 
                                            : 'border-border hover:border-brand-500 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]'
                                    }`}
                                >
                                    <div className="h-32 bg-input/50 flex items-center justify-center overflow-hidden relative">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <PackageOpen className="text-muted" size={32} />
                                        )}
                                        {product.currentQuantity === 0 && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1">{product.name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-brand-500 font-bold text-sm">{formatCurrency(product.sellingPrice)}</span>
                                            <span className="text-xs text-muted">{product.currentQuantity} in stock</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SCREEN: Active Cart */}
            <div className="w-full lg:w-[420px] flex flex-col glass-panel inner-highlight rounded-2xl overflow-hidden shrink-0 min-h-[50vh] lg:min-h-0">
                <div className="p-6 border-b border-border bg-input/20 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground flex items-center">
                        <ShoppingCart className="mr-2 text-brand-500" size={20} />
                        Current Order
                    </h2>
                    <span className="bg-brand-500/10 text-brand-500 px-3 py-1 rounded-full text-xs font-bold">
                        {cart.length} Items
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4 border-b border-border">
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-muted text-sm text-center"
                            >
                                <ShoppingCart size={48} className="mb-4 opacity-20" />
                                <p>Cart is empty.<br/>Select products to add them to the order.</p>
                            </motion.div>
                        ) : (
                            cart.map(item => (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={item._id} 
                                    className="flex justify-between items-center bg-background border border-border p-3 rounded-xl"
                                >
                                    <div className="flex-1 min-w-0 pr-3">
                                        <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                                        <p className="text-xs text-brand-500 font-medium">{formatCurrency(item.sellingPrice)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center bg-input rounded-lg border border-border overflow-hidden">
                                            <button onClick={() => updateQuantity(item._id, -1)} className="p-1.5 text-muted hover:text-foreground hover:bg-background transition-colors">
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold text-foreground">{item.cartQuantity}</span>
                                            <button onClick={() => updateQuantity(item._id, 1)} className="p-1.5 text-muted hover:text-foreground hover:bg-background transition-colors">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* THE POS OVERRIDE TERMINAL */}
                <div className="p-6 bg-input/20 space-y-5">
                    
                    {/* Calculations Grid */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm text-muted">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted">Discount (₹)</span>
                            <input 
                                type="number" 
                                min="0" 
                                value={orderDiscount} 
                                onChange={(e) => setOrderDiscount(e.target.value)}
                                className="w-24 bg-background border border-border rounded-lg px-2 py-1 text-right text-foreground focus:ring-1 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted">Tax (%)</span>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="0" 
                                    value={taxRate} 
                                    onChange={(e) => setTaxRate(e.target.value)}
                                    className="w-16 bg-background border border-border rounded-lg px-2 py-1 text-center text-foreground focus:ring-1 focus:ring-brand-500 outline-none"
                                />
                                <span className="font-medium text-foreground w-20 text-right">+{formatCurrency(taxAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                        <span className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Payment Method</span>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => setPaymentMethod('UPI')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${paymentMethod === 'UPI' ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'bg-background border-border text-muted hover:border-white/20'}`}
                            >
                                <Smartphone size={18} className="mb-1" />
                                <span className="text-xs font-medium">UPI</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('Card')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${paymentMethod === 'Card' ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'bg-background border-border text-muted hover:border-white/20'}`}
                            >
                                <CreditCard size={18} className="mb-1" />
                                <span className="text-xs font-medium">Card</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('Cash')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${paymentMethod === 'Cash' ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'bg-background border-border text-muted hover:border-white/20'}`}
                            >
                                <Banknote size={18} className="mb-1" />
                                <span className="text-xs font-medium">Cash</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-brand-500 tracking-tight">{formatCurrency(total)}</span>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isPending}
                        className="btn-primary py-4 text-lg shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)]"
                    >
                        {isPending ? <Loader2 className="animate-spin mx-auto" size={24} /> : `Collect ${formatCurrency(total)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;