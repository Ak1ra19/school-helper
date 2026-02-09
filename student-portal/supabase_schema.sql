-- Таблицаларды тазалау (қайта құру үшін)
DROP TABLE IF EXISTS "grades";
DROP TABLE IF EXISTS "homeworks";
DROP TABLE IF EXISTS "schedule";
DROP TABLE IF EXISTS "courses";

-- Үй тапсырмалары (Homeworks)
CREATE TABLE "homeworks" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "subject" text NOT NULL,
    "task" text NOT NULL,
    "due_date" date NOT NULL,
    "priority" text CHECK (priority IN ('low', 'medium', 'high')) NOT NULL,
    "completed" boolean DEFAULT false NOT NULL,
    PRIMARY KEY ("id")
);

-- Пәндер (Courses)
CREATE TABLE "courses" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "name" text NOT NULL,
    PRIMARY KEY ("id")
);

-- Бағалар (Grades)
CREATE TABLE "grades" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "course_id" uuid REFERENCES "courses"("id") ON DELETE CASCADE NOT NULL,
    "name" text NOT NULL,
    "score" numeric NOT NULL,
    "weight" numeric NOT NULL,
    PRIMARY KEY ("id")
);

-- Кесте (Schedule)
CREATE TABLE "schedule" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "day" text NOT NULL,
    "name" text NOT NULL,
    "teacher" text NOT NULL,
    "room" text NOT NULL,
    "time" text NOT NULL,
    "color" text NOT NULL,
    PRIMARY KEY ("id")
);

-- RLS (Row Level Security) қосу - барлығына рұқсат
ALTER TABLE "homeworks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grades" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "schedule" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for all users" ON "homeworks" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON "courses" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON "grades" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON "schedule" FOR ALL USING (true) WITH CHECK (true);

-- БАСТАПҚЫ ДЕРЕКТЕР (ҚАЗАҚША)

-- 1. Үй тапсырмалары
INSERT INTO "homeworks" ("subject", "task", "due_date", "priority", "completed") VALUES
('Математика', '5-тарау жаттығуларын орындау', '2026-02-11', 'high', false),
('Қазақ тілі', 'Шығарма жазу', '2026-02-12', 'high', false),
('Жаратылыстану', 'Зертханалық жұмыс - Химиялық реакциялар', '2026-02-14', 'medium', false),
('Тарих', '12-тарауды оқу', '2026-02-10', 'low', true);

-- 2. Пәндер мен бағалар
DO $$
DECLARE
    math_id uuid;
    kaz_id uuid;
    science_id uuid;
BEGIN
    INSERT INTO "courses" ("name") VALUES ('Математика') RETURNING "id" INTO math_id;
    INSERT INTO "courses" ("name") VALUES ('Қазақ тілі') RETURNING "id" INTO kaz_id;
    INSERT INTO "courses" ("name") VALUES ('Жаратылыстану') RETURNING "id" INTO science_id;

    INSERT INTO "grades" ("course_id", "name", "score", "weight") VALUES
    (math_id, 'Тест 1', 85, 10),
    (math_id, 'Аралық бақылау', 92, 30),
    (math_id, 'Тест 2', 88, 10),
    (kaz_id, 'Шығарма', 90, 20),
    (kaz_id, 'Емле диктанты', 94, 15),
    (science_id, 'Зертханалық жұмыс', 88, 25),
    (science_id, 'Тест', 82, 15);
END $$;

-- 3. Кесте
INSERT INTO "schedule" ("day", "name", "teacher", "room", "time", "color") VALUES
('Monday', 'Математика', 'Айгүл Сергеевна', '201 каб.', '8:00 - 9:30', 'bg-blue-100 border-blue-300 text-blue-900'),
('Monday', 'Қазақ тілі', 'Гүлнар Болатқызы', '105 каб.', '9:45 - 11:15', 'bg-green-100 border-green-300 text-green-900'),
('Monday', 'Жаратылыстану', 'Ерлан Маратұлы', 'Зертхана 3', '12:00 - 13:30', 'bg-yellow-100 border-yellow-300 text-yellow-900'),
('Tuesday', 'Тарих', 'Нұрлан Қайратұлы', '308 каб.', '8:00 - 9:30', 'bg-orange-100 border-orange-300 text-orange-900'),
('Tuesday', 'Химия', 'Дина Асқарқызы', 'Зертхана 2', '9:45 - 11:15', 'bg-purple-100 border-purple-300 text-purple-900'),
('Wednesday', 'Математика', 'Айгүл Сергеевна', '201 каб.', '8:00 - 9:30', 'bg-blue-100 border-blue-300 text-blue-900'),
('Wednesday', 'Дене шынықтыру', 'Арман Болатұлы', 'Спорт залы', '9:45 - 11:15', 'bg-red-100 border-red-300 text-red-900'),
('Thursday', 'Қазақ тілі', 'Гүлнар Болатқызы', '105 каб.', '8:00 - 9:30', 'bg-green-100 border-green-300 text-green-900'),
('Thursday', 'Жаратылыстану', 'Ерлан Маратұлы', 'Зертхана 3', '9:45 - 11:15', 'bg-yellow-100 border-yellow-300 text-yellow-900'),
('Friday', 'Тарих', 'Нұрлан Қайратұлы', '308 каб.', '8:00 - 9:30', 'bg-orange-100 border-orange-300 text-orange-900'),
('Friday', 'Өнер', 'Сәуле Қанатқызы', 'Өнер студиясы', '9:45 - 11:15', 'bg-pink-100 border-pink-300 text-pink-900');
