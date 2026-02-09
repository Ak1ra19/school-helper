import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Calendar } from 'lucide-react';
import { supabase, isSupabaseConfigured, demoHomeworks } from '../lib/supabase';
import type { Homework } from '../lib/supabase';


export function HomeworkTracker() {
    const [homework, setHomework] = useState<Homework[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newHomework, setNewHomework] = useState({
        subject: '',
        task: '',
        dueDate: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
    });

    useEffect(() => {
        if (isSupabaseConfigured) {
            loadHomework();
        } else {
            setHomework(demoHomeworks);
        }
    }, []);

    const loadHomework = async () => {
        const { data } = await supabase
            .from('homeworks')
            .select('*')
            .order('due_date', { ascending: true });
        if (data) setHomework(data);
    };

    const addHomework = async () => {
        if (newHomework.subject && newHomework.task && newHomework.dueDate) {
            if (isSupabaseConfigured) {
                const { error } = await supabase.from('homeworks').insert({
                    subject: newHomework.subject,
                    task: newHomework.task,
                    due_date: newHomework.dueDate,
                    priority: newHomework.priority,
                    completed: false,
                });
                if (!error) loadHomework();
            } else {
                setHomework([...homework, {
                    id: Date.now().toString(),
                    subject: newHomework.subject,
                    task: newHomework.task,
                    due_date: newHomework.dueDate,
                    priority: newHomework.priority,
                    completed: false,
                }]);
            }
            setNewHomework({ subject: '', task: '', dueDate: '', priority: 'medium' });
            setShowAddForm(false);
        }
    };

    const toggleComplete = async (id: string, completed: boolean) => {
        if (isSupabaseConfigured) {
            await supabase.from('homeworks').update({ completed: !completed }).eq('id', id);
            loadHomework();
        } else {
            setHomework(homework.map(hw => hw.id === id ? { ...hw, completed: !hw.completed } : hw));
        }
    };

    const deleteHomework = async (id: string) => {
        if (isSupabaseConfigured) {
            await supabase.from('homeworks').delete().eq('id', id);
            loadHomework();
        } else {
            setHomework(homework.filter(hw => hw.id !== id));
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'жоғары';
            case 'medium': return 'орташа';
            case 'low': return 'төмен';
            default: return priority;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(date);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Бүгін';
        if (diffDays === 1) return 'Ертең';
        if (diffDays === -1) return 'Кеше';
        if (diffDays < 0) return `${Math.abs(diffDays)} күн бұрын`;
        return `${diffDays} күнде`;
    };

    const incompleteTasks = homework.filter(hw => !hw.completed);
    const completedTasks = homework.filter(hw => hw.completed);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Үй тапсырмасы</h1>
                    <p className="text-gray-600 mt-1">Барлық тапсырмаларды бақылаңыз</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Қосу
                </button>
            </div>

            {!isSupabaseConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                    ⚠️ Демо режим: Деректер жергілікті сақталады. Тұрақты сақтау үшін Supabase баптаңыз.
                </div>
            )}

            {showAddForm && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Жаңа тапсырма қосу</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Пән</label>
                            <input
                                type="text"
                                value={newHomework.subject}
                                onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="мыс., Математика"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Мерзімі</label>
                            <input
                                type="date"
                                value={newHomework.dueDate}
                                onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Тапсырма сипаттамасы</label>
                            <textarea
                                value={newHomework.task}
                                onChange={(e) => setNewHomework({ ...newHomework, task: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                                placeholder="Тапсырманы сипаттаңыз..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Маңыздылығы</label>
                            <select
                                value={newHomework.priority}
                                onChange={(e) => setNewHomework({ ...newHomework, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="low">Төмен</option>
                                <option value="medium">Орташа</option>
                                <option value="high">Жоғары</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={addHomework}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Қосу
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Болдырмау
                        </button>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-gray-900">{homework.length}</div>
                    <div className="text-sm text-gray-600">Барлығы</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-indigo-600">{incompleteTasks.length}</div>
                    <div className="text-sm text-gray-600">Күтуде</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                    <div className="text-sm text-gray-600">Орындалған</div>
                </div>
            </div>

            {incompleteTasks.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Күтудегі тапсырмалар</h2>
                    <div className="space-y-3">
                        {incompleteTasks.map((hw) => (
                            <div key={hw.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <button
                                    onClick={() => toggleComplete(hw.id, hw.completed)}
                                    className="mt-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                    <Circle className="w-5 h-5" />
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">{hw.subject}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(hw.priority)}`}>
                                            {getPriorityLabel(hw.priority)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{hw.task}</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(hw.due_date)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteHomework(hw.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {completedTasks.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Орындалған тапсырмалар</h2>
                    <div className="space-y-3">
                        {completedTasks.map((hw) => (
                            <div key={hw.id} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg opacity-75">
                                <button
                                    onClick={() => toggleComplete(hw.id, hw.completed)}
                                    className="mt-1 text-green-600 hover:text-green-700 transition-colors"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 line-through">{hw.subject}</span>
                                    </div>
                                    <p className="text-gray-700 line-through">{hw.task}</p>
                                </div>
                                <button
                                    onClick={() => deleteHomework(hw.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {homework.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-gray-500">Тапсырмалар жоқ. Жаңасын қосыңыз!</p>
                </div>
            )}
        </div>
    );
}
