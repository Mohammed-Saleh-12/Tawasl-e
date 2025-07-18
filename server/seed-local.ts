import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { 
  users, articles, testCategories, testQuestions, faqs,
  type InsertUser, type InsertArticle, type InsertTestCategory, 
  type InsertTestQuestion, type InsertFAQ 
} from "@shared/schema";

// Initialize database connection
const initializeDatabase = async () => {
  console.log("🔗 Connecting to local database...");
  
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL || "postgresql://tawasl_user:tawasl_password@localhost:5432/tawasl",
    ssl: false
  });
  
  await pool.query('SELECT NOW()');
  console.log("✅ Local database connection successful!");
  
  return drizzle(pool, { schema });
};

export async function seedDatabase() {
  console.log("🌱 Starting local database seeding...");

  try {
    const db = await initializeDatabase();

    // Seed users
    const userData: InsertUser[] = [
      {
        username: "admin",
        password: "admin123",
        email: "admin@tawasl.com"
      },
      {
        username: "demo_user",
        password: "demo123",
        email: "demo@tawasl.com"
      }
    ];

    console.log("📝 Seeding users...");
    for (const user of userData) {
      await db.insert(users).values(user).onConflictDoNothing();
    }

    // Seed articles
    const articleData: InsertArticle[] = [
      {
        title: "The Art of Active Listening: 10 Techniques That Transform Conversations",
        excerpt: "Master the fundamental skill of active listening with proven techniques that enhance understanding and build stronger relationships.",
        content: `Active listening is more than just hearing words – it's about fully engaging with the speaker to understand their message, emotions, and underlying needs. Research shows that effective listening can improve relationships by up to 40% and increase workplace productivity by 25%.

**The 10 Core Techniques:**

1. **Give Full Attention**: Put away distractions and focus entirely on the speaker. Make eye contact and face them directly.

2. **Use Verbal Affirmations**: Simple phrases like "I see," "Go on," or "That makes sense" encourage the speaker to continue.

3. **Practice Reflective Listening**: Paraphrase what you've heard: "So what you're saying is..." This confirms understanding.

4. **Ask Open-Ended Questions**: Use "What," "How," and "Why" questions to encourage deeper sharing.

5. **Show Empathy**: Acknowledge emotions: "That must have been difficult" or "I can hear the excitement in your voice."

6. **Avoid Interrupting**: Let the speaker finish their thoughts completely before responding.

7. **Pay Attention to Non-Verbals**: Notice body language, tone, and facial expressions for the complete message.

8. **Summarize Key Points**: Periodically recap main ideas to ensure you're on the same page.

9. **Withhold Judgment**: Listen without immediately evaluating or criticizing what you hear.

10. **Follow Up**: Ask clarifying questions and remember details for future conversations.

**Practice Exercises:**
- Spend 10 minutes daily practicing with friends or family
- Record yourself listening to podcasts and practice paraphrasing
- Join conversation groups focused on active listening skills

Remember, active listening is a skill that improves with practice. Start with one technique and gradually incorporate others.`,
        category: "Verbal Communication",
        author: "Dr. Sarah Johnson",
        publishedAt: new Date("2024-01-15"),
        readTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Mastering Body Language: How to Project Confidence in Every Interaction",
        excerpt: "Learn how to use body language effectively to communicate confidence, build trust, and enhance your professional presence.",
        content: `Body language accounts for 55% of all communication, making it one of the most powerful tools in your communication toolkit. Understanding and mastering non-verbal communication can dramatically improve your personal and professional relationships.

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
- Mirror the other person's energy level appropriately

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

Remember, authentic body language is more important than perfect technique. Focus on genuinely engaging with others.`,
        category: "Non-Verbal Communication",
        author: "Mark Thompson",
        publishedAt: new Date("2024-01-10"),
        readTime: 7,
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      }
    ];

    console.log("📝 Seeding articles...");
    for (const article of articleData) {
      await db.insert(articles).values(article).onConflictDoNothing();
    }

    // Seed test categories
    const categoryData: InsertTestCategory[] = [
      {
        name: "Active Listening",
        description: "Test your ability to listen actively and understand others effectively",
        duration: 10,
        questionCount: 5,
        color: "#3B82F6",
        icon: "fas fa-ear"
      },
      {
        name: "Body Language",
        description: "Assess your understanding of non-verbal communication cues",
        duration: 8,
        questionCount: 5,
        color: "#10B981",
        icon: "fas fa-handshake"
      },
      {
        name: "Conflict Resolution",
        description: "Evaluate your skills in resolving conflicts constructively",
        duration: 12,
        questionCount: 5,
        color: "#F59E0B",
        icon: "fas fa-users"
      }
    ];

    console.log("📝 Seeding test categories...");
    for (const category of categoryData) {
      await db.insert(testCategories).values(category).onConflictDoNothing();
    }

    // Seed test questions
    const questionData: InsertTestQuestion[] = [
      {
        categoryId: 1,
        question: "What is the most important aspect of active listening?",
        options: ["Hearing the words", "Understanding the message", "Responding quickly", "Taking notes"],
        correctAnswer: "Understanding the message",
        explanation: "Active listening is about understanding the complete message, not just hearing words."
      },
      {
        categoryId: 1,
        question: "Which technique helps confirm understanding?",
        options: ["Interrupting", "Paraphrasing", "Changing the subject", "Giving advice"],
        correctAnswer: "Paraphrasing",
        explanation: "Paraphrasing what you've heard confirms your understanding and shows the speaker you're listening."
      },
      {
        categoryId: 2,
        question: "What does crossed arms typically indicate?",
        options: ["Confidence", "Defensiveness", "Relaxation", "Attention"],
        correctAnswer: "Defensiveness",
        explanation: "Crossed arms are often interpreted as a defensive posture, indicating resistance or discomfort."
      }
    ];

    console.log("📝 Seeding test questions...");
    for (const question of questionData) {
      await db.insert(testQuestions).values(question).onConflictDoNothing();
    }

    // Seed FAQs
    const faqData: InsertFAQ[] = [
      {
        question: "How can I improve my active listening skills?",
        answer: "Practice focusing entirely on the speaker, use verbal affirmations, paraphrase what you hear, ask open-ended questions, and show empathy through your responses.",
        category: "communication-skills"
      },
      {
        question: "What are the most important body language signals?",
        answer: "Key signals include eye contact (50-70% is ideal), posture (standing tall shows confidence), hand gestures (open palms are welcoming), and personal space.",
        category: "body-language"
      },
      {
        question: "How do I handle difficult conversations at work?",
        answer: "Prepare thoroughly, choose the right time and place, use 'I' statements, focus on the issue not the person, listen actively, and work toward a mutually beneficial solution.",
        category: "conflict-resolution"
      }
    ];

    console.log("📝 Seeding FAQs...");
    for (const faq of faqData) {
      await db.insert(faqs).values(faq).onConflictDoNothing();
    }

    console.log("✅ Database seeding completed successfully!");
    console.log("📊 Seeded data:");
    console.log("   - 2 users");
    console.log("   - 2 articles");
    console.log("   - 3 test categories");
    console.log("   - 3 test questions");
    console.log("   - 3 FAQs");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seeding
seedDatabase().catch(console.error); 