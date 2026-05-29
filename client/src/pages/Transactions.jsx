import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, Receipt, Calendar, FileText, Search, X, Printer, Loader2 
} from 'lucide-react';
import { useSalesHistory } from '../hooks/useSales';

// Utility function to format numbers into standard Indian Rupee (INR) currency strings
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);
};

const Transactions = () => {
    // --- STATE MANAGEMENT ---
    // Controls the backend query range (today, week, month, 6months, year, all)
    const [timeRange, setTimeRange] = useState('month');
    // Controls the frontend local search filter for invoice numbers
    const [searchQuery, setSearchQuery] = useState('');
    // Holds the specific sale object when a user clicks to view a receipt
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // --- DATA FETCHING ---
    // Automatically refetches when timeRange changes
    const { data: salesData, isLoading, isError } = useSalesHistory(timeRange);
    
    // Ensure sales is always an array, then filter based on the search input
    const sales = Array.isArray(salesData) ? salesData : [];
    const filteredSales = sales.filter(sale => 
        sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- CSV EXPORT LOGIC ---
    const handleExportCSV = () => {
        if (filteredSales.length === 0) return; // Prevent exporting empty files

        // 1. Define the exact column headers for the spreadsheet
        const headers = ['Invoice Number', 'Date', 'Time', 'Items Sold', 'Discount (INR)', 'Tax (INR)', 'Total Revenue (INR)', 'Payment Method'];
        
        // 2. Map the JSON data into an array of comma-separated strings
        const rows = filteredSales.map(sale => {
            const date = new Date(sale.createdAt);
            return [
                sale.invoiceNumber,
                date.toLocaleDateString('en-IN'), // Localized Date
                date.toLocaleTimeString('en-IN'), // Localized Time
                sale.products?.length || 0,
                sale.discount || 0,
                sale.tax || 0,
                sale.totalAmount,
                sale.paymentMethod || 'Unknown'
            ].join(','); 
        });

        // 3. Combine headers and rows with line breaks (\n) to form the CSV string
        const csvContent = [headers.join(','), ...rows].join('\n');
        
        // 4. Create a Blob (a file-like object of immutable, raw data)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // 5. Create a hidden <a> tag, attach the Blob URL, and trigger a programmatic click to download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `PetPulse_Report_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        
        // 6. Cleanup the DOM after download
        document.body.removeChild(link);
    };

    return (
        <> 
            {/* --- MAIN PAGE WRAPPER --- */}
            {/* The 'print:hidden' class ensures this entire dashboard disappears when the browser print dialog opens */}
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 print:hidden">
                
                {/* PAGE HEADER & CONTROLS */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center">
                            <FileText className="mr-3 text-brand-500" size={32} />
                            Transactions & Reports
                        </h1>
                        <p className="text-muted mt-1">View history, export financial reports, and generate receipts.</p>
                    </div>

                    {/* Wrapper for Toggle & Export Button. Uses flex-wrap to prevent horizontal overflow on smaller screens */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-start lg:justify-end gap-3 w-full lg:w-auto overflow-hidden">
                        
                        {/* TIME RANGE TOGGLE */}
                        {/* max-w-full and overflow-x-auto allow horizontal scrolling on tiny mobile screens */}
                        <div className="flex p-1 bg-input/40 backdrop-blur-md rounded-xl border border-border shrink-0 overflow-x-auto custom-scrollbar max-w-full">
                            {[
                                { id: 'today', label: 'Today' },
                                { id: 'week', label: '7 Days' },
                                { id: 'month', label: '30 Days' },
                                { id: '6months', label: '6 Months' }, 
                                { id: 'year', label: '1 Year' },
                                { id: 'all', label: 'All Time' }        
                            ].map((range) => (
                                <button
                                    key={range.id}
                                    onClick={() => setTimeRange(range.id)}
                                    className={`relative px-3 md:px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 whitespace-nowrap ${
                                        timeRange === range.id ? 'text-foreground' : 'text-muted hover:text-foreground'
                                    }`}
                                >
                                    {/* Animated background pill using Framer Motion layoutId */}
                                    {timeRange === range.id && (
                                        <motion.div 
                                            layoutId="txTab"
                                            className="absolute inset-0 bg-panel border border-white/10 rounded-lg shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{range.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* EXPORT BUTTON */}
                        {/* flex-none and w-max prevent the button from dynamically stretching and breaking the layout */}
                        <button 
                            onClick={handleExportCSV}
                            disabled={filteredSales.length === 0}
                            className="btn-primary w-full sm:w-max flex-none px-5 whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={18} className="mr-2" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* --- DATA TABLE SECTION --- */}
                <div className="glass-panel inner-highlight rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
                    
                    {/* Search Bar */}
                    <div className="p-4 border-b border-border bg-input/20">
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by Invoice Number..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field bg-background pl-10"
                            />
                        </div>
                    </div>

                    {/* Scrollable Table Wrapper */}
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-input/50">
                                    <th className="py-4 px-6 text-sm font-semibold text-muted">Invoice</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-muted">Date & Time</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-muted">Items</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-muted">Total</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-muted">Payment</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-muted text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Conditional Rendering: Loading State */}
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <Loader2 className="animate-spin mx-auto text-brand-500 mb-2" size={32} />
                                            <p className="text-muted text-sm">Loading transactions...</p>
                                        </td>
                                    </tr>
                                ) : filteredSales.length === 0 ? (
                                    /* Conditional Rendering: Empty State */
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center">
                                            <Receipt className="mx-auto text-muted mb-4 opacity-50" size={48} />
                                            <h3 className="text-lg font-medium text-foreground">No transactions found</h3>
                                            <p className="text-muted text-sm mt-1">Try selecting a different time range.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    /* Conditional Rendering: Data Rows */
                                    filteredSales.map((sale, index) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            key={sale._id} 
                                            className="border-b border-border hover:bg-input/50 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedInvoice(sale)} // Opens the Receipt Modal
                                        >
                                            <td className="py-4 px-6 font-semibold text-foreground">
                                                {sale.invoiceNumber}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-muted">
                                                {new Date(sale.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-foreground">
                                                {sale.products?.length} items
                                            </td>
                                            <td className="py-4 px-6 text-sm font-bold text-brand-500">
                                                {formatCurrency(sale.totalAmount)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="bg-background border border-border px-2.5 py-1 rounded-md text-xs font-medium text-muted">
                                                    {sale.paymentMethod || 'Card'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button 
                                                    className="px-3 py-1.5 text-xs font-semibold text-brand-500 bg-brand-500/10 hover:bg-brand-500 hover:text-white rounded-lg transition-colors"
                                                >
                                                    View Receipt
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- RECEIPT MODAL (PRINT VIEW) --- */}
            {/* Sits outside the main 'print:hidden' div so it can be printed */}
            <AnimatePresence>
                {selectedInvoice && (
                    // print:static and print:p-0 override flexbox centering during print to align the receipt to the paper's top-left
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:static print:block print:p-0">
                        
                        {/* Dark blurred background overlay (hidden during print) */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedInvoice(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm print:hidden"
                        />

                        {/* The Actual Receipt Document */}
                        {/* print CSS strips shadows, margins, and border radii to create a clean white paper look */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white text-black w-full max-w-sm rounded-xl shadow-2xl overflow-hidden z-10 print:shadow-none print:w-full print:max-w-none print:m-0 print:rounded-none"
                        >
                            {/* Close Modal Button (hidden during print) */}
                            <button 
                                onClick={() => setSelectedInvoice(null)} 
                                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors print:hidden"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-8">
                                {/* Receipt Header details */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">PETPULSE</h2>
                                    <p className="text-sm text-gray-500">Premium Pet Supplies</p>
                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{selectedInvoice.invoiceNumber}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(selectedInvoice.createdAt).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                {/* Line Items Loop */}
                                <div className="space-y-3 mb-6">
                                    {selectedInvoice.products?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <div className="flex-1 pr-4">
                                                <p className="font-semibold text-gray-800 line-clamp-1">{item.product?.name || 'Store Item'}</p>
                                                <p className="text-xs text-gray-500">{item.quantity} x {formatCurrency(item.sellingPriceAtTimeOfSale)}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">{formatCurrency(item.quantity * item.sellingPriceAtTimeOfSale)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Financial Calculations (Subtotal, Tax, Discount, Total) */}
                                <div className="pt-4 border-t border-dashed border-gray-300 space-y-2 mb-8">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(selectedInvoice.totalAmount - selectedInvoice.tax + selectedInvoice.discount)}</span>
                                    </div>
                                    {selectedInvoice.discount > 0 && (
                                        <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                            <span>Discount</span>
                                            <span>-{formatCurrency(selectedInvoice.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Tax (GST)</span>
                                        <span>{formatCurrency(selectedInvoice.tax)}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2 mt-2 border-t border-gray-200">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-black text-gray-900">{formatCurrency(selectedInvoice.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 pt-1">
                                        <span>Paid via {selectedInvoice.paymentMethod || 'Card'}</span>
                                    </div>
                                </div>

                                {/* Receipt Footer message */}
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-800">Thank you for your purchase!</p>
                                    <p className="text-xs text-gray-500 mt-1">Please keep this receipt for your records.</p>
                                </div>
                            </div>

                            {/* Trigger the browser print window (hidden during actual print) */}
                            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end print:hidden">
                                <button 
                                    onClick={() => window.print()}
                                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                                >
                                    <Printer size={16} className="mr-2" />
                                    Print Receipt
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Transactions;