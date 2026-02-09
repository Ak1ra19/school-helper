import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== ''

export const supabase: SupabaseClient = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key')

export interface Homework {
    id: string
    subject: string
    task: string
    due_date: string
    priority: 'low' | 'medium' | 'high'
    completed: boolean
    created_at?: string
}

export interface Course {
    id: string
    name: string
}

export interface Grade {
    id: string
    course_id: string
    name: string
    score: number
    weight: number
}

export interface ClassSession {
    id: string
    day: string
    name: string
    teacher: string
    room: string
    time: string
    color: string
}

// Демо деректер қазақ тілінде
export const demoHomeworks: Homework[] = [
    { id: '1', subject: 'Математика', task: '5-тарау жаттығуларын орындау', due_date: '2026-02-11', priority: 'high', completed: false },
    { id: '2', subject: 'Қазақ тілі', task: 'Шығарма жазу', due_date: '2026-02-12', priority: 'high', completed: false },
    { id: '3', subject: 'Жаратылыстану', task: 'Зертханалық жұмыс - Химиялық реакциялар', due_date: '2026-02-14', priority: 'medium', completed: false },
    { id: '4', subject: 'Тарих', task: '12-тарауды оқу', due_date: '2026-02-10', priority: 'low', completed: true },
]

export const demoCourses: (Course & { grades: Grade[] })[] = [
    {
        id: '1',
        name: 'Математика',
        grades: [
            { id: '1', course_id: '1', name: 'Тест 1', score: 85, weight: 10 },
            { id: '2', course_id: '1', name: 'Аралық бақылау', score: 92, weight: 30 },
            { id: '3', course_id: '1', name: 'Тест 2', score: 88, weight: 10 },
        ]
    },
    {
        id: '2',
        name: 'Қазақ тілі',
        grades: [
            { id: '4', course_id: '2', name: 'Шығарма', score: 90, weight: 20 },
            { id: '5', course_id: '2', name: 'Емле диктанты', score: 94, weight: 15 },
        ]
    },
    {
        id: '3',
        name: 'Жаратылыстану',
        grades: [
            { id: '6', course_id: '3', name: 'Зертханалық жұмыс', score: 88, weight: 25 },
            { id: '7', course_id: '3', name: 'Тест', score: 82, weight: 15 },
        ]
    },
]

export const demoSchedule: ClassSession[] = [
    // Дүйсенбі
    { id: '1', day: 'Monday', name: 'Математика', teacher: 'Айгүл Сергеевна', room: '201 каб.', time: '8:00 - 9:30', color: 'bg-blue-100 border-blue-300 text-blue-900' },
    { id: '2', day: 'Monday', name: 'Қазақ тілі', teacher: 'Гүлнар Болатқызы', room: '105 каб.', time: '9:45 - 11:15', color: 'bg-green-100 border-green-300 text-green-900' },
    { id: '3', day: 'Monday', name: 'Жаратылыстану', teacher: 'Ерлан Маратұлы', room: 'Зертхана 3', time: '12:00 - 13:30', color: 'bg-yellow-100 border-yellow-300 text-yellow-900' },
    // Сейсенбі
    { id: '4', day: 'Tuesday', name: 'Тарих', teacher: 'Нұрлан Қайратұлы', room: '308 каб.', time: '8:00 - 9:30', color: 'bg-orange-100 border-orange-300 text-orange-900' },
    { id: '5', day: 'Tuesday', name: 'Химия', teacher: 'Дина Асқарқызы', room: 'Зертхана 2', time: '9:45 - 11:15', color: 'bg-purple-100 border-purple-300 text-purple-900' },
    // Сәрсенбі
    { id: '6', day: 'Wednesday', name: 'Математика', teacher: 'Айгүл Сергеевна', room: '201 каб.', time: '8:00 - 9:30', color: 'bg-blue-100 border-blue-300 text-blue-900' },
    { id: '7', day: 'Wednesday', name: 'Дене шынықтыру', teacher: 'Арман Болатұлы', room: 'Спорт залы', time: '9:45 - 11:15', color: 'bg-red-100 border-red-300 text-red-900' },
    // Бейсенбі
    { id: '8', day: 'Thursday', name: 'Қазақ тілі', teacher: 'Гүлнар Болатқызы', room: '105 каб.', time: '8:00 - 9:30', color: 'bg-green-100 border-green-300 text-green-900' },
    { id: '9', day: 'Thursday', name: 'Жаратылыстану', teacher: 'Ерлан Маратұлы', room: 'Зертхана 3', time: '9:45 - 11:15', color: 'bg-yellow-100 border-yellow-300 text-yellow-900' },
    // Жұма
    { id: '10', day: 'Friday', name: 'Тарих', teacher: 'Нұрлан Қайратұлы', room: '308 каб.', time: '8:00 - 9:30', color: 'bg-orange-100 border-orange-300 text-orange-900' },
    { id: '11', day: 'Friday', name: 'Өнер', teacher: 'Сәуле Қанатқызы', room: 'Өнер студиясы', time: '9:45 - 11:15', color: 'bg-pink-100 border-pink-300 text-pink-900' },
]
