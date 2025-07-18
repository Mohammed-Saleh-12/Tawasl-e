-- Create tables for Tawasl Educational Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS username_idx ON users(username);
CREATE INDEX IF NOT EXISTS email_idx ON users(email);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    published_at TIMESTAMP NOT NULL,
    read_time INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS category_idx ON articles(category);
CREATE INDEX IF NOT EXISTS author_idx ON articles(author);

-- Test categories table
CREATE TABLE IF NOT EXISTS test_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL,
    question_count INTEGER NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS test_category_name_idx ON test_categories(name);

-- Test questions table
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES test_categories(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS test_question_category_idx ON test_questions(category_id);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category_id INTEGER NOT NULL REFERENCES test_categories(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB NOT NULL,
    feedback TEXT,
    completed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS test_result_user_idx ON test_results(user_id);
CREATE INDEX IF NOT EXISTS test_result_category_idx ON test_results(category_id);
CREATE INDEX IF NOT EXISTS test_result_completed_idx ON test_results(completed_at);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS faq_category_idx ON faqs(category);

-- Video analyses table
CREATE TABLE IF NOT EXISTS video_analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    scenario TEXT NOT NULL,
    overall_score INTEGER NOT NULL,
    eye_contact_score INTEGER NOT NULL,
    facial_expression_score INTEGER NOT NULL,
    gesture_score INTEGER NOT NULL,
    posture_score INTEGER NOT NULL,
    feedback JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS video_analysis_user_idx ON video_analyses(user_id);
CREATE INDEX IF NOT EXISTS video_analysis_created_idx ON video_analyses(created_at); 