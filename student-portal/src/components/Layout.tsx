import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Calculator, Calendar, GraduationCap, Menu, X, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserEmail(session?.user?.email || null);
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const navItems = [
        { path: '/', icon: Home, label: 'Басты бет' },
        { path: '/homework', icon: BookOpen, label: 'Үй тапсырмасы' },
        { path: '/grades', icon: Calculator, label: 'Бағалар' },
        { path: '/schedule', icon: Calendar, label: 'Кесте' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900">SchoolHelper</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div className={`
        fixed inset-0 z-10 bg-white md:static md:w-64 md:border-r transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        pt-16 md:pt-0
      `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b hidden md:flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900">SchoolHelper</span>
                    </div>

                    <div className="p-4 border-b bg-indigo-50/50">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="bg-indigo-100 p-2 rounded-full">
                                <User className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{userEmail || 'Қонақ'}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t space-y-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <h4 className="font-semibold text-indigo-900 mb-1">SchoolHelper</h4>
                            <p className="text-xs text-indigo-700">Оқуыңызға сәттілік!</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 w-full text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Шығу</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-0 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
