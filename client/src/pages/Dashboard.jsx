import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, PackageMinus, Activity, ArrowUpRight, Package, Receipt, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 2 
    }).format(amount || 0);
};

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <motion.div 
        whileHover={{ y: -4 }}
        className="glass-panel inner-highlight p-6 rounded-2xl flex flex-col relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.15)] border border-transparent hover:border-white/10"
    >
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${colorClass}`} />
        
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-xl bg-input border border-border text-foreground ${colorClass.replace('bg-', 'text-')}`}>
                <Icon size={20} />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={14} className="mr-1" />
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-muted text-sm font-medium mb-1 relative z-10">{title}</h3>
        <p className="text-2xl font-bold text-foreground tracking-tight relative z-10">{value}</p>
    </motion.div>
);

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('month');
    
    const { dashboard, topProducts, isLoading, isError } = useAnalytics(timeRange);

    if (isError) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl">
                Failed to load analytics data. Please check your connection.
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
            
            {/* Header & Segmented Control */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Store Overview</h1>
                    <p className="text-muted mt-1">Track your revenue, profit, and inventory in real-time.</p>
                </div>

                {/* THE PREMIUM TIME TOGGLE */}
                <div className="flex p-1 bg-input/40 backdrop-blur-md rounded-xl border border-border shrink-0">
                    {[
                        { id: 'today', label: 'Today' },
                        { id: 'week', label: '7 Days' },
                        { id: 'month', label: '30 Days' },
                        { id: 'year', label: '1 Year' }
                    ].map((range) => (
                        <button
                            key={range.id}
                            onClick={() => setTimeRange(range.id)}
                            className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                                timeRange === range.id ? 'text-foreground' : 'text-muted hover:text-foreground'
                            }`}
                        >
                            {timeRange === range.id && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-panel border border-white/10 rounded-lg shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{range.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Top KPI Metrics Grid with Loading Transition */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                <StatCard 
                    title="Total Revenue" 
                    value={formatCurrency(dashboard?.totalRevenue)} 
                    icon={DollarSign} 
                    colorClass="bg-brand-500"
                />
                <StatCard 
                    title="Net Profit" 
                    value={formatCurrency(dashboard?.netProfit)} 
                    icon={dashboard?.netProfit < 0 ? TrendingDown : TrendingUp} 
                    colorClass={dashboard?.netProfit < 0 ? "bg-red-500" : "bg-emerald-500"}
                />
                <StatCard 
                    title="Total Sales" 
                    value={dashboard?.totalSales || 0} 
                    icon={Activity} 
                    colorClass="bg-blue-500"
                />
                <StatCard 
                    title="Low Stock Alerts" 
                    value={dashboard?.lowStockCount || 0} 
                    icon={PackageMinus} 
                    colorClass="bg-red-500"
                />
            </div>

            {/* Main Charts & Activity Section */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                
                {/* Top Products Bar Chart */}
                <div className="glass-panel inner-highlight p-6 rounded-2xl lg:col-span-2">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center">
                        <Package size={18} className="mr-2 text-brand-500" />
                        Top Performing Products
                    </h3>
                    <div className="h-[300px] w-full">
                        {topProducts?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts?.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: 'var(--muted-color)', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        tick={{ fill: 'var(--muted-color)', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value}`} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'var(--input-bg)' }}
                                        contentStyle={{ 
                                            backgroundColor: 'var(--panel-bg)', 
                                            borderColor: 'var(--border-color)', 
                                            borderRadius: '12px', 
                                            color: 'var(--fg-color)' 
                                        }}
                                        itemStyle={{ color: 'var(--brand-500)', fontWeight: 'bold' }}
                                        formatter={(value) => [formatCurrency(value), "Revenue Generated"]}
                                    />
                                    <Bar dataKey="revenueGenerated" radius={[6, 6, 0, 0]}>
                                        {topProducts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-brand-500)' : 'var(--color-brand-400)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted">
                                No sales data available for this timeframe.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions Feed */}
                <div className="glass-panel inner-highlight p-6 rounded-2xl flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center">
                        <Receipt size={18} className="mr-2 text-brand-500" />
                        Recent Sales
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {dashboard?.recentSales?.length > 0 ? (
                            dashboard.recentSales.map((sale) => (
                                <div key={sale._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-input border border-transparent hover:border-border transition-colors">
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-semibold text-foreground truncate">
                                            {sale.invoiceNumber || `INV-${sale._id.substring(18,24).toUpperCase()}`}
                                        </span>
                                        <span className="text-xs text-muted truncate">
                                            {sale.products?.length || 1} {sale.products?.length === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-emerald-500">
                                            +{formatCurrency(sale.totalAmount)}
                                        </span>
                                        <span className="block text-xs text-muted">
                                            {/* Changed to locale date string to show Month/Day for broader timeframes */}
                                            {new Date(sale.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted text-sm mt-10">
                                No recent sales found.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;