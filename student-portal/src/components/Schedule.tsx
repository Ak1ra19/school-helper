import { useState, useEffect } from 'react';
import { Plus, Clock, MapPin, Trash2 } from 'lucide-react';
import { supabase, isSupabaseConfigured, demoSchedule } from '../lib/supabase';
import type { ClassSession } from '../lib/supabase';


export function Schedule() {
    const [schedule, setSchedule] = useState<{ [key: string]: ClassSession[] }>({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [newClass, setNewClass] = useState({
        name: '',
        teacher: '',
        room: '',
        time: '',
        color: 'bg-blue-100 border-blue-300 text-blue-900',
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayLabels: { [key: string]: string } = {
        Monday: 'Дүйсенбі',
        Tuesday: 'Сейсенбі',
        Wednesday: 'Сәрсенбі',
        Thursday: 'Бейсенбі',
        Friday: 'Жұма',
    };
    const colors = [
        { value: 'bg-blue-100 border-blue-300 text-blue-900', label: 'Көк' },
        { value: 'bg-green-100 border-green-300 text-green-900', label: 'Жасыл' },
        { value: 'bg-purple-100 border-purple-300 text-purple-900', label: 'Күлгін' },
        { value: 'bg-yellow-100 border-yellow-300 text-yellow-900', label: 'Сары' },
        { value: 'bg-red-100 border-red-300 text-red-900', label: 'Қызыл' },
        { value: 'bg-orange-100 border-orange-300 text-orange-900', label: 'Қызғылт сары' },
        { value: 'bg-pink-100 border-pink-300 text-pink-900', label: 'Қызғылт' },
    ];

    useEffect(() => {
        if (isSupabaseConfigured) {
            loadSchedule();
        } else {
            const grouped = days.reduce((acc, day) => {
                acc[day] = demoSchedule.filter(s => s.day === day);
                return acc;
            }, {} as { [key: string]: ClassSession[] });
            setSchedule(grouped);
        }
    }, []);

    const loadSchedule = async () => {
        const { data } = await supabase.from('schedule').select('*');
        if (data) {
            const grouped = days.reduce((acc, day) => {
                acc[day] = data.filter(s => s.day === day);
                return acc;
            }, {} as { [key: string]: ClassSession[] });
            setSchedule(grouped);
        }
    };

    const addClass = async () => {
        if (newClass.name && newClass.teacher && newClass.room && newClass.time) {
            if (isSupabaseConfigured) {
                await supabase.from('schedule').insert({ day: selectedDay, ...newClass });
                loadSchedule();
            } else {
                const newSession: ClassSession = {
                    id: Date.now().toString(),
                    day: selectedDay,
                    ...newClass,
                };
                setSchedule({
                    ...schedule,
                    [selectedDay]: [...schedule[selectedDay], newSession],
                });
            }
            setNewClass({ name: '', teacher: '', room: '', time: '', color: 'bg-blue-100 border-blue-300 text-blue-900' });
            setShowAddForm(false);
        }
    };

    const deleteClass = async (id: string) => {
        if (isSupabaseConfigured) {
            await supabase.from('schedule').delete().eq('id', id);
            loadSchedule();
        } else {
            const newSchedule = { ...schedule };
            for (const day of days) {
                newSchedule[day] = newSchedule[day].filter(c => c.id !== id);
            }
            setSchedule(newSchedule);
        }
    };

    const totalClasses = Object.values(schedule).reduce((sum, classes) => sum + classes.length, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Сабақ кестесі</h1>
                    <p className="text-gray-600 mt-1">Апталық кестеңізді басқарыңыз</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Сабақ қосу
                </button>
            </div>

            {!isSupabaseConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                    ⚠️ Демо режим: Деректер жергілікті сақталады. Тұрақты сақтау үшін Supabase баптаңыз.
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-gray-900">{totalClasses}</div>
                    <div className="text-sm text-gray-600">Аптасына сабақ</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-indigo-600">{days.length}</div>
                    <div className="text-sm text-gray-600">Оқу күндері</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-green-600">{(totalClasses / days.length).toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Орташа күніне</div>
                </div>
            </div>

            {showAddForm && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Жаңа сабақ қосу</h3>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Күн</label>
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {days.map(day => (
                                        <option key={day} value={day}>{dayLabels[day]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Пән атауы</label>
                                <input
                                    type="text"
                                    value={newClass.name}
                                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="мыс., Математика"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Мұғалім</label>
                                <input
                                    type="text"
                                    value={newClass.teacher}
                                    onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="мыс., Айгүл Сергеевна"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Кабинет</label>
                                <input
                                    type="text"
                                    value={newClass.room}
                                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="мыс., 201 кабинет"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Уақыт</label>
                                <input
                                    type="text"
                                    value={newClass.time}
                                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="мыс., 8:00 - 9:30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Түс</label>
                                <select
                                    value={newClass.color}
                                    onChange={(e) => setNewClass({ ...newClass, color: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {colors.map(color => (
                                        <option key={color.value} value={color.value}>{color.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={addClass}
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
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-4">
                {days.map(day => (
                    <div key={day} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-indigo-600 text-white p-4 text-center">
                            <h3 className="font-semibold text-lg">{dayLabels[day]}</h3>
                            <div className="text-sm opacity-90">{schedule[day]?.length || 0} сабақ</div>
                        </div>
                        <div className="p-3 space-y-3 min-h-[200px]">
                            {schedule[day]?.map(classSession => (
                                <div
                                    key={classSession.id}
                                    className={`p-3 rounded-lg border-l-4 ${classSession.color} relative group`}
                                >
                                    <button
                                        onClick={() => deleteClass(classSession.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="font-semibold text-sm mb-1">{classSession.name}</div>
                                    <div className="text-xs space-y-1">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{classSession.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{classSession.room}</span>
                                        </div>
                                        <div className="font-medium">{classSession.teacher}</div>
                                    </div>
                                </div>
                            ))}
                            {(!schedule[day] || schedule[day].length === 0) && (
                                <div className="text-center text-gray-400 text-sm py-8">
                                    Сабақ жоқ
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
