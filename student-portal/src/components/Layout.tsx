import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calculator, Calendar, GraduationCap } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const navItems = [
        { path: '/', icon: Home, label: 'Басты бет' },
        { path: '/homework', icon: BookOpen, label: 'Үй тапсырмасы' },
        { path: '/grades', icon: Calculator, label: 'Бағалар' },
        { path: '/schedule', icon: Calendar, label: 'Кесте' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                <div className="flex items-center gap-3 p-6 border-b">
                    <GraduationCap className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900">SchoolHelper</span>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
