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

-- Insert sample data

-- Users
INSERT INTO users (username, password, email) VALUES
('admin', 'admin123', 'admin@tawasl.com'),
('demo_user', 'demo123', 'demo@tawasl.com')
ON CONFLICT (username) DO NOTHING;

-- Test categories
INSERT INTO test_categories (name, description, duration, question_count, color, icon) VALUES
('Active Listening', 'Test your ability to listen actively and understand others effectively', 10, 5, '#3B82F6', 'fas fa-ear'),
('Body Language', 'Assess your understanding of non-verbal communication cues', 8, 5, '#10B981', 'fas fa-handshake'),
('Conflict Resolution', 'Evaluate your skills in resolving conflicts constructively', 12, 5, '#F59E0B', 'fas fa-users')
ON CONFLICT DO NOTHING;

-- Test questions
INSERT INTO test_questions (category_id, question, options, correct_answer, explanation) VALUES
(1, 'What is the most important aspect of active listening?', '["Hearing the words", "Understanding the message", "Responding quickly", "Taking notes"]', 'Understanding the message', 'Active listening is about understanding the complete message, not just hearing words.'),
(1, 'Which technique helps confirm understanding?', '["Interrupting", "Paraphrasing", "Changing the subject", "Giving advice"]', 'Paraphrasing', 'Paraphrasing what you''ve heard confirms your understanding and shows the speaker you''re listening.'),
(2, 'What does crossed arms typically indicate?', '["Confidence", "Defensiveness", "Relaxation", "Attention"]', 'Defensiveness', 'Crossed arms are often interpreted as a defensive posture, indicating resistance or discomfort.')
ON CONFLICT DO NOTHING;

-- Articles
INSERT INTO articles (title, excerpt, content, category, author, published_at, read_time, image_url) VALUES
('The Art of Active Listening: 10 Techniques That Transform Conversations', 'Master the fundamental skill of active listening with proven techniques that enhance understanding and build stronger relationships.', 'Active listening is more than just hearing words – it''s about fully engaging with the speaker to understand their message, emotions, and underlying needs. Research shows that effective listening can improve relationships by up to 40% and increase workplace productivity by 25%.

**The 10 Core Techniques:**

1. **Give Full Attention**: Put away distractions and focus entirely on the speaker. Make eye contact and face them directly.

2. **Use Verbal Affirmations**: Simple phrases like "I see," "Go on," or "That makes sense" encourage the speaker to continue.

3. **Practice Reflective Listening**: Paraphrase what you''ve heard: "So what you''re saying is..." This confirms understanding.

4. **Ask Open-Ended Questions**: Use "What," "How," and "Why" questions to encourage deeper sharing.

5. **Show Empathy**: Acknowledge emotions: "That must have been difficult" or "I can hear the excitement in your voice."

6. **Avoid Interrupting**: Let the speaker finish their thoughts completely before responding.

7. **Pay Attention to Non-Verbals**: Notice body language, tone, and facial expressions for the complete message.

8. **Summarize Key Points**: Periodically recap main ideas to ensure you''re on the same page.

9. **Withhold Judgment**: Listen without immediately evaluating or criticizing what you hear.

10. **Follow Up**: Ask clarifying questions and remember details for future conversations.

**Practice Exercises:**
- Spend 10 minutes daily practicing with friends or family
- Record yourself listening to podcasts and practice paraphrasing
- Join conversation groups focused on active listening skills

Remember, active listening is a skill that improves with practice. Start with one technique and gradually incorporate others.', 'Verbal Communication', 'Dr. Sarah Johnson', '2024-01-15', 5, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'),
('Mastering Body Language: How to Project Confidence in Every Interaction', 'Learn how to use body language effectively to communicate confidence, build trust, and enhance your professional presence.', 'Body language accounts for 55% of all communication, making it one of the most powerful tools in your communication toolkit. Understanding and mastering non-verbal communication can dramatically improve your personal and professional relationships.

**Key Areas of Body Language:**

**1. Posture and Stance**
- Stand tall with shoulders back and relaxed
- Keep feet shoulder-width apart for stability
- Avoid slouching or leaning excessively
- Practice the "power pose" before important meetings

**2. Eye Contact Mastery**
- Maintain 50-70% eye contact during conversations
- Look away naturally, not abruptly
- Use the triangle technique: alternate between eyes and mouth
- Adjust based on cultural contexts

**3. Hand Gestures and Movement**
- Keep hands visible and open
- Use purposeful gestures that support your words
- Avoid pointing with index finger; use open palm instead
- Mirror the other person''s energy level appropriately

**4. Facial Expressions**
- Ensure your expression matches your message
- Practice genuine smiles that reach your eyes
- Be aware of micro-expressions that may betray your feelings
- Use eyebrow movements to emphasize points

**5. Spatial Awareness**
- Respect personal space (typically 18-24 inches for colleagues)
- Lean in slightly to show interest
- Avoid turning your body away from the speaker
- Use height changes (sitting/standing) strategically

**Common Mistakes to Avoid:**
- Crossed arms (appears defensive)
- Fidgeting or excessive movement
- Avoiding eye contact entirely
- Invading personal space
- Inconsistent verbal and non-verbal messages

**Practice Tips:**
- Record yourself during practice presentations
- Practice in front of a mirror
- Ask trusted colleagues for feedback
- Study confident speakers and leaders

Remember, authentic body language is more important than perfect technique. Focus on genuinely engaging with others.', 'Non-Verbal Communication', 'Mark Thompson', '2024-01-10', 7, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600')
ON CONFLICT DO NOTHING;

-- FAQs
INSERT INTO faqs (question, answer, category) VALUES
('How can I improve my active listening skills?', 'Practice focusing entirely on the speaker, use verbal affirmations, paraphrase what you hear, ask open-ended questions, and show empathy through your responses.', 'communication-skills'),
('What are the most important body language signals?', 'Key signals include eye contact (50-70% is ideal), posture (standing tall shows confidence), hand gestures (open palms are welcoming), and personal space.', 'body-language'),
('How do I handle difficult conversations at work?', 'Prepare thoroughly, choose the right time and place, use ''I'' statements, focus on the issue not the person, listen actively, and work toward a mutually beneficial solution.', 'conflict-resolution')
ON CONFLICT DO NOTHING;

-- Display results
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as articles_count FROM articles;
SELECT COUNT(*) as test_categories_count FROM test_categories;
SELECT COUNT(*) as test_questions_count FROM test_questions;
SELECT COUNT(*) as faqs_count FROM faqs; 