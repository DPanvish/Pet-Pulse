import { useState } from 'react'
import { useAuthStore } from "../store/authStore.js";
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, PackageSearch, ShoppingCart, PawPrint, LogOut, Menu } from "lucide-react";

const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: PackageSearch },
    { name: 'Point of Sale', path: '/pos', icon: ShoppingCart },
];


const SidebarContent = ({ user, handleLogout, closeMobileMenu }) => (
    <div className="flex flex-col h-full bg-surface-900/40 backdrop-blur-2xl border-r border-white/5">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
            <div className="w-8 h-8 bg-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center mr-3 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]">
                <PawPrint size={18} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">PetPulse</span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu} // Trigger the prop function
                    className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm
                        ${isActive 
                            ? 'bg-brand-500/10 text-brand-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' 
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }
                    `}
                >
                    <link.icon size={18} className="mr-3" />
                    {link.name}
                </NavLink>
            ))}
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/5">
            <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-black/20 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-brand-400 font-bold mr-3">
                    {user?.name?.charAt(0).toUpperCase() || 'O'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">{user?.name || 'Store Owner'}</p>
                    <p className="text-xs text-neutral-500 truncate">Admin Portal</p>
                </div>
            </div>
            
            <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
            >
                <LogOut size={18} className="mr-3" />
                Sign Out
            </button>
        </div>
    </div>
);


const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {user, logout} = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-surface-950 flex overflow-hidden">

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:block w-72 flex-shrink-0 z-20">
                <SidebarContent 
                    user={user} 
                    handleLogout={handleLogout} 
                    closeMobileMenu={closeMobileMenu} 
                />
            </aside>

            {/* Mobile Sidebar (Slide-out Drewer) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />

                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-72 z-50 md:hidden"
                        >
                            <SidebarContent 
                                user={user} 
                                handleLogout={handleLogout} 
                                closeMobileMenu={closeMobileMenu} 
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 z-10 relative">
                {/* Global Ambient Glow for the whole app */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

                {/* Mobile Topbar (Hamburger Menu) */}
                <header className="h-20 flex items-center justify-between px-6 border-b border-white/5 md:hidden bg-surface-950/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center mr-3">
                            <PawPrint size={18} />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">PetPulse</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Dynamic Page Content Renders Here */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default DashboardLayout
