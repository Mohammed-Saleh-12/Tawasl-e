import { db } from "./db-local";
import { 
  articles, testCategories, testQuestions, faqs,
  type Article, type TestCategory, type TestQuestion, type FAQ
} from "@shared/schema";

export async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Check if data already exists
    const existingArticles = await db.select().from(articles).limit(1);
    if (existingArticles.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Seed articles
    console.log("Seeding articles...");
    const sampleArticles: Omit<Article, 'id'>[] = [
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
      },
      {
        title: "Virtual Communication Mastery: Excelling in Remote Work Environments",
        excerpt: "Navigate the challenges of virtual communication with strategies for video calls, remote collaboration, and digital presence.",
        content: `The shift to remote work has fundamentally changed how we communicate professionally. Virtual communication requires adapting traditional communication skills to digital platforms while maintaining effectiveness and human connection.

**Video Call Excellence:**

**Technical Setup**
- Ensure stable internet connection and good lighting
- Position camera at eye level to avoid unflattering angles
- Use a clean, professional background or virtual background
- Test audio quality and use headphones when possible

**Virtual Presence**
- Look directly at the camera, not the screen, when speaking
- Use hand gestures within the camera frame
- Sit up straight and maintain good posture
- Dress professionally, even if only visible from waist up

**Meeting Management**
- Start with brief small talk to build rapport
- Use names frequently since body language cues are limited
- Implement clear turn-taking protocols
- Summarize action items and next steps clearly

**Digital Communication Channels:**

**Email Excellence**
- Use clear, descriptive subject lines
- Keep messages concise but comprehensive
- Use bullet points for clarity
- Include clear calls to action

**Instant Messaging Best Practices**
- Match the formality to your workplace culture
- Use emojis appropriately to convey tone
- Respond promptly during work hours
- Create clear boundaries for after-hours communication

**Asynchronous Communication**
- Provide context and background information
- Use screen recordings for complex explanations
- Set clear expectations for response times
- Document decisions and important conversations

**Building Relationships Virtually:**
- Schedule regular one-on-one check-ins
- Participate in virtual team-building activities
- Share appropriate personal updates
- Use collaborative tools effectively

**Overcoming Virtual Challenges:**
- Address technical issues proactively
- Combat meeting fatigue with shorter, focused sessions
- Ensure all voices are heard in group calls
- Follow up on non-verbal cues you might have missed

**Tools and Technology:**
- Master your organization's communication platforms
- Use project management tools for transparency
- Leverage collaborative documents for real-time work
- Understand when to use synchronous vs. asynchronous communication

The key to virtual communication success is being more intentional and explicit than in-person interactions require.`,
        category: "Digital Communication",
        author: "Lisa Chen",
        publishedAt: new Date("2024-01-05"),
        readTime: 6,
        imageUrl: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Presentation Skills: Captivating Your Audience from Start to Finish",
        excerpt: "Transform your presentations with proven techniques for structure, delivery, and audience engagement that leave lasting impact.",
        content: `Effective presentations are crucial for career advancement and business success. Whether you're pitching ideas, training colleagues, or speaking at conferences, mastering presentation skills can set you apart as a leader and expert.

**Presentation Structure:**

**Opening (10% of time)**
- Hook your audience with a story, question, or surprising statistic
- Clearly state your purpose and what audience will gain
- Preview your main points
- Establish credibility early

**Body (80% of time)**
- Organize content into 3-5 main points
- Use the "tell them" principle: preview, present, review
- Include supporting evidence and examples
- Create smooth transitions between sections

**Closing (10% of time)**
- Summarize key takeaways
- End with a strong call to action
- Leave audience with memorable closing thought
- Open for questions if appropriate

**Delivery Techniques:**

**Vocal Variety**
- Vary pace, volume, and pitch for emphasis
- Use strategic pauses for impact
- Speak 10-15% slower than normal conversation
- Project confidence through your voice

**Physical Presence**
- Use purposeful movement and gestures
- Maintain good posture throughout
- Make eye contact with entire audience
- Use facial expressions to support your message

**Content Enhancement**
- Tell relevant stories and use examples
- Include audience interaction and engagement
- Use visual aids effectively, not as crutches
- Prepare for potential questions and objections

**Managing Presentation Anxiety:**
- Practice extensively but avoid over-rehearsing
- Arrive early to familiarize yourself with the space
- Use breathing techniques to calm nerves
- Focus on your message, not your anxiety
- Remember that slight nervousness can enhance performance

**Visual Aid Best Practices:**
- Follow the 6x6 rule (max 6 bullet points, 6 words each)
- Use high-quality, relevant images
- Ensure text is readable from the back of the room
- Have a backup plan for technical failures

**Audience Engagement:**
- Ask rhetorical and direct questions
- Use polls or interactive elements
- Include group discussions or partner sharing
- Reference current events or shared experiences

**Handling Q&A Sessions:**
- Listen carefully to the complete question
- Repeat or rephrase questions if needed
- Admit when you don't know something
- Bridge back to your key messages when possible

Remember, great presentations aren't just about sharing information – they're about inspiring action and creating lasting change.`,
        category: "Presentation Skills",
        author: "Dr. Michael Rodriguez",
        publishedAt: new Date("2024-01-20"),
        readTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        title: "Difficult Conversations: Navigating Conflict with Grace and Effectiveness",
        excerpt: "Learn to handle challenging discussions with confidence, turning potential conflicts into opportunities for growth and understanding.",
        content: `Difficult conversations are unavoidable in both personal and professional life. The ability to navigate these challenging discussions skillfully can strengthen relationships, resolve conflicts, and drive positive change.

**Preparation is Key:**

**Before the Conversation**
- Clarify your goals and desired outcomes
- Gather relevant facts and examples
- Consider the other person's perspective
- Choose appropriate timing and setting
- Plan your opening statement

**Creating the Right Environment**
- Choose a private, neutral location
- Ensure adequate time without interruptions
- Sit at the same level to show equality
- Remove barriers like desks between you
- Turn off phones and other distractions

**The PEACE Framework:**

**P - Prepare**
- Know your facts and objectives
- Anticipate possible reactions
- Plan your approach and tone

**E - Engage**
- Start with common ground
- State the issue clearly but kindly
- Use "I" statements to avoid blame

**A - Acknowledge**
- Listen actively to their perspective
- Validate their feelings and concerns
- Show empathy and understanding

**C - Collaborate**
- Work together to find solutions
- Ask for their ideas and input
- Focus on mutual interests

**E - Execute**
- Agree on specific next steps
- Set timeline and follow-up plans
- Document agreements if necessary

**Communication Techniques:**

**Language Strategies**
- Use neutral, non-judgmental language
- Focus on behaviors, not personalities
- Be specific about issues and examples
- Avoid absolute terms like "always" or "never"

**Managing Emotions**
- Stay calm and centered throughout
- Take breaks if emotions escalate
- Acknowledge emotions without being controlled by them
- Use deep breathing to maintain composure

**Common Scenarios and Approaches:**

**Performance Issues**
- Focus on specific behaviors and impact
- Provide clear expectations going forward
- Offer support and resources for improvement
- Set measurable goals and timelines

**Interpersonal Conflicts**
- Address issues early before they escalate
- Focus on finding win-win solutions
- Help parties understand each other's perspectives
- Establish ground rules for future interactions

**Delivering Bad News**
- Be direct but compassionate
- Explain reasoning behind decisions
- Allow time for processing and questions
- Discuss next steps and support available

**What to Avoid:**
- Getting defensive or personal
- Making assumptions about motives
- Bringing up past unrelated issues
- Threatening or ultimatum language
- Rushing to resolution without understanding

**Following Up:**
- Check in after agreed-upon timeframes
- Acknowledge progress and improvements
- Address any ongoing concerns promptly
- Maintain the relationship beyond the issue

Remember, difficult conversations are opportunities to build stronger relationships and create positive change when handled with skill and care.`,
        category: "Interpersonal Skills",
        author: "Sarah Williams",
        publishedAt: new Date("2024-01-25"),
        readTime: 9,
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      }
    ];

    await db.insert(articles).values(sampleArticles);

    // Seed test categories
    console.log("Seeding test categories...");
    const sampleTestCategories: Omit<TestCategory, 'id'>[] = [
      {
        name: "Verbal Communication",
        description: "Test your speaking clarity, tone, and verbal expression skills through various scenarios.",
        duration: 15,
        questionCount: 20,
        color: "bg-blue-500",
        icon: "fas fa-microphone"
      },
      {
        name: "Body Language",
        description: "Assess your understanding of non-verbal cues and body language interpretation.",
        duration: 12,
        questionCount: 15,
        color: "bg-purple-500",
        icon: "fas fa-user-friends"
      },
      {
        name: "Active Listening",
        description: "Evaluate your listening skills and ability to understand and respond appropriately.",
        duration: 10,
        questionCount: 12,
        color: "bg-green-500",
        icon: "fas fa-ear-listen"
      }
    ];

    const insertedCategories = await db.insert(testCategories).values(sampleTestCategories).returning();

    // Seed test questions
    console.log("Seeding test questions...");
    const sampleQuestions: Omit<TestQuestion, 'id'>[] = [
      // Verbal Communication Questions
      {
        categoryId: insertedCategories[0].id,
        question: "Which of the following is the most effective way to show active listening during a conversation?",
        options: [
          "Nodding frequently while planning your response",
          "Maintaining eye contact and asking clarifying questions",
          "Taking detailed notes while the person speaks",
          "Offering immediate solutions to their problems"
        ],
        correctAnswer: "Maintaining eye contact and asking clarifying questions",
        explanation: "Active listening involves being fully present and engaged, which is best demonstrated through eye contact and clarifying questions."
      },
      {
        categoryId: insertedCategories[0].id,
        question: "What is the ideal speaking pace for effective verbal communication?",
        options: [
          "As fast as possible to convey more information",
          "120-150 words per minute with natural pauses",
          "Very slowly to ensure every word is heard",
          "The pace doesn't matter as long as you're clear"
        ],
        correctAnswer: "120-150 words per minute with natural pauses",
        explanation: "A moderate pace with pauses allows listeners to process information and shows confidence."
      },
      {
        categoryId: insertedCategories[0].id,
        question: "When explaining complex information, which technique is most effective?",
        options: [
          "Use technical jargon to sound professional",
          "Speak louder to emphasize importance",
          "Break information into smaller chunks with examples",
          "Repeat the same information multiple times"
        ],
        correctAnswer: "Break information into smaller chunks with examples",
        explanation: "Chunking information and using examples helps listeners understand and retain complex concepts."
      },
      {
        categoryId: insertedCategories[0].id,
        question: "What is the best way to handle interruptions during your speech?",
        options: [
          "Immediately stop and let the other person speak",
          "Ignore the interruption and continue speaking",
          "Acknowledge the interruption politely and finish your thought",
          "Raise your voice to talk over the interruption"
        ],
        correctAnswer: "Acknowledge the interruption politely and finish your thought",
        explanation: "Polite acknowledgment while maintaining your speaking turn shows respect and assertiveness."
      },
      {
        categoryId: insertedCategories[0].id,
        question: "Which vocal technique best conveys confidence and authority?",
        options: [
          "Speaking in a higher pitch",
          "Using uptalk (rising intonation) at the end of statements",
          "Speaking with a lower, steady tone",
          "Speaking very quietly to make people lean in"
        ],
        correctAnswer: "Speaking with a lower, steady tone",
        explanation: "A lower, steady tone is associated with confidence and authority in communication."
      },

      // Body Language Questions
      {
        categoryId: insertedCategories[1].id,
        question: "What does crossed arms typically indicate in body language?",
        options: [
          "Openness and receptivity",
          "Defensiveness or resistance",
          "Confidence and authority",
          "Excitement and enthusiasm"
        ],
        correctAnswer: "Defensiveness or resistance",
        explanation: "Crossed arms often signal a defensive posture or resistance to what's being communicated."
      },
      {
        categoryId: insertedCategories[1].id,
        question: "What percentage of communication is attributed to body language according to research?",
        options: [
          "25%",
          "40%",
          "55%",
          "75%"
        ],
        correctAnswer: "55%",
        explanation: "Albert Mehrabian's research suggests that 55% of communication is through body language."
      },
      {
        categoryId: insertedCategories[1].id,
        question: "Which posture best conveys confidence during a presentation?",
        options: [
          "Hands clasped behind back",
          "Arms crossed over chest",
          "Feet shoulder-width apart, hands visible",
          "Hands in pockets"
        ],
        correctAnswer: "Feet shoulder-width apart, hands visible",
        explanation: "An open stance with visible hands conveys confidence and trustworthiness."
      },
      {
        categoryId: insertedCategories[1].id,
        question: "What is the appropriate amount of eye contact during a conversation?",
        options: [
          "100% constant eye contact",
          "50-70% of the time",
          "Only when speaking",
          "Avoiding eye contact shows respect"
        ],
        correctAnswer: "50-70% of the time",
        explanation: "Maintaining eye contact 50-70% of the time appears natural and engaged without being intimidating."
      },
      {
        categoryId: insertedCategories[1].id,
        question: "Which hand gesture should be avoided during professional communication?",
        options: [
          "Open palms when explaining",
          "Pointing with index finger",
          "Gentle gestures that support speech",
          "Hands at waist level"
        ],
        correctAnswer: "Pointing with index finger",
        explanation: "Pointing with the index finger can appear aggressive or accusatory in professional settings."
      },

      // Active Listening Questions
      {
        categoryId: insertedCategories[2].id,
        question: "What is the primary goal of active listening?",
        options: [
          "To prepare your response while the other person speaks",
          "To fully understand the speaker's message and feelings",
          "To identify flaws in the speaker's argument",
          "To appear engaged even when distracted"
        ],
        correctAnswer: "To fully understand the speaker's message and feelings",
        explanation: "Active listening focuses on complete understanding of both content and emotions being communicated."
      },
      {
        categoryId: insertedCategories[2].id,
        question: "Which technique best demonstrates active listening?",
        options: [
          "Immediately offering advice",
          "Paraphrasing what you heard",
          "Sharing a similar personal experience",
          "Asking yes/no questions"
        ],
        correctAnswer: "Paraphrasing what you heard",
        explanation: "Paraphrasing confirms understanding and shows you're truly listening to the speaker."
      },
      {
        categoryId: insertedCategories[2].id,
        question: "How should you respond when you don't understand something the speaker said?",
        options: [
          "Pretend you understand and move on",
          "Interrupt immediately to ask for clarification",
          "Wait for a natural pause and ask clarifying questions",
          "Change the subject to something you understand"
        ],
        correctAnswer: "Wait for a natural pause and ask clarifying questions",
        explanation: "Respectful clarification shows engagement and ensures accurate understanding."
      },
      {
        categoryId: insertedCategories[2].id,
        question: "What is emotional validation in active listening?",
        options: [
          "Agreeing with everything the speaker says",
          "Acknowledging and accepting the speaker's emotions",
          "Telling the speaker how they should feel",
          "Ignoring emotions and focusing only on facts"
        ],
        correctAnswer: "Acknowledging and accepting the speaker's emotions",
        explanation: "Emotional validation involves recognizing and accepting the speaker's feelings without judgment."
      },
      {
        categoryId: insertedCategories[2].id,
        question: "Which is the most effective way to show you're listening non-verbally?",
        options: [
          "Taking extensive notes",
          "Maintaining appropriate eye contact and nodding",
          "Checking your phone occasionally",
          "Looking around the room"
        ],
        correctAnswer: "Maintaining appropriate eye contact and nodding",
        explanation: "Eye contact and nodding provide clear non-verbal feedback that you're engaged and understanding."
      }
    ];

    await db.insert(testQuestions).values(sampleQuestions);

    // Seed FAQs
    console.log("Seeding FAQs...");
    const sampleFAQs: Omit<FAQ, 'id'>[] = [
      {
        question: "How long does it typically take to see improvement in communication skills?",
        answer: "Most users begin to notice improvements within 2-3 weeks of consistent practice. Significant changes typically occur after 1-2 months of regular engagement with our platform. The key is consistent daily practice, even if just for 10-15 minutes.",
        category: "General"
      },
      {
        question: "What makes your AI analysis more accurate than other platforms?",
        answer: "Our AI uses advanced machine learning models trained on thousands of hours of communication data from professional speakers, coaches, and successful communicators. We continuously update our models based on the latest research in communication psychology and behavioral analysis.",
        category: "Platform"
      },
      {
        question: "Can I practice communication skills if I'm introverted?",
        answer: "Absolutely! Many successful communicators are introverts. Our platform provides a safe, private environment to practice at your own pace. We offer specific techniques tailored for introverts, including energy management and preparation strategies.",
        category: "General"
      },
      {
        question: "How does the video analysis protect my privacy?",
        answer: "Your privacy is our top priority. Videos are processed locally when possible, and any data sent to our servers is encrypted and automatically deleted after analysis. You control all your content and can delete it at any time.",
        category: "Platform"
      },
      {
        question: "What's the difference between verbal and non-verbal communication tests?",
        answer: "Verbal communication tests focus on your word choice, clarity, pace, and vocal variety. Non-verbal tests analyze body language, facial expressions, gestures, and posture. Both are crucial for effective communication.",
        category: "Verbal Communication"
      },
      {
        question: "How accurate is the body language analysis?",
        answer: "Our body language analysis achieves 85-90% accuracy in detecting key indicators like eye contact, posture, and gesture patterns. The system is trained on diverse datasets and continuously improves with usage.",
        category: "Body Language"
      },
      {
        question: "Can I use this platform to prepare for job interviews?",
        answer: "Yes! We have specific modules for interview preparation, including common questions, appropriate body language, and confidence-building techniques. Many users report significant improvement in interview performance.",
        category: "Presentations"
      },
      {
        question: "Is there a mobile app available?",
        answer: "Currently, Tawasl is a web-based platform optimized for all devices. A dedicated mobile app is in development and will be available in early 2024 with additional features for on-the-go practice.",
        category: "Platform Usage"
      }
    ];

    await db.insert(faqs).values(sampleFAQs);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}