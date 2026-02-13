import { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckSquare, BookOpen, TrendingUp } from 'lucide-react';
import { supabase, isSupabaseConfigured, demoHomeworks, demoCourses } from '../lib/supabase';
import type { Homework, Course, Grade } from '../lib/supabase';


export function Dashboard() {
    const [timerMinutes, setTimerMinutes] = useState(25);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const [upcomingTasks, setUpcomingTasks] = useState<Homework[]>([]);
    const [courses, setCourses] = useState<(Course & { grades: Grade[] })[]>([]);

    useEffect(() => {
        if (isSupabaseConfigured) {
            loadUpcomingTasks();
            loadGrades();
        } else {
            setUpcomingTasks(demoHomeworks.filter(h => !h.completed).slice(0, 3));
            setCourses(demoCourses);
        }
    }, []);

    const loadUpcomingTasks = async () => {
        const { data } = await supabase
            .from('homeworks')
            .select('*')
            .eq('completed', false)
            .order('due_date', { ascending: true })
            .limit(3);
        if (data) setUpcomingTasks(data);
    };

    const loadGrades = async () => {
        const { data: coursesData } = await supabase.from('courses').select('*');
        const { data: gradesData } = await supabase.from('grades').select('*');

        if (coursesData && gradesData) {
            const coursesWithGrades = coursesData.map(course => ({
                ...course,
                grades: gradesData.filter(g => g.course_id === course.id)
            }));
            setCourses(coursesWithGrades);
        }
    };

    const calculateAverageGrade = () => {
        if (courses.length === 0) return 0;
        const courseAverages = courses.map(course => {
            if (course.grades.length === 0) return 0;
            const totalWeight = course.grades.reduce((sum, g) => sum + g.weight, 0);
            if (totalWeight === 0) return 0;
            return course.grades.reduce((sum, g) => sum + (g.score * g.weight), 0) / totalWeight;
        });
        return courseAverages.reduce((sum, avg) => sum + avg, 0) / courses.length;
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning) {
            interval = setInterval(() => {
                if (timerSeconds === 0) {
                    if (timerMinutes === 0) {
                        setIsRunning(false);
                        if (mode === 'work') {
                            setMode('break');
                            setTimerMinutes(5);
                        } else {
                            setMode('work');
                            setTimerMinutes(25);
                        }
                    } else {
                        setTimerMinutes(timerMinutes - 1);
                        setTimerSeconds(59);
                    }
                } else {
                    setTimerSeconds(timerSeconds - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timerMinutes, timerSeconds, mode]);

    const resetTimer = () => {
        setIsRunning(false);
        if (mode === 'work') {
            setTimerMinutes(25);
        } else {
            setTimerMinutes(5);
        }
        setTimerSeconds(0);
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
        if (diffDays < 0) return `${Math.abs(diffDays)} күн бұрын`;
        return `${diffDays} күнде`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Басты бет</h1>
                <p className="text-gray-600 mt-1">Оқу көрсеткіштері мен құралдар</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Pomodoro Timer */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-semibold text-gray-900">Оқу таймері</h2>
                    </div>

                    <div className="text-center space-y-6">
                        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${mode === 'work' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                            }`}>
                            {mode === 'work' ? 'Жұмыс уақыты' : 'Демалыс'}
                        </div>

                        <div className="text-5xl md:text-7xl font-bold text-gray-900 font-mono">
                            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                {isRunning ? (
                                    <>
                                        <Pause className="w-5 h-5" />
                                        Тоқтату
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Бастау
                                    </>
                                )}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Қайта бастау
                            </button>
                        </div>

                        <div className="flex justify-center gap-3 pt-4">
                            <button
                                onClick={() => { setMode('work'); setTimerMinutes(25); setTimerSeconds(0); setIsRunning(false); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'work' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                25 мин
                            </button>
                            <button
                                onClick={() => { setMode('break'); setTimerMinutes(5); setTimerSeconds(0); setIsRunning(false); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'break' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                5 мин
                            </button>
                            <button
                                onClick={() => { setMode('break'); setTimerMinutes(15); setTimerSeconds(0); setIsRunning(false); }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                15 мин
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckSquare className="w-5 h-5" />
                            <span className="text-sm font-medium opacity-90">Жақын тапсырмалар</span>
                        </div>
                        <div className="text-4xl font-bold">{upcomingTasks.length}</div>
                        <p className="text-sm opacity-90 mt-1">Бүгін орындаңыз!</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-medium opacity-90">Орташа баға</span>
                        </div>
                        <div className="text-4xl font-bold">{calculateAverageGrade().toFixed(1)}%</div>
                        <p className="text-sm opacity-90 mt-1">Жақсы жұмыс!</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Tasks & Recent Grades */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Upcoming Tasks */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Жақын тапсырмалар</h2>
                    </div>
                    <div className="space-y-3">
                        {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                            <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{task.subject}</div>
                                    <div className="text-sm text-gray-600">{task.task}</div>
                                </div>
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                    {formatDate(task.due_date)}
                                </span>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">Тапсырмалар жоқ</p>
                        )}
                    </div>
                </div>

                {/* Recent Grades */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Соңғы бағалар</h2>
                    </div>
                    <div className="space-y-3">
                        {courses.flatMap(c => c.grades.map(g => ({ ...g, courseName: c.name }))).slice(0, 3).map((grade) => (
                            <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-gray-900">{grade.courseName}</div>
                                    <div className="text-sm text-gray-600">{grade.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900">{grade.score}%</div>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && (
                            <p className="text-gray-500 text-center py-4">Бағалар жоқ</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
