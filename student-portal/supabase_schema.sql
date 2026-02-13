-- Таблицаларды тазалау (қайта құру үшін)
DROP TABLE IF EXISTS "grades";
DROP TABLE IF EXISTS "homeworks";
DROP TABLE IF EXISTS "schedule";
DROP TABLE IF EXISTS "courses";

-- Үй тапсырмалары (Homeworks)
CREATE TABLE "homeworks" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_id" uuid DEFAULT auth.uid() NOT NULL,
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
    "user_id" uuid DEFAULT auth.uid() NOT NULL,
    "name" text NOT NULL,
    PRIMARY KEY ("id")
);

-- Бағалар (Grades)
CREATE TABLE "grades" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_id" uuid DEFAULT auth.uid() NOT NULL,
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
    "user_id" uuid DEFAULT auth.uid() NOT NULL,
    "day" text NOT NULL,
    "name" text NOT NULL,
    "teacher" text NOT NULL,
    "room" text NOT NULL,
    "time" text NOT NULL,
    "color" text NOT NULL,
    PRIMARY KEY ("id")
);

-- RLS (Row Level Security) қосу - тек өз деректерін көру
ALTER TABLE "homeworks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grades" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "schedule" ENABLE ROW LEVEL SECURITY;

-- Policies (Ережелер)
CREATE POLICY "Users can manage their own homeworks" ON "homeworks"
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own courses" ON "courses"
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own grades" ON "grades"
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule" ON "schedule"
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

