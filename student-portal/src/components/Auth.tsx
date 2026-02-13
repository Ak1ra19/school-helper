import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GraduationCap, Loader2 } from 'lucide-react';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password
                });
                if (error) throw error;
                // Check if user needs to confirm email
                if (data.user && !data.session) {
                    setMessage('Тіркелу сәтті өтті! Поштаңызды тексеріп, сілтеме арқылы растаңыз.');
                    setIsLogin(true); // Switch to login mode
                    return;
                }
            }
        } catch (err: any) {
            setError(err.message === "Invalid login credentials"
                ? "Пошта немесе құпия сөз қате. Егер жаңа тіркелсеңіз, поштаңызды растадыңыз ба?"
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                        <GraduationCap className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">SchoolHelper</h1>
                    <p className="text-gray-500 mt-2">
                        {isLogin ? 'Оқу порталына қош келдіңіз' : 'Жаңа аккаунт жасау'}
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm text-center border border-green-200">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Құпия сөз
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {isLogin ? 'Кіру' : 'Тіркелу'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? 'Аккаунтыңыз жоқ па?' : 'Аккаунтыңыз бар ма?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        {isLogin ? 'Тіркелу' : 'Кіру'}
                    </button>
                </div>
            </div>
        </div>
    );
}
