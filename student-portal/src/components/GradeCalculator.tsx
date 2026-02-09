import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { supabase, isSupabaseConfigured, demoCourses } from '../lib/supabase';
import type { Grade, Course } from '../lib/supabase';


export function GradeCalculator() {
    const [courses, setCourses] = useState<(Course & { grades: Grade[] })[]>([]);
    const [newCourseName, setNewCourseName] = useState('');
    const [showAddCourse, setShowAddCourse] = useState(false);

    useEffect(() => {
        if (isSupabaseConfigured) {
            loadCourses();
        } else {
            setCourses(demoCourses);
        }
    }, []);

    const loadCourses = async () => {
        const { data: coursesData } = await supabase.from('courses').select('*');
        const { data: gradesData } = await supabase.from('grades').select('*');

        if (coursesData) {
            const coursesWithGrades = coursesData.map(course => ({
                ...course,
                grades: gradesData?.filter(g => g.course_id === course.id) || []
            }));
            setCourses(coursesWithGrades);
        }
    };

    const addCourse = async () => {
        if (newCourseName.trim()) {
            if (isSupabaseConfigured) {
                await supabase.from('courses').insert({ name: newCourseName });
                loadCourses();
            } else {
                setCourses([...courses, { id: Date.now().toString(), name: newCourseName, grades: [] }]);
            }
            setNewCourseName('');
            setShowAddCourse(false);
        }
    };

    const deleteCourse = async (courseId: string) => {
        if (isSupabaseConfigured) {
            await supabase.from('grades').delete().eq('course_id', courseId);
            await supabase.from('courses').delete().eq('id', courseId);
            loadCourses();
        } else {
            setCourses(courses.filter(c => c.id !== courseId));
        }
    };

    const addGrade = async (courseId: string, name: string, score: number, weight: number) => {
        if (isSupabaseConfigured) {
            await supabase.from('grades').insert({ course_id: courseId, name, score, weight });
            loadCourses();
        } else {
            setCourses(courses.map(c =>
                c.id === courseId
                    ? { ...c, grades: [...c.grades, { id: Date.now().toString(), course_id: courseId, name, score, weight }] }
                    : c
            ));
        }
    };

    const deleteGrade = async (gradeId: string) => {
        if (isSupabaseConfigured) {
            await supabase.from('grades').delete().eq('id', gradeId);
            loadCourses();
        } else {
            setCourses(courses.map(c => ({ ...c, grades: c.grades.filter(g => g.id !== gradeId) })));
        }
    };

    const calculateCourseGrade = (grades: Grade[]) => {
        if (grades.length === 0) return 0;
        const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
        if (totalWeight === 0) return 0;
        const weightedSum = grades.reduce((sum, g) => sum + (g.score * g.weight), 0);
        return weightedSum / totalWeight;
    };

    const getLetterGrade = (score: number) => {
        if (score >= 93) return 'A';
        if (score >= 90) return 'A-';
        if (score >= 87) return 'B+';
        if (score >= 83) return 'B';
        if (score >= 80) return 'B-';
        if (score >= 77) return 'C+';
        if (score >= 73) return 'C';
        if (score >= 70) return 'C-';
        if (score >= 67) return 'D+';
        if (score >= 60) return 'D';
        return 'F';
    };

    const overallAverage = courses.length > 0
        ? courses.reduce((sum, course) => sum + calculateCourseGrade(course.grades), 0) / courses.length
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Бағалар</h1>
                    <p className="text-gray-600 mt-1">Пәндер бойынша бағаларды есептеңіз</p>
                </div>
                <button
                    onClick={() => setShowAddCourse(!showAddCourse)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Пән қосу
                </button>
            </div>

            {!isSupabaseConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                    ⚠️ Демо режим: Деректер жергілікті сақталады. Тұрақты сақтау үшін Supabase баптаңыз.
                </div>
            )}

            {showAddCourse && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Жаңа пән қосу</h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            placeholder="Пән атауы"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                        />
                        <button
                            onClick={addCourse}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Қосу
                        </button>
                        <button
                            onClick={() => setShowAddCourse(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Болдырмау
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calculator className="w-6 h-6" />
                            <span className="text-lg font-medium">Жалпы орташа баға</span>
                        </div>
                        <div className="text-5xl font-bold">{overallAverage.toFixed(1)}%</div>
                        <div className="text-2xl font-semibold mt-2">{getLetterGrade(overallAverage)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm opacity-90">{courses.length} пән бойынша</div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {courses.map(course => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onAddGrade={addGrade}
                        onDeleteGrade={deleteGrade}
                        onDeleteCourse={deleteCourse}
                        calculateGrade={calculateCourseGrade}
                        getLetterGrade={getLetterGrade}
                    />
                ))}
            </div>

            {courses.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-gray-500">Пәндер жоқ. Жаңасын қосыңыз!</p>
                </div>
            )}
        </div>
    );
}

function CourseCard({
    course,
    onAddGrade,
    onDeleteGrade,
    onDeleteCourse,
    calculateGrade,
    getLetterGrade,
}: {
    course: Course & { grades: Grade[] };
    onAddGrade: (courseId: string, name: string, score: number, weight: number) => void;
    onDeleteGrade: (gradeId: string) => void;
    onDeleteCourse: (courseId: string) => void;
    calculateGrade: (grades: Grade[]) => number;
    getLetterGrade: (score: number) => string;
}) {
    const [showAddGrade, setShowAddGrade] = useState(false);
    const [newGrade, setNewGrade] = useState({ name: '', score: '', weight: '' });

    const handleAddGrade = () => {
        if (newGrade.name && newGrade.score && newGrade.weight) {
            onAddGrade(course.id, newGrade.name, Number(newGrade.score), Number(newGrade.weight));
            setNewGrade({ name: '', score: '', weight: '' });
            setShowAddGrade(false);
        }
    };

    const currentGrade = calculateGrade(course.grades);
    const totalWeight = course.grades.reduce((sum, g) => sum + g.weight, 0);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">{course.name}</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="text-3xl font-bold">{currentGrade.toFixed(1)}%</div>
                            <div className="text-xl font-semibold">{getLetterGrade(currentGrade)}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => onDeleteCourse(course.id)}
                        className="text-white hover:text-red-200 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                        Жалпы салмақ: {totalWeight}%
                        {totalWeight !== 100 && (
                            <span className="ml-2 text-yellow-600">({100 - totalWeight}% қалды)</span>
                        )}
                    </div>
                    <button
                        onClick={() => setShowAddGrade(!showAddGrade)}
                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                    >
                        Баға қосу
                    </button>
                </div>

                {showAddGrade && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                type="text"
                                value={newGrade.name}
                                onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                                placeholder="Тапсырма атауы"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="number"
                                value={newGrade.score}
                                onChange={(e) => setNewGrade({ ...newGrade, score: e.target.value })}
                                placeholder="Баға (0-100)"
                                min="0"
                                max="100"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="number"
                                value={newGrade.weight}
                                onChange={(e) => setNewGrade({ ...newGrade, weight: e.target.value })}
                                placeholder="Салмақ %"
                                min="0"
                                max="100"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleAddGrade}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Қосу
                            </button>
                            <button
                                onClick={() => setShowAddGrade(false)}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                                Болдырмау
                            </button>
                        </div>
                    </div>
                )}

                {course.grades.length > 0 ? (
                    <div className="space-y-2">
                        {course.grades.map(grade => (
                            <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{grade.name}</div>
                                    <div className="text-sm text-gray-600">Салмақ: {grade.weight}%</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">{grade.score}%</div>
                                    </div>
                                    <button
                                        onClick={() => onDeleteGrade(grade.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Бағалар жоқ
                    </div>
                )}
            </div>
        </div>
    );
}
